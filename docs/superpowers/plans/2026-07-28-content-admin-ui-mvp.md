# Content Admin UI / Publish Flow MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an internal `/admin` content-management MVP that lets one operator browse existing lessons, edit draft module content, preview the draft in learner-shaped lesson form, manually publish module changes, and roll back to an earlier published module revision without breaking the public published-only read path.

**Architecture:** Keep the existing MySQL/TiDB content model (`lessons`, `lesson_modules`, `module_revisions`) as the single source of truth. Add a small admin server layer that validates module payloads, reads current draft/published pointers, writes append-only draft revisions, publishes by copying draft payloads into new published revisions plus fresh draft baselines, and rolls back by copying a historical published revision into a new published+draft pair. Add a direct internal `/admin` route (not learner-nav linked) with a lesson list page and a lesson editor page: `lessonMeta` and `dialogue` get structured editors, the remaining modules use JSON textareas with validation, and preview renders the same `LessonContent` shape the learner/public API reads.

**Tech Stack:** React, React Router, TypeScript, Vitest, Testing Library, Vercel Node Functions, mysql2, zod

---

### Task 1: Lock the admin content contracts with failing domain tests

**Files:**
- Create: `src/server/content/adminRepository.test.ts`
- Create: `src/content/schema.ts`
- Create: `src/server/content/adminTypes.ts`
- Modify: `src/server/content/publicContent.test.ts`
- Inspect: `src/server/content/repository.ts`, `src/server/content/types.ts`, `src/content/types.ts`

- [ ] Add domain tests that describe the new admin contract before any production admin code exists: lesson list/detail snapshots, module draft save validation, publish creating new published history without exposing draft to the public repository, and rollback creating a fresh published revision from historical published content.
- [ ] Add runtime schemas for `LessonContent`, `LessonMetaPayload`, and each module payload so both server and browser-side admin flows can validate content instead of trusting raw JSON.
- [ ] Keep one public-read regression assertion in place (or add one if missing) that proves the public `ContentMysqlRepository` still only joins `current_published_revision_id` and never reads draft pointers after the admin write layer lands.
- [ ] Run `npm run test -- --run src/server/content/adminRepository.test.ts src/server/content/publicContent.test.ts` and confirm RED before admin repository implementation starts.

### Task 2: Implement the admin repository and HTTP handlers behind the same DB boundary

**Files:**
- Create: `src/server/content/adminRepository.ts`
- Create: `src/server/content/adminHttp.ts`
- Create: `api/admin/content/lessons.ts`
- Create: `api/admin/content/preview.ts`
- Create: `api/admin/content/draft.ts`
- Create: `api/admin/content/publish.ts`
- Create: `api/admin/content/rollback.ts`
- Modify: `src/server/content/apiEntrypoints.test.ts`
- Modify: `src/server/content/repository.ts`

- [ ] Add a focused admin repository that can: list editable lessons, load one lesson’s draft/published snapshot plus published history, save a draft revision for one module, publish one module by creating a new published revision and a new draft baseline, and roll back one module by cloning a historical published revision into a new published+draft pair.
- [ ] Build HTTP handlers for the admin endpoints with strict method checks, safe request-body/query parsing, validation errors for malformed module payload JSON, and response shapes the admin pages can consume directly.
- [ ] Extend the Vercel entrypoint compilation/import test so the new admin entrypoints also emit importable `.js` files and do not break the existing public content entrypoints.
- [ ] Run `npm run test -- --run src/server/content/adminRepository.test.ts src/server/content/apiEntrypoints.test.ts` and confirm GREEN before moving to browser/admin UI work.

### Task 3: Add the admin routes and page-level loading states with failing route tests first

**Files:**
- Create: `src/admin/api.ts`
- Create: `src/admin/types.ts`
- Create: `src/pages/AdminLessonsPage.tsx`
- Create: `src/pages/AdminLessonEditorPage.tsx`
- Create: `src/pages/AdminLessonsPage.test.tsx`
- Create: `src/pages/AdminLessonEditorPage.test.tsx`
- Modify: `src/app/router.tsx`
- Modify: `src/test/renderRoute.tsx` (only if route helpers need fetch/provider setup)

