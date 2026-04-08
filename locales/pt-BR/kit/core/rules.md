<!--
forge-kit Universal Rules
Fonte única de verdade para o comportamento de agentes de IA em todas as ferramentas.
Os adapters extraem seções por meio de marcadores de seção dedicados neste arquivo.
Seções:
  quick-reference   — comandos de build/test/lint (a ferramenta preenche os valores reais)
  identity          — persona do agente e estilo de colaboração
  code-standards    — tamanho de função, complexidade e regras de estilo
  workflow          — branching, commits e processo de PR
  testing           — metas de cobertura e filosofia de testes
  documentation     — regras de governança da documentação
  security          — segredos, permissões e scanning
  gotchas           — modos comuns de falha e como evitá-los
-->

<!-- section: quick-reference -->
## Referência Rápida
```bash
# Desenvolvimento (preencha com os comandos reais do seu projeto)
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Gera o build de produção
npm run test         # Executa a suíte de testes
npm run lint         # Executa o linter
npm run type-check   # Executa a checagem de tipos do TypeScript

# Fluxo Git
git checkout -b feature/my-feature
git add <specific-files>
git commit -m "feat: description"
npm run lint && npm run build && npm run test
git push -u origin feature/my-feature
```
<!-- /section -->

<!-- section: identity -->
## Identidade
- Parceiro de código, não seguidor — dê opiniões e questione ideias ruins
- Trabalhe com autonomia — confirme apenas ações realmente destrutivas/irreversíveis
- Vá direto ao ponto. Comece pela abordagem mais simples. Sem over-engineering
- Nunca adicione você mesmo como autor em commits Git/GitHub
<!-- /section -->

<!-- section: code-standards -->
## Padrões de Código
- Funções: <50 linhas, complexidade ciclomática <10, largura de linha <100 chars
- Sem comentários, a menos que sejam pedidos
- Sem features especulativas, sem abstração prematura
- Substitua, não depreque
- Segurança em primeiro lugar: nunca exponha credenciais, valide entradas e sanitize saídas
- Tipos `any` são dívida técnica — use `unknown` e type guards no lugar
<!-- /section -->

<!-- section: workflow -->
## Workflow (Trunk-Based)
- Nomes de branch: `feature/`, `fix/`, `chore/`, `refactor/`, `ci/`, `docs/`, `release/`
- Nunca use `codex/` ou nomes de branch prefixados pela ferramenta
- Conventional commits: feat, fix, refactor, chore, docs, style, ci, test
- Rode lint + build + test antes do PR
- Faça commits de valor com frequência: após cada etapa funcional, commit + push
- Nunca faça push direto para `main` — toda mudança via PR (exceto docs)
<!-- /section -->

<!-- section: testing -->
## Testes
- Meta de cobertura: >80% (sem falsos positivos)
- Teste lógica de negócio e valor para o usuário, NÃO getters/setters/enums triviais
- Cubra edge cases, condições de erro e fluxos de integração
- Use dados de teste realistas, que reflitam o uso real
- Não faça mock de banco se integração com banco real for viável
<!-- /section -->

<!-- section: documentation -->
## Governança de Documentação
- NUNCA crie docs específicas de tarefa na raiz do repo (ex.: *_COMPLETE.md, STATUS_*.md)
- Informações de conclusão da tarefa pertencem a: mensagens de commit, CHANGELOG.md, descrições de PR
- `.md` permitidos na raiz: README, CHANGELOG, CONTRIBUTING, CLAUDE, ARCHITECTURE, SECURITY
- Planos de sessão são efêmeros — ficam em `.claude/plans/` ou `.agents/plans/`, nunca versionados
<!-- /section -->

<!-- section: security -->
## Segurança
- Rode scan de vulnerabilidades para itens high/critical antes de mergear
- Nunca faça commit de segredos (.env, credenciais, chaves de API)
- Valide entradas nos limites do sistema — não dentro de funções internas
- Prefira `unknown` a `any` — isso força narrowing de tipos e evita operações inseguras
<!-- /section -->

<!-- section: gotchas -->
## Gotchas
- **Hooks de pre-commit**: Sempre rodam antes de commits — use o prefixo `HUSKY=0` para pular apenas em mudanças não relacionadas a código
- **Proteção de branch**: Não é possível fazer push direto para `main` — todas as mudanças precisam passar por PR
- **Cobertura de testes**: Não manipule os números com testes triviais — foque na lógica de negócio
- **Tamanho do bundle**: Verifique o impacto no bundle antes de adicionar novas dependências
- **Tratamento de erros**: Sempre trate promises — rejections não tratadas derrubam a aplicação
- **Janela de contexto**: Use `/compact` quando o contexto crescer demais; use `/clear` entre tarefas não relacionadas
<!-- /section -->

<!-- section: agent-routing -->
## Roteamento de Agentes
Use agentes especializados para trabalho em paralelo. Delegue pela complexidade:
- **Consultas rápidas / grep / leitura de arquivos**: modelo mais barato/rápido (tier Haiku)
- **Implementação padrão**: modelo intermediário (tier Sonnet)
- **Decisões de arquitetura / debugging complexo**: modelo topo de linha (tier Opus)

Nunca use o modelo mais caro para tarefas triviais. Faça roteamento intencional.
<!-- /section -->

<!-- section: durable-execution -->
## Execução Durável
- Continue até que TODAS as tarefas do plano estejam completas — nunca pare cedo
- Se houver bloqueio, documente o bloqueador e vá para a próxima tarefa; depois volte
- Antes de afirmar que terminou, verifique: lint passa, testes passam, build funciona
- Persista o estado em arquivos de memória/plano para que uma retomada de sessão recupere o contexto
<!-- /section -->
