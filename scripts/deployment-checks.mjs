#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import {
  closeSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, join, resolve } from 'node:path';

const EVIDENCE_DIR = 'evidence';
const MAX_OUTPUT_BYTES = 32 * 1024 * 1024;

function reportPaths(name) {
  const final = join(EVIDENCE_DIR, name);
  return { final, pending: `${final}.pending` };
}

function prepareReport({ final, pending }) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  rmSync(final, { force: true });
  rmSync(pending, { force: true });
}

function runToFile(command, args, output, env = process.env) {
  const descriptor = openSync(output, 'w', 0o600);
  try {
    const result = spawnSync(command, args, {
      env,
      shell: false,
      stdio: ['ignore', descriptor, 'inherit'],
    });
    if (result.error) {
      process.stderr.write(`checker could not start: ${result.error.message}\n`);
      return result.error.code === 'ENOENT' ? 127 : 126;
    }
    if (result.signal) {
      process.stderr.write(`checker terminated by signal ${result.signal}\n`);
      return 128;
    }
    return result.status ?? 1;
  } finally {
    closeSync(descriptor);
  }
}

function runCaptured(command, args, env = process.env) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    env,
    maxBuffer: MAX_OUTPUT_BYTES,
    shell: false,
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  if (result.error) throw new Error(`${command} could not start: ${result.error.message}`);
  if (result.signal) throw new Error(`${command} terminated by signal ${result.signal}`);
  if (result.status !== 0) throw new Error(`${command} exited ${result.status}`);
  return result.stdout;
}

function runJson(command, args, env = process.env) {
  const raw = runCaptured(command, args, env);
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`${command} returned malformed JSON: ${error.message}`);
  }
}

function parsePending({ pending }, label) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(pending, 'utf8'));
  } catch (error) {
    throw new Error(`${label} report is missing or malformed: ${error.message}`);
  }
  return parsed;
}

function publish(paths) {
  renameSync(paths.pending, paths.final);
}

export function validateNpmAuditReport(report) {
  const vulnerabilities = report?.metadata?.vulnerabilities;
  if (!vulnerabilities || Array.isArray(vulnerabilities) || typeof vulnerabilities !== 'object') {
    return false;
  }
  const severities = ['info', 'low', 'moderate', 'high', 'critical'];
  if (![...severities, 'total'].every(key =>
    Number.isSafeInteger(vulnerabilities[key]) && vulnerabilities[key] >= 0)) {
    return false;
  }
  return severities.reduce((total, key) => total + vulnerabilities[key], 0) === vulnerabilities.total;
}

export function validateTrivyReport(report) {
  return Boolean(
    report &&
    !Array.isArray(report) &&
    typeof report === 'object' &&
    Array.isArray(report.Results) &&
    report.Results.every(result =>
      result &&
      !Array.isArray(result) &&
      typeof result === 'object' &&
      (result.Vulnerabilities == null || Array.isArray(result.Vulnerabilities))),
  );
}

function validateCycloneDxReport(report) {
  return report?.bomFormat === 'CycloneDX' && Array.isArray(report.components);
}

function validateSpdxReport(report) {
  return typeof report?.spdxVersion === 'string' && Array.isArray(report.packages);
}

function validateGenericJsonReport(report) {
  return report !== null && typeof report === 'object';
}

export function validateCosignReport(report) {
  if (Array.isArray(report)) {
    return report.length > 0 && report.every(entry =>
      entry && !Array.isArray(entry) && typeof entry === 'object');
  }
  return validateGenericJsonReport(report) && Object.keys(report).length > 0;
}

function validateAndPublish(paths, label, validator) {
  const report = parsePending(paths, label);
  if (!validator(report)) throw new Error(`${label} report has an unexpected structure`);
  publish(paths);
}

