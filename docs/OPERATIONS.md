# Operations

## Runtime contract

- One Node.js process, one worker, one App Service instance.
- One SQLite handle at `/home/data/lantern.db` in production.
- `journal_mode=DELETE`, `foreign_keys=ON`, bounded `busy_timeout`.
- `/api/live` never accesses SQLite.
- `/api/ready` performs only a bounded schema/version and cheap database query.
- No integrity scan, backup, repair, or long migration runs during startup or an HTTP request.

For first deployment only, `LANTERN_DB_ALLOW_CREATE=true` permits production startup to create `/home/data/lantern.db` and apply the app schema. Set it back to `false` immediately after the empty authority is confirmed.

The container compiles `better-sqlite3` in a Debian build stage with Python, Make, and g++, runs a native module smoke check there, prunes development dependencies, and copies only production modules into the non-root runtime stage. Compilers are not present in the runtime image.

## Deployment

The deployment workflow runs icon drift, types, lint, and all repository tests with `npm run check:source`, then compiles the frontend once in a cached runner-built Docker image. Existing database, migration, bootstrap, and recovery tests also run in that final image against disposable storage before the same image is pushed. Activation uses its exact registry digest, full source SHA, and workflow run/attempt identity.

Dependency audit, source/image SBOMs, Trivy, and Cosign signing/attestation verification run in a sibling diagnostics job. Their original reports and candidate-bound diagnostic records are retained as artifacts; findings or tooling failures cannot veto build or activation. No recurring backup, off-host archive freshness check, or monitoring resource is added.

Only production mutation is serialized, without cancellation, with `queue: max` retaining up to 100 pending jobs. The in-lock guard accepts the current default SHA or a proven ancestor whose deployable files are unchanged under the workflow's existing `paths-ignore`; lookup, ancestry, and diff errors fail closed. Rename detection is disabled so moving code into an ignored documentation path cannot hide its deletion. Cutover requires one worker and a stopped application with three absent liveness responses before repinning. Exact-release health and promotion share a ten-minute wall-clock limit; the entire rollback has a four-minute limit and must prove quiescence before restoring the prior digest and release settings. App-owned startup validation and persistent `/home` storage are unchanged.

Candidate, promotion, and rollback health confirmations require HTTP 200 from all three endpoints, matching SHA/build identity in readiness and version, and the same nonempty process identity across liveness, readiness, and version. Three consecutive confirmations must come from one process; a process change restarts the streak. Rollback proves the restored release's stable process rather than requiring the pre-deployment process ID.

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
