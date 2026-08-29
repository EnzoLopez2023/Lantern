# Source lineage

Lantern Wave 1 is derived only from Hearth production commit `f0b05fc1dbf53e8aa26c215d8e858894a2793871`, tree `62cbd35861c511f7c17187c875d19ee6e353b80d`, version 2.13.2 build 172, and image digest `sha256:dc4df7e0f966be5b0608e71643d316cc5eba7590b8e56cec482583ab69443140`.

## Owned source

- `src/KnowledgeBase/**`
- `src/ExamPrepHub/**`
- `routes/examPrep.js`
- `routes/kbProgress.js`
- `routes/tts.js`
- The minimal pinned import closure required by those modules

Every copied source file is read with `git show <commit>:<path>`. `docs/source-lineage.json` records source and destination paths plus hashes after extraction.

The generated manifest contains 225 pinned source files: 109 byte-for-byte copies and 116 bounded adaptations for strict TypeScript compatibility, literal guide prose, routing, auth-aware persistence, and the independent app boundary. It also records ten Lantern-owned support files added inside the extracted feature trees.

## Excluded source

- Local Hearth HEAD `9396372bd3825370c0b91a506f1de5261a709790`
- Hearth PostgreSQL pull-request and integration branches
- Hearth's global `AppView` shell, dashboard, navigation, and unrelated features/routes
- Cairn and IT-certification content

## Data authority

The immutable source backup is 950,947,840 bytes with SHA-256 `dc9fb47d269b339a3dcae37279dc3116f37a0635728a2d2b2ac2c511811a5807`.

| Table | Rows | Canonical source SHA-256 |
|---|---:|---|
| `exam_attempts` | 0 | `6e9ee03c85f73bb2fca73fb301ec58facd47e7ba6d7f7c5be4baec7ef6c1e606` |
| `exam_question_results` | 0 | `8d66544a801347b22884b623c422eb726f73affa492c22a644c193a78caa9ca0` |
| `kb_tts_progress` | 3 | `9687599dccc177ca7fe95d3a70c8f93c0da192805304abcebcf2d098a7d07bda` |

The combined Lantern source product hash is `b71bee99ff4160f7018b227dda921311aa9a32775c613e5159dcc411eaaab8cb`.
