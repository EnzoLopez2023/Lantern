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

class CheckerProcessError extends Error {
  constructor(message, { exitCode = null, signal = null } = {}) {
    super(message);
    this.exitCode = exitCode;
    this.signal = signal;
  }
}

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
      throw new CheckerProcessError(
        `checker could not start: ${result.error.message}`,
        { exitCode: result.error.code === 'ENOENT' ? 127 : 126 },
      );
    }
    if (result.signal) {
      throw new CheckerProcessError(
        `checker terminated by signal ${result.signal}`,
        { signal: result.signal },
      );
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
  if (result.error) {
    throw new CheckerProcessError(
      `${command} could not start: ${result.error.message}`,
      { exitCode: result.error.code === 'ENOENT' ? 127 : 126 },
    );
  }
  if (result.signal) {
    throw new CheckerProcessError(
      `${command} terminated by signal ${result.signal}`,
      { signal: result.signal },
    );
  }
  if (result.status !== 0) {
    throw new CheckerProcessError(
      `${command} exited ${result.status}`,
      { exitCode: result.status },
    );
  }
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
  const dependencyCounts = report?.metadata?.dependencies;
  if (
    report?.auditReportVersion !== 2 ||
    !isPlainObject(report.vulnerabilities) ||
    !isPlainObject(vulnerabilities) ||
    !isPlainObject(dependencyCounts)
  ) {
    return false;
  }
  const severities = ['info', 'low', 'moderate', 'high', 'critical'];
  if (![...severities, 'total'].every(key =>
    Number.isSafeInteger(vulnerabilities[key]) && vulnerabilities[key] >= 0)) {
    return false;
  }
  if (!['prod', 'dev', 'optional', 'peer', 'peerOptional', 'total'].every(key =>
    Number.isSafeInteger(dependencyCounts[key]) && dependencyCounts[key] >= 0)) {
    return false;
  }
  const entries = Object.entries(report.vulnerabilities);
  if (severities.reduce((total, key) => total + vulnerabilities[key], 0) !== vulnerabilities.total) {
    return false;
  }
  if (entries.length !== vulnerabilities.total) return false;
  const counted = Object.fromEntries(severities.map(severity => [severity, 0]));
  for (const [name, vulnerability] of entries) {
    if (
      !isPlainObject(vulnerability) ||
      vulnerability.name !== name ||
      !severities.includes(vulnerability.severity) ||
      typeof vulnerability.isDirect !== 'boolean' ||
      !Array.isArray(vulnerability.via) ||
      vulnerability.via.length === 0 ||
      !vulnerability.via.every(via =>
        typeof via === 'string' ||
        (isPlainObject(via) &&
          Number.isSafeInteger(via.source) &&
          typeof via.name === 'string' &&
          typeof via.dependency === 'string' &&
          typeof via.title === 'string' &&
          typeof via.url === 'string' &&
          severities.includes(via.severity) &&
          typeof via.range === 'string')) ||
      !Array.isArray(vulnerability.effects) ||
      typeof vulnerability.range !== 'string' ||
      !Array.isArray(vulnerability.nodes) ||
      !vulnerability.nodes.every(node => typeof node === 'string') ||
      !(typeof vulnerability.fixAvailable === 'boolean' || isPlainObject(vulnerability.fixAvailable))
    ) {
      return false;
    }
    counted[vulnerability.severity] += 1;
  }
  return severities.every(severity => counted[severity] === vulnerabilities[severity]);
}

export function validateTrivyReport(report, expectedArtifactName) {
  const allowedSeverity = new Set(['HIGH', 'CRITICAL']);
  return Boolean(
    isPlainObject(report) &&
    report.SchemaVersion === 2 &&
    report.ArtifactName === expectedArtifactName &&
    report.ArtifactType === 'container_image' &&
    isPlainObject(report.Metadata) &&
    /^sha256:[0-9a-f]{64}$/.test(report.Metadata.ImageID ?? '') &&
    Array.isArray(report.Metadata.RepoDigests) &&
    report.Metadata.RepoDigests.includes(expectedArtifactName) &&
    report.Metadata.Reference === expectedArtifactName &&
    Array.isArray(report.Results) &&
    report.Results.length > 0 &&
    report.Results.every(result =>
      isPlainObject(result) &&
      nonEmptyString(result.Target) &&
      nonEmptyString(result.Class) &&
      nonEmptyString(result.Type) &&
      (result.Vulnerabilities == null ||
        (Array.isArray(result.Vulnerabilities) &&
          result.Vulnerabilities.every(vulnerability =>
            isPlainObject(vulnerability) &&
            nonEmptyString(vulnerability.VulnerabilityID) &&
            nonEmptyString(vulnerability.PkgName) &&
            nonEmptyString(vulnerability.InstalledVersion) &&
            allowedSeverity.has(vulnerability.Severity))))),
  );
}

