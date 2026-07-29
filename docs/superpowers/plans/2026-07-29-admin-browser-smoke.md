# Admin Browser Smoke Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a minimal but effective Playwright smoke test for the admin flow so browser-level regressions are caught before deploy.

**Architecture:** Reuse the existing Playwright + Vite browser harness and add one focused admin smoke spec that stubs `/api/admin/*` at the browser boundary with `page.route`. Keep the test browser-real at the UI layer: it should navigate through `/admin`, exercise the in-page auth flow, open the lesson editor, and save one draft change while asserting the browser never shows a native auth dialog.

**Tech Stack:** Playwright, Vite dev server, React Router, browser route interception, Vitest/unit tests for supporting coverage

---

### Task 1: Add a failing admin browser smoke spec that captures the regression boundary

**Files:**
- Create: `tests/e2e/admin-smoke.spec.ts`
- Inspect: `playwright.config.ts`
- Inspect: `tests/e2e/mvp-flow.spec.ts`
- Inspect: `src/pages/AdminLessonsPage.tsx`
- Inspect: `src/pages/AdminLessonEditorPage.tsx`

- [ ] **Step 1: Write a failing Playwright spec for the admin happy path**

```ts
import { expect, test } from 'playwright/test'

test('admin uses the in-page sign-in flow without a browser auth dialog and can save a draft', async ({ page }) => {
  let dialogCount = 0
  page.on('dialog', async (dialog) => {
    dialogCount += 1
    await dialog.dismiss()
  })

  await page.goto('/admin')

  await expect(page.getByRole('heading', { name: /admin sign in required/i })).toBeVisible()
  expect(dialogCount).toBe(0)

  await page.getByLabel(/admin username/i).fill('editor')
  await page.getByLabel(/admin password/i).fill('secret')
  await page.getByRole('button', { name: /unlock content admin/i }).click()

  await expect(page.getByRole('heading', { name: /content admin/i })).toBeVisible()
  await page.getByRole('link', { name: /open self-intro editor/i }).click()
  await expect(page).toHaveURL(/\/admin\/lesson\/self-intro$/)

  await page.getByRole('button', { name: /edit lesson meta/i }).click()
  await page.getByLabel(/lesson title \(en\)/i).fill('Edited in browser smoke')
  await page.getByRole('button', { name: /save lesson meta draft/i }).click()

  await expect(page.getByDisplayValue('Edited in browser smoke')).toBeVisible()
  expect(dialogCount).toBe(0)
})
```

- [ ] **Step 2: Back the test with browser-side API route stubs that intentionally return unauthenticated `401` without `WWW-Authenticate` for the SPA request, then authenticated lesson/snapshot/draft responses after sign-in**

```ts
const lessons = [{ lessonId: 'self-intro', slug: 'self-intro', displayOrder: 1, enabled: true, draftChangedModuleCount: 1 }]
let draftTitleEn = 'Airport immigration basics'

await page.route('**/api/admin/content/lessons?lessonId=self-intro', async (route) => {
  const auth = await route.request().headerValue('authorization')
  if (!auth) {
    await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'Admin authentication required' }) })
    return
  }

  await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(buildSnapshot(draftTitleEn)) })
})
```

- [ ] **Step 3: Run the targeted Playwright spec and verify RED**

Run: `npm run test:e2e -- tests/e2e/admin-smoke.spec.ts`
Expected: FAIL because the spec or stub plumbing is incomplete.

### Task 2: Implement the minimal browser smoke scaffolding and make the admin flow pass

**Files:**
- Create: `tests/e2e/admin-smoke.spec.ts`
- Modify: `src/admin/api.ts` (only if the test exposes a real browser-layer requirement not already covered)
- Inspect: `src/admin/types.ts`
- Inspect: `src/content/course.ts`

- [ ] **Step 1: Add compact test helpers inside the spec to build lesson list/snapshot payloads and keep one in-memory draft state**

```ts
function buildSnapshot(titleEn: string) {
  return {
    lessonId: 'self-intro',
    slug: 'self-intro',
    displayOrder: 1,
    enabled: true,
    draftLesson: {
      ...course.lessons[0],
      title: { ...course.lessons[0].title, en: titleEn },
    },
    publishedLesson: course.lessons[0],
    modules: [...],
    publishedHistory: {...},
  }
}
```

- [ ] **Step 2: Make the route stubs cover the four success criteria explicitly**

```ts
await page.route('**/api/admin/content/lessons', async (route) => {
  const auth = await route.request().headerValue('authorization')
  const client = await route.request().headerValue('x-content-admin-client')

  if (!auth) {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      headers: client === 'spa' ? {} : { 'WWW-Authenticate': 'Basic realm="Content Admin"' },
      body: JSON.stringify({ error: 'Admin authentication required' }),
    })
    return
  }

  await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(lessons) })
})
```

- [ ] **Step 3: Update the draft-save route stub to mutate the in-memory title and return a refreshed snapshot, then assert the UI reflects the saved title**

```ts
await page.route('**/api/admin/content/draft', async (route) => {
  const body = JSON.parse(route.request().postData() ?? '{}')
  draftTitleEn = body.payload.title.en
  await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(buildSnapshot(draftTitleEn)) })
})
```

- [ ] **Step 4: Run the targeted Playwright spec and verify GREEN**

Run: `npm run test:e2e -- tests/e2e/admin-smoke.spec.ts`
Expected: PASS with 1 passing admin smoke test.

- [ ] **Step 5: Commit the passing browser smoke slice**

```bash
git add tests/e2e/admin-smoke.spec.ts
git commit -m "test: add admin browser smoke"
```

### Task 3: Finish with broader verification and handoff-ready notes

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-admin-browser-smoke.md` (only to add brief completion notes if useful)
- Inspect: thread acceptance criteria in `#t31`

- [ ] **Step 1: Run the fresh verification set for this slice**

Run: `npm run test -- --run && npm run test:e2e -- tests/e2e/admin-smoke.spec.ts && npm run build && npm run lint`
Expected: all commands pass.

- [ ] **Step 2: Summarize the exact smoke coverage now guaranteed**

```text
- Unauthenticated /admin shows the in-page sign-in screen
- No browser native auth dialog appears during that flow
- Authenticated admin can reach lesson list + lesson editor
- One lesson-meta draft save succeeds through the browser UI
```

- [ ] **Step 3: Hand off to the verify/merge/deploy owner with the incremental ref and the verification evidence**

Run: `git rev-parse --short HEAD`
Expected: a concrete commit hash to give the branch-side owner.
