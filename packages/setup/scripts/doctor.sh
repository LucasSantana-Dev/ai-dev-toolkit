#!/usr/bin/env bash
set -euo pipefail

ok() {
	printf '✅ %s\n' "$1"
}

warn() {
	printf '⚠️  %s\n' "$1"
}

check_cmd() {
	local cmd="$1"
	local label="$2"
	if command -v "$cmd" >/dev/null 2>&1; then
		ok "$label"
	else
		warn "$label not found"
	fi
}

echo "ai-dev-toolkit doctor"
echo

check_cmd git "git"
check_cmd gh "GitHub CLI"
check_cmd node "Node.js"
check_cmd python3 "Python 3"
check_cmd jq "jq"
check_cmd rg "ripgrep"
check_cmd fd "fd"
check_cmd fzf "fzf"
check_cmd tmux "tmux"
check_cmd opencode "OpenCode CLI"
check_cmd claude "Claude CLI"

echo

if gh auth status >/dev/null 2>&1; then
	ok "GitHub authentication"
else
	warn "GitHub CLI not authenticated (run: gh auth login)"
fi

if [[ -f "$HOME/.config/ai-dev-toolkit/shell.sh" ]]; then
	ok "portable shell config installed"
else
	warn "portable shell config missing"
fi

if [[ -f "$HOME/.config/ai-dev-toolkit/local.env" ]]; then
	ok "local AI env template installed"
else
	warn "local AI env template missing"
fi

if [[ -f "$HOME/.config/opencode/opencode.jsonc" ]]; then
	ok "OpenCode config installed"
else
	warn "OpenCode config missing"
fi

if [[ -f "$HOME/.config/opencode/AGENTS.md" ]]; then
	ok "OpenCode rules/guidance installed"
else
	warn "OpenCode rules/guidance missing"
fi

if [[ -d "$HOME/.opencode/skills/agents" && -d "$HOME/.opencode/skills/codex" ]]; then
	ok "OpenCode skills directories prepared"
else
	warn "OpenCode skills directories missing"
fi

if [[ -n "${OPENAI_API_KEY:-}" || -n "${ANTHROPIC_API_KEY:-}" || -n "${GITHUB_TOKEN:-}" ]]; then
	ok "at least one AI/provider token is loaded in environment"
else
	warn "no AI/provider tokens loaded yet (edit ~/.config/ai-dev-toolkit/local.env)"
fi

if [[ -f "$HOME/.config/tmux/sessionizer.sh" ]]; then
	ok "tmux toolkit installed"
else
	warn "tmux toolkit missing"
fi

if [[ -f "$HOME/.config/iterm2/forge_terminal_stack.py" ]]; then
	ok "iTerm2 support installed"
else
	warn "iTerm2 support not installed (optional)"
fi

echo
echo "Next recommended commands:"
echo "  source ~/.bashrc   # or source ~/.zshrc"
echo "  gh auth login"
echo "  edit ~/.config/ai-dev-toolkit/local.env"
echo "  opencode --help    # verify CLI if installed"
echo "  repo-terminal-ready"
