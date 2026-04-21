---
name: agent-gotchas
description: Use when an AI agent behaves surprisingly — stale tool registry, context loss, branch churn, unexpected hook output. Checks a living list of known failure modes before you debug as if it were novel.
---

# Agent Gotchas

Before treating a weird agent behavior as a new bug, check if it matches a known pattern. Pull the full list from the source doc; a few representative entries:

- **Stale MCP tool registry** — tool disappeared upstream but is still listed locally. Symptom: `Invalid tool name` on startup. Fix: remove from `included_optional_tools` in `~/.serena/serena_config.yml` and restart.
- **Parallel-session branch churn** — two sessions share a clone and silently move HEAD. Symptom: commit lands on a branch you didn't think you were on. Fix: `git branch --show-current` before every commit; prefer worktrees for long edits.
- **`gh pr merge --auto` and BEHIND branches** — auto-merge doesn't auto-rebase. Symptom: PR sits auto-merge-labeled forever while main advances. Fix: sweep with `gh pr update-branch`.
- **Skill triggered on wrong topic** — the skill's description was too generic. Symptom: skill pulled into unrelated requests. Fix: tighten description to name the actual trigger, not just the topic.

## How to use

When something feels off:
1. Grep this doc for a matching symptom.
2. Apply the fix.
3. If no match — add a new entry before closing out.
