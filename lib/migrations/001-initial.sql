CREATE TABLE exam_attempts (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  mode            TEXT    NOT NULL DEFAULT 'full' CHECK(mode IN ('full','practice')),
  score           INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_count   INTEGER NOT NULL,
  domain1_score   INTEGER DEFAULT 0,
  domain1_total   INTEGER DEFAULT 0,
  domain2_score   INTEGER DEFAULT 0,
  domain2_total   INTEGER DEFAULT 0,
  passed          INTEGER NOT NULL DEFAULT 0,
  time_spent_sec  INTEGER,
  completed_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_exam_attempts_completed ON exam_attempts(completed_at DESC);
CREATE INDEX idx_exam_attempts_passed ON exam_attempts(passed);

CREATE TABLE exam_question_results (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  attempt_id   INTEGER NOT NULL,
  question_id  TEXT    NOT NULL,
  selected     TEXT    NOT NULL,
  correct      INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE
);
CREATE INDEX idx_exam_qr_attempt ON exam_question_results(attempt_id);
CREATE INDEX idx_exam_qr_qid ON exam_question_results(question_id);

CREATE TABLE exam_attempt_owners (
  attempt_id INTEGER PRIMARY KEY,
  tenant_id  TEXT NOT NULL,
  oid        TEXT NOT NULL,
  FOREIGN KEY (attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE
);
CREATE INDEX idx_exam_attempt_owners_identity
  ON exam_attempt_owners(tenant_id, oid, attempt_id);

CREATE TABLE kb_tts_progress (
  tenant_id      TEXT    NOT NULL,
  oid            TEXT    NOT NULL,
  guide_id       TEXT    NOT NULL,
  section_index  INTEGER NOT NULL DEFAULT 0,
  sentence_index INTEGER NOT NULL DEFAULT 0,
  section_title  TEXT    NOT NULL DEFAULT '',
  updated_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (tenant_id, oid, guide_id)
);

CREATE TABLE users (
  tenant_id   TEXT NOT NULL,
  oid         TEXT NOT NULL,
  display_name TEXT,
  email       TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  last_seen_at TEXT NOT NULL DEFAULT (datetime('now')),
  disabled_at TEXT,
  PRIMARY KEY (tenant_id, oid)
);

CREATE TABLE roles (
  name        TEXT PRIMARY KEY,
  scopes_json TEXT NOT NULL,
  built_in    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE user_roles (
  tenant_id  TEXT NOT NULL,
  oid        TEXT NOT NULL,
  role_name  TEXT NOT NULL,
  granted_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (tenant_id, oid, role_name),
  FOREIGN KEY (tenant_id, oid) REFERENCES users(tenant_id, oid) ON DELETE CASCADE,
  FOREIGN KEY (role_name) REFERENCES roles(name) ON DELETE RESTRICT
);

CREATE TABLE app_settings (
  key          TEXT PRIMARY KEY,
  value_json   TEXT NOT NULL,
  revision     INTEGER NOT NULL DEFAULT 1,
  updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_tenant_id TEXT NOT NULL,
  updated_oid  TEXT NOT NULL
);

CREATE TABLE audit_events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  occurred_at TEXT NOT NULL DEFAULT (datetime('now')),
  tenant_id   TEXT,
  oid         TEXT,
  action      TEXT NOT NULL,
  target_type TEXT,
  target_id   TEXT,
  detail_json TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX idx_audit_events_time ON audit_events(occurred_at DESC, id DESC);
CREATE INDEX idx_audit_events_actor ON audit_events(tenant_id, oid, id DESC);

CREATE TABLE user_state (
  tenant_id    TEXT NOT NULL,
  oid          TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_key TEXT NOT NULL,
  revision     INTEGER NOT NULL,
  value_json   TEXT,
  tombstone    INTEGER NOT NULL DEFAULT 0,
  mutation_id  TEXT NOT NULL,
  updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (tenant_id, oid, resource_type, resource_key)
);
CREATE INDEX idx_user_state_sync
  ON user_state(tenant_id, oid, updated_at, resource_type, resource_key);

CREATE TABLE user_state_mutations (
  tenant_id    TEXT NOT NULL,
  oid          TEXT NOT NULL,
  mutation_id  TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_key TEXT NOT NULL,
  response_json TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (tenant_id, oid, mutation_id)
);

CREATE TABLE legacy_imports (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  imported_at     TEXT NOT NULL DEFAULT (datetime('now')),
  source_sha256   TEXT NOT NULL UNIQUE,
  source_size     INTEGER NOT NULL,
  owner_tenant_id TEXT NOT NULL,
  owner_oid       TEXT NOT NULL,
  counts_json     TEXT NOT NULL
);

CREATE TABLE reconciliation_runs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  reconciled_at TEXT NOT NULL DEFAULT (datetime('now')),
  source_sha256 TEXT NOT NULL,
  report_json   TEXT NOT NULL
);

INSERT INTO roles(name, scopes_json, built_in)
VALUES
  ('user', '["exam:read","exam:write","kb:read","kb:write","state:read","state:write","tts:use","settings:read"]', 1),
  ('admin', '["*"]', 1);
