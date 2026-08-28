import assert from 'node:assert/strict'
import test from 'node:test'
import { validateEnvironment } from '../../server/bootstrap.js'

const productionEnvironment = {
  NODE_ENV: 'production',
  AZURE_AD_TENANT_ID: '11111111-1111-1111-1111-111111111111',
  AZURE_AD_CLIENT_ID: 'lantern-client',
  AZURE_AD_AUDIENCE: 'api://lantern',
  AZURE_AD_API_SCOPE: 'api://lantern/access_as_user',
  AZURE_AD_DELEGATED_SCOPE: 'access_as_user',
  BUILD_SHA: 'a'.repeat(40),
}

test('production requires portable runtime auth and API scope settings', () => {
  for (const name of [
    'AZURE_AD_TENANT_ID',
    'AZURE_AD_CLIENT_ID',
    'AZURE_AD_AUDIENCE',
    'AZURE_AD_API_SCOPE',
    'AZURE_AD_DELEGATED_SCOPE',
  ]) {
    const environment = { ...productionEnvironment }
    delete environment[name]
    assert.throws(
      () => validateEnvironment(environment),
      new RegExp(`Missing required production environment variables:.*${name}`),
    )
  }
})

test('speech stream timeout configuration is bounded and ordered', () => {
  assert.throws(() => validateEnvironment({
    ...productionEnvironment,
    AZURE_SPEECH_STREAM_IDLE_TIMEOUT_MS: '1000',
    AZURE_SPEECH_STREAM_TIMEOUT_MS: '1000',
  }), /must exceed/)
  assert.throws(() => validateEnvironment({
    ...productionEnvironment,
    AZURE_SPEECH_STREAM_IDLE_TIMEOUT_MS: '24',
  }), /between 25 and 60000/)
})

test('startup rejects every nonempty public API base', () => {
  for (const apiBaseUrl of [
    'https://api.example.invalid',
    '//api.example.invalid',
    '/api-prefix',
    ' ',
  ]) {
    assert.throws(() => validateEnvironment({
      ...productionEnvironment,
      LANTERN_PUBLIC_API_BASE_URL: apiBaseUrl,
    }), /same-origin only/)
  }
})

test('development bypass startup requires only DEV_AUTH GUIDs', () => {
  const config = validateEnvironment({
    NODE_ENV: 'development',
    ALLOW_DEV_AUTH: 'true',
    DEV_AUTH_TENANT_ID: '11111111-1111-1111-1111-111111111111',
    DEV_AUTH_OID: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  })
  assert.equal(config.auth.bypass, true)
  assert.equal(config.auth.tenantId, '11111111-1111-1111-1111-111111111111')
  assert.equal(config.auth.audience, null)
  assert.throws(() => validateEnvironment({
    NODE_ENV: 'development',
    ALLOW_DEV_AUTH: 'true',
    DEV_AUTH_TENANT_ID: 'development',
    DEV_AUTH_OID: 'local-user',
  }), /must be a GUID/)
})
