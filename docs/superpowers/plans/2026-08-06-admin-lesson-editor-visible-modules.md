# Admin Lesson Editor Visible Modules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/admin/lesson/:lessonId` expose exactly seven editable modules in canonical order while preserving the complete nine-module snapshot/API/data model and all Short Input behavior.

**Architecture:** Keep the API snapshot intact. Define one page-local `editableModuleOrder`, use it to type page state/config and to reconstruct an ordered `editableModuleSnapshots` array from the unordered full response, and pass only that array into history/publish/rollback UI. No server or shared-content concept changes.

**Tech Stack:** React 19, TypeScript, React Testing Library/Vitest, Playwright, Vite, oxlint.

---

### Task 0: Establish immutable inputs, branch, and baseline

Approved spec is commit `5ba7c739f6f7a1955e33747dae4cbb9ced3e7dca`; implementation base is `origin/main` `ce1461dc95b7cb43d06df3210fbcc2160a0e6da2`. The design branch differs from main only by the spec. Keep both the approved spec and this plan external to the implementation branch; do **not** cherry-pick `5ba7c73` and do not add `docs/` files.

- [ ] **Step 1: Fetch the approved design/plan and current main**

```bash
git fetch origin main design/t49-admin-editor-visible-modules
test "$(git rev-parse origin/main)" = ce1461dc95b7cb43d06df3210fbcc2160a0e6da2
git show origin/design/t49-admin-editor-visible-modules:docs/superpowers/specs/2026-08-06-admin-lesson-editor-visible-modules-design.md >/dev/null
git show origin/design/t49-admin-editor-visible-modules:docs/superpowers/plans/2026-08-06-admin-lesson-editor-visible-modules.md >/dev/null
```

Expected: both documents are readable, and main still matches the approved base. If main moved, stop and ask the integration owner to reconcile the base.

- [ ] **Step 2: Materialize read-only inputs outside the implementation worktree**

```bash
INPUT_DIR="${TMPDIR:-/tmp}/t49-admin-editor-visible-modules-input"
mkdir -p "$INPUT_DIR"
git show origin/design/t49-admin-editor-visible-modules:docs/superpowers/specs/2026-08-06-admin-lesson-editor-visible-modules-design.md >"$INPUT_DIR/spec.md"
git show origin/design/t49-admin-editor-visible-modules:docs/superpowers/plans/2026-08-06-admin-lesson-editor-visible-modules.md >"$INPUT_DIR/plan.md"
test -s "$INPUT_DIR/spec.md"
test -s "$INPUT_DIR/plan.md"
```

- [ ] **Step 3: Create the implementation branch directly from main**

```bash
REPO_ROOT="$(git rev-parse --show-toplevel)"
WORKTREE_DIR="$(dirname "$REPO_ROOT")/en-fr-chinese-entry-mvp-t49-admin-editor-visible-modules"
git worktree add "$WORKTREE_DIR" -b feature/t49-admin-editor-visible-modules origin/main
cd "$WORKTREE_DIR"
git status --short --branch
git diff --name-only origin/main...HEAD
```

Expected: clean feature branch at `ce1461d`; final command prints nothing. If `origin/main` moved, stop and have the owner reconcile the approved base before implementation rather than silently planning against a different tree.

- [ ] **Step 4: Install dependencies and reproduce the focused baseline**

```bash
npm ci
npm run test -- --run src/pages/AdminLessonEditorPage.test.tsx
npm run test:e2e -- tests/e2e/admin-smoke.spec.ts
```

Expected baseline: focused unit **1 file / 17 tests passed**; focused Admin browser smoke **1 test passed**. The current full baseline is **36 unit files / 228 tests** and **9 Playwright tests**; lint/build pass and build transforms 74 modules. If `npm ci` reports dependency audit findings in the executor's environment, record them as a caveat but do not run `npm audit fix`, because dependency changes are outside #t49.

## Smallest allowed path set and exact current symbols

No files are created. Exactly four files change:

1. `src/pages/AdminLessonEditorPage.test.tsx`
   - fixture `lessonSnapshot` lines 19-50;
   - shell assertion lines 63-89;
   - index-based module mutations at 316-328, 374-376, 393-395, 423-425, 450-454, 492-496, and 544-548;
   - publish scoped-copy assertion line 365;
   - add six focused cases before the closing `describe` at line 590.
2. `tests/e2e/admin-smoke.spec.ts`
   - full snapshot fixture `buildLessonSnapshot` lines 24-70;
   - lesson API route lines 84-119 remains full-response;
   - lesson-editor actions/assertions lines 277-290;
   - Voice assertion line 294 remains and proves Voice scope is unchanged.
