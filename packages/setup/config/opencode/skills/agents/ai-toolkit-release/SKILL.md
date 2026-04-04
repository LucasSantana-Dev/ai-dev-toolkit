---
name: ai-toolkit-release
description: Ship validated changes with repeatable release evidence. Use when work is ready and you need to bump a version, update changelog or release notes, tag the repo, create a GitHub release, or publish artifacts without inventing the release flow.
metadata:
  owner: global-agents
  tier: contextual
  canonical_source: ~/.opencode/skills/agents/ai-toolkit-release/SKILL.md
---

## Use When

- Verification already passed and the remaining work is release preparation.
- You need a small, repeatable flow for version bump, changelog, tag, release notes, or publish.
- You want release evidence instead of manual, one-off release steps.

## Inputs / Prereqs

- Repository root.
- Existing version source if present (`package.json`, `pyproject.toml`, `VERSION`, tags, or release docs).
- GitHub access for tags or releases.
- Registry auth only if the repo actually publishes artifacts.

## Workflow

1. Detect the release surface that actually exists: version file, changelog, tags, release workflow, package manager, and publish target.
2. Refuse to continue if verification has not already passed or the release target is ambiguous.
3. Choose the release scope from user intent and commit history: patch, minor, major, or tag-only.
4. Update only the tracked release artifacts that already exist, such as version file, `CHANGELOG.md`, or release notes.
5. Create the release commit and tag with exact evidence for what changed.
6. Create the GitHub release and publish artifacts only when the repo supports it and auth is available.
7. Report the final release state: version, tag, published targets, and any skipped steps with reasons.

## Outputs / Evidence

- Release artifacts updated.
- Exact version and tag created.
- Commands run for changelog, tag, GitHub release, and publish.
- Explicit blocker list when auth, version source, or verification is missing.

## Failure / Stop Conditions

- Do not invent a version file, changelog process, or registry target that the repo does not use.
- Do not publish artifacts without auth or explicit release intent.
- Do not claim release completion without tag or release evidence.
