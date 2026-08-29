# SC 11th-Grade Curriculum — Build Spec & Backlog

> **Status:** Spec / backlog — not yet implemented. Saved here so future
> Claude Code sessions (on any machine) can pick this up. Companion to
> [BLUEPRINT.md](BLUEPRINT.md). Once a class track is built and QC-passed it
> moves out of the backlog section below.

## Why this exists

A High School category was added to the Exam Prep Hub (see [exams.ts](exams.ts) — `category: 'High School'` on SCPERMIT and SAT). The next layer is full curriculum coverage for the **South Carolina Board of Education 11th-grade (junior) year**, so a junior using this app can study every required class plus electives they're taking. Required classes get the full deep-dive treatment; electives get a lighter track.

The spec also covers the SC **EOCEP-tested classes from 9th and 10th grade** (Algebra 1, English 2, Biology 1) so EOCEP coverage is complete — a junior retaking any of them, or a younger sibling studying ahead, gets the same quality of content as USHC.

## SC graduation requirements (verified)

Cross-checked May 2026 against [SCDE — High School Courses and Requirements](https://ed.sc.gov/districts-schools/state-accountability/high-school-courses-and-requirements/). Authoritative reference: [SBE Regulation 43-234](https://ed.sc.gov/districts-schools/state-accountability/high-school-diploma/sbe-regulation-43-234-defined-program-grades-9-12-and-graduation-requirements/). Applies to the entering freshman class of 2023–24 and forward.

| Subject | Credits |
|---|---|
| English | 4 |
| U.S. History | 1 |
| Economics | 0.5 |
| Government | 0.5 |
| Other Social Studies | 1 |
| Mathematics | 4 |
| Sciences | 3 |
| Computer Science | 1 |
| PE or JROTC or Marching Band with PE | 1 |
| World Language or Career & Technology Elective | 1 |
| Personal Finance | 0.5 |
| Electives | 6.5 |
| **Total** | **24** |

**EOCEP-tested courses** (current per [SCDE EOCEP](https://ed.sc.gov/tests/high/eocep/)):
- Algebra 1
- English 2
- Biology 1
- United States History and the Constitution (USHC)
- Intermediate Algebra (remediation)

Only USHC is taken in the standard 11th-grade slot. EOCEP scores count 20% of the student's final course grade.

## Scope — what to build

### Required 11th-grade classes (full deep-dive)

| Class | EOCEP? | Sandbox? | Notes |
|---|---|---|---|
| **English 3 / English Language Arts 3** | No | No | English 2 EOCEP is 10th grade; English 3 is the unflagged 11th-grade English. |
| **U.S. History and the Constitution** | **Yes** | **Yes** | The only EOCEP track in this grade — gets the full Microsoft-style timed `ExamSandbox.tsx`. |
| **Math — Algebra 2** | No | No | Standard-pace junior math. |
| **Math — Pre-Calculus** | No | No | Build alongside Algebra 2 so any 11th-grade math placement is covered. |
| **Math — Probability & Statistics** | No | No | Common alternative junior math. |
| **Science — Chemistry** | No | No | Per user: build all three junior sciences. |
| **Science — Physics** | No | No | Per user: build all three junior sciences. |
| **Science — Environmental Science** | No | No | Per user: build all three junior sciences. |
| **Personal Finance (0.5 credit)** | No | No | Required 0.5 credit for 2023–24 freshmen onward; commonly taken in 11th or 12th. |

### Cross-grade EOCEP tracks (full deep-dive)

These are taken in 9th or 10th grade, not 11th — but they're included in this build because **EOCEP coverage should be complete** (a junior retaking any of them still needs the content, and partial EOCEP coverage in the High School category would feel arbitrary). Each gets the same full deep-dive + timed sandbox as USHC.

| Class | Typical grade | EOCEP? | Sandbox? |
|---|---|---|---|
| **Algebra 1** | 9th | **Yes** | **Yes** |
| **English 2** | 10th | **Yes** | **Yes** |
| **Biology 1** | 9th–10th | **Yes** | **Yes** |
| **Intermediate Algebra** | varies (remediation) | **Yes** | **Yes** — but lower priority; only build if a student is on the remediation track |

All four EOCEP-tested junior-year-adjacent tracks (Algebra 1, English 2, Biology 1, USHC) get the timed exam sandbox. Intermediate Algebra is deferred unless explicitly needed.

### Elective tracks (lighter content, same section structure)

Per user: *"author for all, just no need to make them all thorough as required classes, but should still have all sections like required classes."* Every elective track has the same files / tabs / quick-checks as a required class — only the quantity floors (from the deliverables table below) differ. **No exam sandbox on any elective** — no EOCEP coverage.

The universe of common SC 11th-grade electives, organised by category. Build every track in this list:

**World Language** (counts toward 1-credit World Language / CATE requirement, or as elective):
- Spanish 1 / 2 / 3 / 4 / AP Spanish Language
- French 1 / 2 / 3 / 4 / AP French Language
- Latin 1 / 2 / 3 / 4
- German 1 / 2 / 3
- American Sign Language 1 / 2

**AP courses** typically taken by SC juniors:
- AP U.S. History
- AP English Language and Composition
- AP Calculus AB / BC
- AP Statistics
- AP Biology
- AP Chemistry
- AP Physics 1 / 2 / C: Mechanics
- AP Psychology
- AP World History: Modern
- AP Computer Science Principles
- AP Computer Science A
- AP Human Geography
- AP Environmental Science

> **Open question:** AP courses have College Board exams (not EOCEP). The user's rule is "sandbox only for EOCEP-tested classes" — strict reading: no sandbox for AP tracks. Confirm before building.

**Career & Technology Education (CATE)** (counts toward World Language / CATE, or as elective):
- Accounting 1 / 2
- Business / Marketing
- Information Technology Fundamentals
- Engineering Design / PLTW Principles of Engineering
- Health Science 1 / 2
- Culinary Arts 1 / 2
- Agriculture / Animal Science / Horticulture
- Cybersecurity 1 / 2

**Arts** (elective):
- Visual Art 1 / 2 / 3 / AP Studio Art
- Theatre / Drama 1 / 2 / 3
- Band / Wind Ensemble
- Chorus / Concert Choir
- Orchestra / Strings
- Dance 1 / 2

**Other electives**:
- Psychology (non-AP)
- Sociology
- Journalism / Newspaper / Yearbook
- Speech & Debate / Forensics
- Leadership / Student Council
- Creative Writing
- Film Studies

Driver's Education is **not** authored here — SC permit prep already lives at the SCPERMIT track.

This list is comprehensive but should be sanity-checked against the actual course catalogue of the student's specific SC district before mass-authoring — district offerings vary.

## Per-class deliverables

| Component | Required class | Elective |
|---|---|---|
| Study guide with sectioned topics | **Full** (≥ 8 sections, ≥ 120 KB) | Light (≥ 4 sections, ≥ 40 KB) |
| **Quick check** at the end of each section | **Yes — every section** | **Yes — every section** |
| Flashcards | ≥ 30 cards | ≥ 15 cards |
| Glossary | ≥ 30 terms | ≥ 15 terms |
| Practice test | ≥ 100 questions | ≥ 30 questions |
| Diagnostic / readiness analytics | Yes | Optional |
| Exam sandbox (timed) | **Only if EOCEP-tested** (US History) | No |
| Mermaid diagrams or visualisations where they help | ≥ 6 | ≥ 2 |
| Inline tips (see editorial rule below) | ≥ 15 | ≥ 5 |
| Analogies / real-world connections | ≥ 15 | ≥ 5 |

## Editorial rules — the user's specific requests

1. **NO "Exam Tip" language.** This is curriculum, not certification prep. Use mixed callout labels that match what the tip is actually doing — variety is the goal, not a single re-label:
   - `Watch For` — common pitfalls / wrong-answer traps
   - `Why It Matters` — real-world / cross-discipline connection
   - `Make It Stick` — memory aids, mnemonics
   - `In Plain Words` — re-explanation in everyday language
   - `Try This` — micro-exercise inline with the text
   - `Connect` — link to a related topic in another section/class
   - `Coach's Note` — mentor-voice guidance
2. **Tons of tips.** Aim higher than the certification tracks — junior-year students benefit from frequent reinforcement. ≥ 15 inline callouts per required-class study guide is the floor, not the ceiling.
3. **"Quick check" at the end of each section.** Short reinforcement quiz (3–5 questions) that the student can hit immediately after reading. Distinct from the longer practice test. Implementation idea: a `QuickCheck.tsx` shared component that takes a small question array; embed it at the bottom of each `Section*` block in `StudyGuide.tsx`.
4. **Practice test must be thorough.** ≥ 100 questions for required classes, spanning every section. Mix formats (multiple choice, short answer, true/false). Include explanations on every question (≥ 80 chars per explanation — same as the cert-track QC floor).
5. **Tone:** approachable for an 11th-grader. Avoid jargon without unpacking it. Analogy-first introductions to new concepts.

## Quality-control gate — adapt the Cairn `qc.mjs` pattern

The user runs a similar Exam Prep app in the **Cairn** repo (`C:\Repos\Cairn`) with a `lib/qc.mjs` script that gates content as `active` only when it passes 20+ automated checks (file existence, byte sizes, question count, subdomain↔section coverage mapping, explanation length, domain-weight sum, no-TODOs, lazy imports wired up, etc.). See [Cairn lib/qc.mjs](file:///C:/Repos/Cairn/lib/qc.mjs).

**Before deploying ANY class track here**, a Hearth-side equivalent must exist:

- Add `lib/qc.mjs` (or `scripts/qc.mjs`) to this repo.
- Define a `'High School'` tier alongside any existing tiers, with thresholds matching the table above.
- Add the curriculum-specific checks:
  - Every `Section*` in `StudyGuide.tsx` has a `<QuickCheck />` embedded.
  - Callout labels are from the approved list (no occurrences of `Exam Tip` / `Exam Tips`).
  - The full practice test exists and meets the question floor.
  - Sandbox file exists **only** when the class is flagged as EOCEP-tested.
- Wire it into the `/build-exam-prep` skill's exit step so the skill cannot commit a class until QC passes.

This is the user's explicit ask: *"Create a quality Control assessment of the class track created before deploying. Review my Cairn — Exam prep app on how I do QC."*

## Implementation order

### Foundation (already built — checked off as of this commit)

- ✅ **Shared `SectionQuiz`** — already exists at [shared/components.tsx:477](shared/components.tsx#L477). Default title is literally "Quick check". HS tracks reuse it as-is at the bottom of each `Section*` block — no new component needed.
- ✅ **`Callout` component** — new at [shared/Callout.tsx](shared/Callout.tsx). One component with a `kind` prop (`'watch-for' | 'why-it-matters' | 'make-it-stick' | 'in-plain-words' | 'try-this' | 'connect' | 'coachs-note'`). Lives separate from the cert-track `ExamTip` so cert tracks are unaffected. Optional `label` prop lets authors override the default chip text.
- ✅ **Type extensions in [types.ts](types.ts)** — `ExamLevel` adds `'High School Required'` and `'High School Elective'`; `ExamMeta` adds `isEOCEP?: boolean`. The QC script reads both to pick the right tier and to gate sandbox presence.
- ✅ **QC script** — [lib/qc.mjs](../../lib/qc.mjs) (core, importable) + [.claude/skills/build-exam-prep/qc-check.mjs](../../.claude/skills/build-exam-prep/qc-check.mjs) (CLI wrapper). New `highSchool` + `highSchoolElective` tiers in `BARS`. HS-specific checks: forbid `<ExamTip>` and the literal "Exam Tip" / "Exam Tips" phrase, require a `<SectionQuiz>` per non-exempt section, gate `ExamSandbox.tsx` presence on `isEOCEP`. Run `node .claude/skills/build-exam-prep/qc-check.mjs <CODE>` to validate a track.

### Remaining build order

1. **Update `/build-exam-prep` skill templates** to default to `<Callout>` (HS) or `<ExamTip>` (cert) and to scaffold a `<SectionQuiz>` block at the end of each `Section*` for HS tracks. Bake the QC invocation into the skill's exit step so it cannot commit a class until `qc-check.mjs` exits 0.
2. **First reference build — US History and the Constitution** (USHC). EOCEP-tested, so it exercises the full required-class + sandbox path. The content lends itself to memorable analogies.
3. **Run QC on USHC.** Iterate until it passes — this also shakes out QC-rule bugs in the freshly-ported `qc.mjs`.
4. **Remaining EOCEP-tested tracks** (Algebra 1, English 2, Biology 1) — same full deep-dive + sandbox treatment. Each runs QC before merge. Reuses the sandbox infrastructure from step 2.
5. **Remaining 11th-grade required classes** (English 3, Algebra 2, Pre-Calculus, Probability & Statistics, Chemistry, Physics, Environmental Science, Personal Finance) — full deep-dive but no sandbox. Each runs QC before merge.
6. **Electives**, in batches by category (World Language first, then CATE, then AP, then Arts, then Other). Lighter content floors but same section structure.

## Decisions locked in by the user

- Required-class list cross-checked May 2026 against SCDE — see table above.
- Build all three junior sciences (Chemistry, Physics, Environmental Science).
- Build elective tracks for everything in the elective universe above (full section structure, lighter quantity floors per the deliverables table).
- Source-of-truth policy: **do not adopt** Cairn's strict "≥ 4 source categories" rule. SCDE alone is also not enough — triangulate with district pacing guides (e.g. Greenville / Lexington / Richland), College Board AP Course & Exam Descriptions (for AP tracks), widely-adopted textbook outlines (Holt McDougal, Pearson, Bedford), and reputable OER (CK-12, Khan Academy outlines, OpenStax). Cite inline where a claim could be contested.

## Still open

- Sandbox policy for AP tracks (College Board exams aren't EOCEP — strict reading says no sandbox, but AP students benefit from timed practice).
- Confirm the student's specific SC district course catalogue — district offerings vary; the elective universe above is comprehensive but not every district offers every option.
- Decide if practice-test questions can be AI-drafted then human-reviewed, or must be hand-authored. The QC script should have a no-TODOs / no-placeholder rule that catches AI-leftover artifacts either way.

## Related

- [BLUEPRINT.md](BLUEPRINT.md) — the existing certification-track blueprint. Most of its rules apply; this doc is the high-school overlay.
- [Cairn lib/qc.mjs](file:///C:/Repos/Cairn/lib/qc.mjs) — reference QC implementation.
- [Cairn .claude/skills/build-exam-prep/SKILL.md](file:///C:/Repos/Cairn/.claude/skills/build-exam-prep/SKILL.md) — reference skill that gates commit on QC pass.
