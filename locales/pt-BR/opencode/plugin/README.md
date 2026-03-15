# OpenCode Plugins

## Session Manager (`session-manager.ts`)

Auto-manages OpenCode sessions to keep the sidebar clean across multiple projects.

### What it does

| Trigger | Action |
|---------|--------|
| Every 30 min + startup | Deletes sessions >24h old with no file changes |
| Every 30 min | Keeps max 3 sessions per project, deletes oldest empty ones |
| Session goes idle | Prefixes title with `[IDLE]` or `[WIP]` |
| Session becomes active | Removes status prefix |

### Install

Copy `session-manager.ts` to `~/.config/opencode/plugin/`:

```bash
cp opencode/plugin/session-manager.ts ~/.config/opencode/plugin/
```

### Configuration

Edit the constants at the top of `session-manager.ts`:

```typescript
const IDLE_THRESHOLD_MS = 2 * 60 * 60 * 1000     // 2h — when to mark [IDLE]
const STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000   // 24h — when to auto-delete
const MAX_SESSIONS_PER_PROJECT = 3                 // max sessions kept per project
const AUTO_CLEAN_INTERVAL_MS = 30 * 60 * 1000     // cleanup frequency
```

### Behavior

- Sessions with uncommitted file changes are **never auto-deleted** — only tagged `[WIP]`
- Sessions with no changes older than 24h are auto-deleted
- When you exceed 3 sessions per project, oldest empty sessions are pruned
- Status prefixes are removed automatically when you resume a session

## Notify (`notify.ts`)

Simple audio notification plugin.

- Says "Done" when a session goes idle (task complete)
- Says "Pushed" after `git push` or `gh pr create`
