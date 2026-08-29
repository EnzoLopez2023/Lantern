# Operations

## Runtime contract

- One Node.js process, one worker, one App Service instance.
- One SQLite handle at `/home/data/lantern.db` in production.
- `journal_mode=DELETE`, `foreign_keys=ON`, bounded `busy_timeout`.
- `/api/live` never accesses SQLite.
- `/api/ready` performs only a bounded schema/version and cheap database query.
- No integrity scan, backup, repair, or long migration runs during startup or an HTTP request.

The container compiles `better-sqlite3` in a Debian build stage with Python, Make, and g++, runs a native module smoke check there, prunes development dependencies, and copies only production modules into the non-root runtime stage. Compilers are not present in the runtime image.

## Authentication

The browser obtains an app-audience access token through MSAL. The server validates signature, issuer, tenant, audience, lifetime, GUID-shaped `oid`, and the exact configured delegated `scp`; optional `idtyp=app` and roles-only tokens are rejected. App-only tokens cannot acquire the default user role. Data identity is `(tenant_id, oid)`; email and display name are descriptive only.

Development auth bypass requires development mode, explicit server/client flags, and GUID-valued `DEV_AUTH_TENANT_ID`/`DEV_AUTH_OID`. It derives identity only from those development values and does not require Azure configuration. Production rejects it.

The immutable image is environment-portable: Express emits `/runtime-config.js` from validated runtime Entra configuration before the Vite module loads. The endpoint is public, contains no secrets, and is served with `Cache-Control: no-store`. API requests are always same-origin under `/api`; absolute, protocol-relative, and prefixed API base configuration is rejected.

## Legacy import

Use only a supplied immutable verified backup. The importer opens the source read-only, verifies byte count and SHA-256 before SQL, requires explicit tenant/OID ownership, rejects a nonempty target, and imports only Lantern's owned tables.

Retain the source backup and reconciliation output through cutover acceptance.

## Backup and restore

Backups use SQLite's online backup API or a deliberately quiesced writer. Never copy a live DB file. Every backup bundle includes bytes, SHA-256, schema identity, table counts, recency, quick/integrity/FK checks, and build identity.

Verify by reading the backup back and restoring to a disposable destination. Controlled production restore requires downtime, explicit authorization, a pre-restore snapshot, and a forward recovery decision after the first new write.

Secure write/publication operations require Linux descriptor-relative filesystem access through `/proc/self/fd`; unsupported platforms fail closed before creating output. Read-only verification of an existing intact bundle remains location-portable.
