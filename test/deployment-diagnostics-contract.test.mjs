import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  CONTRACT_VERSION,
  classifyProcess,
  parseReport,
} from '../scripts/deployment-diagnostic.mjs';

const REVIEWED_CONTRACT_HEAD = '3b5bc3bfd2ed84a87f19f6fbe77074bd850cd5d1';
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
});

test('deployment workflow keeps checks observable and operations blocking', async () => {
  const workflow = await readFile('.github/workflows/deploy.yml', 'utf8');
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

  for (const operation of [
    'Checkout exact source',
    'Set up Node',
    'Install exact dependencies',
    'Run repository checks',
    'Azure login with OIDC',
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

  const sourceAudit = step(workflow, 'Diagnostic: production dependency audit');
  assert.match(sourceAudit, /npm audit --omit=dev --audit-level=high --json/);
  assert.match(sourceAudit, /report-format: npm-audit-json/);

  const imageSbom = step(workflow, 'Generate exact-image SBOM');
  assert.match(imageSbom, /continue-on-error: true/);
  assert.match(imageSbom, /anchore\/sbom-action@e22c389904149dbc22b58101806040fa8d37a610/);
  assert.match(imageSbom, /format: spdx-json/);
  assert.match(imageSbom, /upload-artifact: false/);
  assert.match(imageSbom, /upload-release-assets: false/);

  const imageScan = step(workflow, 'Scan exact image for HIGH and CRITICAL vulnerabilities');
  assert.match(imageScan, /continue-on-error: true/);
  assert.match(imageScan, /aquasecurity\/trivy-action@ed142fd0673e97e23eac54620cfb913e5ce36c25/);
  assert.match(imageScan, /exit-code: '0'/);
  assert.match(imageScan, /ignore-unfixed: false/);
  assert.match(imageScan, /severity: HIGH,CRITICAL/);
  assert.match(imageScan, /scanners: vuln/);
  assert.match(imageScan, /timeout: 10m/);

  assert.match(
    workflow,
    /sigstore\/cosign-installer@6f9f17788090df1f26f669e9d70d6ae9567deba6/,
  );
  assert.match(workflow, /cosign verify \\\n[\s\S]*--certificate-identity "\$workflow_identity"/);
  assert.equal((workflow.match(/cosign verify-attestation --type /g) ?? []).length, 2);
  assert.match(workflow, /--type slsaprovenance1/);
  assert.match(workflow, /--type spdxjson/);

  assert.match(
    step(workflow, 'Restore prior release after failure or cancellation'),
    /failure\(\) \|\| cancelled\(\)/,
  );
  assert.match(step(workflow, 'Verify candidate is the exact release'), /REQUIRED_CONFIRMATIONS/);
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
