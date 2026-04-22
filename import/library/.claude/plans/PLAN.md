# ai-dev-toolkit-library — Executable Plan

**Target:** https://github.com/LucasSantana-Dev/ai-dev-toolkit-library (empty, private, `main`)
**Model:** curate a catalog + front it with a single MCP gateway — do NOT rebuild a gateway
**Users:** you + friends (public catalog, personal gateway per user)
**Stack choice rationale:** `forge-space/mcp-gateway` is already an IBM `mcp-context-forge` deployment; we reuse it wholesale as the single MCP entrypoint. The library's job is to (a) hold the curated catalog of Skills & MCP servers, (b) seed the gateway from that catalog, (c) ship a browseable site + thin install CLI.

## Locked decisions (baked into phases below)

1. **Gateway hosting:** personal per friend (localhost + Docker). Shared catalog, NOT shared gateway — MCP tools touch personal secrets, so blast radius stays per-user.
2. **Site hosting:** public repo + GitHub Pages. Phase 3 secrets scan is the gate; flip to public before Phase 6.
3. **CLI distribution:** published to npm as `@lucassantana/adtl`. `npx @lucassantana/adtl ...` is the canonical install path.
4. **Catalog kinds:** `skills/` (actionable procedures, ~10 at launch), `servers/` (MCP upstreams, ~10 at launch), `collections/` (bundles), `docs/` (reference material — renders on site, no install verb).

---

## Source assets to draw from (all local)

| Source | What we pull | How |
|---|---|---|
| `/Volumes/External HD/Desenvolvimento/ai-dev-toolkit/patterns/*.md` | 30 pattern docs → convert to Skills | script: markdown → `SKILL.md` with YAML frontmatter |
| `/Volumes/External HD/Desenvolvimento/ai-dev-toolkit/implementations/{claude-code,codex,cursor,...}` | editor-specific skill/rule packs | copy into `catalog/skills/<editor>-*` |
| `/Volumes/External HD/Desenvolvimento/ai-dev-toolkit/kit/{adapters,hooks,profiles,rag}` | hook/profile templates → Skills + install scripts | symlink or vendor-copy |
| `/Volumes/External HD/Desenvolvimento/dev-assets/global/{agents,claude,claude-memories,codex}` | personal agents/rules → Skills catalog | sanitize then vendor |
| `/Volumes/External HD/Desenvolvimento/ai-dev-toolkit-setup` (GitHub) | `Brewfile`, `.windsurfrules`, etc. → `catalog/skills/env-bootstrap/` | submodule or vendor |
| `/Volumes/External HD/Desenvolvimento/forge-space/mcp-gateway/scripts/mcp-wrapper.sh` | stdio⇄HTTP bridge for IDE | copy to `gateway/scripts/` |
| `/Volumes/External HD/Desenvolvimento/forge-space/mcp-gateway/docker-compose.yml` + `config/` | reference compose + gateway config | adapt into `gateway/` |
| `ghcr.io/ibm/mcp-context-forge:latest` (Apache-2.0) | the gateway binary | pull in compose |

---

## Target repo layout

