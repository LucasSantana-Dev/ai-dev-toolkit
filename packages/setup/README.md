# ai-dev-toolkit-setup

Setup portátil do ai-dev-toolkit para máquinas novas, sem depender de dotfiles pessoais.

## O que este repo faz

- instala dependências base em macOS, Ubuntu e Windows
- configura shell helpers portáteis para bash/zsh
- instala o workflow compartilhado de tmux
- prepara onboarding por repositório com `.tmux-session.json`
- oferece suporte opcional ao iTerm2 no macOS

## Quick start

### macOS / Ubuntu

```bash
git clone git@github.com:LucasSantana-Dev/ai-dev-toolkit-setup.git
cd ai-dev-toolkit-setup
./bootstrap.sh
```

Depois, valide o ambiente automaticamente:

```bash
./scripts/doctor.sh
```

Com iTerm2 no macOS:

```bash
./bootstrap.sh --with-iterm2
```

### Windows

Abra PowerShell como administrador:

```powershell
git clone git@github.com:LucasSantana-Dev/ai-dev-toolkit-setup.git
cd ai-dev-toolkit-setup
./bootstrap.ps1
```

> Para o workflow completo de tmux/bash, o caminho recomendado no Windows é usar **WSL2 + Ubuntu**.

## O que será instalado

- Git
- GitHub CLI (`gh`)
- Node.js
- Python 3
- jq
- ripgrep
- fd
- fzf
- tmux

Em macOS, o bootstrap também instala extras úteis via Homebrew:
- zoxide
- atuin
- eza
- bat
- starship
- direnv

## Fluxo diário

Depois do bootstrap:

```bash
source ~/.bashrc   # ou source ~/.zshrc
gh auth login
```

Em um repositório:

```bash
repo-terminal-ready
```

Ou, se quiser auto-aplicar onboarding detectado:

```bash
repo-terminal-ready-yes
```

## Templates tmux por projeto

Sugestão automática:

```bash
ttemplate-suggest
ttemplate-preview
ttemplate-apply
```

## Shells suportados

- bash
- zsh

PowerShell pode ser usado para bootstrap no Windows, mas o workflow avançado do toolkit hoje é pensado principalmente para bash/zsh.

## Segredos locais

Use um arquivo local fora do repo, por exemplo:

```bash
~/.config/ai-dev-toolkit/local.env
```

Exemplo em `templates/local.env.example`.
