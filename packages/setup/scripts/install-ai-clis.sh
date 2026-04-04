#!/usr/bin/env bash
set -euo pipefail

OS="$(uname -s)"

install_opencode() {
	if command -v opencode >/dev/null 2>&1; then
		return 0
	fi

	case "$OS" in
	Darwin)
		if command -v brew >/dev/null 2>&1; then
			brew install anomalyco/tap/opencode
			return 0
		fi
		;;
	Linux)
		if command -v npm >/dev/null 2>&1; then
			npm install -g opencode-ai
			return 0
		fi
		;;
	esac

	echo "Could not auto-install opencode on this platform." >&2
	return 1
}

install_claude() {
	if command -v claude >/dev/null 2>&1; then
		return 0
	fi

	case "$OS" in
	Darwin)
		if command -v brew >/dev/null 2>&1; then
			brew install --cask claude-code
			return 0
		fi
		;;
	Linux)
		curl -fsSL https://claude.ai/install.sh | bash
		return 0
		;;
	esac

	echo "Could not auto-install Claude Code on this platform." >&2
	return 1
}

install_opencode || true
install_claude || true
