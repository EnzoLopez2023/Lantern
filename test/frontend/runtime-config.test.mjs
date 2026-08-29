import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PUBLIC_RUNTIME_CONFIG_KEYS,
  resolveRuntimeConfig,
  sanitizeRuntimeConfig,
} from '../../src/app/config/resolveRuntimeConfig.ts';
import { sameOriginApiPath } from '../../src/app/api/apiPath.ts';

test('runtime values override local Vite fallbacks but API base configuration is rejected', () => {
  const resolved = resolveRuntimeConfig({
    tenantId: 'runtime-tenant',
    clientId: 'runtime-client',
    apiScope: 'runtime-scope',
    apiBaseUrl: 'https://api.example.test/',
    allowDevAuth: true,
    devTenantId: 'runtime-dev-tenant',
    devOid: 'runtime-dev-oid',
  }, {
    tenantId: 'vite-tenant',
    clientId: 'vite-client',
  }, true);

  assert.equal(resolved.tenantId, 'runtime-tenant');
  assert.equal(resolved.clientId, 'runtime-client');
  assert.equal(resolved.apiBaseUrl, '');
  assert.match(resolved.configurationError, /not configurable.*current origin/i);
  assert.equal(resolved.allowDevAuth, true);
});

test('Vite fallback is local-development only and sanitizer excludes secrets', () => {
  const production = resolveRuntimeConfig(undefined, {
    tenantId: 'vite-tenant',
    clientId: 'vite-client',
    allowDevAuth: true,
  }, false);
  assert.equal(production.tenantId, '');
  assert.equal(production.clientId, '');
  assert.equal(production.allowDevAuth, false);
  assert.equal(production.configurationError, null);

  const sanitized = sanitizeRuntimeConfig({
    tenantId: 'tenant',
    clientSecret: 'must-not-escape',
    databaseUrl: 'must-not-escape',
  });

  test('production rejects a baked Vite API base instead of ignoring it', () => {
    const resolved = resolveRuntimeConfig(
      undefined,
      { apiBaseUrl: 'https://vite-api.example.test' },
      false,
    );

    assert.match(resolved.configurationError, /API base URLs are not configurable/);
    assert.equal(resolved.apiBaseUrl, '');
  });

  test('whitespace-only runtime and Vite API bases are rejected', () => {
    assert.match(
      resolveRuntimeConfig({ apiBaseUrl: ' ' }, {}, false).configurationError,
      /API base URLs are not configurable/,
    );
    assert.match(
      resolveRuntimeConfig(undefined, { apiBaseUrl: '\t' }, false).configurationError,
      /API base URLs are not configurable/,
    );
  });
  assert.deepEqual(Object.keys(sanitized).sort(), [...PUBLIC_RUNTIME_CONFIG_KEYS].sort());
  assert.equal('clientSecret' in sanitized, false);
  assert.equal('databaseUrl' in sanitized, false);
});

test('runtime and local-development API bases cannot redirect requests off origin', () => {
  for (const apiBaseUrl of [
    'https://api.example.test',
    '//api.example.test',
    'http://localhost:3001',
    '/alternate-api',
  ]) {
    const runtime = resolveRuntimeConfig({ apiBaseUrl }, {}, false);
    assert.equal(runtime.apiBaseUrl, '');
    assert.match(runtime.configurationError, /API base URLs are not configurable/i);
  }

  const vite = resolveRuntimeConfig(undefined, {
    apiBaseUrl: 'https://vite-api.example.test',
  }, true);
  assert.equal(vite.apiBaseUrl, '');
  assert.match(vite.configurationError, /VITE_API_BASE_URL empty/i);
});

test('API request paths are strictly origin-relative', () => {
  assert.equal(sameOriginApiPath('/api/user-state?limit=500'), '/api/user-state?limit=500');
  for (const unsafe of [
    'https://api.example.test/state',
    '//api.example.test/state',
    'api/user-state',
    '/\\api.example.test/state',
    '/api/user-state\nhttps://api.example.test',
  ]) {
    assert.throws(() => sameOriginApiPath(unsafe), /origin-relative path/i);
  }
});
