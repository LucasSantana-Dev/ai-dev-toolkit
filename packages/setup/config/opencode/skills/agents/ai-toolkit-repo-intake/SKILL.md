---
name: ai-toolkit-repo-intake
description: Onboard into an unfamiliar repository fast. Use when starting work in a new repo, resuming after a long gap, or before making changes without context.
metadata:
  owner: global-agents
  tier: contextual
  canonical_source: ~/.opencode/skills/agents/ai-toolkit-repo-intake/SKILL.md
---

## Use When

- You just entered a new repository.
- You need a quick map of stack, entrypoints, scripts, and local instructions.
- You want context before editing code.

## Inputs / Prereqs

- Repository root.
- Access to `README.md`, `AGENTS.md`, `CLAUDE.md`, package manifests, and lockfiles if present.

## Workflow

1. Read local instructions first: `README.md`, `AGENTS.md`, `CLAUDE.md`.
2. Detect the stack from manifests and scripts.
3. Summarize the repo structure, main entrypoints, verification commands, and likely next step.
4. Flag any missing auth, env files, or setup blockers.

## Outputs / Evidence

- Short repo summary.
- Stack and package manager.
- Primary commands for run/test/build.
- Top 1–3 next actions.

## Failure / Stop Conditions

- Stop if the repo root is unclear.
- Do not guess commands that are not present in the repo.
