import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import Database from 'better-sqlite3';

test('native SQLite works and compilers remain outside the runtime image', async () => {
  const dockerfile = await readFile('Dockerfile', 'utf8');
  const runtimeStage = dockerfile.slice(dockerfile.indexOf('FROM node:24-bookworm-slim AS runtime'));

  assert.match(dockerfile, /AS dependencies[\s\S]*python3 make g\+\+/);
  assert.match(dockerfile, /npm_config_build_from_source=true/);
  assert.match(dockerfile, /require\('better-sqlite3'\)/);
  assert.match(dockerfile, /npm prune --omit=dev/);
  assert.match(runtimeStage, /--from=build \/app\/node_modules/);
  assert.doesNotMatch(runtimeStage, /apt-get|python3|make|g\+\+|npm ci/);
  assert.match(runtimeStage, /\nUSER node\n/);

  const database = new Database(':memory:');
  try {
    assert.deepEqual(database.prepare('SELECT 1 AS value').get(), { value: 1 });
  } finally {
    database.close();
  }
});
