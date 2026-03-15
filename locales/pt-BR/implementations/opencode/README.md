# OpenCode Implementation

Reference implementation of the toolkit patterns for [OpenCode](https://opencode.ai).

## Setup

```bash
# Copy config
cp opencode.jsonc ~/.config/opencode/opencode.jsonc
cp dcp.jsonc ~/.config/opencode/dcp.jsonc

# Copy plugins
cp plugin/*.ts ~/.config/opencode/plugin/
```

## Plugins

| Plugin | Pattern | Description |
|--------|---------|-------------|
| `orchestrator.ts` | [Task Orchestration](../../patterns/task-orchestration.md) | Centralized backlog, auto-dispatch, completion monitoring |
| `session-manager.ts` | [Session Management](../../patterns/session-management.md) | Auto-cleanup, status tagging, per-project limits |
| `session-resume.ts` | [Session Management](../../patterns/session-management.md) | Persist and resume interrupted work |
| `perf-optimizer.ts` | [Session Management](../../patterns/session-management.md) | Auto-compact for faster switching |
| `notify.ts` | — | Native OS notifications for events |

## Commands

| Command | Description |
|---------|-------------|
| `/plan` | Analyze repos, create prioritized task backlog |
| `/backlog` | Show task status across all projects |
| `/next` | Manually dispatch next ready task |
| `/resume` | Load git state, suggest next task |
| `/verify` | Run lint + type-check + test + build |
| `/ship` | Commit + push + create PR |
| `/commit` | Conventional commit without push |
| `/test` | Run tests, report results |
| `/clean` | Clear build artifacts |
| `/validate` | Full repo health scorecard |
| `/ecosystem` | Health check across all repos |

## Adapting to Other Tools

Each plugin implements a pattern. To port to another tool:

1. Read the pattern doc in `patterns/`
2. Use the plugin as a reference for logic
3. Implement using your tool's extension API

For example, `orchestrator.ts` could become:
- A **Cursor extension** using the Cursor API
- A **shell script** with `claude --session-id` for Claude Code
- A **VS Code task** with workspace automation
