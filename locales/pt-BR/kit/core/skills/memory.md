---
name: memory
description: Persista decisões, preferências e estado do projeto entre sessões
triggers:
  - memory
  - lembre disso
  - salve para a próxima sessão
  - persistir
  - cross-session
---

# Memory

Sincronize contexto importante com armazenamento persistente para que sessões futuras comecem informadas.

## What to Remember

| Categoria | Exemplos | Prioridade |
|---|---|---|
| Decisions | Escolhas de arquitetura, design de API, convenções de nomes | alta |
| Preferences | Estilo de código, formato de commit, template de PR | alta |
| Blockers | Issues conhecidas, restrições de dependência, peculiaridades de ambiente | alta |
| Progress | Fases concluídas, PRs entregues, histórico de releases | média |
| Context | Integrantes do time, relações entre repos, alvos de deploy | média |

## What NOT to Remember

- Saída transitória de debugging
- Logs de execução de ferramentas
- Itens de todo já concluídos (já estão no histórico git)
- Leituras de arquivos específicas da sessão

## Steps

1. Identifique decisões, preferências ou bloqueadores da sessão atual
2. Verifique se já existem na memória (evite duplicatas)
3. Escreva no armazenamento apropriado:
   - `.agents/memory/` para memória local do projeto
   - Arquivos de plano para estado de trabalho em andamento
   - Mensagens de commit git para decisões já entregues
4. Confirme o que foi persistido

## Storage Locations

```text
.agents/memory/decisions.md    — decisões de arquitetura e design
.agents/memory/preferences.md  — preferências de estilo de código e workflow
.agents/memory/blockers.md     — issues conhecidas e restrições
.agents/plans/<task>.md         — estado de trabalho em andamento
```

## Rules

- Escreva memória no fim da sessão, não continuamente
- Mantenha entradas concisas — uma linha por decisão
- Adicione data às entradas para detectar obsolescência
- Remova entradas que não são mais verdadeiras
- Memória é complementar — a base de código é a fonte de verdade
