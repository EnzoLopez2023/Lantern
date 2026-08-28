import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the immutable image loads runtime config before the frontend bundle', async () => {
  const [html, dockerfile, dockerignore] = await Promise.all([
    readFile('index.html', 'utf8'),
    readFile('Dockerfile', 'utf8'),
    readFile('.dockerignore', 'utf8'),
  ]);

  const runtimeConfig = html.indexOf('src="/runtime-config.js"');
  const application = html.indexOf('src="/src/main.tsx"');
  assert.ok(runtimeConfig >= 0);
  assert.ok(application > runtimeConfig);
  assert.doesNotMatch(dockerfile, /\bARG\s+VITE_/);
  assert.match(dockerignore, /^\.env\*$/m);
});
