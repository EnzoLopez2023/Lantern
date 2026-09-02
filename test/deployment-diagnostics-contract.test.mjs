import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  CONTRACT_VERSION,
  classifyProcess,
  parseReport,
} from '../scripts/deployment-diagnostic.mjs';
import {
  runWithTimeout,
  runWithTimeoutOutcome,
} from '../scripts/deployment-check-runner.mjs';
import {
  classifyReadinessResponse,
  validateCycloneDxReport,
  validateCosignReport,
  validateNpmAuditReport,
  validateReadinessReport,
  validateSpdxReport,
  validateTrivyReport,
} from '../scripts/deployment-checks.mjs';

const REVIEWED_CONTRACT_HEAD = '6e59c97a52820e15539ad8434788fcfb95a75730';
const REVIEWED_HELPER_BLOB = 'd31a00faad5832832bf0b91e96387f5f77645700';
const REVIEWED_ACTION_BLOB = 'ff7330e29f4f15abe61bf8c4f5520ff5f1674fc4';

function gitBlobOid(content) {
  return createHash('sha1')
    .update(`blob ${content.length}\0`)
    .update(content)
    .digest('hex');
}

function step(source, name) {
  const unquoted = `      - name: ${name}`;
  const quoted = `      - name: "${name}"`;
  const start = Math.max(source.indexOf(unquoted), source.indexOf(quoted));
  assert.notEqual(start, -1, `workflow step not found: ${name}`);
  const end = source.indexOf('\n      - name:', start + 1);
  return source.slice(start, end === -1 ? source.length : end);
}

test('deployment diagnostic templates exactly match the reviewed contract head', async () => {
  const [helper, action] = await Promise.all([
    readFile('scripts/deployment-diagnostic.mjs'),
    readFile('.github/actions/deployment-diagnostic/action.yml'),
  ]);

  assert.equal(CONTRACT_VERSION, 'deployment-diagnostics-v1');
  assert.equal(gitBlobOid(helper), REVIEWED_HELPER_BLOB);
  assert.equal(gitBlobOid(action), REVIEWED_ACTION_BLOB);
  assert.match(
    action.toString('utf8'),
    /node "\$DIAGNOSTIC_HELPER" run[\s\S]*-- bash -c "\$DIAGNOSTIC_COMMAND"/,
  );
  assert.match(REVIEWED_CONTRACT_HEAD, /^[0-9a-f]{40}$/);
});