function writeReport(paths, report) {
  writeFileSync(paths.pending, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
  publish(paths);
}

function sourceAudit() {
  const paths = reportPaths('npm-audit.json');
  prepareReport(paths);
  const status = runToFile(
    'npm',
    ['audit', '--omit=dev', '--audit-level=high', '--json'],
    paths.pending,
  );
  validateAndPublish(paths, 'npm audit', validateNpmAuditReport);
  return status;
}

function sourceSbom() {
  const paths = reportPaths('source-sbom.cdx.json');
  prepareReport(paths);
  const status = runToFile(
    'npm',
    ['sbom', '--sbom-format=cyclonedx'],
    paths.pending,
  );
  if (status !== 0) return status;
  validateAndPublish(paths, 'source SBOM', validateCycloneDxReport);
  return 0;
}

function fetchReadiness(query) {
  const paths = reportPaths(query.report);
  prepareReport(paths);
  const status = runToFile(
    'curl',
    [
      '-fsS',
      '--max-time',
      process.env.HTTP_TIMEOUT_SECONDS,
      `${process.env.PRODUCTION_URL}${process.env.READY_PATH}?${query.parameter}=${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}`,
    ],
    paths.pending,
  );
  if (status !== 0) return { status, paths, report: null };
  return { status, paths, report: parsePending(paths, query.label) };
}

function migrationCompatibility() {
  const readiness = fetchReadiness({
    label: 'migration readiness',
    parameter: 'migration-compat',
    report: 'migration-readiness.json',
  });
  if (readiness.status !== 0) return readiness.status;
  if (!validateGenericJsonReport(readiness.report)) {
    throw new Error('migration readiness report has an unexpected structure');
  }
  publish(readiness.paths);

  const candidate = readdirSync('lib/migrations')
    .filter(name => /^\d{3,}[-_].+\.sql$/.test(name))
    .sort()
    .map(name => basename(name));
  const currentIdentity = readiness.report?.database?.schemaIdentity;
  const current = typeof currentIdentity === 'string' && currentIdentity !== 'unversioned'
    ? currentIdentity.split(',')
    : [];
  const compatible =
    readiness.report?.status === 'ready' &&
    current.length > 0 &&
    current.every((name, index) => candidate[index] === name);

  const paths = reportPaths('migration-check.json');
  prepareReport(paths);
  writeReport(paths, {
    check: 'migration-compatibility',
    current_schema: current.join(','),
    candidate_schema: candidate.join(','),
    compatible,
  });
  return compatible ? 0 : 1;
}

function recoveryPrecondition() {
  const backups = runJson('az', [
    'webapp',
    'config',
    'backup',
    'list',
    '--resource-group',
    process.env.RG,
    '--webapp-name',
    process.env.WEBAPP,
    '--query',
    '[].{status:status,completed:finishedTimeStamp,created:created}',
    '--output',
    'json',
  ]);
  if (!Array.isArray(backups)) throw new Error('backup inventory is not an array');

  const successful = backups
    .filter(entry => String(entry?.status ?? '').toLowerCase() === 'succeeded')
    .map(entry => entry.completed ?? entry.created)
    .filter(value => typeof value === 'string' && value.length > 0)
    .map(value => ({ value, timestamp: Date.parse(value) }));
  if (successful.some(entry => !Number.isFinite(entry.timestamp))) {
    throw new Error('backup inventory contains a malformed completion timestamp');
  }
  successful.sort((left, right) => left.timestamp - right.timestamp);
  const latest = successful.at(-1) ?? null;
  const ageSeconds = latest ? Math.floor((Date.now() - latest.timestamp) / 1_000) : null;
  const fresh = ageSeconds !== null && ageSeconds >= 0 && ageSeconds <= 93_600;
  const rollbackReady = /^sha256:[0-9a-f]{64}$/.test(process.env.PREVIOUS_IMAGE_DIGEST ?? '');

  const paths = reportPaths('recovery-check.json');
  prepareReport(paths);
  writeReport(paths, {
    check: 'backup-freshness',
    rpo_hours: 26,
    latest_successful_backup: latest?.value ?? null,
    age_seconds: ageSeconds,
    fresh_backup: fresh,
    rollback_image_resolved: rollbackReady,
  });
  return fresh && rollbackReady ? 0 : 1;
}

function readinessPrecondition() {
  const readiness = fetchReadiness({
    label: 'pre-activation readiness',
    parameter: 'preflight-readiness',
    report: 'readiness-check.json',
  });
  if (readiness.status !== 0) return readiness.status;
  if (!validateGenericJsonReport(readiness.report)) {
    throw new Error('readiness report has an unexpected structure');
  }
  publish(readiness.paths);
  const report = readiness.report;
  return report.status === 'ready' &&
    report.database?.authority === 'sqlite' &&
    report.database?.journalMode === 'delete' &&
    report.lifecycle === 'running'
    ? 0
    : 1;
}

function monitoringPrecheck() {
  const appId = runCaptured('az', [
    'webapp',
    'show',
    '--resource-group',
    process.env.RG,
    '--name',
    process.env.WEBAPP,
    '--query',
    'id',
    '--output',
    'tsv',
  ]).trim();
  if (!appId) throw new Error('web app resource id is empty');

  const alerts = runJson('az', [
    'monitor',
    'metrics',
    'alert',
    'list',
    '--resource-group',
    process.env.RG,
    '--query',
    '[].{name:name,enabled:enabled,scopes:scopes,actionGroups:actions[].actionGroupId}',
    '--output',
    'json',
  ]);
  if (!Array.isArray(alerts)) throw new Error('monitor alert inventory is not an array');
  if (!alerts.every(alert =>
    alert &&
    !Array.isArray(alert) &&
    typeof alert === 'object' &&
    typeof alert.name === 'string' &&
    typeof alert.enabled === 'boolean' &&
    Array.isArray(alert.scopes) &&
    (alert.actionGroups == null || Array.isArray(alert.actionGroups)))) {
    throw new Error('monitor alert inventory contains a malformed entry');
  }

  const startTime = new Date(Date.now() - 2 * 60 * 60 * 1_000).toISOString();
  const metrics = runJson('az', [
    'monitor',
    'metrics',
    'list',
    '--resource',
    appId,
    '--metric',
    'Http2xx',
    '--interval',
    'PT1H',
    '--aggregation',
    'Total',
    '--start-time',
    startTime,
    '--output',
    'json',
  ]);
  if (!Array.isArray(metrics?.value)) throw new Error('monitor metric response has no value array');
  const samples = [];
  for (const metric of metrics.value) {
    if (!Array.isArray(metric?.timeseries)) {
      throw new Error('monitor metric response contains malformed timeseries');
    }
    for (const series of metric.timeseries) {
      if (!Array.isArray(series?.data)) {
        throw new Error('monitor metric response contains malformed sample data');
      }
      for (const sample of series.data) {
        if (sample?.total != null && !Number.isFinite(Number(sample.total))) {
          throw new Error('monitor metric response contains a malformed total');
        }
        samples.push(Number(sample?.total) || 0);
      }
    }
  }

  const normalizedAppId = appId.toLowerCase();
  const matchingAlerts = alerts.filter(alert =>
    Array.isArray(alert?.scopes) &&
    alert.scopes.some(scope => String(scope).toLowerCase() === normalizedAppId));
  const approvedActionGroup =
    `/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/${process.env.RG}` +
    '/providers/Microsoft.Insights/actionGroups/ag-recovery-alerts';
  const normalizedActionGroup = approvedActionGroup.toLowerCase();
  const hasAlert = matchingAlerts.some(alert =>
    alert.enabled === true &&
    Array.isArray(alert.actionGroups) &&
    alert.actionGroups.some(action => String(action).toLowerCase() === normalizedActionGroup));
  const http2xxTotal = samples.reduce((total, sample) => total + sample, 0);
  const recentSuccess = http2xxTotal > 0;

  const paths = reportPaths('monitor-precheck.json');
  prepareReport(paths);
  writeReport(paths, {
    check: 'monitor-precheck',
    lookback_hours: 2,
    alert_names: matchingAlerts.map(alert => alert.name).sort(),
    has_enabled_approved_alert: hasAlert,
    http_2xx_total: http2xxTotal,
    recent_successful_sample: recentSuccess,
  });
  return hasAlert && recentSuccess ? 0 : 1;
}

function protectedConfiguration() {
  const config = runJson('az', [
    'webapp',
    'config',
    'show',
    '--resource-group',
    process.env.RG,
    '--name',
    process.env.WEBAPP,
    '--query',
    '{alwaysOn:alwaysOn, workers:numberOfWorkers, image:linuxFxVersion}',
    '--output',
    'json',
  ]);
  if (!validateGenericJsonReport(config)) throw new Error('site configuration is not an object');

  const paths = reportPaths('config-fingerprint.json');
  prepareReport(paths);
  const invariants = [
    { name: 'alwaysOn', matches: config.alwaysOn === true },
    { name: 'numberOfWorkers', matches: config.workers === 1 },
    { name: 'linuxFxVersion', matches: String(config.image ?? '').startsWith('DOCKER|') },
  ];
  writeReport(paths, { check: 'site-invariant-fingerprint', invariants });
  return invariants.every(invariant => invariant.matches) ? 0 : 1;
}

function imageSbom() {
  const paths = reportPaths('image-sbom.spdx.json');
  prepareReport(paths);
  if (process.env.SYFT_SETUP_OUTCOME !== 'success') {
    process.stderr.write('Syft setup did not complete successfully\n');
    return 127;
  }
  const status = runToFile(
    process.env.SYFT_CMD,
    ['scan', process.env.IMAGE_REFERENCE, '-o', 'spdx-json'],
    paths.pending,
    { ...process.env, SYFT_CHECK_FOR_APP_UPDATE: 'false' },
  );
  if (status !== 0) return status;
  validateAndPublish(paths, 'image SBOM', validateSpdxReport);
  return 0;
}

function imageScan() {
  const paths = reportPaths('trivy-image.json');
  prepareReport(paths);
  if (process.env.TRIVY_SETUP_OUTCOME !== 'success') {
    process.stderr.write('Trivy setup did not complete successfully\n');
    return 127;
  }
  const version = runCaptured('trivy', ['--version']);
  if (!/^Version:\s+0\.70\.0$/m.test(version)) {
    throw new Error('Trivy version is not the expected 0.70.0');
  }
  const status = spawnSync('trivy', ['image', process.env.IMAGE_REFERENCE], {
    env: {
      ...process.env,
      TRIVY_EXIT_CODE: '0',
      TRIVY_FORMAT: 'json',
      TRIVY_IGNORE_UNFIXED: 'false',
      TRIVY_OUTPUT: paths.pending,
      TRIVY_SCANNERS: 'vuln',
      TRIVY_SEVERITY: 'HIGH,CRITICAL',
      TRIVY_TIMEOUT: '10m',
    },
    shell: false,
    stdio: 'inherit',
  });
  if (status.error) {
    process.stderr.write(`checker could not start: ${status.error.message}\n`);
    return status.error.code === 'ENOENT' ? 127 : 126;
  }
  if (status.signal) return 128;
  if (status.status !== 0) return status.status ?? 1;
  validateAndPublish(paths, 'Trivy', validateTrivyReport);
  return 0;
}

function cosignVerification({ report, args }) {
  const paths = reportPaths(report);
  prepareReport(paths);
  const status = runToFile('cosign', args, paths.pending);
  validateAndPublish(paths, 'Cosign', validateCosignReport);
  return status;
}

function signatureVerification() {
  const workflowIdentity =
    `https://github.com/${process.env.GITHUB_REPOSITORY}/.github/workflows/deploy.yml@${process.env.GITHUB_REF}`;
  return cosignVerification({
    report: 'cosign-signature.json',
    args: [
      'verify',
      '--certificate-identity',
      workflowIdentity,
      '--certificate-oidc-issuer',
      'https://token.actions.githubusercontent.com',
      process.env.IMAGE_REFERENCE,
    ],
  });
}

function provenanceVerification() {
  const workflowIdentity =
    `https://github.com/${process.env.GITHUB_REPOSITORY}/.github/workflows/deploy.yml@${process.env.GITHUB_REF}`;
  return cosignVerification({
    report: 'cosign-provenance.json',
    args: [
      'verify-attestation',
      '--type',
      'slsaprovenance1',
      '--certificate-identity',
      workflowIdentity,
      '--certificate-oidc-issuer',
      'https://token.actions.githubusercontent.com',
      process.env.IMAGE_REFERENCE,
    ],
  });
}

function sbomAttestationVerification() {
  const workflowIdentity =
    `https://github.com/${process.env.GITHUB_REPOSITORY}/.github/workflows/deploy.yml@${process.env.GITHUB_REF}`;
  return cosignVerification({
    report: 'cosign-sbom.json',
    args: [
      'verify-attestation',
      '--type',
      'spdxjson',
      '--certificate-identity',
      workflowIdentity,
      '--certificate-oidc-issuer',
      'https://token.actions.githubusercontent.com',
      process.env.IMAGE_REFERENCE,
    ],
  });
}

const CHECKS = new Map([
  ['source-audit', sourceAudit],
  ['source-sbom', sourceSbom],
  ['migration', migrationCompatibility],
  ['recovery', recoveryPrecondition],
  ['readiness', readinessPrecondition],
  ['monitoring', monitoringPrecheck],
  ['protected-configuration', protectedConfiguration],
  ['image-sbom', imageSbom],
  ['image-scan', imageScan],
  ['signature', signatureVerification],
  ['provenance', provenanceVerification],
  ['sbom-attestation', sbomAttestationVerification],
]);

export function main(argv) {
  const [name] = argv;
  const check = CHECKS.get(name);
  if (!check) {
    process.stderr.write(`unknown deployment check: ${name ?? '(none)'}\n`);
    return 2;
  }
  try {
    return check();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    return 2;
  }
}

const invokedDirectly = process.argv[1] && import.meta.url === `file://${resolve(process.argv[1])}`;
if (invokedDirectly) {
  process.exit(main(process.argv.slice(2)));
}
