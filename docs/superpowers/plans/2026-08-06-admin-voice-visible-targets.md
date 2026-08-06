# Admin Voice Visible Targets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/admin/voice` operate on exactly 172 visible targets from Dialogue, Sentence Patterns, Vocabulary, Practice, and Short Input while preserving the complete 182-target Pronunciation-capable domain/API contract.

**Architecture:** Add one positive-allowlist `collectAdminVoiceVisibleTargets()` policy derived from the unchanged complete collector, and make `AdminVoiceGenerationPage.buildRows()` its only production consumer. Because counts, generation, approval, and draft apply already derive from page rows, no downstream filters or server/domain changes are needed.

**Tech Stack:** React 19, TypeScript, Vitest/React Testing Library, Playwright, Vite, oxlint, GitHub/Vercel deployment.

---

### Task 0: Establish immutable inputs, isolated branch, and baseline

**Files:**
- Read-only spec: `docs/superpowers/specs/2026-08-06-admin-voice-visible-targets-design.md`
- Read-only plan: `docs/superpowers/plans/2026-08-06-admin-voice-visible-targets.md`
- No implementation files change in this task.

Approved design content is commit `65c2313f2476c90bc8516b240c7e125c3580969d`. Baseline-refresh merge `246c184` then merged the design branch cleanly with current `origin/main`. The implementation base is `origin/main` `a5d15d00e4f6709f4d71944e5a088af0431bc8e9`. Keep spec/plan external to the implementation branch; do not cherry-pick either document.

- [ ] **Step 1: Fetch and validate immutable refs**

```bash
git fetch origin main design/t51-admin-voice-visible-targets
test "$(git rev-parse origin/main)" = a5d15d00e4f6709f4d71944e5a088af0431bc8e9
git show origin/design/t51-admin-voice-visible-targets:docs/superpowers/specs/2026-08-06-admin-voice-visible-targets-design.md >/dev/null
git show origin/design/t51-admin-voice-visible-targets:docs/superpowers/plans/2026-08-06-admin-voice-visible-targets.md >/dev/null
```

Expected: both documents are readable and main is the reviewed planning base. If `origin/main` moved, stop and ask the integration owner to check whether any of the seven allowed paths changed before rebasing the implementation input.

- [ ] **Step 2: Materialize read-only inputs outside the implementation worktree**

```bash
INPUT_DIR="${TMPDIR:-/tmp}/t51-admin-voice-visible-targets-input"
mkdir -p "$INPUT_DIR"
git show origin/design/t51-admin-voice-visible-targets:docs/superpowers/specs/2026-08-06-admin-voice-visible-targets-design.md >"$INPUT_DIR/spec.md"
git show origin/design/t51-admin-voice-visible-targets:docs/superpowers/plans/2026-08-06-admin-voice-visible-targets.md >"$INPUT_DIR/plan.md"
test -s "$INPUT_DIR/spec.md"
test -s "$INPUT_DIR/plan.md"
```

- [ ] **Step 3: Create the implementation branch directly from main**

```bash
REPO_ROOT="$(git rev-parse --show-toplevel)"
WORKTREE_DIR="$(dirname "$REPO_ROOT")/en-fr-chinese-entry-mvp-t51-admin-voice-visible-targets"
git worktree add "$WORKTREE_DIR" -b feature/t51-admin-voice-visible-targets origin/main
cd "$WORKTREE_DIR"
test "$(git rev-parse HEAD)" = a5d15d00e4f6709f4d71944e5a088af0431bc8e9
git status --short --branch
git diff --name-only origin/main...HEAD
```

Expected: clean feature branch and empty diff.

- [ ] **Step 4: Install dependencies and reproduce the focused/full baseline**

```bash
npm ci
npm run test -- --run \
  src/admin/voiceTargets.test.ts \
  src/pages/AdminVoiceGenerationPage.test.tsx \
  src/server/voice/adminHttp.test.ts \
  src/content/course.test.ts
npm run test:e2e -- \
  tests/e2e/admin-smoke.spec.ts \
  tests/e2e/admin-voice-layout.spec.ts
```

Expected baseline: focused unit **4 files / 41 tests**, focused E2E **3 tests**. Current full baseline is **37 files / 239 unit tests**, lint/build pass with 74 transformed modules, and **11 Playwright tests**. Record the existing React Router v7 future-flag/environment warnings; do not change dependencies.