test('missing and malformed checker reports remain execution failures', () => {
  for (const [format, report] of [
    ['npm-audit-json', ''],
    ['npm-audit-json', '{"metadata":{}}'],
    ['cyclonedx-json', '{"bomFormat":"Other","components":[]}'],
    ['spdx-json', '{"packages":[]}'],
    ['trivy-json', '{"Results":"not-an-array"}'],
    ['generic-json', 'not-json'],
  ]) {
    const result = parseReport(format, report);
    assert.equal(result.ok, false, `${format} must reject ${report || 'empty output'}`);
    assert.ok(result.error);
  }

  assert.equal(classifyProcess({ exitCode: 127 }).ok, false);
  assert.equal(classifyProcess({ exitCode: 124 }).ok, false);
  assert.equal(classifyProcess({ signal: 'SIGKILL' }).ok, false);
  assert.equal(classifyProcess({ exitCode: 1 }).ok, true);

  assert.equal(validateNpmAuditReport({ metadata: { vulnerabilities: {} } }), false);
  const candidate = `acr.example/lantern@sha256:${'a'.repeat(64)}`;
  assert.equal(validateNpmAuditReport({
    auditReportVersion: 2,
    vulnerabilities: {
      qs: {
        name: 'qs',
        severity: 'moderate',
        isDirect: false,
        via: [{
          source: 1,
          name: 'qs',
          dependency: 'qs',
          title: 'advisory',
          url: 'https://example.test/advisory',
          severity: 'moderate',
          range: '<1.0.0',
        }],
        effects: [],
        range: '<1.0.0',
        nodes: ['node_modules/qs'],
        fixAvailable: true,
      },
    },
    metadata: {
      vulnerabilities: { info: 0, low: 0, moderate: 1, high: 0, critical: 0, total: 1 },
      dependencies: { prod: 1, dev: 0, optional: 0, peer: 0, peerOptional: 0, total: 1 },
    },
  }), true);
  assert.equal(validateCycloneDxReport({
    bomFormat: 'CycloneDX',
    specVersion: 'garbage',
    components: [null],
  }), false);
  assert.equal(validateCycloneDxReport({
    bomFormat: 'CycloneDX',
    specVersion: '1.5',
    components: [null],
  }), false);
  assert.equal(validateCycloneDxReport({
    bomFormat: 'CycloneDX',
    specVersion: '1.5',
    serialNumber: 'urn:uuid:d135c669-a636-488d-85e0-11bea7067646',
    version: 1,
    metadata: {
      timestamp: '2026-09-02T12:00:00.000Z',
      tools: [{ vendor: 'npm', name: 'cli', version: '11.13.0' }],
      component: {
        name: 'lantern',
        version: '0.1.0',
        purl: 'pkg:npm/lantern@0.1.0',
      },
    },
    components: [{
      type: 'library',
      name: 'example',
      version: '1.0.0',
      purl: 'pkg:npm/example@1.0.0',
    }],
    dependencies: [],
  }, { name: 'lantern', version: '0.1.0' }), true);
  assert.equal(validateSpdxReport({
    spdxVersion: 'garbage',
    SPDXID: 'SPDXRef-DOCUMENT',
    packages: [null],
  }), false);
  assert.equal(validateSpdxReport({
    spdxVersion: 'SPDX-2.3',
    SPDXID: 'SPDXRef-DOCUMENT',
    packages: [null],
  }), false);
  const spdxReport = {
    spdxVersion: 'SPDX-2.3',
    dataLicense: 'CC0-1.0',
    SPDXID: 'SPDXRef-DOCUMENT',
    name: 'lantern',
    documentNamespace: 'https://anchore.com/syft/image/lantern-example',
    creationInfo: {
      created: '2026-09-02T12:00:00.000Z',
      creators: ['Organization: Anchore, Inc', 'Tool: syft-1.42.3'],
    },
    packages: [{
      SPDXID: 'SPDXRef-DocumentRoot-Image-lantern',
      name: 'lantern',
      versionInfo: `sha256:${'a'.repeat(64)}`,
      downloadLocation: 'NOASSERTION',
      filesAnalyzed: false,
      checksums: [{
        algorithm: 'SHA256',
        checksumValue: 'a'.repeat(64),
      }],
      externalRefs: [{
        referenceCategory: 'PACKAGE-MANAGER',
        referenceType: 'purl',
        referenceLocator: `pkg:oci/lantern@sha256%3A${'a'.repeat(64)}?arch=amd64`,
      }],
      primaryPackagePurpose: 'CONTAINER',
    }],
    relationships: [{
      spdxElementId: 'SPDXRef-DOCUMENT',
      relatedSpdxElement: 'SPDXRef-DocumentRoot-Image-lantern',
      relationshipType: 'DESCRIBES',
    }],
  };
  assert.equal(validateSpdxReport(spdxReport, candidate), true);
  const staleSpdx = structuredClone(spdxReport);
  staleSpdx.packages[0].versionInfo = `sha256:${'c'.repeat(64)}`;
  staleSpdx.packages[0].checksums[0].checksumValue = 'c'.repeat(64);
  staleSpdx.packages[0].externalRefs[0].referenceLocator =
    `pkg:oci/lantern@sha256%3A${'c'.repeat(64)}?arch=amd64`;
  assert.equal(validateSpdxReport(staleSpdx, candidate), false);
  assert.equal(validateTrivyReport({
    SchemaVersion: 0,
    ArtifactName: candidate,
    ArtifactType: 'container_image',
    Metadata: {
      ImageID: `sha256:${'b'.repeat(64)}`,
      RepoDigests: [candidate],
      Reference: candidate,
    },
    Results: [{ Target: 'example', Vulnerabilities: {} }],
  }, candidate), false);
  assert.equal(validateTrivyReport({
    SchemaVersion: 2,
    ArtifactName: candidate,
    ArtifactType: 'container_image',
    Metadata: {
      ImageID: `sha256:${'b'.repeat(64)}`,
      RepoDigests: [candidate],
      Reference: candidate,
    },
    Results: [{
      Target: 'example',
      Class: 'os-pkgs',
      Type: 'debian',
      Vulnerabilities: [{}],
    }],
  }, candidate), false);
  assert.equal(validateTrivyReport({
    SchemaVersion: 2,
    ArtifactName: candidate,
    ArtifactType: 'container_image',
    Metadata: {
      ImageID: `sha256:${'b'.repeat(64)}`,
      RepoDigests: [candidate],
      Reference: candidate,
    },
    Results: [{
      Target: 'example',
      Class: 'os-pkgs',
      Type: 'debian',
      Vulnerabilities: [{
        VulnerabilityID: 'CVE-2026-0001',
        PkgName: 'example',
        InstalledVersion: '1.0.0',
        Severity: 'HIGH',
      }],
    }],
  }, candidate), true);
  const staleTrivy = {
    SchemaVersion: 2,
    ArtifactName: candidate,
    ArtifactType: 'container_image',
    Metadata: {
      ImageID: `sha256:${'b'.repeat(64)}`,
      RepoDigests: [`acr.example/lantern@sha256:${'c'.repeat(64)}`],
      Reference: `acr.example/lantern@sha256:${'c'.repeat(64)}`,
    },
    Results: [{
      Target: 'example',
      Class: 'os-pkgs',
      Type: 'debian',
      Vulnerabilities: [],
    }],
  };
  assert.equal(validateTrivyReport(staleTrivy, candidate), false);
  assert.equal(validateReadinessReport({}), false);
  assert.equal(validateReadinessReport({ status: 'not_ready', database: null }), false);
  assert.equal(validateReadinessReport({ status: 'not_ready', database: 'unavailable' }), true);
  assert.equal(classifyReadinessResponse({
    status: 'not_ready',
    database: 'unavailable',
  }, 503), 1);
  assert.throws(
    () => classifyReadinessResponse({ status: 'not_ready', database: 'unavailable' }, 200),
    /does not match HTTP 200/,
  );
  assert.equal(validateCosignReport({ arbitrary: true }, candidate, 'signature'), false);
  assert.equal(validateCosignReport([], candidate, 'signature'), false);
  assert.equal(validateCosignReport([{
    critical: {
      identity: { 'docker-reference': 'acr.example/lantern' },
      image: { 'docker-manifest-digest': `sha256:${'a'.repeat(64)}` },
      type: 'cosign container image signature',
    },
  }], candidate, 'signature'), true);
  assert.equal(validateCosignReport([{
    critical: {
      identity: { 'docker-reference': candidate },
      image: { 'docker-manifest-digest': `sha256:${'a'.repeat(64)}` },
      type: 'https://sigstore.dev/cosign/sign/v1',
    },
  }], candidate, 'signature'), true);
  assert.equal(validateCosignReport({
    _type: 'https://in-toto.io/Statement/v1',
    predicateType: 'https://slsa.dev/provenance/v1',
    subject: [{ name: 'lantern', digest: { sha256: 'a'.repeat(64) } }],
    predicate: {
      buildDefinition: { buildType: 'https://example.test/build' },
      runDetails: { builder: { id: 'https://example.test/builder' } },
    },
  }, candidate, 'slsaprovenance1'), true);
  assert.equal(validateCosignReport({
    _type: 'https://in-toto.io/Statement/v0.1',
    predicateType: 'https://spdx.dev/Document',
    subject: [{ name: 'lantern', digest: { sha256: 'a'.repeat(64) } }],
    predicate: spdxReport,
  }, candidate, 'spdxjson'), true);
  assert.equal(validateCosignReport({
    _type: 'https://in-toto.io/Statement/v0.1',
    predicateType: 'https://spdx.dev/Document',
    subject: [{ name: 'lantern', digest: { sha256: 'a'.repeat(64) } }],
    predicate: staleSpdx,
  }, candidate, 'spdxjson'), false);
});

