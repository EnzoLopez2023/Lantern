# Lantern

Lantern is the independent Knowledge Base and Study Hub extracted from Hearth's production release 2.13.2. It preserves the pinned learning content and behavior while moving identity, progress, assessments, and TTS into an app-local authority.

## Local development

Requirements: Node.js 24 and a native build environment supported by `better-sqlite3`.

```bash
cp .env.example .env
npm install
npm run server
npm run dev
```

Set `ALLOW_DEV_AUTH=true`, `VITE_ALLOW_DEV_AUTH=true`, and GUID-valued `DEV_AUTH_TENANT_ID`/`DEV_AUTH_OID` only for local development. Azure tenant, audience, client, and scope values are not required in this explicit bypass. Production startup rejects the bypass.

## Portable runtime configuration

The production frontend does not bake Entra or API values into the Vite bundle. `index.html` loads `/runtime-config.js` before the application module, and Express generates that no-store script from runtime environment variables:

- `AZURE_AD_TENANT_ID`
- `AZURE_AD_CLIENT_ID`
- `AZURE_AD_AUDIENCE`
- `AZURE_AD_API_SCOPE`
- `AZURE_AD_DELEGATED_SCOPE` (the exact `scp` claim token, such as `access_as_user`)

The API is always same-origin and path-relative; cross-origin API base configuration is rejected. The Docker image therefore remains identical across environments. `VITE_AZURE_AD_*` values are local-development fallbacks only; they are not Docker build arguments and no `.env` file is copied into the image.

## Checks

```bash
npm run check
```

Tests use Node's built-in `node:test` runner.

## Data and recovery

Lantern uses one SQLite database in DELETE journal mode. Production must use `/home/data/lantern.db`; development defaults to `./data/lantern.db`.

The legacy importer accepts only the verified immutable Hearth backup and only Lantern's three owned tables. It requires explicit legacy tenant/OID ownership:

```bash
npm run import:legacy -- \
  --source /path/to/hearth-production.sqlite3 \
  --target ./data/lantern.db \
  --owner-tenant 00000000-0000-0000-0000-000000000000 \
  --owner-oid 00000000-0000-0000-0000-000000000000

npm run reconcile -- \
  --source /path/to/hearth-production.sqlite3 \
  --target ./data/lantern.db \
  --owner-tenant 00000000-0000-0000-0000-000000000000 \
  --owner-oid 00000000-0000-0000-0000-000000000000 \
  --output ./data/import-reconciliation.json
```

Recovery commands are explicit and never run on startup or request paths:

```bash
npm run backup -- --database ./data/lantern.db --output ./backups/lantern.sqlite3
npm run backup:verify -- --database ./backups/lantern.sqlite3
npm run restore:verify -- --backup ./backups/lantern.sqlite3 --destination ./data/restore-check.sqlite3 --disposable
```

Secure backup creation and disposable restore publication require Linux descriptor-relative filesystem operations (`/proc/self/fd`). Unsupported platforms fail closed before writing; read-only verification of an existing bundle remains portable.

See `docs/OPERATIONS.md` for the operating contract.

## Source authority

- Commit: `f0b05fc1dbf53e8aa26c215d8e858894a2793871`
- Tree: `62cbd35861c511f7c17187c875d19ee6e353b80d`
- Image: `sha256:dc4df7e0f966be5b0608e71643d316cc5eba7590b8e56cec482583ab69443140`
- Verified source DB SHA-256: `dc9fb47d269b339a3dcae37279dc3116f37a0635728a2d2b2ac2c511811a5807`

No source is taken from Hearth local HEAD or PostgreSQL work.
