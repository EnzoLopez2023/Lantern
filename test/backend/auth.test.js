import assert from 'node:assert/strict'
import test from 'node:test'
import { exportJWK, generateKeyPair, SignJWT } from 'jose'
import { authConfiguration, createTokenVerifier } from '../../lib/auth.js'

const tenantId = '11111111-1111-1111-1111-111111111111'
const oid = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'

test('development bypass is explicit and impossible outside development', () => {
  assert.throws(() => authConfiguration({
    NODE_ENV: 'production',
    ALLOW_DEV_AUTH: 'true',
    DEV_AUTH_TENANT_ID: tenantId,
    DEV_AUTH_OID: oid,
  }), /permitted only/)
  assert.throws(() => authConfiguration({
    NODE_ENV: 'test',
    ALLOW_DEV_AUTH: 'true',
    DEV_AUTH_TENANT_ID: tenantId,
    DEV_AUTH_OID: oid,
  }), /permitted only/)
  const config = authConfiguration({
    NODE_ENV: 'development',
    ALLOW_DEV_AUTH: 'true',
    DEV_AUTH_TENANT_ID: tenantId,
    DEV_AUTH_OID: oid,
  })
  assert.equal(config.developmentIdentity.oid, oid)
})

test('JWT verifier checks signature, issuer, tenant, audience, lifetime, and GUID OID', async () => {
  const { publicKey, privateKey } = await generateKeyPair('RS256')
  const jwk = await exportJWK(publicKey)
  const config = {
    tenantId,
    audience: 'lantern-client',
    issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
    delegatedScope: 'access_as_user',
  }
  const verify = createTokenVerifier(config, { jwks: publicKey })
  const makeToken = (overrides = {}) => new SignJWT({
    tid: tenantId,
    oid,
    name: 'Test User',
    preferred_username: 'address@example.invalid',
    idtyp: 'user',
    scp: 'openid access_as_user profile',
    ...overrides,
  })
    .setProtectedHeader({ alg: 'RS256', kid: jwk.kid })
    .setIssuer(config.issuer)
    .setAudience(config.audience)
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(privateKey)

  assert.deepEqual(await verify(await makeToken()), {
    tenantId,
    oid,
    displayName: 'Test User',
    email: 'address@example.invalid',
  })
  await assert.rejects(verify(await makeToken({ oid: 'not-a-guid' })), /GUID/)
  await assert.rejects(verify(await makeToken({ scp: undefined })))
  await assert.rejects(verify(await makeToken({ scp: 'openid wrong_scope' })), /scope/)
  await assert.rejects(verify(await makeToken({ idtyp: undefined })))
  await assert.rejects(verify(await makeToken({ idtyp: 'app' })), /delegated user/)
  await assert.rejects(verify(await makeToken({
    idtyp: 'app',
    scp: undefined,
    roles: ['Lantern.ReadWrite.All'],
  })))
  const wrongAudience = await new SignJWT({ tid: tenantId, oid })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuer(config.issuer)
    .setAudience('wrong')
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(privateKey)
  await assert.rejects(verify(wrongAudience))
})

test('token auth configuration fails closed without one delegated scope token', () => {
  assert.throws(() => authConfiguration({
    NODE_ENV: 'development',
    AZURE_AD_TENANT_ID: tenantId,
    AZURE_AD_AUDIENCE: 'lantern-client',
  }), /AZURE_AD_DELEGATED_SCOPE/)
  assert.throws(() => authConfiguration({
    NODE_ENV: 'development',
    AZURE_AD_TENANT_ID: tenantId,
    AZURE_AD_AUDIENCE: 'lantern-client',
    AZURE_AD_DELEGATED_SCOPE: 'scope-one scope-two',
  }), /one exact scp claim token/)
})
