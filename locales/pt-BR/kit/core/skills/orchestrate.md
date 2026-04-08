---
name: orchestrate
description: Quebre trabalho complexo em fases com rastreamento de dependências e checkpoints de verificação
triggers:
  - orchestrate
  - quebrar isso
  - multi-step
  - planejar e executar
  - tarefa complexa
---

# Orchestrate

Quebre trabalho complexo em fases verificáveis e execute-as em ordem.

## Steps

1. Decomponha o pedido em 3-7 fases atômicas
2. Identifique dependências (quais fases precisam terminar antes das outras)
3. Defina por fase: entregável, check de verificação, escopo estimado
4. Execute na ordem das dependências
5. Após cada fase: verifique, reporte, prossiga ou pare em caso de falha
6. Após todas as fases: rode os quality gates completos

## Phase Template

```text
Phase N: <nome>
  Scope: ~N linhas em N arquivos
  Deliverable: <o que existe quando termina>
  Verify: <comando ou check>
  Depends on: <números das fases ou "none">
```

## Rules

- Nunca pule a verificação entre fases
- Corrija uma fase que falhou antes de iniciar a próxima
- Fases independentes podem rodar em paralelo quando houver subagentes disponíveis
- Mantenha cada fase abaixo de ~100 linhas alteradas
- Escreva uma linha curta de status após cada fase concluída
