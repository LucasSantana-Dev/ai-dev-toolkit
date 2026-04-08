# Política de Segurança

## Como Reportar uma Vulnerabilidade

Reporte problemas de segurança para [security@forgespace.co](mailto:security@forgespace.co). Não abra uma issue pública.

## Escopo

- **Scripts de instalação** (`tools/*.sh`, `tools/*.ps1`) — injeção em shell, downloads inseguros
- **Código de exemplo** em `patterns/` — credenciais hardcoded, práticas inseguras
- **Configuração de CI/CD** (`.github/workflows/`) — injeção em workflows, exposição de segredos

## Resposta

| Severidade | Tempo de resposta |
|---|---|
| Critical | 48 horas |
| High | 1 semana |
| Medium/Low | Melhor esforço |
