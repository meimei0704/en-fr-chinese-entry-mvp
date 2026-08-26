# Inclusive French Greeting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three masculine-only daily-greetings translations with the approved `Enchanté(e)` compatibility form.

**Architecture:** Keep the static lesson source authoritative, protect the wording with content-level assertions, and regenerate derived JSON/SQL artifacts through the existing generators. Publish only the two changed modules after the pull request passes review.

**Tech Stack:** TypeScript, Vitest, Vite, Go seed generator, MySQL content-admin revisions.

## Global Constraints

- Do not change lesson IDs, ordering, pinyin, explanations, audio, or UI code.
- The exact approved prefix is `Enchanté(e)`.
- Generated JSON and SQL must be derived from the static lesson source.

---

### Task 1: Guard the approved French wording

**Files:**
- Modify: `src/content/contentSemantics.test.ts`
- Modify: `src/content/course.test.ts`

**Interfaces:**
- Consumes: the exported `course` object.
- Produces: regression assertions for all three daily-greetings translations.

- [ ] **Step 1: Write failing expectations for `Enchanté(e)`**

Assert the dialogue translation and two pattern-example translations use
`Enchanté(e)` and that the serialized lesson contains no former
masculine-only forms.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
npx vitest run src/content/contentSemantics.test.ts src/content/course.test.ts
```

Expected: failures showing the current `Enchanté...` values.

### Task 2: Update the authoritative lesson and generated artifacts

**Files:**
- Modify: `src/content/lessons/dailyGreetings.ts`
- Modify: `pkg/seedgen/data/course.json`
- Modify: `db/seeds/0001_initial_content_admin.sql`

**Interfaces:**
- Consumes: approved `Enchanté(e)` wording.
- Produces: synchronized static, JSON, and SQL content.

- [ ] **Step 1: Replace the three source translations**

Use:

```text
Enchanté(e) de faire votre connaissance.
Enchanté(e) de faire connaissance avec tout le monde.
```

- [ ] **Step 2: Regenerate derived artifacts**

Run:

```bash
node scripts/export-course-json.mjs
go run ./cmd/contentseed > db/seeds/0001_initial_content_admin.sql
```

- [ ] **Step 3: Verify GREEN**

Run:

```bash
npx vitest run src/content/contentSemantics.test.ts src/content/course.test.ts
go test ./pkg/seedgen/...
```

Expected: all tests pass.

### Task 3: Validate, review, and publish

**Files:**
- No additional source files.

**Interfaces:**
- Consumes: reviewed commit.
- Produces: preview and production content-admin revisions.

- [ ] **Step 1: Run the full repository gates**

Run unit tests, lint, build, end-to-end tests, seed consistency, and
`git diff --check`.

- [ ] **Step 2: Commit and open a focused pull request**

Commit only the design, plan, tests, source, and regenerated artifacts.

- [ ] **Step 3: Publish after review**

Back up and transactionally publish the daily-greetings `dialogue` and
`sentencePatterns` modules to preview and production, then compare both
published payloads with the committed seed.
