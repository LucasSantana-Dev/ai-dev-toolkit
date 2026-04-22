# ai-dev-toolkit-library — project guidance

Curated catalog of Skills + MCP servers fronted by a single local `mcp-context-forge` gateway. See `.claude/plans/PLAN.md` for the full build plan.

## Layout at a glance

- `catalog/{skills,servers,agents,collections,docs}/` — the curated library
- `gateway/` — docker-compose stack; gateway bound to `127.0.0.1:4444`
- `cli/` — `@lucassantana/adtl` (pnpm workspace package)
- `web/` — Astro static site → GH Pages
- `schemas/` — JSON schemas for all 5 kinds
- `scripts/` — validators + importers

## 5 catalog kinds

| Kind | Installs to | Install verb | Use when |
|---|---|---|---|
| `skill` | `~/.claude/skills/<id>/` | `adtl install <id>` | Actionable procedure (multi-file) |
| `agent` | `~/.claude/agents/<id>.md` | `adtl install <id>` | Claude sub-agent (single file) |
| `server` | Gateway admin API | `adtl add-server <id>` | MCP upstream |
| `collection` | — | browse only | Opinionated bundle |
| `doc` | — | read only | Reference material |

## Contribution rules

1. Every catalog entry must pass `pnpm run validate` before commit.
2. Every import from `dev-assets` or elsewhere must pass the secrets scan — the scan is **blocking**, never bypass with `--no-verify`.
3. Gateway port bindings in compose: `127.0.0.1:4444:4444` only. Never `0.0.0.0`.
4. CLI install target: `~/.claude/skills/<id>/`. Do not rewrite user's existing skill dirs — refuse with a clear error.
5. Docs kind (`catalog/docs/*.md`) has no install verb. If you're tempted to add one, it's a Skill.

## Non-obvious gotchas

- `mcp-context-forge` virtual-server UUID is pinned in `gateway/seeds/virtual-server.yaml`; changing it breaks everyone's `~/.claude/mcpServers` config.
- The `@lucassantana/adtl` scoped package needs `npm publish --access public` (scoped packages default to private on npm).
- The Astro site's `base: '/ai-dev-toolkit-library'` must match the repo name; changes require updating `astro.config.mjs`.
- Repo is private during bootstrap; flip public only after Phase 3 secrets scan + manual review pass (Phase 6).

## When adding a new Skill

1. `mkdir catalog/skills/<slug>`, write `SKILL.md` + `manifest.json` per `schemas/skill.schema.json`.
2. `pnpm run validate` (blocking).
3. `pnpm run index` to rebuild `catalog/index.json`.
4. Commit with `feat(catalog): add <slug> skill`.

## When adding a new Server

1. `cat schemas/server.schema.json` for required fields.
2. Write `catalog/servers/<slug>.yaml`.
3. `pnpm run validate`, then `python gateway/seeds/seed.py` locally to smoke-test registration.
4. Commit with `feat(catalog): add <slug> server`.