## Exact seven-path implementation boundary

Exactly these paths may change:

1. `src/admin/voiceTargets.ts`
2. `src/admin/voiceTargets.test.ts`
3. `src/pages/AdminVoiceGenerationPage.tsx`
4. `src/pages/AdminVoiceGenerationPage.test.tsx`
5. `src/server/voice/adminHttp.test.ts`
6. `tests/e2e/admin-smoke.spec.ts`
7. `tests/e2e/admin-voice-layout.spec.ts`

No production server file changes. Explicitly unchanged: `src/admin/voiceTypes.ts`, `src/server/voice/adminHttp.ts`, provider/storage/auth code, `src/content/**`, `src/server/content/**`, `api/**`, `db/**`, `public/audio/**`, Admin lesson editor/list pages, learner pages, schemas, seeds, migrations, package/config files, and docs on the implementation branch.

### Task 1: Write all boundary and compatibility tests first (RED)

**Files:**
- Modify: `src/admin/voiceTargets.test.ts`
- Modify: `src/pages/AdminVoiceGenerationPage.test.tsx`
- Modify: `src/server/voice/adminHttp.test.ts`
- Modify: `tests/e2e/admin-smoke.spec.ts`
- Modify: `tests/e2e/admin-voice-layout.spec.ts`

- [ ] **Step 1: Add visible-collector and retained-Pronunciation apply tests**

In `src/admin/voiceTargets.test.ts`, import `collectAdminVoiceVisibleTargets` beside the existing collectors, then add these two cases inside `describe('admin batch voice audio targets', ...)`:

```ts
it('derives the 172 Admin Voice targets from the unchanged 182-target manifest', () => {
  const completeTargets = collectCourseVoiceAudioTargets(course.lessons)
  const visibleTargets = collectAdminVoiceVisibleTargets(course.lessons)
  const visibleModuleTypes = new Set([
    'dialogue',
    'sentencePatterns',
    'vocabulary',
    'practice',
    'shortInput',
  ])
  const visibleCounts = Object.fromEntries(
    [...visibleModuleTypes].map((moduleType) => [
      moduleType,
      visibleTargets.filter((target) => target.moduleType === moduleType).length,
    ]),
  )

  expect(completeTargets).toHaveLength(182)
  expect(completeTargets.filter((target) => target.moduleType === 'pronunciation')).toHaveLength(10)
  expect(visibleTargets).toHaveLength(172)
  expect(visibleCounts).toEqual({
    dialogue: 52,
    sentencePatterns: 30,
    vocabulary: 50,
    practice: 30,
    shortInput: 10,
  })
  expect(visibleTargets.every((target) => visibleModuleTypes.has(target.moduleType))).toBe(true)
  expect(visibleTargets.some((target) => target.moduleType === 'pronunciation')).toBe(false)
  expect(visibleTargets.some((target) => target.targetId.startsWith('pronunciation:'))).toBe(false)
  expect(visibleTargets.some((target) => /· Pronunciation \d+$/i.test(target.label))).toBe(false)
  expect(visibleTargets.map((target) => target.targetId)).toEqual(
    completeTargets
      .filter((target) => visibleModuleTypes.has(target.moduleType))
      .map((target) => target.targetId),
  )
})

it('retains Pronunciation replacement compatibility outside the Admin Voice surface', () => {
  const targetTip = lesson.pronunciation[0]!
  const siblingTip = {
    ...targetTip,
    id: 'self-intro-pronunciation-sibling',
    audio: '/audio/self-intro/pronunciation-sibling.mp3',
  }
  const lessonWithSibling = {
    ...lesson,
    pronunciation: [targetTip, siblingTip],
  }

  const patches = applyVoiceGenerationBatchToLesson(lessonWithSibling, [
    {
      lessonId: lesson.id,
      targetId: `pronunciation:${targetTip.id}`,
      generatedAudioUrl: '/voice/generated/audio/self-intro/pronunciation-01.mp3',
    },
  ])

  expect(patches).toEqual([
    {
      moduleType: 'pronunciation',
      payload: [
        {
          ...targetTip,
          audio: '/voice/generated/audio/self-intro/pronunciation-01.mp3',
          audioFallback: targetTip.audio,
        },
        siblingTip,
      ],
    },
  ])
})
```

The existing complete-collector test remains 182 and still asserts a real Pronunciation target.

