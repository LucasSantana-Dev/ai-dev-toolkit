# Claude Code Implementation

Reference implementation of the toolkit patterns for [Claude Code](https://claude.com/claude-code).

## Context Building

Claude Code uses `CLAUDE.md` files at project root and in subdirectories. See [Context Building pattern](../../patterns/context-building.md).

```bash
cp ../../rules/CLAUDE.md your-project/CLAUDE.md
```

## Memory

Claude Code has built-in memory at `~/.claude/projects/<path>/memory/`:

```
.claude/
  memory/
    MEMORY.md      ← Index (auto-loaded)
    topic-1.md     ← Detail files
    topic-2.md
```

See [Memory Systems pattern](../../patterns/memory-systems.md).

## Task Orchestration

Claude Code supports hooks and skills. For task orchestration:

```bash
# Run a prompt in a specific session
claude --session-id ses_abc123 --prompt "Continue with task X"

# Create a plan
claude --prompt "Read CLAUDE.md, analyze the project, create a task list"
```

A shell-based orchestrator could read `backlog.json` and dispatch via CLI:

```bash
#!/bin/bash
TASK=$(jq -r '.tasks[] | select(.status=="ready") | .id' backlog.json | head -1)
if [ -n "$TASK" ]; then
  PROMPT=$(jq -r --arg id "$TASK" '.tasks[] | select(.id==$id) | .description' backlog.json)
  DIR=$(jq -r --arg id "$TASK" '.tasks[] | select(.id==$id) | .directory' backlog.json)
  cd "$DIR" && claude --prompt "$PROMPT"
fi
```

## Session Management

Claude Code sessions persist automatically. Use `/compact` for context management and hooks for automation.

## Multi-Model Routing

Claude Code supports model selection:
- Default: Sonnet (via `/fast` toggle)
- Complex: Opus (full context)
- Use skills to route: `smart-model-select` skill

## Contributions Welcome

If you build Claude Code implementations of these patterns, open a PR.
