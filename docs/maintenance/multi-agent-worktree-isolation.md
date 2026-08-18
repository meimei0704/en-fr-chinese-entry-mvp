# Multi-agent worktree isolation notes

## Background and root cause

The shared-repo concurrent write incident was root-caused as two layered problems:

1. **Shared checkout**: multiple agent sessions operated on the same physical working tree
   (`agt_gmja9c85esy3k8/repo`), racing on the shared `.git`/index. Symptoms included a
   120-line uncommitted `src/styles/global.css` diff appearing/disappearing across
   concurrent agent checks ("ghost diff", 08-17) and a required
   `Merge origin/main into local main` divergence commit (08-15).
2. **Direct pushes to `main`**: multiple clones pushing straight to `origin/main`
   caused non-fast-forward divergence (08-15 and 08-17). This is now sealed by the
   PR flow (feature branch -> review -> merge), which is required for all changes.

## Rule: one session, one working tree

Each agent session that needs a writeable checkout must use its own git worktree.
Worktrees share the repository object database but each has an independent working
tree, index, and HEAD, so concurrent git operations cannot clobber each other.

## Creating an isolated worktree

```sh
# from the primary checkout (the repo root, on main)
git worktree add ../repo-wt-<agent-session> -b feat/<branch-name>

# work inside the new tree; it tracks its own branch
cd ../repo-wt-<agent-session>
git status            # independent working tree/index
```

`git worktree list` shows all trees. The primary checkout stays on `main` for
deploy-only operations (push/PR merge); feature work happens in per-session trees.

## Safe pull

Always pull with `--ff-only` to avoid implicit merge commits that add divergence:

```sh
git pull --ff-only origin main
```

## Cleanup

```sh
git worktree remove ../repo-wt-<agent-session>
git branch -D feat/<branch-name>   # after the branch is merged/pushed
```