- [ ] **Step 2: Change only Admin Voice page-visible counts from 182 to 172**

In `src/pages/AdminVoiceGenerationPage.test.tsx`, update every page heading/setup wait from `/182 audio targets/i` to `/172 audio targets/i`, the successful full batch from `/182 generated/i` to `/172 generated/i`, and the all-failed batch from `/182 failed/i` to `/172 failed/i`.

```bash
rg -n "182 (audio targets|generated|failed)" src/pages/AdminVoiceGenerationPage.test.tsx
```

Expected after editing: no matches. Do not change 182 in complete collector, server, or content tests.

- [ ] **Step 3: Add the page-wide no-Pronunciation/positive-five-module regression**

Add this focused case after the initial load test in `src/pages/AdminVoiceGenerationPage.test.tsx`:

```ts
it('shows 172 targets from the five visible modules while retaining generic pronunciation copy', async () => {
  installBatchFetchMock()

  renderRoute('/admin/voice')

  expect(await screen.findByRole('heading', { level: 2, name: /172 audio targets/i })).toBeVisible()
  const metrics = within(screen.getByTestId('admin-voice-metrics'))
  const targetGrid = screen.getByTestId('admin-voice-target-grid')
  expect(metrics.getByText('172', { selector: 'strong' })).toBeVisible()
  expect(targetGrid.querySelector('[data-testid^="voice-target-row-pronunciation:"]')).toBeNull()
  expect(within(targetGrid).queryByText(/^pronunciation · zh-CN$/i)).not.toBeInTheDocument()
  expect(within(targetGrid).queryByText(/· Pronunciation \d+$/i)).not.toBeInTheDocument()

  for (const targetId of [
    'dialogue:self-intro-line-01',
    'sentencePatterns:self-intro-pattern-1',
    'vocabulary:self-intro-vocab-1',
    'practice:listening:self-intro-listening-1',
    'shortInput:self-intro-short-input-01',
  ]) {
    expect(screen.getByTestId(`voice-target-row-${targetId}`)).toBeVisible()
  }

  expect(screen.getByRole('heading', { level: 1, name: /original pronunciation is active/i })).toBeVisible()
})
```

The complete `lessonSnapshot()` fixture continues to contain `pronunciation` and `hanziRecognition` modules/history.

- [ ] **Step 4: Strengthen the existing generate/approve/apply integration for all five visible modules**

In the existing test `creates a profile, generates pending rows, requires preview approval, and applies grouped draft patches`:

1. After clicking “Generate all pending,” parse all generate calls and lock the 172 visible request boundary:

```ts
const generateBodies = vi.mocked(fetch).mock.calls
  .filter((call) => call[0] === '/api/admin/voice/generate')
  .map((call) => JSON.parse(String(call[1]!.body)) as {
    target: { targetId: string; moduleType: string }
  })

expect(generateBodies).toHaveLength(172)
expect(new Set(generateBodies.map((body) => body.target.moduleType))).toEqual(
  new Set(['dialogue', 'sentencePatterns', 'vocabulary', 'practice', 'shortInput']),
)
expect(generateBodies.some((body) => body.target.targetId.startsWith('pronunciation:'))).toBe(false)
expect(generateBodies.some((body) => ['pronunciation', 'hanziRecognition'].includes(body.target.moduleType))).toBe(false)
```

2. Approve exactly one representative from each visible module:

```ts
const representativeTargetIds = [
  'dialogue:self-intro-line-01',
  'sentencePatterns:self-intro-pattern-1',
  'vocabulary:self-intro-vocab-1',
  'practice:listening:self-intro-listening-1',
  'shortInput:self-intro-short-input-01',
]

for (const targetId of representativeTargetIds) {
  const row = screen.getByTestId(`voice-target-row-${targetId}`)
  await user.click(within(row).getByLabelText(/previewed and approve/i))
}
```

3. Click apply, wait for five draft calls, parse them, and assert exact module order:

```ts
await user.click(screen.getByRole('button', { name: /apply approved to drafts/i }))

await waitFor(() => {
  expect(vi.mocked(fetch).mock.calls.filter((call) => call[0] === '/api/admin/content/draft')).toHaveLength(5)
})

const draftBodies = vi.mocked(fetch).mock.calls
  .filter((call) => call[0] === '/api/admin/content/draft')
  .map((call) => JSON.parse(String(call[1]!.body)) as {
    lessonId: string
    moduleType: string
    payload: unknown
  })
expect(draftBodies.map((body) => body.moduleType)).toEqual([
  'dialogue',
  'sentencePatterns',
  'vocabulary',
  'practice',
  'shortInput',
])
expect(draftBodies.some((body) => ['pronunciation', 'hanziRecognition'].includes(body.moduleType))).toBe(false)
```