test('checker runner terminates the complete process group', {
  skip: process.platform === 'win32',
}, async () => {
  const started = Date.now();
  const status = await runWithTimeout({
    command: 'bash',
    args: ['-c', 'sleep 5 & wait'],
    timeoutMs: 50,
    killGraceMs: 50,
  });
  assert.equal(status, 124);
  assert.ok(Date.now() - started < 1_000, 'a checker descendant survived the timeout');
});

test('checker runner preserves exit and signal outcomes', {
  skip: process.platform === 'win32',
}, async () => {
  const exited = await runWithTimeoutOutcome({
    command: process.execPath,
    args: ['-e', 'process.exit(3)'],
    timeoutMs: 1_000,
    killGraceMs: 50,
  });
  assert.deepEqual(exited, { exitCode: 3, recordValue: '3' });

  const signaled = await runWithTimeoutOutcome({
    command: 'bash',
    args: ['-c', 'kill -TERM $$'],
    timeoutMs: 1_000,
    killGraceMs: 50,
  });
  assert.deepEqual(signaled, { exitCode: 1, recordValue: 'signal:SIGTERM' });
});

test('deployment workflow keeps checks observable and operations blocking', async () => {
  const [workflow, checks] = await Promise.all([
    readFile('.github/workflows/deploy.yml', 'utf8'),
    readFile('scripts/deployment-checks.mjs', 'utf8'),
  ]);
  const checkIds = [
    'source-dependency-audit',
    'source-sbom',
    'image-sbom',
    'image-vulnerability-scan',
    'signature-verification',
    'provenance-attestation-verification',
    'migration-compatibility-precheck',
    'recovery-precondition-precheck',
    'readiness-precondition-precheck',
    'monitoring-precheck',
    'protected-configuration-precheck',
  ];

  for (const checkId of checkIds) {
    assert.match(workflow, new RegExp(`check-id: ${checkId}(?:\\n|$)`), checkId);
  }
  assert.doesNotMatch(workflow, /\bmode:\s*skip\b/);
  assert.equal(
    (workflow.match(/uses: \.\/\.github\/actions\/deployment-diagnostic/g) ?? []).length,
    13,
  );
  assert.equal((workflow.match(/records: \$\{\{ env\.DIAGNOSTIC_RECORDS \}\}/g) ?? []).length, 13);
  assert.equal((workflow.match(/outputs\.exit_code/g) ?? []).length, 12);
  for (const helperStep of workflow
    .split(/(?=^      - name:)/m)
    .filter(block => block.includes('uses: ./.github/actions/deployment-diagnostic'))) {
    assert.match(helperStep, /mode: (?:record|aggregate)/);
    assert.doesNotMatch(helperStep, /^\s+run:\s*[|>]?/m);
  }

  for (const operation of [
    'Checkout exact source',
    'Set up Node',
    'Install exact dependencies',
    'Run repository checks',
    'Azure login with OIDC',
    'Refresh Azure login before production activation',
    'Capture prior release and protected configuration',
    'Build, push, and inspect digest-pinned candidate',
    'Install Cosign',
    'Sign and attest exact image',
    'Activate inspected digest as production release',
    'Verify candidate is the exact release',
    'Restore prior release after failure or cancellation',
  ]) {
    assert.doesNotMatch(step(workflow, operation), /continue-on-error:\s*true/, operation);
  }

  const checkerTimeouts = new Map([
    ['Run production dependency audit', 2],
    ['Generate source SBOM', 2],
    ['Check migration compatibility', 1],
    ['Check backup and recovery freshness', 2],
    ['Check pre-activation readiness', 1],
    ['Check monitoring resources', 2],
    ['Check protected configuration', 1],
    ['Set up exact-image SBOM scanner', 2],
    ['Generate exact-image SBOM', 5],
    ['Set up exact-image vulnerability scanner', 2],
    ['Resolve vulnerability database cache date', 1],
    ['Restore vulnerability database cache', 2],
    ['Scan exact image for HIGH and CRITICAL vulnerabilities', 11],
    ['Verify exact image signature', 2],
    ['Verify provenance attestation', 2],
    ['Verify SBOM attestation', 2],
  ]);
  let diagnosticBudget = 0;
  for (const [name, timeout] of checkerTimeouts) {
    const checker = step(workflow, name);
    assert.match(checker, /continue-on-error: true/, name);
    assert.match(checker, new RegExp(`timeout-minutes: ${timeout}(?:\\n|$)`), name);
    diagnosticBudget += timeout;
  }
  assert.equal(diagnosticBudget, 40);
  assert.match(workflow, /runs-on: ubuntu-latest\n    timeout-minutes: 80/);

  const sourceAudit = step(workflow, 'Run production dependency audit');
  assert.match(sourceAudit, /deployment-check-runner\.mjs --timeout-ms 90000/);
  assert.match(sourceAudit, /deployment-checks\.mjs source-audit/);
  assert.match(checks, /\['audit', '--omit=dev', '--audit-level=high', '--json'\]/);
  assert.match(checks, /'--output',\s*paths\.pending,\s*'--write-out',\s*'%\{http_code\}'/);
  assert.doesNotMatch(checks, /'-fsS'/);
  assert.match(
    step(workflow, 'Diagnostic: record production dependency audit'),
    /report-format: npm-audit-json/,
  );

  const syftSetup = step(workflow, 'Set up exact-image SBOM scanner');
  assert.match(syftSetup, /anchore\/sbom-action\/download-syft@e22c389904149dbc22b58101806040fa8d37a610/);
  assert.match(syftSetup, /syft-version: v1\.42\.3/);
  const imageSbom = step(workflow, 'Generate exact-image SBOM');
  assert.match(imageSbom, /continue-on-error: true/);
  assert.match(imageSbom, /deployment-check-runner\.mjs --timeout-ms 240000/);
  assert.match(imageSbom, /deployment-checks\.mjs image-sbom/);
  assert.match(imageSbom, /SYFT_SETUP_OUTCOME: \$\{\{ steps\.syft-setup\.outcome \}\}/);
  assert.match(checks, /\['scan', process\.env\.IMAGE_REFERENCE, '-o', 'spdx-json'\]/);
  assert.match(
    step(workflow, 'Diagnostic: record exact-image SBOM'),
    /outputs\.exit_code \|\| \(steps\.image-sbom\.outcome == 'success' && '0' \|\| '124'\)/,
  );

  const trivySetup = step(workflow, 'Set up exact-image vulnerability scanner');
  assert.match(trivySetup, /aquasecurity\/trivy-action@ed142fd0673e97e23eac54620cfb913e5ce36c25/);
  assert.match(trivySetup, /aquasecurity\/setup-trivy@3fb12ec12f41e471780db15c232d5dd185dcb514/);
  assert.match(trivySetup, /version: v0\.70\.0/);
  const imageScan = step(workflow, 'Scan exact image for HIGH and CRITICAL vulnerabilities');
  assert.match(imageScan, /continue-on-error: true/);
  assert.match(imageScan, /deployment-check-runner\.mjs --timeout-ms 630000/);
  assert.match(imageScan, /deployment-checks\.mjs image-scan/);
  assert.match(imageScan, /TRIVY_SETUP_OUTCOME: \$\{\{ steps\.trivy-setup\.outcome \}\}/);
  for (const input of [
    "TRIVY_EXIT_CODE: '0'",
    "TRIVY_FORMAT: 'json'",
    "TRIVY_IGNORE_UNFIXED: 'false'",
    "TRIVY_SCANNERS: 'vuln'",
    "TRIVY_SEVERITY: 'HIGH,CRITICAL'",
    "TRIVY_TIMEOUT: '10m'",
  ]) {
    assert.ok(checks.includes(input), input);
  }
  assert.match(
    step(workflow, 'Diagnostic: record image vulnerability scan'),
    /outputs\.exit_code \|\| \(steps\.image-scan\.outcome == 'success' && '0' \|\| '124'\)/,
  );

  assert.match(
    workflow,
    /sigstore\/cosign-installer@6f9f17788090df1f26f669e9d70d6ae9567deba6/,
  );
  assert.match(checks, /'verify',[\s\S]*'--certificate-identity'/);
  assert.equal((checks.match(/'verify-attestation'/g) ?? []).length, 2);
  assert.match(checks, /'slsaprovenance1'/);
  assert.match(checks, /'spdxjson'/);

  assert.match(
    step(workflow, 'Restore prior release after failure or cancellation'),
    /failure\(\) \|\| cancelled\(\)/,
  );
  assert.match(step(workflow, 'Verify candidate is the exact release'), /REQUIRED_CONFIRMATIONS/);
  assert.equal((workflow.match(/uses: azure\/login@7184910d9eb2b1c5e48f7073824a90609bb9b6d6/g) ?? []).length, 2);
  assert.ok(
    workflow.indexOf('Refresh Azure login before production activation') <
      workflow.indexOf('Arm rollback before production mutation'),
  );
  assert.doesNotMatch(workflow, /^\s+needs:/m);
});