3. `src/pages/AdminLessonEditorPage.tsx`
   - field imports and module policy/config/copy lines 25-165;
   - selected type line 183;
   - pending/map derivations lines 225-234;
   - `handleSelectModule` line 367;
   - `renderModuleEditor` lines 412-529, deleting hidden cases 466-495;
   - top badge/copy lines 642-656;
   - directory loop lines 716-774;
   - history call lines 811-816.
4. `src/components/admin/ModuleHistoryList.tsx`
   - prop contract lines 3-14;
   - hidden-only Hanzi label branch lines 22-23;
   - component signature and iteration lines 33-46.

Explicitly unchanged: `src/admin/types.ts`, `src/admin/api.ts`, `src/server/**`, `api/**`, `db/**`, `src/content/**`, `src/components/admin/structuredEditorConfigs.ts`, `src/components/admin/StructuredContentEditors.tsx`, `src/pages/AdminLessonsPage*`, `src/pages/AdminVoiceGenerationPage*`, learner pages, schemas, seed, migrations, package/config files. `ContentModuleType` remains the nine-member type at `src/server/content/types.ts:3-15`. MySQL continues returning `lm.module_type asc` (`src/server/content/adminStoreMysql.ts:129`; repository query also at `src/server/content/repository.ts:156`).

### Task 1: Write all focused tests first (RED)

- [ ] **Step 1: Make the full nine-module fixture typed and order-sensitive**

In `src/pages/AdminLessonEditorPage.test.tsx`, add type imports and type the fixture:

```ts
import type {
  AdminLessonSnapshot,
  AdminModuleSnapshot,
  PublishedModuleHistoryEntry,
} from '../admin/types'
import type { ContentModuleType } from '../server/content/types'

const editableModuleLabels = [
  'Lesson Meta',
  'Dialogue',
  'Sentence Patterns',
  'Vocabulary',
  'Practice',
  'Review Cards',
  'Short Input',
]

function lessonSnapshot(): AdminLessonSnapshot {
  return {
    lessonId: lesson.id,
    slug: lesson.id,
    displayOrder: 1,
    enabled: true,
    draftLesson: lesson,
    publishedLesson: lesson,
    // Deliberately mirrors MySQL alphabetical module_type order, not UI order.
    modules: [
      { moduleType: 'dialogue', draftRevisionId: 104, publishedRevisionId: 103, hasUnpublishedChanges: false },
      { moduleType: 'hanziRecognition', draftRevisionId: 112, publishedRevisionId: 111, hasUnpublishedChanges: false },
      { moduleType: 'lessonMeta', draftRevisionId: 102, publishedRevisionId: 101, hasUnpublishedChanges: true },
      { moduleType: 'practice', draftRevisionId: 114, publishedRevisionId: 113, hasUnpublishedChanges: false },
      { moduleType: 'pronunciation', draftRevisionId: 110, publishedRevisionId: 109, hasUnpublishedChanges: false },
      { moduleType: 'reviewCards', draftRevisionId: 116, publishedRevisionId: 115, hasUnpublishedChanges: false },
      { moduleType: 'sentencePatterns', draftRevisionId: 106, publishedRevisionId: 105, hasUnpublishedChanges: false },
      { moduleType: 'shortInput', draftRevisionId: 118, publishedRevisionId: 117, hasUnpublishedChanges: false },
      { moduleType: 'vocabulary', draftRevisionId: 108, publishedRevisionId: 107, hasUnpublishedChanges: false },
    ],
    publishedHistory: {
      lessonMeta: [{ revisionId: 101, createdAt: '2026-07-28T00:00:00.000Z', createdBy: 'seed', note: 'Initial published baseline', sourceRevisionId: null, payload: { id: lesson.id, title: lesson.title, scenario: lesson.scenario }, lessonId: lesson.id, moduleType: 'lessonMeta' }],
      dialogue: [],
      sentencePatterns: [],
      vocabulary: [],
      pronunciation: [],
      hanziRecognition: [],
      practice: [],
      reviewCards: [],
      shortInput: [],
    },
  }
}

function setModuleSnapshot(
  snapshot: AdminLessonSnapshot,
  moduleType: ContentModuleType,
  updates: Partial<AdminModuleSnapshot>,
) {
  const index = snapshot.modules.findIndex((module) => module.moduleType === moduleType)
  if (index < 0) throw new Error(`Missing fixture module: ${moduleType}`)
  snapshot.modules[index] = { ...snapshot.modules[index]!, ...updates }
}

function historyEntry(
  moduleType: ContentModuleType,
  revisionId: number,
  note: string,
  payload: unknown,
): PublishedModuleHistoryEntry {
  return {
    lessonId: lesson.id,
    moduleType,
    revisionId,
    payload,
    createdAt: `2026-07-28T00:${revisionId % 60}:00.000Z`,
    createdBy: 'admin-ui',
    note,
    sourceRevisionId: null,
  }
}

function parsedRequestBody(callIndex: number) {
  const init = vi.mocked(fetch).mock.calls[callIndex]?.[1]
  return JSON.parse(String(init?.body)) as Record<string, unknown>
}
```

