---
name: route
description: Classifique a complexidade da tarefa e escolha o tier de modelo certo para evitar gasto excessivo em trabalho trivial
triggers:
  - route
  - qual modelo
  - seleção de modelo
  - complexidade da tarefa
  - escolher modelo
---

# Route

Classifique a tarefa e recomende um tier de modelo antes da execução.

## Classificação

| Sinal | Barato | Médio | Caro |
|---|---|---|---|
| Linhas alteradas | <20, arquivo único | 20-200, vários arquivos | >200 ou cross-repo |
| Profundidade de raciocínio | Lookup, grep, rename | Bug fix, escrita de testes | Arquitetura, migração |
| Domínio | Config, docs, typo | Implementação padrão | Design multi-sistema |

## Overrides

- Trabalho visual/UI → modelo com capacidade visual independentemente do tamanho
- Docs/escrita → tier intermediário com limite alto de tokens
- Auditoria de segurança → no mínimo tier intermediário

## Steps

1. Estime linhas alteradas e quantidade de arquivos
2. Avalie a profundidade de raciocínio necessária
3. Verifique overrides de domínio
4. Produza a recomendação

## Output

```text
Tier: cheap | mid | expensive
Reason: <justificativa em uma frase>
```

## Rules

- Por padrão, use o tier mais barato capaz de lidar com a tarefa
- Em caso de dúvida, comece barato e escale se falhar
- Nunca use o tier caro para edições em um único arquivo com menos de 20 linhas
