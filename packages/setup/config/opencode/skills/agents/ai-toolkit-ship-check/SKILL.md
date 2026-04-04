---
name: ai-toolkit-ship-check
description: Verify work before shipping. Use when changes are ready, before committing, before pushing, or before asking for review.
metadata:
  owner: global-agents
  tier: contextual
  canonical_source: ~/.opencode/skills/agents/ai-toolkit-ship-check/SKILL.md
---

## Use When

- You believe work is done.
- You are about to commit or push.
- You need a quick quality gate pass.

## Inputs / Prereqs

- Current repository state.
- Project verification commands if they exist.

## Workflow

1. Inspect changed files and staged state.
2. Run the repository verification commands that actually exist.
3. Report pass/fail with exact command names.
4. Refuse to claim success without evidence.

## Outputs / Evidence

- Files changed.
- Commands run.
- Pass/fail summary.
- Explicit blocker list if something is broken.

## Failure / Stop Conditions

- Do not invent tests or build commands.
- Do not mark work ready when verification was skipped.