Replace every `snapshot.modules[0] = ...` mutation listed in the file map with `setModuleSnapshot(snapshot, 'lessonMeta', { ... })`. This is mandatory after shuffling; otherwise existing publish/rollback tests mutate `dialogue` and become false positives. Update current copy assertions to `1 editable module pending publish` (line 87) and `all editable modules published` (line 365).

- [ ] **Step 2: Add the canonical-order and whole-page no-leak regression**

```ts
it('uses the editable whitelist order and leaks no hidden module UI from a full shuffled snapshot', async () => {
  const snapshot = lessonSnapshot()
  snapshot.publishedHistory.pronunciation = [
    historyEntry('pronunciation', 109, 'Hidden pronunciation history', lesson.pronunciation),
  ]
  snapshot.publishedHistory.hanziRecognition = [
    historyEntry('hanziRecognition', 111, 'Hidden hanzi history', lesson.hanziRecognition),
  ]
  vi.mocked(fetch).mockResolvedValue(jsonResponse(snapshot))

  renderRoute(`/admin/lesson/${lesson.id}`)
  await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })

  const directory = within(screen.getByTestId('admin-module-directory'))
  const history = within(screen.getByRole('region', { name: /module history/i }))
  expect(directory.getAllByRole('heading', { level: 3 }).map((node) => node.textContent)).toEqual(editableModuleLabels)
  expect(directory.getAllByRole('button', { name: /^edit /i })).toHaveLength(7)
  expect(history.getAllByRole('heading', { level: 3 }).map((node) => node.textContent)).toEqual(editableModuleLabels)
  expect(screen.queryByTestId('admin-module-card-pronunciation')).not.toBeInTheDocument()
  expect(screen.queryByTestId('admin-module-card-hanziRecognition')).not.toBeInTheDocument()
  expect(screen.queryByText(/^Pronunciation$/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/^Hanzi Recognition$/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/hidden pronunciation history/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/hidden hanzi history/i)).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /(edit|publish|rollback).*pronunciation/i })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /(edit|publish|rollback).*hanzi recognition/i })).not.toBeInTheDocument()
  expect(directory.getByRole('button', { name: /edit short input/i })).toBeVisible()
})
```

- [ ] **Step 3: Add the exact Short Input save-request regression**

```ts
it('saves the full Short Input payload through the existing draft endpoint', async () => {
  const user = userEvent.setup()
  const updatedPrompt = {
    ...lesson.shortInput,
    prompt: { ...lesson.shortInput.prompt, en: 'Ask where baggage claim is.' },
  }
  const updatedSnapshot = lessonSnapshot()
  updatedSnapshot.draftLesson = { ...lesson, shortInput: updatedPrompt }
  vi.mocked(fetch)
    .mockResolvedValueOnce(jsonResponse(lessonSnapshot()))
    .mockResolvedValueOnce(jsonResponse(updatedSnapshot))

  renderRoute(`/admin/lesson/${lesson.id}`)
  await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })
  await user.click(screen.getByRole('button', { name: /edit short input/i }))
  const prompt = screen.getByLabelText(/prompt \(en\)/i)
  await user.clear(prompt)
  await user.type(prompt, 'Ask where baggage claim is.')
  await user.click(screen.getByRole('button', { name: /save short input draft/i }))

  expect(parsedRequestBody(1)).toEqual({
    lessonId: lesson.id,
    moduleType: 'shortInput',
    payload: updatedPrompt,
    note: 'Save short input draft',
  })
  expect(await screen.findByDisplayValue('Ask where baggage claim is.')).toBeVisible()
})
```

This exact payload retains `id`, both prompt locales, `target`, `audio`, and both explanation locales.

- [ ] **Step 4: Add the hidden-only scoped-zero regression**

