# Mapa de Backlog do ai-dev-toolkit

_Última atualização: 2026-04-03_

## Snapshot

- Branch inspecionada: `release/v0.11.0`
- Branch padrão: `main`
- PRs abertas: `0`
- Issues abertas: `0`
- Fonte principal do backlog: `backlog.json`
- Fonte do roadmap estratégico: `.claude/plans/universal-toolkit-installer.md`

## Resumo das Evidências

### Sinais urgentes confirmados

- A release mais recente no GitHub agora é **`v0.11.0`**.
- O trabalho de maior valor no curto prazo deixou de ser a execução da release e passou a ser o endurecimento da governança pós-release.
- `backlog.json` é a fila operacional principal e precisa continuar alinhado com PRs mergeadas e com o estado das releases.
- Os maiores ganhos de qualidade no curto prazo vêm de schemas, parity entre adapters e higiene recorrente de backlog.

### Superfícies de implementação ausentes confirmadas

- `kit/core/schedules.json` está ausente.
- `kit/plugins/` está ausente.
- `implementations/antigravity/` está ausente.
- `implementations/windsurf/README.md` está ausente.

### Superfícies existentes confirmadas

- `kit/core/mcp.json` existe.
- `kit/core/agents.json` existe.
- `kit/core/routing.json` existe.
- `kit/schema/` existe com 9 JSON schemas.
- `implementations/cursor/README.md` existe.
- `companies/fullstack-forge/` existe, mas nenhum template adicional de company foi encontrado.

---

## Agora

### 1. Stabilize post-release backlog governance

**Why now**

- `v0.11.0` is already published, so the remaining risk is backlog/process drift rather than release execution.
- The repo now depends on `backlog.json` as an operational control surface for follow-on work.

**Evidence**

- GitHub latest release → `v0.11.0`
- `backlog.json` still carries multiple governance and parity items as the active next work
- Human-readable backlog context was missing before this document

**First action**

- Keep `backlog.json` and the human-readable backlog in sync:
  1. reconcile shipped work to `done`
  2. add drift detection and recurring triage
  3. prioritize the next governance lanes for shipment

### 2. Formalize JSON schemas for forge-kit core config

**Why now**

- The repo already treats `agents.json`, `routing.json`, and `mcp.json` as structured contracts.
- Missing schemas are the clearest DX + governance gap after release readiness.

**Evidence**

- `backlog.json` → `json-schemas` is `high` + `ready`
- `kit/schema/` is currently missing
- Existing config files already reference schema paths (`agents.json`, `routing.json`)

**First action**

- Define the minimal schema set and validation contract for:
  - `agents.json`
  - `routing.json`
  - `mcp.json`
  - `autopilot.json`
  - `loop.json`
  - `token-optimization.json`
  - `hooks.json`

### 3. Close the highest-value adapter parity gaps

**Why now**

- The toolkit promise is cross-tool portability; parity gaps undermine the headline value proposition.
- This work is already explicitly queued and tightly coupled to the installer story.

**Evidence**

- `backlog.json` → `adapter-parity-close` is `high` + `ready`
- README and `kit/` position forge-kit as multi-tool, but parity work remains open

**First action**

- Re-run or reconstruct a parity matrix and convert it into adapter-specific subtasks.

---

## Próximos

### 4. Fill missing implementation docs/adapters

**Why next**

- These are concrete, bounded gaps that improve trust and adoption after the release and core schema work.

**Evidence**

- `implementations/antigravity/` missing
- `implementations/windsurf/README.md` missing
- `implementations/cursor/README.md` already present

**First action**

- Define a minimum implementation-doc contract and apply it to Antigravity + Windsurf.

### 5. Expand company templates beyond `fullstack-forge`

**Why next**

- Template breadth is an adoption multiplier, but it depends on the core forge-kit surface stabilizing first.

**Evidence**

- `backlog.json` → `company-templates` exists
- Only `companies/fullstack-forge/` is currently present

**First action**

- Pick the first two templates with the highest adoption leverage:
  - `solopreneur`
  - `startup-mvp`

### 6. Stabilize backlog governance itself

**Why next**

- There are no open GitHub issues/PRs, so backlog visibility currently lives inside the repo.
- Without a clear human-readable map, backlog.json alone is easy to ignore.

**Evidence**

- `gh pr list` → `[]`
- `gh issue list` → `[]`
- `backlog.json` exists, but there was no canonical markdown backlog before this map

**First action**

- Decide whether `backlog.json` remains the source of truth with `BACKLOG.md` as a human-readable projection.

---

## Depois

### 7. Add schedule / heartbeat automation

**Why later**

- Important for autonomous workflows, but not a release blocker.
- Best done after the core config/schema story is stable.

**Evidence**

- `backlog.json` → `heartbeat-schedule`
- `kit/core/schedules.json` is missing

**First action**

- Define 3 concrete schedule use cases before inventing schema shape.

### 8. Design the plugin system

**Why later**

- It is a broad architecture surface and should not outrun parity + core config maturity.

**Evidence**

- `backlog.json` → `plugin-system`
- `kit/plugins/` is missing

**First action**

- Write a short architecture note clarifying plugin boundaries: skills, hooks, MCP config, providers.

### 9. Align the repo backlog with the broader forge-kit roadmap

**Why later**

- `.claude/plans/universal-toolkit-installer.md` suggests a larger initiative than the current backlog.json expresses.
- This should become an epic map once the release line is stable.

**Evidence**

- `.claude/plans/universal-toolkit-installer.md`

**First action**

- Extract roadmap milestones from that plan and link them to backlog epics.

---

## Limpeza / Redução de Risco

### A. Separar “ausente por design” de “ausente por omissão”

Para cada caminho ausente, adicione uma classificação:

- `required-now`
- `planned-next`
- `deferred`
- `intentionally-out-of-scope`

### B. Tornar impossível o estado de release se desalinhar silenciosamente

Adicione um gate de release que falhe se:

- o nome da branch implicar uma versão maior do que a de `package.json`
- existir conteúdo em `CHANGELOG.md` na seção unreleased para uma branch de release já tagueada
- o estado de release/tag no GitHub não corresponder à versão pretendida

### C. Manter ruído de instalação local fora do planejamento

Se o seu checkout contiver ruído local de workspace, como `node_modules/`, mantenha o planejamento e o trabalho de backlog em um worktree limpo para evitar sinais falsos no backlog.

---

## Ordem de execução recomendada

1. Entregar `v0.11.0`
2. Adicionar JSON schemas + enforcement de validação
3. Fechar gaps de parity entre adapters
4. Preencher a documentação de implementação de Antigravity/Windsurf
5. Expandir templates de companies
6. Adicionar a camada de schedules
7. Projetar o sistema de plugins
8. Incorporar o roadmap do instalador universal aos épicos de longo prazo

---

## Próxima tarefa recomendada imediatamente

**Entregar a próxima frente de governança pós-release** com checklist explícito e gates de verificação.
