---
name: secure
description: Checklist de scan de segurança — segredos, dependências, entradas, permissões e caminhos de injeção
triggers:
  - security scan
  - verificar segredos
  - auditar segurança
  - antes do release
  - secure this
---

# Secure

Rode antes de merge ou release. Bloqueie em achados CRITICAL.

## Checks

1. **Secrets** — faça scan das mudanças staged em busca de chaves de API, tokens, senhas e arquivos `.env`
2. **Dependencies** — audite vulnerabilidades high/critical
3. **Inputs** — verifique se entradas do usuário são validadas nos limites do sistema
4. **Permissions** — garanta que não exista acesso amplo demais a arquivo/rede
5. **Injection** — confirme que caminhos de injeção SQL, de comando e de template são seguros

## Output

```text
Secrets:      ✓ clean | ✗ N findings
Dependencies: ✓ clean | ✗ N high/critical
Inputs:       ✓ validated | ✗ N unvalidated
Permissions:  ✓ minimal | ✗ N broad
Injection:    ✓ safe | ✗ N vulnerable

Overall: PASS | FAIL (N issues)
```

## Rules

- Achados CRITICAL bloqueiam merge — sem exceções
- Achados HIGH exigem reconhecimento explícito
- Nunca faça commit de `.env`, credenciais ou padrões de segredos
- Prefira allowlists a blocklists para validação de entrada
- Use queries parametrizadas — nunca concatenação de string para SQL