```ts
it('reports editable modules in sync when only hidden modules are pending', async () => {
  const snapshot = lessonSnapshot()
  snapshot.modules.forEach((module) => { module.hasUnpublishedChanges = false })
  setModuleSnapshot(snapshot, 'pronunciation', { hasUnpublishedChanges: true })
  setModuleSnapshot(snapshot, 'hanziRecognition', { hasUnpublishedChanges: true })
  vi.mocked(fetch).mockResolvedValue(jsonResponse(snapshot))

  renderRoute(`/admin/lesson/${lesson.id}`)
  await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })

  expect(screen.getByText('All editable modules published')).toBeVisible()
  expect(screen.getByText('Editable modules in sync')).toBeVisible()
  expect(screen.queryByText(/2 modules pending publish/i)).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /publish (pronunciation|hanzi recognition)/i })).not.toBeInTheDocument()
})
```

- [ ] **Step 5: Add the plural editable-pending copy regression**

```ts
it('uses plural scoped copy for multiple editable pending modules', async () => {
  const snapshot = lessonSnapshot()
  snapshot.modules.forEach((module) => { module.hasUnpublishedChanges = false })
  setModuleSnapshot(snapshot, 'lessonMeta', { hasUnpublishedChanges: true })
  setModuleSnapshot(snapshot, 'shortInput', { hasUnpublishedChanges: true })
  vi.mocked(fetch).mockResolvedValue(jsonResponse(snapshot))

  renderRoute(`/admin/lesson/${lesson.id}`)
  await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })

  expect(screen.getByText('2 editable modules pending publish')).toBeVisible()
  expect(screen.getByText('2 editable modules pending')).toBeVisible()
})
```

- [ ] **Step 6: Add Short Input pending, publish, and post-publish hidden-pending regression**

```ts
it('publishes the only visible Short Input pending module and returns to scoped zero', async () => {
  const user = userEvent.setup()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  const pendingSnapshot = lessonSnapshot()
  pendingSnapshot.modules.forEach((module) => { module.hasUnpublishedChanges = false })
  for (const moduleType of ['shortInput', 'pronunciation', 'hanziRecognition'] as const) {
    setModuleSnapshot(pendingSnapshot, moduleType, { hasUnpublishedChanges: true })
  }
  const publishedSnapshot = lessonSnapshot()
  publishedSnapshot.modules.forEach((module) => { module.hasUnpublishedChanges = false })
  setModuleSnapshot(publishedSnapshot, 'pronunciation', { hasUnpublishedChanges: true })
  setModuleSnapshot(publishedSnapshot, 'hanziRecognition', { hasUnpublishedChanges: true })
  setModuleSnapshot(publishedSnapshot, 'shortInput', {
    hasUnpublishedChanges: false,
    draftRevisionId: 202,
    publishedRevisionId: 201,
  })
  vi.mocked(fetch)
    .mockResolvedValueOnce(jsonResponse(pendingSnapshot))
    .mockResolvedValueOnce(jsonResponse(publishedSnapshot))

  renderRoute(`/admin/lesson/${lesson.id}`)
  expect(await screen.findByText('1 editable module pending publish')).toBeVisible()
  const publishButtons = screen.getAllByRole('button', { name: /^publish /i })
  expect(publishButtons).toHaveLength(1)
  expect(publishButtons[0]).toHaveAccessibleName(/publish short input/i)
  await user.click(publishButtons[0]!)

  expect(parsedRequestBody(1)).toEqual({
    lessonId: lesson.id,
    moduleType: 'shortInput',
    note: 'Publish shortInput draft',
  })
  expect(await screen.findByText('All editable modules published')).toBeVisible()
  expect(screen.getByText('Editable modules in sync')).toBeVisible()
  expect(screen.getByText(/short input published successfully/i)).toBeVisible()
  expect(screen.queryByText(/^Pronunciation$/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/^Hanzi Recognition$/i)).not.toBeInTheDocument()
})
```

- [ ] **Step 7: Add Short Input history/rollback and hidden-history regression**

