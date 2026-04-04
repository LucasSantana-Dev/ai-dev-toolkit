#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:?repo root required}"
OPENCODE_DIR="$HOME/.config/opencode"
OPENCODE_SKILLS_DIR="$HOME/.opencode/skills"
TOOLKIT_STAMP="$HOME/.config/ai-dev-toolkit/.toolkit-version"
TOOLKIT_REPO="Forge-Space/ai-dev-toolkit"

# Read pinned toolkit version
TOOLKIT_VERSION_FILE="$ROOT/TOOLKIT_VERSION"
if [[ -f "$TOOLKIT_VERSION_FILE" ]]; then
	TOOLKIT_VERSION="$(tr -d '[:space:]' <"$TOOLKIT_VERSION_FILE")"
else
	TOOLKIT_VERSION=""
fi

mkdir -p "$OPENCODE_DIR" "$OPENCODE_DIR/scripts" \
	"$OPENCODE_SKILLS_DIR/agents" "$OPENCODE_SKILLS_DIR/codex" \
	"$HOME/.config/ai-dev-toolkit"

# ---------------------------------------------------------------------------
# Fetch toolkit content from GitHub release tarball
# ---------------------------------------------------------------------------
fetch_toolkit() {
	local version="$1"
	local url="https://github.com/${TOOLKIT_REPO}/archive/refs/tags/v${version}.tar.gz"
	local tmpdir
	tmpdir="$(mktemp -d)"
	local strip="ai-dev-toolkit-${version}"

	echo "  Fetching ai-dev-toolkit v${version}..."
	if curl -fsSL "$url" | tar xz -C "$tmpdir" 2>/dev/null; then
		TOOLKIT_DIR="$tmpdir/$strip"
		echo "  Toolkit v${version} fetched OK."
		return 0
	else
		rm -rf "$tmpdir"
		echo "  WARNING: Could not fetch toolkit v${version}. Using local fallback."
		return 1
	fi
}

# ---------------------------------------------------------------------------
# Install content from toolkit (either fetched or local fallback)
# ---------------------------------------------------------------------------
install_from_toolkit() {
	local toolkit_root="$1"

	# Skills from kit/core/skills/ → ~/.opencode/skills/agents/
	if [[ -d "$toolkit_root/kit/core/skills" ]]; then
		echo "  Installing portable skills from toolkit..."
		for skill_file in "$toolkit_root/kit/core/skills/"*.md; do
			[[ -f "$skill_file" ]] || continue
			local name
			name="$(basename "$skill_file" .md)"
			mkdir -p "$OPENCODE_SKILLS_DIR/agents/$name"
			cp "$skill_file" "$OPENCODE_SKILLS_DIR/agents/$name/SKILL.md"
		done
	fi

	# OpenCode templates from implementations/opencode/
	if [[ -f "$toolkit_root/implementations/opencode/opencode.template.jsonc" ]]; then
		echo "  Rendering opencode.jsonc from toolkit template..."
		python3 "$ROOT/scripts/render-opencode-config.py" \
			"$toolkit_root/implementations/opencode/opencode.template.jsonc" \
			"$OPENCODE_DIR/opencode.jsonc"
	fi

	if [[ ! -f "$OPENCODE_DIR/dcp.jsonc" ]] &&
		[[ -f "$toolkit_root/implementations/opencode/dcp.template.jsonc" ]]; then
		cp "$toolkit_root/implementations/opencode/dcp.template.jsonc" \
			"$OPENCODE_DIR/dcp.jsonc"
	fi

	# AGENTS.md from rules/
	if [[ -f "$toolkit_root/rules/AGENTS.md" ]]; then
		cp "$toolkit_root/rules/AGENTS.md" "$OPENCODE_DIR/AGENTS.md"
	fi

	# Helper scripts from tools/
	for script in mcp-health.py toggle-mcp.py release.py; do
		if [[ -f "$toolkit_root/tools/$script" ]]; then
			cp "$toolkit_root/tools/$script" "$OPENCODE_DIR/scripts/$script"
		fi
	done
	chmod +x "$OPENCODE_DIR/scripts/"* 2>/dev/null || true
}

# ---------------------------------------------------------------------------
# Local fallback: use bundled content from this repo
# ---------------------------------------------------------------------------
install_from_local() {
	echo "  Using local fallback (bundled content)..."

	# AGENTS.md (minimal local copy)
	if [[ -f "$ROOT/config/opencode/AGENTS.md" ]]; then
		cp "$ROOT/config/opencode/AGENTS.md" "$OPENCODE_DIR/AGENTS.md"
	fi

	cp "$ROOT/config/opencode/README.md" "$OPENCODE_DIR/README.md"

	# Render opencode.jsonc from local template
	python3 "$ROOT/scripts/render-opencode-config.py" \
		"$ROOT/config/opencode/opencode.template.jsonc" \
		"$OPENCODE_DIR/opencode.jsonc"

	# DCP config
	if [[ ! -f "$OPENCODE_DIR/dcp.jsonc" ]]; then
		cp "$ROOT/config/opencode/dcp.template.jsonc" "$OPENCODE_DIR/dcp.jsonc"
	fi

	# Local skills (if still present during migration)
	local source_skills="$ROOT/config/opencode/skills"
	if [[ -d "$source_skills/agents" ]]; then
		cp -R "$source_skills/agents/." "$OPENCODE_SKILLS_DIR/agents/"
	fi
	if [[ -d "$source_skills/codex" ]]; then
		cp -R "$source_skills/codex/." "$OPENCODE_SKILLS_DIR/codex/"
	fi

	# Local scripts (if still present during migration)
	local source_scripts="$ROOT/config/opencode/scripts"
	if [[ -d "$source_scripts" ]]; then
		cp -R "$source_scripts/." "$OPENCODE_DIR/scripts/"
		chmod +x "$OPENCODE_DIR/scripts/"* 2>/dev/null || true
	fi
}

# ---------------------------------------------------------------------------
# Main flow
# ---------------------------------------------------------------------------
echo "Setting up AI tools..."

TOOLKIT_DIR=""

if [[ -n "$TOOLKIT_VERSION" ]]; then
	if fetch_toolkit "$TOOLKIT_VERSION"; then
		install_from_toolkit "$TOOLKIT_DIR"
		echo "$TOOLKIT_VERSION" >"$TOOLKIT_STAMP"
		rm -rf "$(dirname "$TOOLKIT_DIR")"
	else
		install_from_local
		echo "local-fallback" >"$TOOLKIT_STAMP"
	fi
else
	echo "  No TOOLKIT_VERSION file found. Using local fallback."
	install_from_local
	echo "no-pin" >"$TOOLKIT_STAMP"
fi

echo "AI tools setup complete."
