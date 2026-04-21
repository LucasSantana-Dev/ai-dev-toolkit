---
name: git-worktrees
description: Use this skill when you need multiple active branches without switching — parallel AI sessions, risky experiments, release-branch isolation. Not needed for simple one-branch edits.
---

# Git Worktrees for AI Sessions

`git worktree` lets one clone host multiple checked-out branches in separate directories. This is the right tool for AI-assisted work because:

- Two sessions can work on different branches **without** racing on HEAD.
- A risky experiment lives in its own directory, so bailing is `rm -rf <worktree>`.
- Release-prep work stays isolated from feature work.

## Create

```bash
git worktree add .worktrees/<slug> -b feature/<slug>
cd .worktrees/<slug>
```

## List / remove

```bash
git worktree list
git worktree remove .worktrees/<slug>
```

## Cleanup gone branches (with their worktrees)

```bash
git fetch --prune
for wt in $(git worktree list --porcelain | awk '/^worktree / {print $2}'); do
  branch=$(git -C "$wt" branch --show-current 2>/dev/null)
  [[ -z "$branch" ]] && continue
  if ! git rev-parse --verify "origin/$branch" >/dev/null 2>&1; then
    echo "gone: $wt ($branch)"
    # Manual check before: git worktree remove "$wt"
  fi
done
```

## When NOT to use

- You're editing a single file in a single branch — just edit it.
- You're making a 2-commit fix that'll merge within the hour.

The setup cost is real. Reach for a worktree when parallelism actually matters.
