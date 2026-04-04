---
name: ai-toolkit-mcp-readiness
description: Check whether MCP-backed workflows are actually usable. Use when setting up a machine, validating AI tooling, or troubleshooting why tools are unavailable.
metadata:
  owner: global-agents
  tier: contextual
  canonical_source: ~/.opencode/skills/agents/ai-toolkit-mcp-readiness/SKILL.md
---

## Use When

- A new machine was just bootstrapped.
- MCP tools appear misconfigured or unavailable.
- You need to know which missing auth/token is blocking AI workflows.

## Inputs / Prereqs

- OpenCode config directory.
- Local env file if present.

## Workflow

1. Check whether `opencode.jsonc`, `dcp.jsonc`, and skill directories exist.
2. Check whether provider tokens are present in the environment.
3. Distinguish config problems from auth problems.
4. Report the smallest next fix.

## Outputs / Evidence

- Installed config files.
- Missing tokens or auth steps.
- Ready vs blocked summary.

## Failure / Stop Conditions

- Do not expose secret values.
- Do not claim MCP readiness if auth is still missing.