function isPlainObject(value) {
  return Boolean(value && !Array.isArray(value) && typeof value === 'object');
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validTimestamp(value) {
  return (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/.test(value ?? '') &&
    Number.isFinite(Date.parse(value))
  );
}

export function validateCycloneDxReport(report, expectedPackage) {
  const componentTypes = new Set([
    'application',
    'container',
    'cryptographic-asset',
    'data',
    'device',
    'file',
    'firmware',
    'framework',
    'library',
    'machine-learning-model',
    'operating-system',
    'platform',
  ]);
  const root = report?.metadata?.component;
  const expectedPurl = expectedPackage
    ? `pkg:npm/${expectedPackage.name}@${expectedPackage.version}`
    : null;
  return Boolean(
    isPlainObject(report) &&
    report.bomFormat === 'CycloneDX' &&
    ['1.5', '1.6'].includes(report.specVersion) &&
    /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      .test(report.serialNumber ?? '') &&
    Number.isSafeInteger(report.version) &&
    report.version >= 1 &&
    isPlainObject(report.metadata) &&
    validTimestamp(report.metadata.timestamp) &&
    Array.isArray(report.metadata.tools) &&
    report.metadata.tools.some(tool =>
      isPlainObject(tool) &&
      tool.vendor === 'npm' &&
      tool.name === 'cli' &&
      nonEmptyString(tool.version)) &&
    isPlainObject(root) &&
    nonEmptyString(root.name) &&
    nonEmptyString(root.version) &&
    (!expectedPurl || root.purl === expectedPurl) &&
    Array.isArray(report.components) &&
    report.components.length > 0 &&
    report.components.every(component =>
      isPlainObject(component) &&
      componentTypes.has(component.type) &&
      nonEmptyString(component.name) &&
      nonEmptyString(component.version) &&
      /^pkg:npm\//.test(component.purl ?? '')) &&
    Array.isArray(report.dependencies),
  );
}

export function validateSpdxReport(report, expectedImageReference, expectedImageId) {
  const expected = expectedDigestParts(expectedImageReference);
  const configDigest = /^sha256:[0-9a-f]{64}$/.test(expectedImageId ?? '')
    ? expectedImageId
    : null;
  if (!expected || !configDigest) return false;
  const imageName = expectedImageReference
    ?.split('@')[0]
    .split('/')
    .at(-1);
  const packageIds = new Set();
  const rootPackage = Array.isArray(report?.packages)
    ? report.packages.find(packageEntry =>
      isPlainObject(packageEntry) &&
      packageEntry.primaryPackagePurpose === 'CONTAINER' &&
      /^SPDXRef-DocumentRoot-Image-/.test(packageEntry.SPDXID ?? ''))
    : null;
  const rootPurl = (Array.isArray(rootPackage?.externalRefs)
    ? rootPackage.externalRefs.find(reference =>
      isPlainObject(reference) &&
      reference.referenceCategory === 'PACKAGE-MANAGER' &&
      reference.referenceType === 'purl' &&
      nonEmptyString(reference.referenceLocator))
    : null)?.referenceLocator;
  let decodedRootPurl = '';
  try {
    decodedRootPurl = decodeURIComponent(rootPurl ?? '');
  } catch {
    return false;
  }
  return Boolean(
    isPlainObject(report) &&
    ['SPDX-2.2', 'SPDX-2.3'].includes(report.spdxVersion) &&
    report.dataLicense === 'CC0-1.0' &&
    report.SPDXID === 'SPDXRef-DOCUMENT' &&
    nonEmptyString(report.name) &&
    (!imageName ||
      report.name.toLowerCase().includes(imageName.toLowerCase()) ||
      String(report.documentNamespace).toLowerCase().includes(imageName.toLowerCase())) &&
    /^https:\/\/anchore\.com\/syft\/image\//.test(report.documentNamespace ?? '') &&
    isPlainObject(report.creationInfo) &&
    validTimestamp(report.creationInfo.created) &&
    Array.isArray(report.creationInfo.creators) &&
    report.creationInfo.creators.includes('Tool: syft-1.42.3') &&
    Array.isArray(report.packages) &&
    report.packages.length > 0 &&
    report.packages.every(packageEntry => {
      if (
        !isPlainObject(packageEntry) ||
        !/^SPDXRef-[A-Za-z0-9.-]+$/.test(packageEntry.SPDXID ?? '') ||
        packageIds.has(packageEntry.SPDXID) ||
        !nonEmptyString(packageEntry.name) ||
        !nonEmptyString(packageEntry.downloadLocation) ||
        typeof packageEntry.filesAnalyzed !== 'boolean'
      ) {
        return false;
      }
      packageIds.add(packageEntry.SPDXID);
      return true;
    }) &&
    isPlainObject(rootPackage) &&
    rootPackage.name === report.name &&
    rootPackage.versionInfo === expected.digest &&
    Array.isArray(rootPackage.checksums) &&
    rootPackage.checksums.some(checksum =>
      isPlainObject(checksum) &&
      checksum.algorithm === 'SHA256' &&
      checksum.checksumValue === configDigest.slice('sha256:'.length)) &&
    /^pkg:oci\//.test(decodedRootPurl) &&
    decodedRootPurl.includes(`@${configDigest}`) &&
    Array.isArray(report.relationships) &&
    report.relationships.some(relationship =>
      isPlainObject(relationship) &&
      relationship.spdxElementId === 'SPDXRef-DOCUMENT' &&
      relationship.relatedSpdxElement === rootPackage.SPDXID &&
      relationship.relationshipType === 'DESCRIBES'),
  );
}

export function validateReadinessReport(report) {
  if (!isPlainObject(report) || !['ready', 'not_ready'].includes(report.status)) return false;
  if (report.status === 'not_ready') return report.database === 'unavailable';
  return Boolean(
    isPlainObject(report.database) &&
    nonEmptyString(report.database.authority) &&
    nonEmptyString(report.database.journalMode) &&
    /^(\d{3,}[-_][^,]+\.sql)(,\d{3,}[-_][^,]+\.sql)*$/.test(report.database.schemaIdentity ?? '') &&
    nonEmptyString(report.lifecycle) &&
    Array.isArray(report.workers) &&
    isPlainObject(report.build) &&
    report.build.app === 'lantern',
  );
}

function expectedDigestParts(expectedImageReference) {
  const [repository, digest] = String(expectedImageReference ?? '').split('@');
  if (!repository || !/^sha256:[0-9a-f]{64}$/.test(digest ?? '')) return null;
  return { digest, digestHex: digest.slice('sha256:'.length), repository };
}

function statementMatches(
  statement,
  digestHex,
  predicateKind,
  expectedImageReference,
  expectedImageId,
) {
  const predicateTypes = {
    slsaprovenance1: 'https://slsa.dev/provenance/v1',
    spdxjson: 'https://spdx.dev/Document',
  };
  const expectedPredicateType = predicateTypes[predicateKind];
  return Boolean(
    isPlainObject(statement) &&
    ['https://in-toto.io/Statement/v0.1', 'https://in-toto.io/Statement/v1'].includes(statement._type) &&
    statement.predicateType === expectedPredicateType &&
    Array.isArray(statement.subject) &&
    statement.subject.some(subject =>
      isPlainObject(subject) &&
      isPlainObject(subject.digest) &&
      subject.digest.sha256 === digestHex) &&
    (predicateKind === 'slsaprovenance1'
      ? isPlainObject(statement.predicate) &&
        isPlainObject(statement.predicate.buildDefinition) &&
        nonEmptyString(statement.predicate.buildDefinition.buildType) &&
        isPlainObject(statement.predicate.runDetails) &&
        isPlainObject(statement.predicate.runDetails.builder) &&
        nonEmptyString(statement.predicate.runDetails.builder.id)
      : validateSpdxReport(statement.predicate, expectedImageReference, expectedImageId)),
  );
}

function decodeEnvelopeStatement(entry) {
  if (
    !isPlainObject(entry) ||
    !nonEmptyString(entry.payloadType) ||
    !nonEmptyString(entry.payload) ||
    !Array.isArray(entry.signatures) ||
    entry.signatures.length === 0 ||
    !entry.signatures.every(signature => isPlainObject(signature) && nonEmptyString(signature.sig))
  ) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(entry.payload, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

export function validateCosignReport(
  report,
  expectedImageReference,
  kind,
  expectedImageId = null,
) {
  const expected = expectedDigestParts(expectedImageReference);
  if (!expected || !['signature', 'slsaprovenance1', 'spdxjson'].includes(kind)) return false;
  const entries = Array.isArray(report) ? report : [report];
  if (entries.length === 0) return false;
  if (kind === 'signature') {
    return entries.every(entry => {
      if (
        !isPlainObject(entry) ||
        !isPlainObject(entry.critical) ||
        !isPlainObject(entry.critical.identity) ||
        !isPlainObject(entry.critical.image) ||
        entry.critical.image['docker-manifest-digest'] !== expected.digest
      ) {
        return false;
      }
      const type = entry.critical.type;
      const reference = entry.critical.identity['docker-reference'];
      return (
        (type === 'cosign container image signature' && reference === expected.repository) ||
        (type === 'https://sigstore.dev/cosign/sign/v1' && reference === expectedImageReference)
      );
    });
  }
  return entries.every(entry => {
    const statement = nonEmptyString(entry?.payload)
      ? decodeEnvelopeStatement(entry)
      : entry;
    return statementMatches(
      statement,
      expected.digestHex,
      kind,
      expectedImageReference,
      expectedImageId,
    );
  });
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
  const packageManifest = JSON.parse(readFileSync('package.json', 'utf8'));
  validateAndPublish(
    paths,
    'source SBOM',
    report => validateCycloneDxReport(report, packageManifest),
  );
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
  if (!validateReadinessReport(readiness.report)) {
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
    readiness.report?.database?.authority === 'sqlite' &&
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
  if (!validateReadinessReport(readiness.report)) {
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
  if (!isPlainObject(config)) throw new Error('site configuration is not an object');

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

function candidateImageId() {
  const imageId = runCaptured('docker', [
    'image',
    'inspect',
    '--format',
    '{{.Id}}',
    process.env.IMAGE_REFERENCE,
  ]).trim();
  if (!/^sha256:[0-9a-f]{64}$/.test(imageId)) {
    throw new Error('candidate image config digest is malformed');
  }
  return imageId;
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
  const imageId = candidateImageId();
  validateAndPublish(
    paths,
    'image SBOM',
    report => validateSpdxReport(report, process.env.IMAGE_REFERENCE, imageId),
  );
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
    throw new CheckerProcessError(
      `checker could not start: ${status.error.message}`,
      { exitCode: status.error.code === 'ENOENT' ? 127 : 126 },
    );
  }
  if (status.signal) {
    throw new CheckerProcessError(
      `checker terminated by signal ${status.signal}`,
      { signal: status.signal },
    );
  }
  if (status.status !== 0) return status.status ?? 1;
  validateAndPublish(
    paths,
    'Trivy',
    report => validateTrivyReport(report, process.env.IMAGE_REFERENCE),
  );
  return 0;
}

function cosignVerification({ report, args, kind }) {
  const paths = reportPaths(report);
  prepareReport(paths);
  const status = runToFile('cosign', args, paths.pending);
  const imageId = kind === 'spdxjson' ? candidateImageId() : null;
  validateAndPublish(
    paths,
    'Cosign',
    value => validateCosignReport(
      value,
      process.env.IMAGE_REFERENCE,
      kind,
      imageId,
    ),
  );
  return status;
}

function signatureVerification() {
  const workflowIdentity =
    `https://github.com/${process.env.GITHUB_REPOSITORY}/.github/workflows/deploy.yml@${process.env.GITHUB_REF}`;
  return cosignVerification({
    report: 'cosign-signature.json',
    kind: 'signature',
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
    kind: 'slsaprovenance1',
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
    kind: 'spdxjson',
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

function executeCheck(argv) {
  const [name] = argv;
  const check = CHECKS.get(name);
  if (!check) {
    process.stderr.write(`unknown deployment check: ${name ?? '(none)'}\n`);
    return { exitCode: 2, signal: null };
  }
  try {
    return { exitCode: check(), signal: null };
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    if (error instanceof CheckerProcessError) {
      return { exitCode: error.exitCode, signal: error.signal };
    }
    return { exitCode: 2, signal: null };
  }
}

export function main(argv) {
  return executeCheck(argv).exitCode ?? 1;
}

const invokedDirectly = process.argv[1] && import.meta.url === `file://${resolve(process.argv[1])}`;
if (invokedDirectly) {
  const outcome = executeCheck(process.argv.slice(2));
  if (outcome.signal) {
    try {
      process.kill(process.pid, outcome.signal);
      await new Promise(resolveSignal => setTimeout(resolveSignal, 1_000));
    } catch (error) {
      process.stderr.write(`could not propagate checker signal ${outcome.signal}: ${error.message}\n`);
    }
  }
  process.exit(outcome.exitCode ?? 1);
}
