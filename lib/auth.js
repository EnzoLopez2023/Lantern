import { createRemoteJWKSet, jwtVerify } from 'jose'

export const GUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function guid(value, name) {
  const normalized = String(value ?? '').trim().toLowerCase()
  if (!GUID_PATTERN.test(normalized)) throw new Error(`${name} must be a GUID`)
  return normalized
}

export function authConfiguration(env = process.env) {
  const production = env.NODE_ENV === 'production'
  const bypass =
    env.ALLOW_DEV_AUTH === 'true' ||
    env.LANTERN_DEV_AUTH_BYPASS === 'true'
  if (bypass && env.NODE_ENV !== 'development') {
    throw new Error('LANTERN_DEV_AUTH_BYPASS is permitted only when NODE_ENV=development')
  }
  if (bypass) {
    const tenantId = guid(env.DEV_AUTH_TENANT_ID, 'DEV_AUTH_TENANT_ID')
    return {
      production,
      bypass,
      tenantId,
      audience: null,
      issuer: null,
      delegatedScope: null,
      developmentIdentity: {
        tenantId,
        oid: guid(env.DEV_AUTH_OID, 'DEV_AUTH_OID'),
        displayName: String(env.DEV_AUTH_DISPLAY_NAME || 'Lantern developer').slice(0, 200),
        email: null,
      },
    }
  }

  const tenantId = guid(
    env.AZURE_AD_TENANT_ID ?? env.AZURE_TENANT_ID,
    'AZURE_AD_TENANT_ID',
  )
  const audience = String(
    env.AZURE_AD_AUDIENCE ??
    env.AZURE_AD_CLIENT_ID ??
    env.AZURE_AUDIENCE ??
    env.AZURE_CLIENT_ID ??
    '',
  ).trim()
  if (!audience) throw new Error('AZURE_AD_AUDIENCE or AZURE_AD_CLIENT_ID is required')
  const delegatedScope = String(env.AZURE_AD_DELEGATED_SCOPE ?? '').trim()
  if (!delegatedScope || /\s/.test(delegatedScope)) {
    throw new Error('AZURE_AD_DELEGATED_SCOPE must be one exact scp claim token')
  }
  const issuer = `https://login.microsoftonline.com/${tenantId}/v2.0`

  return { production, bypass, tenantId, audience, issuer, delegatedScope }
}

export function createTokenVerifier(config, {
  jwks = createRemoteJWKSet(
    new URL(`https://login.microsoftonline.com/${config.tenantId}/discovery/v2.0/keys`),
    { timeoutDuration: 3_000, cooldownDuration: 30_000, cacheMaxAge: 600_000 },
  ),
} = {}) {
  if (!config.delegatedScope || /\s/.test(config.delegatedScope)) {
    throw new Error('Token verifier requires one exact delegated scope token')
  }
  return async (token) => {
    const { payload } = await jwtVerify(token, jwks, {
      algorithms: ['RS256'],
      issuer: config.issuer,
      audience: config.audience,
      clockTolerance: 5,
      maxTokenAge: '2h',
      requiredClaims: ['exp', 'iat', 'iss', 'aud', 'tid', 'oid', 'idtyp', 'scp'],
    })
    const tenantId = guid(payload.tid, 'token tid')
    const oid = guid(payload.oid, 'token oid')
    if (tenantId !== config.tenantId) throw new Error('Token tenant does not match')
    if (payload.idtyp !== 'user') throw new Error('Token is not a delegated user token')
    if (
      typeof payload.scp !== 'string' ||
      !payload.scp.split(/\s+/).includes(config.delegatedScope)
    ) {
      throw new Error('Token lacks the configured delegated scope')
    }
    return {
      tenantId,
      oid,
      displayName: typeof payload.name === 'string' ? payload.name.slice(0, 200) : null,
      email: typeof payload.preferred_username === 'string'
        ? payload.preferred_username.slice(0, 320)
        : null,
    }
  }
}

function bearerToken(header) {
  if (typeof header !== 'string') return null
  const match = /^Bearer ([A-Za-z0-9\-._~+/]+=*)$/.exec(header)
  return match?.[1] ?? null
}

export function createAuth({
  repositories,
  config = authConfiguration(),
  verifyToken = config.bypass ? null : createTokenVerifier(config),
} = {}) {
  async function authenticate(req, res, next) {
    let identity
    try {
      if (config.bypass) {
        identity = config.developmentIdentity
      } else {
        const token = bearerToken(req.get('authorization'))
        if (!token) return res.status(401).json({ error: 'Bearer token required' })
        identity = await verifyToken(token)
      }
    } catch {
      return res.status(401).json({ error: 'Invalid access token' })
    }
    try {
      const user = await repositories.ensureUser(identity)
      if (user.disabled) return res.status(403).json({ error: 'User is disabled' })
      req.identity = identity
      req.localUser = user
      next()
    } catch (error) {
      next(error)
    }
  }

  function requireScope(scope) {
    return (req, res, next) => {
      const scopes = req.localUser?.scopes ?? []
      if (!scopes.includes('*') && !scopes.includes(scope)) {
        return res.status(403).json({ error: 'Insufficient app-local permission' })
      }
      next()
    }
  }

  return { authenticate, requireScope, config }
}