```ts
it('keeps Short Input history and rollback while excluding hidden histories', async () => {
  const user = userEvent.setup()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  const snapshot = lessonSnapshot()
  snapshot.publishedHistory.shortInput = [
    historyEntry('shortInput', 117, 'Current Short Input', lesson.shortInput),
    historyEntry('shortInput', 77, 'Older Short Input', { ...lesson.shortInput, target: '出口在哪里？' }),
  ]
  snapshot.publishedHistory.pronunciation = [
    historyEntry('pronunciation', 109, 'Hidden pronunciation history', lesson.pronunciation),
  ]
  snapshot.publishedHistory.hanziRecognition = [
    historyEntry('hanziRecognition', 111, 'Hidden hanzi history', lesson.hanziRecognition),
  ]
  vi.mocked(fetch)
    .mockResolvedValueOnce(jsonResponse(snapshot))
    .mockResolvedValueOnce(jsonResponse(lessonSnapshot()))

  renderRoute(`/admin/lesson/${lesson.id}`)
  await screen.findByText('Older Short Input')
  expect(screen.queryByText(/hidden pronunciation history/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/hidden hanzi history/i)).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /rollback short input to revision 77/i }))

  expect(parsedRequestBody(1)).toEqual({
    lessonId: lesson.id,
    moduleType: 'shortInput',
    publishedRevisionId: 77,
    note: 'Rollback to revision 77',
  })
  expect(await screen.findByText(/short input rolled back to revision 77/i)).toBeVisible()
})
```

- [ ] **Step 8: Add the Playwright full-response fixture and browser assertions**

In `tests/e2e/admin-smoke.spec.ts:32-42`, keep all nine modules but use the same alphabetical order. Set `lessonMeta`, `pronunciation`, and `hanziRecognition` pending; all others false. This simultaneously models MySQL order and proves only one editable pending module is counted:

```ts
modules: [
  { moduleType: 'dialogue', draftRevisionId: 104, publishedRevisionId: 103, hasUnpublishedChanges: false },
  { moduleType: 'hanziRecognition', draftRevisionId: 112, publishedRevisionId: 111, hasUnpublishedChanges: true },
  { moduleType: 'lessonMeta', draftRevisionId: 102, publishedRevisionId: 101, hasUnpublishedChanges: true },
  { moduleType: 'practice', draftRevisionId: 114, publishedRevisionId: 113, hasUnpublishedChanges: false },
  { moduleType: 'pronunciation', draftRevisionId: 110, publishedRevisionId: 109, hasUnpublishedChanges: true },
  { moduleType: 'reviewCards', draftRevisionId: 116, publishedRevisionId: 115, hasUnpublishedChanges: false },
  { moduleType: 'sentencePatterns', draftRevisionId: 106, publishedRevisionId: 105, hasUnpublishedChanges: false },
  { moduleType: 'shortInput', draftRevisionId: 118, publishedRevisionId: 117, hasUnpublishedChanges: false },
  { moduleType: 'vocabulary', draftRevisionId: 108, publishedRevisionId: 107, hasUnpublishedChanges: false },
],
```

Immediately after the existing editor heading assertion at line 279, add:

```ts
const editor = page.getByRole('main')
const directory = page.getByTestId('admin-module-directory')
const history = page.getByRole('region', { name: /module history/i })
await expect(directory.getByRole('button', { name: /^Edit / })).toHaveCount(7)
expect(await directory.getByRole('heading', { level: 3 }).allTextContents()).toEqual(editableModuleLabels)
expect(await history.getByRole('heading', { level: 3 }).allTextContents()).toEqual(editableModuleLabels)
await expect(directory.getByRole('button', { name: /edit short input/i })).toBeVisible()
await expect(editor.getByText('1 editable module pending publish')).toBeVisible()
await expect(editor.getByText('1 editable module pending')).toBeVisible()
await expect(editor.getByText(/^Pronunciation$/)).toHaveCount(0)
await expect(editor.getByText(/^Hanzi Recognition$/)).toHaveCount(0)
await expect(editor.getByRole('button', { name: /(edit|publish|rollback).*pronunciation/i })).toHaveCount(0)
await expect(editor.getByRole('button', { name: /(edit|publish|rollback).*hanzi recognition/i })).toHaveCount(0)
```

Define this constant near line 12:

```ts
const editableModuleLabels = [
  'Lesson Meta',
  'Dialogue',
  'Sentence Patterns',
  'Vocabulary',
  'Practice',
  'Review Cards',
  'Short Input',
]
```

Keep the existing Lesson Meta fill/save and back-to-list actions at lines 281-291. Keep the Voice assertion `Original pronunciation is active` at line 294: hidden terminology is prohibited only in the lesson editor and remains valid on Voice.

- [ ] **Step 9: Run focused tests and capture RED evidence before production edits**

```bash
npm run test -- --run src/pages/AdminLessonEditorPage.test.tsx
npm run test:e2e -- tests/e2e/admin-smoke.spec.ts
```

Expected RED: unit command fails because directory/history still expose nine modules, history follows response order, hidden pending is counted, and old unscoped copy remains; browser smoke fails first on 9 versus 7 Edit buttons and/or missing scoped copy. The Short Input save regression may already pass; the suite must still be red for the intended visibility boundary.

