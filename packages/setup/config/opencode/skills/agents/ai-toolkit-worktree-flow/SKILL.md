---
name: ai-toolkit-worktree-flow
description: Decide when and how to use git worktrees for safer parallel work. Use when starting a feature branch, splitting workstreams, or avoiding a dirty main checkout.
metadata:
  owner: global-agents
  tier: contextual
  canonical_source: ~/.opencode/skills/agents/ai-toolkit-worktree-flow/SKILL.md
---

## Use When

- A task should be isolated from the current checkout.
- Multiple features or fixes need parallel work.
- You want safer branching for AI-assisted development.

## Inputs / Prereqs

- Git repository.
- Proposed branch name and reason for isolation.

## Workflow

1. Decide whether the task deserves a worktree.
2. Prefer `feature/`, `fix/`, `chore/`, or `refactor/` branch names.
3. Create the worktree and report the path.
4. Keep the original checkout clean.

## Outputs / Evidence

- Branch name.
- Worktree path.
- Reason it was isolated.

## Failure / Stop Conditions

- Stop if the directory is not a git repo.
- Do not create throwaway branches without a clear reason.
