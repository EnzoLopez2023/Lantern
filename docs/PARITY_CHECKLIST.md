# Production parity checklist

## Knowledge Base

- [ ] Every pinned guide loads by stable guide ID.
- [ ] Search indexing, ranking, highlighting, keyboard navigation, and empty states match production.
- [ ] Guide checklists retain their production data shapes.
- [ ] TTS voice selection, 10,000-character limit, playback controls, resume, and clear work.
- [ ] Generated audio is streamed or stored outside SQLite.

## Study Hub

- [ ] All 14 active tracks render with production names, metadata, question banks, glossaries, and decks.
- [ ] Study guides preserve reading, completion, and section-quiz state where implemented.
- [ ] Diagnostics, practice, flashcards, notes, bookmarks, streaks, drill statistics, and flashcard statistics match production behavior.
- [ ] EOCEP sandboxes preserve timing, answer order, review flags, scoring, domain breakdown, and reload resume.
- [ ] SAT adaptive testing/analytics and SCPERMIT mock/sign flows match their specialized production behavior.
- [ ] Unified search remains available only on tracks that ship it.

## Identity and offline behavior

- [ ] Every mutable resource is isolated by tenant ID and OID.
- [ ] localStorage remains an immediate offline cache.
- [ ] Legacy browser keys are copied only after explicit user confirmation and are not deleted during Wave 1.
- [ ] Offline mutations replay idempotently; conflicts and tombstones are explicit.

## Data and operations

- [ ] Source backup bytes and SHA-256 match before import.
- [ ] Real import reconciles 0 attempts, 0 question results, and 3 KB progress rows.
- [ ] Source and mapping-aware target count/key/hash/FK/sequence reports have zero unexplained differences.
- [ ] SQLite is DELETE journal, foreign keys are on, and busy timeout is bounded.
- [ ] Liveness is process-only and readiness performs only bounded checks.
- [ ] Backup, verification, and disposable restore run only through explicit commands.

## Delivery

- [ ] Strict TypeScript, lint, `node:test`, production build, dependency audit, and forbidden-dependency checks pass.
- [ ] Desktop/mobile, keyboard/focus, reduced-motion, loading, empty, and error-state checks pass.
- [ ] No PostgreSQL, Azure management, OpenAI, Anthropic, Hearth shell, Cairn, or IT-certification code is present.