### Task 2: Implement the minimal production boundary (GREEN)

- [ ] **Step 1: Add the page-local editable module type and whitelist**

In `src/pages/AdminLessonEditorPage.tsx`, remove only `hanziRecognitionFields` and `pronunciationFields` from the import at lines 25-31. Replace `moduleOrder` with:

```ts
const editableModuleOrder = [
  'lessonMeta',
  'dialogue',
  'sentencePatterns',
  'vocabulary',
  'practice',
  'reviewCards',
  'shortInput',
] as const satisfies readonly ContentModuleType[]

type EditableModuleType = (typeof editableModuleOrder)[number]
```

Change `moduleConfig` to `Record<EditableModuleType, { label: string; description: string }>` and delete only its `pronunciation` and `hanziRecognition` entries (current lines 64-71). Change `structuredModuleCopy` to `Partial<Record<EditableModuleType, ...>>` and delete only those two entries (current lines 106-115). Retain the existing seven labels/descriptions and sentence-pattern, vocabulary, and review-card copy verbatim.

Use `EditableModuleType` for:

```ts
const [selectedModuleType, setSelectedModuleType] = useState<EditableModuleType | null>(null)

// Apply these exact signature substitutions without changing their bodies:
// getModuleSummary(..., moduleType: EditableModuleType)
// handleSelectModule(moduleType: EditableModuleType)
// renderModuleEditor(moduleType: EditableModuleType)
```

Use `moduleConfig[moduleType as EditableModuleType]?.label ?? moduleType` in `getModuleLabel`; publish/rollback callbacks remain string-compatible with the existing API. Delete the complete `pronunciation` and `hanziRecognition` switch cases at current lines 466-495. Do not touch field-config files or `LessonContent`.

- [ ] **Step 2: Derive visible snapshots in whitelist order**

Replace current lines 225-234 with:

```ts
const editableModuleSnapshots = useMemo(() => {
  const modulesByType = new Map(snapshot?.modules.map((module) => [module.moduleType, module]) ?? [])
  return editableModuleOrder.flatMap((moduleType) => {
    const module = modulesByType.get(moduleType)
    return module ? [module] : []
  })
}, [snapshot])

const pendingModuleCount = useMemo(
  () => editableModuleSnapshots.filter((module) => module.hasUnpublishedChanges).length,
  [editableModuleSnapshots],
)

const selectedModule = useMemo(
  () => (selectedModuleType ? moduleConfig[selectedModuleType] : null),
  [selectedModuleType],
)

const moduleSnapshots = useMemo(
  () => new Map(editableModuleSnapshots.map((module) => [module.moduleType, module])),
  [editableModuleSnapshots],
)
```

This map-then-whitelist lookup is required. `snapshot.modules.filter(...)` is forbidden because it preserves MySQL alphabetical order. Missing visible modules remain absent from history while directory cards still render from the whitelist and show `—` revisions through the existing optional lookup.

Change the directory loop at line 716 to `editableModuleOrder.map(...)`. Pass the same ordered array to history:

```tsx
<ModuleHistoryList
  snapshot={snapshot}
  modules={editableModuleSnapshots}
  pendingAction={pendingHistoryAction}
  onPublish={handlePublishModule}
  onRollback={handleRollbackModule}
/>
```

- [ ] **Step 3: Scope all top-level pending wording to editable modules**

Replace `getPendingModuleCopy` with:

```ts
function getPendingModuleCopy(pendingModuleCount: number) {
  if (pendingModuleCount === 0) return 'All editable modules published'
  if (pendingModuleCount === 1) return '1 editable module pending publish'
  return `${pendingModuleCount} editable modules pending publish`
}

function getPendingModuleBadgeCopy(pendingModuleCount: number) {
  if (pendingModuleCount === 0) return 'Editable modules in sync'
  if (pendingModuleCount === 1) return '1 editable module pending'
  return `${pendingModuleCount} editable modules pending`
}
```

At current line 643 use:

```tsx
{getPendingModuleBadgeCopy(pendingModuleCount)}
```

The numeric `<strong>` remains. Do not emit `All modules published` or `Published in sync` in the top summary; the per-visible-module history status may still say `Published in sync` because it describes that one visible module.

- [ ] **Step 4: Narrow ModuleHistoryList to the ordered visible input**

In `src/components/admin/ModuleHistoryList.tsx`, add the prop, destructure it, and iterate it:

