import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const healthScript = readFileSync(new URL('../scripts/deployment-health.sh', import.meta.url), 'utf8');
const workflow = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
const releases = [
  { phase: 'candidate', sha: 'a'.repeat(40), buildId: '100-2', excludedInstance: 'previous-process' },
  { phase: 'rollback', sha: 'b'.repeat(40), buildId: '99-1', excludedInstance: '' },
];

function healthyRound(release, instanceId = 'restarted-process') {
  const metadata = { commit: release.sha, buildId: release.buildId, instanceId };
  return {
    live: { body: { status: 'live', instanceId, uptimeSeconds: 1 } },
    ready: { body: { status: 'ready', build: { ...metadata } } },
    version: { body: metadata },
  };
}

function probe(release, rounds) {
  const mocks = String.raw`
    sleep() { :; }
    curl() {
      local endpoint response
      case "$*" in
        *"/api/live?probe="*) endpoint=live ;;
        *"/api/ready?probe="*) endpoint=ready ;;
        *"/api/version?probe="*) endpoint=version ;;
        *) echo "Unexpected probe: $*" >&2; return 97 ;;
      esac
      response="$(jq -ec --arg endpoint "$endpoint" --argjson attempt "$attempt" \
        '.[$attempt - 1][$endpoint]' <<<"$MOCK_ROUNDS")" || return 97
      jq -jr '(.body | tojson), "\n", (.httpStatus // 200)' <<<"$response"
      return "$(jq -r '.exitCode // 0' <<<"$response")"
    }
  `;
  const result = spawnSync('bash', ['--noprofile', '--norc', '-e', '-o', 'pipefail'], {
    input: `set -u\n${mocks}\n${healthScript}\nverify_release "$PHASE" "$MAX_ATTEMPTS" "$EXPECTED_SHA" "$EXPECTED_BUILD_ID" "$EXCLUDED_INSTANCE"\n`,
    env: {
      ...process.env,
      BASH_ENV: '/dev/null',
      PHASE: release.phase,
      EXPECTED_SHA: release.sha,
      EXPECTED_BUILD_ID: release.buildId,
      EXCLUDED_INSTANCE: release.excludedInstance,
      MOCK_ROUNDS: JSON.stringify(rounds),
      MAX_ATTEMPTS: String(rounds.length),
      GITHUB_RUN_ID: '100',
      GITHUB_RUN_ATTEMPT: '2',
      PRODUCTION_URL: 'https://offline.invalid',
      LIVE_PATH: '/api/live',
      READY_PATH: '/api/ready',
      VERSION_PATH: '/api/version',
      HTTP_TIMEOUT_SECONDS: '1',
      POLL_INTERVAL_SECONDS: '0',
      REQUIRED_CONFIRMATIONS: '3',
    },
    encoding: 'utf8',
    timeout: 10_000,
  });
  assert.ifError(result.error);
  assert.equal(result.signal, null, result.stderr);
  return result;
}

for (const release of releases) {
  test(`${release.phase} accepts three stable matching endpoint identities`, () => {
    const result = probe(release, Array.from({ length: 3 }, () => healthyRound(release)));
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /exact confirmation 3\/3 \(attempt 3, instance=restarted-process\)/);
  });

  test(`${release.phase} rejects rotating process instances even when each round agrees`, () => {
    const result = probe(release, ['first', 'second', 'third'].map(id => healthyRound(release, id)));
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.doesNotMatch(result.stdout, /exact confirmation [23]\/3/);
  });

  const invalidRounds = [
    ['readiness from a different SHA', round => { round.ready.body.build.commit = 'c'.repeat(40); }],
    ['readiness from a different build', round => { round.ready.body.build.buildId = 'other-build'; }],
    ['readiness from another process', round => { round.ready.body.build.instanceId = 'other-process'; }],
    ['liveness from another process', round => { round.live.body.instanceId = 'other-process'; }],
    ['version from a different SHA', round => { round.version.body.commit = 'c'.repeat(40); }],
    ['version from a different build', round => { round.version.body.buildId = 'other-build'; }],
    ['empty process identity', round => {
      round.live.body.instanceId = '';
      round.ready.body.build.instanceId = '';
      round.version.body.instanceId = '';
    }],
    ['unhealthy readiness', round => { round.ready.body.status = 'not_ready'; }],
    ['unhealthy liveness', round => { round.live.body.status = 'not_live'; }],
    ...['live', 'ready', 'version'].map(endpoint => [
      `non-200 ${endpoint}`, round => { round[endpoint].httpStatus = 503; },
    ]),
    ['failed HTTP request with a healthy-looking body', round => { round.ready.exitCode = 28; }],
  ];

  for (const [name, invalidate] of invalidRounds) {
    test(`${release.phase} rejects ${name}`, () => {
      const round = healthyRound(release);
      invalidate(round);
      const result = probe(release, [round, round, round]);
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert.doesNotMatch(result.stdout, /exact confirmation/);
    });
  }

  test(`${release.phase} restarts its streak when a new healthy process appears`, () => {
    const result = probe(release, ['first', 'first', 'recovered', 'recovered', 'recovered']
      .map(id => healthyRound(release, id)));
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /exact confirmation 1\/3 \(attempt 3, instance=recovered\)/);
    assert.match(result.stdout, /exact confirmation 3\/3 \(attempt 5, instance=recovered\)/);
  });

  test(`${release.phase} resets its streak after mixed readiness identity`, () => {
    const rounds = Array.from({ length: 5 }, () => healthyRound(release));
    rounds[1].ready.body.build.commit = 'c'.repeat(40);
    const result = probe(release, rounds);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /exact confirmation 3\/3 \(attempt 5, instance=restarted-process\)/);
  });
}

test('candidate health still rejects the pre-deployment process', () => {
  const release = releases[0];
  const result = probe(release, Array.from({ length: 3 }, () =>
    healthyRound(release, release.excludedInstance)));
  assert.equal(result.status, 1, result.stdout + result.stderr);
});

test('deployment and rollback use the actual shared proof without changing time budgets', () => {
  assert.equal((workflow.match(/source scripts\/deployment-health\.sh/g) ?? []).length, 2);
  assert.match(workflow, /verify_release candidate "\$MAX_ATTEMPTS" "\$GITHUB_SHA" "\$BUILD_ID" "\$PREVIOUS_INSTANCE_ID"/);
  assert.match(workflow, /verify_release promoted 12 "\$GITHUB_SHA" "\$BUILD_ID" "\$PREVIOUS_INSTANCE_ID"/);
  assert.match(workflow, /verify_release rollback "\$ROLLBACK_MAX_ATTEMPTS" "\$PREVIOUS_COMMIT" "\$PREVIOUS_BUILD_ID"\n/);
  assert.match(workflow, /REQUIRED_CONFIRMATIONS: '3'/);
  assert.match(workflow, /timeout-minutes: 10\n\s+shell: timeout --signal=TERM --kill-after=5s 595s bash/);
  assert.match(workflow, /timeout-minutes: 4\n\s+shell: timeout --signal=TERM --kill-after=5s 235s bash/);
});