```
ai-dev-toolkit-library/
├── catalog/
│   ├── skills/<slug>/
│   │   ├── SKILL.md              # Claude skill format, frontmatter: name, description, tags, editors[]
│   │   ├── manifest.json         # schema-validated metadata (id, version, source, install hints)
│   │   └── assets/ scripts/      # optional: hook scripts, templates
│   ├── servers/<slug>.yaml       # MCP server entry: name, transport (stdio|sse|http),
│   │                             # image|cmd, args, env, tags, homepage, license
│   ├── collections/<slug>.yaml   # ordered bundles (e.g. "python-dev", "discord-bot-dev")
│   └── docs/<slug>.md            # reference material — rendered on site, no install verb
├── gateway/
│   ├── docker-compose.yml        # mcp-context-forge + postgres + redis + optional admin
│   ├── .env.example
│   ├── seeds/
│   │   ├── seed.py               # POSTs catalog/servers/*.yaml into gateway admin API
│   │   └── virtual-server.yaml   # defines the single "library" virtual-server UUID
│   ├── scripts/mcp-wrapper.sh    # from forge-space; stdio bridge for Claude Code / IDE
│   └── README.md
├── cli/                           # npm package: `adtl`
│   ├── package.json              # bin: adtl
│   └── src/
│       ├── commands/{list,search,install,add-server,setup-claude,doctor}.ts
│       └── lib/{catalog,gateway-api,claude-config}.ts
├── web/                           # Astro static site, builds from catalog/
│   ├── src/pages/{index,skills/[slug],servers/[slug],collections/[slug]}.astro
│   ├── src/content/config.ts     # Astro content collections mapped to catalog/
│   └── astro.config.mjs          # base: '/ai-dev-toolkit-library'
├── schemas/
│   ├── skill.schema.json
│   ├── server.schema.json
│   ├── collection.schema.json
│   └── doc.schema.json
├── scripts/
│   ├── validate-catalog.ts       # JSON-schema check every manifest
│   ├── import-patterns.ts        # ai-dev-toolkit/patterns → catalog/skills
│   ├── import-dev-assets.ts      # dev-assets/global → catalog/skills
│   └── generate-index.ts         # build catalog/index.json for site + CLI
├── .github/workflows/
│   ├── ci.yml                    # lint + validate + build site
│   └── pages.yml                 # deploy web/ to GitHub Pages on main
├── .claude/
│   ├── CLAUDE.md                 # project guidance for future Claude Code sessions
│   └── plans/                    # keep this PLAN here
├── LICENSE                        # MIT (code) — catalog entries keep their own licenses
├── README.md                      # quickstart for you + friends
├── package.json                   # pnpm workspace: cli, web, scripts
└── pnpm-workspace.yaml
```

---

## Phase 0 — Bootstrap (15 min)

```bash
cd "/Volumes/External HD/Desenvolvimento"
gh repo clone LucasSantana-Dev/ai-dev-toolkit-library
cd ai-dev-toolkit-library

# pnpm workspace + baseline
pnpm init
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - cli
  - web
  - scripts
EOF

# scaffolding
mkdir -p catalog/{skills,servers,collections} \
         gateway/{seeds,scripts} \
         cli/src/{commands,lib} \
         web scripts schemas \
         .github/workflows \
         .claude/plans

# copy this plan in so future sessions find it
mv ../ai-dev-toolkit-library-PLAN.md .claude/plans/PLAN.md

# LICENSE (MIT), README stub, .gitignore
# ...then:
git add . && git commit -m "chore: bootstrap repo skeleton"
git push
```

**Checkpoint:** `gh repo view LucasSantana-Dev/ai-dev-toolkit-library` shows non-zero size.

---

## Phase 1 — Catalog schema + validator (45 min)

1. Write `schemas/skill.schema.json` (id, name, description, version, tags[], editors[], source{type:git|local, path}, install{copy_to:"~/.claude/skills/<id>"}).
2. Write `schemas/server.schema.json` (id, name, transport, command|image, args[], env[], tags[], homepage, license).
3. Write `schemas/collection.schema.json` (id, name, items[{kind, id}]).
4. Write `schemas/doc.schema.json` (id, title, description, tags[], source_path). Docs have NO install verb — they render on the site as reading material only.
5. `scripts/validate-catalog.ts` using `ajv` — fails CI on any invalid manifest across all 4 kinds.
6. `scripts/generate-index.ts` → writes `catalog/index.json` (flat list consumed by site & CLI, tagged by `kind`).
7. Seed 3 skills + 2 servers + 1 doc by hand to exercise all schemas before bulk import.

**Checkpoint:** `pnpm run validate` passes with the hand-written samples.

---

## Phase 2 — Gateway stack (1 h) — localhost-only, per user

Design: every friend runs their own stack. No shared gateway, no Tailscale, no cross-user auth surface. Gateway binds to `127.0.0.1` only.