```ts
interface ModuleHistoryListProps {
  snapshot: AdminLessonSnapshot
  modules: AdminLessonSnapshot['modules']
  pendingAction: { moduleType: string; kind: 'publish' | 'rollback'; revisionId?: number } | null
  onPublish(moduleType: string): Promise<void>
  onRollback(moduleType: string, revisionId: number): Promise<void>
}

export function ModuleHistoryList({
  snapshot,
  modules,
  pendingAction,
  onPublish,
  onRollback,
}: ModuleHistoryListProps) {
  // In the unchanged JSX section, iterate modules.map((module) => ...) rather than snapshot.modules.map(...).
}
```

Delete the `hanziRecognition` label branch at current lines 22-23; no hidden label special case remains. Continue reading history from the full snapshot exactly as now:

```ts
const history = snapshot.publishedHistory[module.moduleType] ?? []
```

Do not add a second whitelist to this component and do not clone/filter `snapshot`.

- [ ] **Step 5: Run the focused GREEN verification**

```bash
npm run test -- --run src/pages/AdminLessonEditorPage.test.tsx
npm run test:e2e -- tests/e2e/admin-smoke.spec.ts
```

Expected: focused unit **23 passed** (17 existing + 6 new), focused browser smoke **1 passed**. Verify the request assertions show `shortInput` for draft, publish, and rollback; after publish, two hidden pending entries remain in the response while the editor reports scoped zero.

### Task 3: Commit the two green slices

Both test files should be authored and observed RED before production work. After both focused commands are GREEN, commit in two reviewable green commits while leaving the E2E file unstaged for the first commit:

- [ ] **Step 1: Commit the production policy and focused unit regressions**

```bash
git add src/pages/AdminLessonEditorPage.test.tsx \
  src/pages/AdminLessonEditorPage.tsx \
  src/components/admin/ModuleHistoryList.tsx
git commit -m "feat: scope admin lesson editor modules"
```

- [ ] **Step 2: Commit the browser regression**

```bash
git add tests/e2e/admin-smoke.spec.ts
git commit -m "test: cover admin editor visible modules in browser"
```

Commit 1 owns the policy, derived ordering, history prop contract, scoped copy, and all detailed Short Input request regressions. Commit 2 owns only the full nine-module browser fixture and cross-page smoke assertions.

### Task 4: Run full verification and hand off for review

- [ ] **Step 1: Run focused and full verification**

```bash
npm run test -- --run src/pages/AdminLessonEditorPage.test.tsx
npm run test:e2e -- tests/e2e/admin-smoke.spec.ts
npm run test -- --run
npm run lint
npm run build
npm run test:e2e
git diff --check origin/main...HEAD
git status --short --branch
git diff --name-only origin/main...HEAD | sort
```

Expected final counts: focused unit 23; full unit **36 files / 234 tests**; focused E2E 1; full E2E **9 tests**. Lint/build pass; working tree clean. Expected path list is exactly:

```text
src/components/admin/ModuleHistoryList.tsx
src/pages/AdminLessonEditorPage.test.tsx
src/pages/AdminLessonEditorPage.tsx
tests/e2e/admin-smoke.spec.ts
```

- [ ] **Step 2: Run the negative scope audit**

```bash
git diff --exit-code origin/main...HEAD -- \
  src/admin src/server api db src/content \
  src/components/admin/structuredEditorConfigs.ts \
  src/components/admin/StructuredContentEditors.tsx \
  src/pages/AdminLessonsPage.tsx src/pages/AdminLessonsPage.test.tsx \
  src/pages/AdminVoiceGenerationPage.tsx src/pages/AdminVoiceGenerationPage.test.tsx \
  src/pages/LessonPage.tsx src/pages/PracticePage.tsx src/pages/ShortInputPage.tsx \
  package.json package-lock.json vercel.json
! git diff --name-only origin/main...HEAD | grep '^docs/'
! rg -n -i 'pronunciation|hanzi recognition|hanziRecognition' \
  src/pages/AdminLessonEditorPage.tsx src/components/admin/ModuleHistoryList.tsx
```

Expected: all three checks succeed with no output. Hidden terms are expected in tests/fixtures and unchanged data/Voice files; they must be absent only from the two production editor UI files.

- [ ] **Step 3: Push the immutable review head and register review context**

