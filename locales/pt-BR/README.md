# AI Dev Toolkit

**Patterns, tools, and practices for productive AI-assisted development.**

> The key is the environment setting, not the actual tool. The context building, not the provider.

This toolkit captures working patterns that are tool-agnostic. Whether you use Claude Code, OpenCode, Cursor, Windsurf, Copilot, or something that doesn't exist yet — these patterns apply. The principles are universal; the implementations are reference examples.

## Philosophy

1. **Context is everything** — A well-structured project with clear rules, conventions, and memory beats any model upgrade
2. **Environment > Provider** — Invest in your dev environment (terminal, shell, git workflow) not in chasing the latest model
3. **Automate the scheduler, not just the code** — Let AI manage task queues, not just execute prompts
4. **Compound knowledge** — Every session should make the next one better through persistent memory and learned patterns
5. **Decoupled patterns** — Every pattern here works across tools. Vendor lock-in is a bug

## What's Inside

### Patterns (`patterns/`)
Tool-agnostic working patterns for AI-assisted development:
- **Context Building** — How to structure projects so any AI agent is productive from the first prompt
- **Task Orchestration** — Centralized backlogs, automatic dispatch, autonomous work chains
- **Multi-Model Routing** — When to use which model tier and why
- **Session Management** — Keep workspaces clean, resume interrupted work, optimize for speed
- **Memory Systems** — Persistent context across sessions, machines, and tools
- **Security** — Secrets management, agent permissions, code review practices

### Rules (`rules/`)
Drop-in project rules that work with any AI coding tool:
- `CLAUDE.md` / `AGENTS.md` / `.cursorrules` / `COPILOT.md` — same patterns, different filenames
- Code standards, commit conventions, PR workflow
- Documentation governance

### Terminal Tools (`tools/`)
CLI tools that boost productivity regardless of AI tool:
- **Setup scripts** — one-command install for macOS, Ubuntu, and Windows
- lazygit, fzf, bat, eza, delta, zoxide, atuin, btop, jq, yq

### Reference Implementations (`implementations/`)
Concrete implementations of the patterns above for specific tools:
- **OpenCode** — plugins, commands, DCP config
- *(Claude Code, Cursor, etc. — contributions welcome)*

## Quick Start

### 1. Set up your terminal
```bash
# macOS
bash tools/install-macos.sh

# Ubuntu/Linux
bash tools/install-ubuntu.sh

# Windows (PowerShell as Admin)
.\tools\install-windows.ps1
```

### 2. Add rules to your project
```bash
cp rules/CLAUDE.md your-project/CLAUDE.md    # Claude Code / OpenCode
cp rules/AGENTS.md your-project/AGENTS.md    # OpenCode
# OR
cp rules/CLAUDE.md your-project/.cursorrules  # Cursor
# OR
cp rules/CLAUDE.md your-project/COPILOT.md    # GitHub Copilot
```

### 3. Read the patterns
Start with [`patterns/context-building.md`](patterns/context-building.md) — it's the foundation everything else builds on.

### 4. Adopt incrementally
Pick one pattern, apply it for a week, then add another. Don't try to adopt everything at once.

## Patterns at a Glance

| Pattern | Problem it solves | Tool-agnostic? |
|---------|------------------|----------------|
| [Context Building](patterns/context-building.md) | AI doesn't understand your project | Yes |
| [Task Orchestration](patterns/task-orchestration.md) | Manually re-prompting each session | Yes |
| [Multi-Model Routing](patterns/multi-model-routing.md) | Overpaying for simple tasks | Yes |
| [Session Management](patterns/session-management.md) | Cluttered workspaces, slow switching | Yes |
| [Memory Systems](patterns/memory-systems.md) | Repeating yourself across sessions | Yes |
| [Security](best-practices/security.md) | Leaked secrets, unsafe agent actions | Yes |
| [Workflow](best-practices/workflow.md) | Inconsistent commits, broken CI | Yes |
| [Context Optimization](best-practices/context-management.md) | Token waste, context overflow | Yes |

## Who This Is For

- Developers who use AI coding tools daily and want to be more productive
- Teams adopting AI-assisted development and need shared standards
- Anyone setting up a new dev environment optimized for AI workflows

## Contributing

Fork it, adapt it, share what works. Open a PR if you discover a pattern worth adding.

## License

MIT
