---
name: ai-toolkit-mcp-health
description: Validate live MCP provider health after setup or auth. Use when MCP config exists but you still need to confirm enabled servers are reachable, auth is valid, or MCP commands fail in ways that static readiness checks cannot explain.
metadata:
  owner: global-agents
  tier: contextual
  canonical_source: ~/.opencode/skills/agents/ai-toolkit-mcp-health/SKILL.md
---

## Use When

- Static setup checks already passed but MCP workflows still fail.
- You just enabled or authenticated one or more MCP providers.
- You need to separate config issues from live connectivity, auth, or provider-side failures.

## Inputs / Prereqs

- OpenCode CLI.
- Installed OpenCode config and MCP toggle helper if present.
- Installed `mcp-health` helper from the shared setup.
- The specific MCP server name when you want a targeted check.

## Workflow

1. Run `mcp-health` with no arguments or a target like `mcp-health linear`.
2. Read the local enabled/disabled state plus the live `opencode mcp ls` and `opencode mcp auth ls` signals it aggregates.
3. Classify the failure as config, missing auth, invalid auth, unreachable provider, or unknown CLI limitation.
4. Report the smallest next fix, including whether to re-enable, re-authenticate, or inspect provider-specific credentials.

## Outputs / Evidence

- Enabled MCP servers inspected.
- Live auth or CLI evidence captured.
- A ready vs blocked summary for the checked provider.
- Next remediation step when health is not confirmed.

## Failure / Stop Conditions

- Do not expose secret values or tokens.
- Do not claim MCP health from config presence alone.
- Do not invent provider-specific health commands that are not available locally.