```bash
git push -u origin feature/t49-admin-editor-visible-modules
IMPLEMENTATION_HEAD="$(git rev-parse HEAD)"
test "$(git rev-parse origin/feature/t49-admin-editor-visible-modules)" = "$IMPLEMENTATION_HEAD"
PRIMARY_CHECKOUT="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")"
/Users/cuiqiu/.loop/bin/loop exec review add \
  "{\"path\":\"$PRIMARY_CHECKOUT\",\"base\":\"ce1461dc95b7cb43d06df3210fbcc2160a0e6da2\",\"head\":\"$IMPLEMENTATION_HEAD\",\"thread\":\"#dylan-s-test:3d141777\"}"
```

Expected: the remote branch resolves to the exact local review head and Loop returns a review-context reference. Do not amend, rebase, or force-push that head after requesting review; if a reviewer requires fixes, create a new commit, rerun verification, push, and refresh the review context.

- [ ] **Step 4: Hand off with complete evidence and wait for the designated verdict**

Post one concise implementation handoff in `#dylan-s-test:3d141777` containing all six fields:

1. **Scope boundary:** exactly the four approved paths and the negative scope-audit result.
2. **Branch/commit:** branch, both commit SHAs, immutable final HEAD, and remote-equals-local check.
3. **TDD/verification:** RED failure summaries followed by focused unit/E2E and full unit/lint/build/E2E GREEN counts.
4. **Review context:** the Loop review-context reference from Step 3.
5. **Remaining caveats:** only observed pre-existing warnings or “none”; never omit this field.
6. **Current gate/exit:** waiting for `dylan-t2-reviewer` to return exactly `pass` or `fix required`; on `pass`, `dylan-t2-planner` owns rebase/merge, merged-head verification, deploy, and production smoke.

Do not claim merge or deployment completion from the implementation branch.

## Acceptance, review, merge, and deployment handoff

Implementation handoff must include branch name, both commit SHAs, RED failure summaries, GREEN command/count summaries, and the four-path scope diff. Reviewer (`dylan-t2-reviewer`) explicitly returns `pass` or `fix required`; integration owner (`dylan-t2-planner`) does not merge on ambiguous review.

Acceptance checklist:

- [ ] Directory has exactly seven Edit controls and canonical order: Lesson Meta, Dialogue, Sentence Patterns, Vocabulary, Practice, Review Cards, Short Input.
- [ ] History headings use the same seven-item order even when API modules are alphabetical/shuffled.
- [ ] No Pronunciation/Hanzi Recognition card, selected badge/editor, pending count, history heading/revision, publish/rollback control, or feedback appears on `/admin/lesson/:lessonId`.
- [ ] Hidden-only pending response produces numeric 0, `All editable modules published`, and `Editable modules in sync`.
- [ ] Short Input save sends the complete unchanged-shape payload with `moduleType: 'shortInput'`.
- [ ] Short Input + two hidden pending produces `1 editable module pending publish`, badge `1 editable module pending`, and only `Publish short input`; successful response with hidden pending retained returns scoped zero.
- [ ] Short Input history and rollback revision 77 work; hidden histories do not render.
- [ ] Complete nine-module API fixture/history/data/types remain; no server/schema/seed/API changes.
- [ ] Existing auth, Lesson Meta save, preview refresh, unsaved-leave, publish failure, rollback, Admin-list, learner, and Voice tests remain green.
- [ ] Voice smoke still shows `Original pronunciation is active`; this is intentionally outside editor scope.
- [ ] Four-path scope audit, full unit/lint/build/full E2E pass.

Before merge, fetch/rebase onto the then-current `origin/main`, resolve only if behavior remains spec-identical, rerun all six verification commands on the rebased head, then merge. On merged main rerun full unit, lint, build, and full E2E. Deployment owner records deployment status and fixed production URL. Production smoke must load that deployed frontend, route-mock a full alphabetical nine-module Admin snapshot with both hidden modules pending, and repeat the Playwright directory/history/order/scoped-copy/no-leak assertions plus Short Input visibility; then visit Voice and retain its pronunciation assertion. Do not use a production API response that omits hidden modules, because that would fail to prove the UI boundary.

## Caveats

- The exact post-change line numbers will shift; the pre-change ranges above are anchors at `ce1461d`.
- `snapshot` must remain full for `LessonPreviewPanel` and `publishedHistory`; narrowing the API result itself violates the spec.
- A plain filter is functionally insufficient because production MySQL ordering is alphabetical.
- The E2E smoke intentionally keeps Lesson Meta as its save action; detailed Short Input save/publish/post-publish/history/rollback requests are locked at unit level per the approved spec, avoiding new mocked API surface in the broad Voice smoke.
- Existing hidden unpublished revisions are intentionally ignored by this page and require no cleanup in #t49.
