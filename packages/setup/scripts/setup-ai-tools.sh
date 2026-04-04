#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:?repo root required}"
OPENCODE_DIR="$HOME/.config/opencode"
OPENCODE_SKILLS_DIR="$HOME/.opencode/skills"
SOURCE_SKILLS_DIR="$ROOT/config/opencode/skills"

mkdir -p "$OPENCODE_DIR" "$OPENCODE_SKILLS_DIR/agents" "$OPENCODE_SKILLS_DIR/codex"

cp "$ROOT/config/opencode/AGENTS.md" "$OPENCODE_DIR/AGENTS.md"
cp "$ROOT/config/opencode/README.md" "$OPENCODE_DIR/README.md"

python3 "$ROOT/scripts/render-opencode-config.py" "$ROOT/config/opencode/opencode.template.jsonc" "$OPENCODE_DIR/opencode.jsonc"

if [[ ! -f "$OPENCODE_DIR/dcp.jsonc" ]]; then
	cp "$ROOT/config/opencode/dcp.template.jsonc" "$OPENCODE_DIR/dcp.jsonc"
fi

if [[ -d "$SOURCE_SKILLS_DIR/agents" ]]; then
	cp -R "$SOURCE_SKILLS_DIR/agents/." "$OPENCODE_SKILLS_DIR/agents/"
fi

if [[ -d "$SOURCE_SKILLS_DIR/codex" ]]; then
	cp -R "$SOURCE_SKILLS_DIR/codex/." "$OPENCODE_SKILLS_DIR/codex/"
fi