- [ ] Add route-level tests that prove `/admin` renders an editable lesson list page and `/admin/lesson/:lessonId` loads an editor shell with loading, empty, and error states while leaving all learner routes untouched.
- [ ] Add small browser admin API helpers/types that mirror the server DTOs and keep all fetch logic out of the page components.
- [ ] Implement the admin lesson list page first, using a direct internal route entry (`/admin`) instead of adding learner-facing navigation noise to `/home` or `/progress`.
- [ ] Run `npm run test -- --run src/pages/AdminLessonsPage.test.tsx src/pages/AdminLessonEditorPage.test.tsx src/app/AppShell.test.tsx` and confirm GREEN before adding editor interactions.

### Task 4: Implement the lesson editor MVP with structured + JSON module editing and preview

**Files:**
- Create: `src/components/admin/LessonMetaEditor.tsx`
- Create: `src/components/admin/DialogueEditor.tsx`
- Create: `src/components/admin/JsonModuleEditor.tsx`
- Create: `src/components/admin/LessonPreviewPanel.tsx`
- Modify: `src/pages/AdminLessonEditorPage.tsx`
- Modify: `src/pages/AdminLessonEditorPage.test.tsx`
- Inspect: `src/components/DialoguePlayer.tsx`, `src/content/copy.ts`, `src/pages/LessonPage.tsx`

- [ ] Add failing editor tests for the agreed MVP behavior: `lessonMeta` and `dialogue` are editable via readable structured inputs, the remaining modules are editable through JSON textareas with inline validation, and saving a module refreshes the server-backed draft snapshot.
- [ ] Add a draft preview panel that renders the same `LessonContent` shape the learner/public API uses, so preview stays aligned with published read semantics even if the layout is admin-specific.
- [ ] Keep editing scoped to existing content only: no lesson create/delete/reorder, no audio file upload workflow, and no structure mutation outside the existing module payloads.
- [ ] Run `npm run test -- --run src/pages/AdminLessonEditorPage.test.tsx` and confirm GREEN before publish/rollback controls are added.

### Task 5: Add module publish / rollback controls, status cues, and verification coverage

**Files:**
- Create: `src/components/admin/ModuleHistoryList.tsx`
- Modify: `src/pages/AdminLessonEditorPage.tsx`
- Modify: `src/pages/AdminLessonEditorPage.test.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/styles/global.test.ts` (only if new admin tokens/layout assertions are worth pinning)

- [ ] Add failing interaction tests that prove one module can be published independently, the lesson editor shows published-vs-draft status per module, and selecting a historical published revision triggers a rollback flow that refreshes preview/state.
- [ ] Implement per-module publish and rollback controls with clear status copy, revision metadata, and safe disabled states while requests are in flight.
- [ ] Add only the CSS needed for an internal admin surface that is readable next to the existing learner shell, without refactoring the learner visual system.
- [ ] Run `npm run test -- --run src/pages/AdminLessonEditorPage.test.tsx src/server/content/adminRepository.test.ts` and confirm GREEN.

### Task 6: Finish with full verification and operator notes

**Files:**
- Modify: `docs/superpowers/plans/2026-07-28-content-admin-ui-mvp.md` (check off finished steps or add brief implementation notes only if helpful)
- Inspect: `#t41` acceptance criteria / checkpoint text in Loop

- [ ] Run the fresh full verification set: `npm run test -- --run`, `npm run build`, and `npm run lint`.
- [ ] Do one minimal manual browser/API sanity pass for `/admin`, `/admin/lesson/self-intro`, draft save, preview refresh, publish, and rollback using only non-secret local/dev inputs.
- [ ] Record the milestone back to `#t41` with the concrete admin entry paths, what is now implemented, and any intentional MVP caveats that remain for follow-up work.