4. Build `draftByModule` and assert selected audio/fallback plus unchanged siblings. Use the original `course.lessons[0]!` fixture as the source of truth:

```ts
const originalLesson = course.lessons[0]!
const draftByModule = new Map(draftBodies.map((body) => [body.moduleType, body.payload]))
const generatedAudioFor = (audio: string) => `/voice/generated${audio}`

const dialoguePayload = draftByModule.get('dialogue') as LessonContent['dialogue']
expect(dialoguePayload.lines[0]).toEqual({
  ...originalLesson.dialogue.lines[0]!,
  audio: generatedAudioFor(originalLesson.dialogue.lines[0]!.audio),
  audioFallback: originalLesson.dialogue.lines[0]!.audio,
})
expect(dialoguePayload.lines[1]).toEqual(originalLesson.dialogue.lines[1])

const sentencePayload = draftByModule.get('sentencePatterns') as LessonContent['sentencePatterns']
expect(sentencePayload[0]).toEqual({
  ...originalLesson.sentencePatterns[0]!,
  audio: generatedAudioFor(originalLesson.sentencePatterns[0]!.audio),
  audioFallback: originalLesson.sentencePatterns[0]!.audio,
})
expect(sentencePayload[1]).toEqual(originalLesson.sentencePatterns[1])

const vocabularyPayload = draftByModule.get('vocabulary') as LessonContent['vocabulary']
expect(vocabularyPayload[0]).toEqual({
  ...originalLesson.vocabulary[0]!,
  audio: generatedAudioFor(originalLesson.vocabulary[0]!.audio),
  audioFallback: originalLesson.vocabulary[0]!.audio,
})
expect(vocabularyPayload[1]).toEqual(originalLesson.vocabulary[1])

const practicePayload = draftByModule.get('practice') as LessonContent['practice']
expect(practicePayload.listening[0]).toEqual({
  ...originalLesson.practice.listening[0]!,
  audio: generatedAudioFor(originalLesson.practice.listening[0]!.audio),
  audioFallback: originalLesson.practice.listening[0]!.audio,
})
expect(practicePayload.speaking[0]).toEqual(originalLesson.practice.speaking[0])

const shortInputPayload = draftByModule.get('shortInput') as LessonContent['shortInput']
expect(shortInputPayload).toEqual({
  ...originalLesson.shortInput,
  audio: generatedAudioFor(originalLesson.shortInput.audio),
  audioFallback: originalLesson.shortInput.audio,
})
expect(await screen.findByText(/applied 5 approved targets/i)).toBeVisible()
```

Remove the old Dialogue-only draft-call assertions from this test; the new five-module assertions supersede them.

- [ ] **Step 5: Add a direct Pronunciation API compatibility test**

In `src/server/voice/adminHttp.test.ts`, add this case near the successful generate handler coverage. It deliberately uses the complete collector and changes no server production code:

```ts
it('keeps valid Pronunciation targets in the complete authenticated API manifest', async () => {
  const pronunciationTarget = collectCourseVoiceAudioTargets(course.lessons).find(
    (target) => target.moduleType === 'pronunciation',
  )!
  const target = {
    lessonId: pronunciationTarget.lessonId,
    targetId: pronunciationTarget.targetId,
    moduleType: pronunciationTarget.moduleType,
    originalAudio: pronunciationTarget.originalAudio,
    storageKey: pronunciationTarget.storageKey,
    language: pronunciationTarget.language,
  }
  const { provider, storage } = createFakeServices()
  const handlers = createAdminVoiceHttpHandlers({ provider, storage }, adminAuthEnv)
  const response = createResponseRecorder()

  await handlers.generate(
    {
      method: 'POST',
      headers: { authorization: adminAuthHeader },
      body: {
        consentConfirmed: true,
        profileId: 'profile_self_intro',
        text: pronunciationTarget.text,
        target,
      },
    },
    response,
  )

  expect(response.statusCode).toBe(200)
  expect(response.body).toEqual({ audioUrl: '/voice/generated/self-intro-line-01.mp3' })
  expect(provider.generateReplacementAudio).toHaveBeenCalledWith(
    expect.objectContaining({
      text: pronunciationTarget.text,
      target,
    }),
  )
  expect(storage.saveGeneratedAudio).toHaveBeenCalledWith(
    expect.objectContaining({ target }),
  )
})
```

