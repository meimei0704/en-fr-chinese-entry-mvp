# Git worktree isolation for concurrent agent sessions

Date: 2026-08-18

> **Background (2026-08-18 root-cause diagnosis):** concurrent-write corruption on the shared
> `en-fr-chinese-entry-mvp` checkout was traced to **multiple agent sessions sharing one physical
> working-tree checkout**. Concurrent git operations on a shared `.git`/index raced, so one session's
> dirty working tree became visible to (and could be overwritten by) another. Direct pushes to
> `origin/main` amplified this into non-fast-forward divergence. The PR review gate already
> eliminated direct main merges; this document adds the **worktree isolation** rule that removes the
> shared-working-tree hazard.

## Rule

**One physical working tree per agent session.** Never run more than one session's git operations
against the same checkout at the same time.

## Procedure

### 1. Start every task from a dedicated worktree

```bash
# from the canonical repo (the one with the shared object store / .git)
cd /Users/cuiqiu/.loop/agents/agt_yb1p444oqvycrf/repo
git fetch origin
git worktree add -b feat/my-task /var/folders/.../T/opencode/wt-my-task origin/main
```

Key properties:

- `git worktree add -b <branch> <path> <start-point>` creates an **independent working tree**
  linked to the shared object store.
- Each worktree has its **own checkout and its own index**; sessions never touch each other's
  `.git/index`, so a dirty tree in one worktree cannot leak into another.
- The object store is shared, so objects/commits written by any worktree are immediately visible
  to all — no duplication of `.git`.

### 2. Work only inside the worktree

All edits, `git add`, `git commit`, `git push` happen inside the worktree path. The canonical repo
directory itself is used only for `git worktree add/remove`, `git fetch`, and inspection.

### 3. Keep main linear — always `--ff-only`

```bash
# inside the worktree, before starting or before pushing
git pull --ff-only origin main
git push -u origin <branch>
```

`--ff-only` refuses to create merge commits locally, which is what prevents the 08-15/08-17
non-fast-forward divergence on `main`.

### 4. After the PR is merged

```bash
# from the canonical repo
git worktree remove /path/to/wt-my-task --force
git worktree prune
git branch -d feat/my-task
```

## Rules of thumb

- **One worktree = one task.** Reuse the same worktree for follow-up commits on the same branch;
  create a new worktree for a new branch.
- **Never run `git` in the canonical repo's working tree concurrently with another session.**
  If the canonical checkout is someone else's active workspace, only use `git worktree add/remove`,
  `git fetch`, `git log`, `git show` against it.
- **`git pull --ff-only`** everywhere you would have used `git pull` / `git merge origin/main`.
- **Direct push to `origin/main` is forbidden.** All integration goes through a feature branch →
  PR → review → merge.

## Verification (smoke test)

To confirm the isolation property after setting up a worktree:

```bash
# in worktree A, dirty a file without committing
cd /path/to/wt-a
git checkout --detach HEAD >/dev/null 2>&1 && echo dirty > src/content/copy.ts
# in worktree B (independent), the same file is NOT dirty
cd /path/to/wt-b
git status --porcelain src/content/copy.ts   # empty output = isolated
```

Two worktrees with separate indexes show independent `git status` results, which is exactly the
race that was previously causing the "ghost diff" (appear → vanish → reappear) on `global.css`.
