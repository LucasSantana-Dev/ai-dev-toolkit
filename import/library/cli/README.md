# @lucassantana/adtl

CLI for [ai-dev-toolkit-library](https://github.com/LucasSantana-Dev/ai-dev-toolkit-library) —
browse Skills and MCP servers, install them into Claude Code, and wire up your local MCP gateway
to Claude Code, Codex, Cursor, Gemini, Windsurf, or Claude Desktop.

## Install

No install needed:

```bash
npx @lucassantana/adtl <command>
```

Or globally:

```bash
npm i -g @lucassantana/adtl
adtl <command>
```

## Commands

| Command | What it does |
|---|---|
| `adtl list [--kind K] [--tag T] [query]` | Browse the catalog. |
| `adtl search <query>` | Alias for `list`. |
| `adtl install <skill-or-agent-id> [--force]` | Copies a skill to `~/.claude/skills/<id>/` or an agent to `~/.claude/agents/<id>.md`. |
| `adtl add-server <server-id>` | Registers a catalog MCP server with your local gateway. |
| `adtl setup <editor>` / `adtl setup --all` / `adtl setup --list` | Wire one or more editors' MCP configs to the local gateway. |
| `adtl doctor` | Verifies catalog + gateway + editor configs are healthy. |

### Per-editor aliases

Every adapter also has a dedicated command — identical to `adtl setup <editor>`, shorter to type:

| Alias | Editor | Writes |
|---|---|---|
| `adtl setup-claude` | Claude Code | `~/.claude/settings.json` |
| `adtl setup-claude-desktop` | Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) / `%APPDATA%/Claude/…` (Win) / `~/.config/Claude/…` (Linux) |
| `adtl setup-codex` | Codex CLI | `~/.codex/config.toml` |
| `adtl setup-cursor` | Cursor | `~/.cursor/mcp.json` |
| `adtl setup-gemini` | Gemini CLI | `~/.gemini/settings.json` |
| `adtl setup-windsurf` | Windsurf | `~/.codeium/windsurf/mcp_config.json` |

Every setup command:
- Merges into existing config (your other MCP servers are preserved).
- Writes a `.bak` of the previous file before overwriting.
- Uses `npx -y mcp-remote <gateway-url>` inline — no wrapper script, no repo clone required.

### Setup flags

- `--all` — install into every editor whose config directory already exists on disk (auto-detect).
- `--gateway-url <url>` — override gateway URL. Default: `http://127.0.0.1:4444`.
- `--server-uuid <uuid>` — skip the live gateway probe and hard-code the virtual-server UUID. Useful when running against a pinned or remote gateway.

## First-time setup

```bash
# 1. Start your local gateway (one-time)
git clone https://github.com/LucasSantana-Dev/ai-dev-toolkit-library
cd ai-dev-toolkit-library/gateway
# create gateway/.env per gateway/README.md
docker compose up -d
python seeds/seed.py

# 2. Wire every installed editor
npx @lucassantana/adtl setup --all

# 3. Browse + install
npx @lucassantana/adtl list --kind skill
npx @lucassantana/adtl install prompting-discipline
npx @lucassantana/adtl doctor
```

## Data sources

- **Catalog index**: fetched from `main` branch on every run (cached under `~/.cache/adtl/`).
- **Running from inside a cloned repo**: local `catalog/index.json` wins.

## License

MIT.