test('diagnostic evidence is retained best-effort without fabricated success', async () => {
  const workflow = await readFile('.github/workflows/deploy.yml', 'utf8');
  const aggregate = step(workflow, 'Diagnostic: aggregate results');
  const upload = step(workflow, 'Upload nonsecret deployment and diagnostic evidence');

  assert.match(aggregate, /if: \$\{\{ always\(\) \}\}/);
  assert.match(aggregate, /mode: aggregate/);
  assert.match(upload, /if: \$\{\{ always\(\) \}\}/);
  assert.match(upload, /continue-on-error: true/);
  assert.match(upload, /name: deployment-diagnostics-\$\{\{ github\.run_id \}\}-\$\{\{ github\.run_attempt \}\}/);
  assert.match(upload, /deployment-diagnostics\/records\.jsonl/);
  assert.match(upload, /deployment-diagnostics\/records-summary\.json/);
  assert.match(upload, /retention-days: 30/);
  assert.match(step(workflow, 'Warn when evidence upload fails'), /::warning title=Deployment diagnostics upload/);

  assert.match(workflow, /DIAGNOSTIC_CANDIDATE_DIGEST=\$digest/);
  assert.match(workflow, /DIAGNOSTIC_BUILD_ID=\$BUILD_ID/);
  assert.match(workflow, /--argjson sbomAttested "\$SBOM_ATTESTED"/);
  assert.match(workflow, /sbomAttested: \$sbomAttested/);
  assert.doesNotMatch(workflow, /sbomAttested: true/);
  assert.doesNotMatch(workflow, /"status"\s*:\s*"pass"/);
});
