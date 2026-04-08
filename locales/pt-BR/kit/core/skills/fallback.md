---
name: fallback
description: Lide com falhas de modelo e provedor com cadeias automáticas de fallback
triggers:
  - fallback
  - modelo falhou
  - provedor fora
  - rate limited
  - trocar modelo
  - tentar com outro modelo
---

# Fallback

Quando um modelo ou provedor falhar, siga a cadeia de fallback em vez de parar.

## Failure Types

| Tipo | Detecção | Ação |
|---|---|---|
| Rate limit | 429 / "rate limited" | Espere e tente novamente, depois faça fallback |
| Falha de auth | 401 / 403 | Troque de provedor imediatamente |
| Modelo indisponível | 404 / "model not found" | Troque para o modelo de fallback |
| Timeout | Sem resposta em 60s | Tente uma vez de novo, depois faça fallback |
| Overflow de contexto | "context too long" | Compacte o contexto (use a skill de context), tente novamente |
| Qualidade da saída | Saída quebrada/vazia | Escale para o próximo tier |

## Fallback Chain

```text
1. Tentar novamente com o mesmo modelo (lida com erros transitórios)
2. Trocar para o modelo de fallback no mesmo tier
3. Trocar para o provedor de fallback no mesmo tier
4. Escalar para o próximo tier com o provedor principal
5. Escalar para o próximo tier com o provedor de fallback
6. STOP — reporte a falha com a cadeia completa tentada
```

## Provider Priority

Leia de `.forge-setup.json` ou `routing.json`:

```text
Primary: <provedor escolhido pelo usuário>
Fallback: <provedor de fallback escolhido pelo usuário>
Local: ollama (se habilitado)
```

## Rules

- Nunca degrade silenciosamente — sempre registre qual modelo/provedor está ativo
- Rate limits: exponential backoff (1s → 2s → 4s → 8s → parar)
- Falhas de auth pulam retry — troque de provedor imediatamente
- Overflow de contexto dispara compactação antes do retry
- Acompanhe custo/tokens totais por sessão para consciência operacional
- Depois que o fallback ativar, continue no fallback — não volte no meio da tarefa

## Output on Fallback

```text
⚠ Fallback activated
  Reason: <rate limit | auth | unavailable | timeout | overflow | quality>
  From: <provider/model>
  To: <provider/model>
  Attempt: N/5
```
