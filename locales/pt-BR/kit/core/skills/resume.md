---
name: resume
description: Recupere o estado da sessão a partir de git, planos e trabalho recente para continuar de onde parou
triggers:
  - resume
  - continuar
  - o que eu estava fazendo
  - retomar de onde parei
  - iniciar sessão
---

# Resume

Carregue o estado atual e sugira a próxima ação.

## Steps

1. Verifique o git status e o log recente (últimos 5 commits)
2. Verifique se há PRs abertos na branch atual
3. Procure arquivos de plano em `.agents/plans/` ou `.claude/plans/`
4. Procure marcadores TODO/FIXME nos arquivos alterados recentemente
5. Resuma o estado e recomende a próxima ação

## Priority Order

1. PR aberto com feedback de review → trate comentários primeiro
2. CI quebrado na branch atual → corrija antes de novo trabalho
3. Existe arquivo de plano ativo → continue da última fase incompleta
4. Há mudanças não commitadas → decidir: commit, stash ou descarte
5. Sem trabalho em andamento → verifique backlog ou peça direção

## Output

```text
## Session State
Branch: <nome>
Last commit: <mensagem> (<tempo atrás>)
Open PRs: <count>
Active plan: <path ou none>
Uncommitted: <count files>

## Next Action
<recomendação em uma frase>
```

## Rules

- Sempre verifique o estado do git antes de sugerir trabalho
- Se existir PR aberto, priorize feedback de review acima de novo trabalho
- Nunca inicie novo trabalho sem reconhecer o que já está em andamento
- Se existir um arquivo de plano, continue de onde ele parou
