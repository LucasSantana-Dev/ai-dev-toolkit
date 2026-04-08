---
name: context
description: Otimize o uso da janela de contexto — compacte dados obsoletos e preserve o estado ativo
triggers:
  - otimizar contexto
  - contexto muito grande
  - compact
  - sessão lenta
  - liberar contexto
---

# Context

Mantenha a janela de contexto focada no que importa agora.

## When to Use

- A sessão parece lenta ou as respostas pioraram
- Você está alternando entre tarefas não relacionadas
- Depois de concluir uma tarefa grande e mudar de foco
- O contexto está se aproximando da capacidade máxima

## Steps

1. Estime o uso atual do contexto
2. Identifique contexto obsoleto (saídas antigas, discussões resolvidas, itens concluídos)
3. Compacte ou remova contexto obsoleto
4. Verifique se o estado ativo foi preservado (branch, arquivos, plano, decisões)
5. Reporte o que mudou

## Output

```text
Before: ~N% used
Compacted: <o que foi removido>
After: ~N% used
Preserved: <itens-chave mantidos>
```

## Rules

- Nunca compacte o estado da tarefa ativa
- Preserve: branch atual, arquivos ativos, plano em andamento, decisões-chave
- Remova: saídas antigas de busca, todos concluídos, threads resolvidas
- Se estiver muito inchado, recomende uma sessão nova
- Salve o estado crítico em um arquivo de plano antes de compactar, se o trabalho ainda estiver em andamento