- [ ] **Step 6: Update browser tests while keeping complete route mocks**

In `tests/e2e/admin-smoke.spec.ts`:

- keep `voiceTargets = collectCourseVoiceAudioTargets(course.lessons)` so the fake server remains complete;
- add `const adminSmokeBaseUrl = process.env.ADMIN_SMOKE_BASE_URL` and navigate with:

```ts
await page.goto(adminSmokeBaseUrl ? new URL('/admin', adminSmokeBaseUrl).href : '/admin')
```

- record every generate request target in a local array:

```ts
const generatedTargets: Array<{ targetId: string; moduleType: string }> = []

// Inside the /api/admin/voice/generate route, after parsing body:
generatedTargets.push({
  targetId: body.target?.targetId ?? '',
  moduleType: body.target?.moduleType ?? '',
})
```

- change visible/generated assertions from 182 to 172;
- after entering `/admin/voice`, assert generic heading remains, Pronunciation cards/module metadata do not exist, and representatives from all five modules exist;
- after generate-all, assert exactly 172 recorded targets, their module set equals the five approved types, and no ID/type is Pronunciation or Hanzi Recognition;
- keep browser approval/apply limited to Dialogue, but assert no accumulated draft request has hidden module type.

Use these browser assertions:

```ts
await expect(page.getByRole('heading', { name: /172 audio targets/i })).toBeVisible()
await expect(page.getByRole('heading', { name: /original pronunciation is active/i })).toBeVisible()
await expect(page.locator('[data-testid^="voice-target-row-pronunciation:"]')).toHaveCount(0)
await expect(page.getByText(/^pronunciation · zh-CN$/i)).toHaveCount(0)
for (const targetId of [
  'dialogue:self-intro-line-01',
  'sentencePatterns:self-intro-pattern-1',
  'vocabulary:self-intro-vocab-1',
  'practice:listening:self-intro-listening-1',
  'shortInput:self-intro-short-input-01',
]) {
  await expect(page.getByTestId(`voice-target-row-${targetId}`)).toBeVisible()
}
expect(generatedTargets).toHaveLength(172)
expect(new Set(generatedTargets.map((target) => target.moduleType))).toEqual(
  new Set(['dialogue', 'sentencePatterns', 'vocabulary', 'practice', 'shortInput']),
)
expect(generatedTargets.some((target) => target.targetId.startsWith('pronunciation:'))).toBe(false)
expect(generatedTargets.some((target) => ['pronunciation', 'hanziRecognition'].includes(target.moduleType))).toBe(false)
expect(draftRequests.some((request) => ['pronunciation', 'hanziRecognition'].includes(request.moduleType))).toBe(false)
```

In `tests/e2e/admin-voice-layout.spec.ts`, change only `/182 audio targets/i` to `/172 audio targets/i`; keep both viewport/layout contracts.

- [ ] **Step 7: Run focused tests and capture RED evidence before production edits**

```bash
npm run test -- --run \
  src/admin/voiceTargets.test.ts \
  src/pages/AdminVoiceGenerationPage.test.tsx \
  src/server/voice/adminHttp.test.ts \
  src/content/course.test.ts
npm run test:e2e -- \
  tests/e2e/admin-smoke.spec.ts \
  tests/e2e/admin-voice-layout.spec.ts
```

Expected RED: unit compilation fails because `collectAdminVoiceVisibleTargets` is not exported; page tests still observe 182 and Pronunciation rows; browser tests observe 182. The new direct server Pronunciation test may already pass, which proves compatibility before production work, but the focused suites must be red for the missing UI boundary.

### Task 2: Implement the minimal visible-target policy (GREEN)

**Files:**
- Modify: `src/admin/voiceTargets.ts`
- Modify: `src/pages/AdminVoiceGenerationPage.tsx`

- [ ] **Step 1: Add the single positive Admin Voice allowlist collector**

Immediately after `collectCourseVoiceAudioTargets()` in `src/admin/voiceTargets.ts`, add:

```ts
const adminVoiceVisibleModuleTypes = new Set<VoiceAudioModuleType>([
  'dialogue',
  'sentencePatterns',
  'vocabulary',
  'practice',
  'shortInput',
])

export function collectAdminVoiceVisibleTargets(
  lessons: readonly LessonContent[],
): VoiceAudioTarget[] {
  return collectCourseVoiceAudioTargets(lessons).filter((target) =>
    adminVoiceVisibleModuleTypes.has(target.moduleType),
  )
}
```

Do not edit complete collector construction, `moduleOrder`, `parseTargetId`, replacement adapters, or any apply branch. The policy must be positive inclusion; do not use only `moduleType !== 'pronunciation'`.

- [ ] **Step 2: Make page rows consume only the visible collector**

In `src/pages/AdminVoiceGenerationPage.tsx`, replace the complete collector import with `collectAdminVoiceVisibleTargets`, then change only `buildRows()`:

```ts
function buildRows(lessons: readonly LessonContent[]): VoiceGenerationRow[] {
  return collectAdminVoiceVisibleTargets(lessons).map((target) => ({
    target,
    status: 'pending',
    generatedAudioUrl: '',
    error: null,
  }))
}
```

Do not add filters in rendering, counting, generation, approval, or apply. All existing downstream behavior must continue to derive from `rows`.

- [ ] **Step 3: Run focused GREEN verification**

```bash
npm run test -- --run \
  src/admin/voiceTargets.test.ts \
  src/pages/AdminVoiceGenerationPage.test.tsx \
  src/server/voice/adminHttp.test.ts \
  src/content/course.test.ts
npm run test:e2e -- \
  tests/e2e/admin-smoke.spec.ts \
  tests/e2e/admin-voice-layout.spec.ts
```

Expected: focused unit **4 files / 45 tests** (41 baseline + 4 new), focused E2E **3 tests**. Visible page/browser totals are 172; complete collector/server/content totals remain 182.

### Task 3: Commit two reviewable GREEN slices

**Files:** the exact seven-path boundary above.

- [ ] **Step 1: Commit production policy and unit/server regressions**

```bash
git add \
  src/admin/voiceTargets.ts \
  src/admin/voiceTargets.test.ts \
  src/pages/AdminVoiceGenerationPage.tsx \
  src/pages/AdminVoiceGenerationPage.test.tsx \
  src/server/voice/adminHttp.test.ts
git commit -m "feat: scope admin voice targets"
```

- [ ] **Step 2: Commit browser and production-smoke regressions**

```bash
git add tests/e2e/admin-smoke.spec.ts tests/e2e/admin-voice-layout.spec.ts
git commit -m "test: cover admin voice visible targets"
```

Expected: two commits, clean tree, no docs or production server changes.

### Task 4: Full verification, strict scope audit, and review handoff

**Files:** no new changes expected.

- [ ] **Step 1: Run focused and full verification**

```bash
npm run test -- --run \
  src/admin/voiceTargets.test.ts \
  src/pages/AdminVoiceGenerationPage.test.tsx \
  src/server/voice/adminHttp.test.ts \
  src/content/course.test.ts
npm run test:e2e -- \
  tests/e2e/admin-smoke.spec.ts \
  tests/e2e/admin-voice-layout.spec.ts
npm run test -- --run
npm run lint
npm run build
npm run test:e2e
git diff --check origin/main...HEAD
git status --short --branch
git diff --name-only origin/main...HEAD | sort
```

Expected final counts: focused unit **45**, full unit **37 files / 243 tests**, focused E2E **3**, full E2E **11**. Lint/build pass; build transforms 74 modules. Exact changed paths:

```text
src/admin/voiceTargets.test.ts
src/admin/voiceTargets.ts
src/pages/AdminVoiceGenerationPage.test.tsx
src/pages/AdminVoiceGenerationPage.tsx
src/server/voice/adminHttp.test.ts
tests/e2e/admin-smoke.spec.ts
tests/e2e/admin-voice-layout.spec.ts
```

- [ ] **Step 2: Run negative scope and contract audits**

```bash
git diff --exit-code origin/main...HEAD -- \
  src/admin/voiceTypes.ts \
  src/server/voice/adminHttp.ts \
  src/server/voice/provider.ts \
  src/server/voice/storage.ts \
  src/content src/server/content api db public/audio \
  package.json package-lock.json playwright.config.ts vercel.json
! git diff --name-only origin/main...HEAD | grep '^docs/'
rg -n "collectCourseVoiceAudioTargets|case 'pronunciation'|pronunciation:" \
  src/admin/voiceTargets.ts src/admin/voiceTypes.ts src/server/voice/adminHttp.ts
```

