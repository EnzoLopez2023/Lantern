ALTER TABLE user_state ADD COLUMN change_sequence INTEGER;

CREATE TABLE user_state_changes (
  change_sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id       TEXT    NOT NULL,
  oid             TEXT    NOT NULL,
  resource_type   TEXT    NOT NULL,
  resource_key    TEXT    NOT NULL,
  revision        INTEGER NOT NULL,
  value_json      TEXT,
  tombstone       INTEGER NOT NULL,
  mutation_id     TEXT    NOT NULL,
  updated_at      TEXT    NOT NULL
);

CREATE INDEX idx_user_state_changes_snapshot
  ON user_state_changes(tenant_id, oid, change_sequence);
CREATE INDEX idx_user_state_changes_resource
  ON user_state_changes(
    tenant_id, oid, resource_type, resource_key, change_sequence DESC
  );

INSERT INTO user_state_changes(
  tenant_id, oid, resource_type, resource_key, revision,
  value_json, tombstone, mutation_id, updated_at
)
SELECT
  tenant_id, oid, resource_type, resource_key, revision,
  value_json, tombstone, mutation_id, updated_at
FROM user_state
ORDER BY updated_at, resource_type, resource_key, tenant_id, oid;

UPDATE user_state
SET change_sequence = (
  SELECT change_sequence
  FROM user_state_changes changes
  WHERE changes.tenant_id = user_state.tenant_id
    AND changes.oid = user_state.oid
    AND changes.resource_type = user_state.resource_type
    AND changes.resource_key = user_state.resource_key
);

CREATE UNIQUE INDEX idx_user_state_change_sequence
  ON user_state(change_sequence);
CREATE INDEX idx_user_state_sync_sequence
  ON user_state(tenant_id, oid, change_sequence);

CREATE TRIGGER user_state_requires_change_sequence_insert
BEFORE INSERT ON user_state
WHEN NEW.change_sequence IS NULL OR NEW.change_sequence <= 0
BEGIN
  SELECT RAISE(ABORT, 'user_state change_sequence is required');
END;

CREATE TRIGGER user_state_requires_change_sequence_update
BEFORE UPDATE ON user_state
WHEN NEW.change_sequence IS NULL OR NEW.change_sequence <= OLD.change_sequence
BEGIN
  SELECT RAISE(ABORT, 'user_state change_sequence must increase');
END;