1. Copy `docker-compose.yml` from `forge-space/mcp-gateway` as reference; pare down to:
   - `gateway` → `ghcr.io/ibm/mcp-context-forge:latest`, ports `"127.0.0.1:4444:4444"` (NEVER `0.0.0.0`)
   - `postgres:16` (volume, localhost-only)
   - `redis:7` (localhost-only)
2. `gateway/.env.example` — `GATEWAY_ADMIN_TOKEN`, `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`. Each user generates their own with `openssl rand -hex 32`.
3. `gateway/seeds/seed.py`:
   - reads every `catalog/servers/*.yaml`
   - calls gateway admin REST (`POST /admin/servers`) to register each upstream
   - creates one virtual-server "library" (UUID pinned in `virtual-server.yaml`)
   - idempotent (upsert by `id`)
4. Copy `mcp-wrapper.sh` → `gateway/scripts/mcp-wrapper.sh` (unchanged, it's already generic).
5. `gateway/README.md`:
   ```
   cp .env.example .env && edit .env    # generate GATEWAY_ADMIN_TOKEN + JWT_SECRET
   docker compose up -d
   python seeds/seed.py
   # Then in Claude Code ~/.claude/mcpServers:
   # "library": { "command": "bash", "args": ["<path>/gateway/scripts/mcp-wrapper.sh"],
   #              "env": { "MCP_CLIENT_SERVER_URL": "http://127.0.0.1:4444/servers/<uuid>/mcp" } }
   ```

**Checkpoint:** `docker compose up -d` + `seed.py` + `curl 127.0.0.1:4444/admin/servers` lists the seeded servers; MCP Inspector connects to `http://127.0.0.1:4444/servers/<uuid>/mcp`.

---

## Phase 3 — Curated import from local assets (1 h)

Curate, don't dump. Each source file lands as either a Skill, a Doc, or is deferred — decided by the classifier in `import-patterns.ts`.

1. `scripts/import-patterns.ts`:
   - for each `/Volumes/External HD/Desenvolvimento/ai-dev-toolkit/patterns/*.md`
   - classify by hardcoded allowlist:
     - **→ Skills (actionable procedures):** `prompting-discipline`, `code-review`, `testing`, `agent-gotchas`, `spec-driven-development`, `context-building`, `git-worktrees`, `task-orchestration`, `prompt-injection-defense`, `skill-md-adoption`
     - **→ Docs (reference material):** `rag-architecture`, `opentelemetry-genai`, `cost-aware-routing`, `llm-evaluation`, `reasoning-model-prompting`, `agent-observability`, `ai-observability`, `multi-model-routing`, `benchmark-reality-gap`, `streaming-orchestration`
     - **→ Deferred:** everything else (import on demand later)
   - Skills: extract first `# Heading` → `name`, first paragraph → `description`; emit `catalog/skills/<id>/SKILL.md` + `manifest.json`
   - Docs: emit `catalog/docs/<id>.md` with frontmatter; no install verb
2. `scripts/import-dev-assets.ts`:
   - walk `/Volumes/External HD/Desenvolvimento/dev-assets/global/{agents,claude,codex}/`
   - **secrets scan** (blocking): regex-scan every file for `lucas\.diassantana|GHP_[A-Za-z0-9]{36}|gho_[A-Za-z0-9]{36}|sk-[A-Za-z0-9]{32,}|xoxb-|xoxp-|AKIA[0-9A-Z]{16}`; ABORT on match and print offending file:line — user must sanitize upstream before re-running
   - username `lucassantana` is allowed (handle), `lucas.diassantana` (email) is not
   - emit skills under `catalog/skills/personal-*` only after scan passes
3. Seed `catalog/servers/` with 10 starter entries:
   - `context7`, `github`, `playwright`, `serena`, `memory`, `sentry` (stdio via npx)
   - `redis`, `docker`, `kubernetes`, `linear` (from your active MCP set)
4. Build 2 opinionated collections:
   - `claude-code-power-user` → agent-gotchas, prompting-discipline, serena, context7, github
   - `discord-bot-dev` → Lucky-specific patterns + github + redis
5. Run `pnpm run validate` — fix any schema violations.
6. **Public-repo gate:** review `git diff` manually. Only after this passes does Phase 6 flip the repo public.

**Checkpoint:** `catalog/index.json` has ~10 skills + ~10 servers + 2 collections + ~10 docs; validator green; secrets scan clean.

---

## Phase 4 — CLI (`adtl`) (1 h)

Commands:
- `adtl list [--kind skill|server|collection] [--tag <t>]`
- `adtl search <query>`
- `adtl install <skill-id>` → clones/copies into `~/.claude/skills/<id>/` (respects install hints)
- `adtl add-server <server-id>` → POSTs to local gateway admin API
- `adtl setup-claude` → writes `~/.claude/mcpServers` entry wiring `library` via `mcp-wrapper.sh`
- `adtl doctor` → verify gateway reachable, `~/.claude/skills/` writable, Docker up

Publish as `@lucassantana/adtl` on npm (scoped, free tier). Friends install with `npx @lucassantana/adtl setup-claude` — same muscle memory as `npx skills add ...`. Publishing details:
- Add `.npmignore` to exclude `src/`, tests, fixtures; ship compiled `dist/` only.
- `npm publish --access public` (scoped packages default to private).
- Version via `pnpm changeset` or manual semver — bump on catalog schema changes.
- GH Actions: on tag push `cli-v*`, run `npm publish`.

**Checkpoint:** `npx @lucassantana/adtl list` prints the catalog; `adtl setup-claude` produces a working Claude Code MCP entry pointing at the user's local gateway.

---

## Phase 5 — Web frontend (1 h)

1. `pnpm create astro@latest web -- --template minimal --typescript strict`.
2. Astro content collections mapped to `catalog/` via `src/content/config.ts`:
   ```ts
   export const collections = {
     skills: defineCollection({ loader: glob({ base: '../catalog/skills', pattern: '*/manifest.json' }) }),
     servers: defineCollection({ loader: glob({ base: '../catalog/servers', pattern: '*.yaml' }) }),
     docs: defineCollection({ loader: glob({ base: '../catalog/docs', pattern: '*.md' }) }),
   };
   ```
3. Pages: `/`, `/skills`, `/skills/[slug]`, `/servers`, `/servers/[slug]`, `/collections/[slug]`, `/docs`, `/docs/[slug]`.
4. Skills/servers pages show copy-pasteable `npx @lucassantana/adtl install <id>` / `add-server <id>`. Docs pages render markdown only — no install CTA.
5. Styling: Tailwind + a minimal card grid. This is catalog browsing, not a design portfolio.
6. `astro.config.mjs` → `site: 'https://lucassantana-dev.github.io', base: '/ai-dev-toolkit-library'`.

**Checkpoint:** `pnpm --filter web dev` renders local catalog browsable.

---

## Phase 6 — Public flip + CI + Pages + npm publish (30 min)

1. **Manual review** of repo contents (one more pass after Phase 3's scan).
2. **Flip repo public:** `gh repo edit LucasSantana-Dev/ai-dev-toolkit-library --visibility public --accept-visibility-change-consequences`.
3. `.github/workflows/ci.yml` — on PR: `pnpm install`, `validate-catalog`, `astro build`, `tsc --noEmit` for cli.
4. `.github/workflows/pages.yml` — on push to `main`: build `web/`, deploy to GitHub Pages.
5. `.github/workflows/publish.yml` — on tag `cli-v*`: `pnpm --filter cli build && npm publish --access public` (needs `NPM_TOKEN` secret).
6. Enable Pages in repo settings → source = GH Actions.

**Checkpoint:** push to main → Actions green → https://lucassantana-dev.github.io/ai-dev-toolkit-library live; tag `cli-v0.1.0` → `@lucassantana/adtl` on npm.

---

## Phase 7 — Friends onboarding (15 min)

Write `docs/QUICKSTART.md`:

```
# For friends joining the library

1. Clone gateway stack:
     git clone https://github.com/LucasSantana-Dev/ai-dev-toolkit-library && cd ai-dev-toolkit-library/gateway
     cp .env.example .env
     # edit .env: generate GATEWAY_ADMIN_TOKEN + JWT_SECRET with `openssl rand -hex 32`
     docker compose up -d
     python seeds/seed.py
2. Wire Claude Code:
     npx @lucassantana/adtl setup-claude
3. Browse the catalog: https://lucassantana-dev.github.io/ai-dev-toolkit-library
4. Install a skill:       npx @lucassantana/adtl install <slug>
5. Add a server:          npx @lucassantana/adtl add-server <slug>
```

And `docs/ADD_A_SKILL.md`, `docs/ADD_A_SERVER.md` — contribution recipes (PR flow, schema fields, how the validator runs).

Seed `.claude/CLAUDE.md` in the repo with:
- purpose + layout
- "when adding a skill, run `pnpm run import:validate` before commit"
- pointer to this PLAN

---

## Phase 8 — Nice-to-haves (defer)

- `adtl update` — pull catalog index, diff installed skills, offer upgrades.
- GH issue templates for "suggest a skill" / "suggest a server".
- Admin UI: reuse `forge-space/mcp-gateway/apps/web-admin` (Next.js) as the gateway dashboard — drop it behind Tailscale auth.
- Telemetry: opt-in, OTEL → Phoenix (mcp-context-forge supports this natively).
- Skill versioning: add `version` to schema now; defer resolver until multiple versions exist.

---

## Execution sequence for Claude Code CLI

Run these as discrete sessions/prompts. Each is designed to fit in a single Claude Code session without blowing context:

1. **Session 1 (Phase 0–1):** *"In `ai-dev-toolkit-library`, bootstrap the pnpm workspace skeleton per `.claude/plans/PLAN.md` Phase 0, then implement schemas and the validator in Phase 1. Commit in 2 commits."*
2. **Session 2 (Phase 2):** *"Stand up `gateway/` per PLAN.md Phase 2 using `ghcr.io/ibm/mcp-context-forge:latest`. Reference `/Volumes/External HD/Desenvolvimento/forge-space/mcp-gateway` for compose details. Verify with `docker compose up -d` locally."*
3. **Session 3 (Phase 3):** *"Run the bulk-import scripts in PLAN.md Phase 3. Commit generated catalog in a single 'feat(catalog): seed from ai-dev-toolkit + dev-assets' commit."*
4. **Session 4 (Phase 4):** *"Implement the `adtl` CLI per PLAN.md Phase 4. Test `list`, `install`, `setup-claude` end-to-end against my local Claude config."*
5. **Session 5 (Phase 5–6):** *"Build the Astro site and wire CI + Pages per PLAN.md Phases 5–6. Open a PR and confirm green checks."*
6. **Session 6 (Phase 7):** *"Write QUICKSTART + contribution docs per PLAN.md Phase 7 and land in a single PR."*

---

## Hard constraints

- Do NOT fork mcp-context-forge — consume the published image.
- Do NOT publish any skill containing personal tokens/emails — the import script runs a blocking secrets scan; fix offending files before commit.
- Gateway binds to `127.0.0.1` only. Never `0.0.0.0`. No Tailscale for the gateway. Shared catalog ≠ shared gateway.
- Keep gateway config and tokens out of the repo (`.env.example` only; real `.env` gitignored).
- Keep repo private until Phase 3 sanitization + manual review pass; flip to public in Phase 6 as a deliberate step.
- Catalog entries that vendor third-party code must preserve upstream LICENSE files under `catalog/skills/<id>/LICENSE.<upstream>`.
- `docs/` kind has no install verb — if a catalog item ships procedure code, it's a Skill, not a Doc.

---

## Open decisions

All four resolved — see "Locked decisions" at top of this file.