Expected: first two checks succeed with no output. The final scan must still show the complete collector, Pronunciation target/type/apply compatibility, and server use of the complete manifest.

- [ ] **Step 3: Push immutable review head and register Loop review context**

```bash
git push -u origin feature/t51-admin-voice-visible-targets
IMPLEMENTATION_HEAD="$(git rev-parse HEAD)"
test "$(git rev-parse origin/feature/t51-admin-voice-visible-targets)" = "$IMPLEMENTATION_HEAD"
PRIMARY_CHECKOUT="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")"
/Users/cuiqiu/.loop/bin/loop exec review add \
  "{\"path\":\"$PRIMARY_CHECKOUT\",\"base\":\"a5d15d00e4f6709f4d71944e5a088af0431bc8e9\",\"head\":\"$IMPLEMENTATION_HEAD\",\"thread\":\"#dylan-s-test:3d141777\"}"
```

Do not amend/rebase the requested review head. If fixes are required, add commits, rerun all verification, push, and refresh review context.

- [ ] **Step 4: Hand off with the six required fields**

Post one concise thread message containing:

1. **Scope boundary:** seven paths and explicit unchanged server/data/API/audio/types/dependencies.
2. **Branch/commit:** branch, both commit SHAs, immutable head, remote-equals-local.
3. **TDD/verification:** RED summaries; focused/full unit/E2E counts; lint/build/scope results.
4. **Review context:** Loop review-context ID.
5. **Remaining caveats:** only observed existing warnings or `none`.
6. **Current gate/exit:** wait for `dylan-t2-reviewer` to return exactly `pass` or `fix required`; on pass, `dylan-t2-planner` owns main refresh/rebase, merge, merged-head verification, deploy, and production smoke.

## Acceptance and integration checklist

- [ ] Complete collector/server/content contracts remain 182 and retain exactly 10 Pronunciation targets.
- [ ] Admin Voice visible collector/page contains 172 targets and exactly five module types.
- [ ] One positive allowlist is the only visibility policy; page rows are the single downstream source.
- [ ] No Pronunciation/Hanzi row, technical metadata, count, generate payload, approval row, or draft patch originates from `/admin/voice`.
- [ ] Generic `Original pronunciation is active` copy remains.
- [ ] Five representative visible rows generate, approve, and apply in one page integration flow with exact payload/fallback/sibling assertions.
- [ ] Direct authenticated Pronunciation API and complete apply helper remain compatible.
- [ ] Browser smoke uses complete route mocks, emits 172 visible requests, and applies Dialogue only.
- [ ] Desktop/mobile Admin Voice layout remains unchanged.
- [ ] Seven-path audit, focused/full tests, lint, build, full E2E, designated review all pass.

After reviewer pass, integration owner fetches current `origin/main`. If it moved, rebase only after confirming no conflicting change to the seven paths, then rerun every verification command and refresh review if the reviewed tree changes materially. Merge/push main only with a clean verified head.

The existing GitHub/Vercel integration deploys pushed main. Record the production deployment ID/status for the merged SHA, require `success`, confirm `https://en-fr-chinese-entry-mvp.vercel.app` serves the new bundle, then run:

```bash
ADMIN_SMOKE_BASE_URL="https://en-fr-chinese-entry-mvp.vercel.app" \
  npm run test:e2e -- tests/e2e/admin-smoke.spec.ts
```

The production route-mock smoke must show 172 visible/generated targets, no Pronunciation/Hanzi UI/request/draft action, all five representative module cards, generic pronunciation-quality copy, and the existing Dialogue approval/apply flow. It must not call real Admin content/voice APIs or incur provider cost.

## Caveats

- Exact line numbers may shift; symbols and test names are the stable anchors.
- `ADMIN_SMOKE_BASE_URL` changes only navigation origin; Playwright's local web server may still start under the existing config, but all assertions run against the deployed bundle.
- No visible count is hard-coded in production; 172 is fixture-backed test evidence from the current 182 minus 10 Pronunciation targets.
- Existing React Router v7 future-flag and environment warnings are non-blocking unless their behavior changes.
