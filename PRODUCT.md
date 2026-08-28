# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Authenticated learners who use a private knowledge library and study tools across browsers and devices.

## Product Purpose

Lantern combines Hearth's production Knowledge Base and Study Hub in one independent application. Success means every guide and active study track remains usable with the same learning outcomes while progress is isolated to the signed-in person.

## Positioning

Lantern is the source-controlled learning application from Hearth. It owns technical guides and non-IT school, standardized-test, and permit preparation together; IT-certification content belongs to Cairn and must not be introduced here.

## Operating Context

Learners search and read long-form guides, listen with Azure Speech, complete guide checklists, study track material, run diagnostics and practice, use flashcards, take supported mock/adaptive/sandbox exams, and resume work online or offline.

## Capabilities and Constraints

- Preserve the production behavior and content at Hearth commit `f0b05fc1dbf53e8aa26c215d8e858894a2793871`.
- Keep learning content source-controlled and generated TTS audio outside SQLite.
- Use app-local Entra authentication and tenant/OID-scoped state.
- Run as one Express process and one SQLite authority in DELETE journal mode.
- Never depend on Hearth's global shell, another product's database, PostgreSQL, or IT-certification content.

## Brand Commitments

The product name is Lantern. The incumbent Knowledge Base and Study Hub visual and interaction language is authoritative for Wave 1; parity takes precedence over redesign.

## Evidence on Hand

- Hearth source commit `f0b05fc1dbf53e8aa26c215d8e858894a2793871`, version 2.13.2 build 172.
- Production image digest `sha256:dc4df7e0f966be5b0608e71643d316cc5eba7590b8e56cec482583ab69443140`.
- Verified production SQLite backup SHA-256 `dc9fb47d269b339a3dcae37279dc3116f37a0635728a2d2b2ac2c511811a5807`.

## Product Principles

- Preserve learning outcomes before improving architecture.
- Make identity boundaries explicit and stable.
- Keep offline work immediate and synchronization recoverable.
- Treat content lineage and data reconciliation as release evidence.
- Keep operational work bounded and deliberate.

## Accessibility & Inclusion

Preserve keyboard access, visible focus, reduced-motion preferences, responsive layouts, semantic controls, and readable long-form content.
