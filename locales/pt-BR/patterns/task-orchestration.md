# Task Orchestration

> Stop being the scheduler. Define the work, let the machine manage the queue.

## The Problem

You have 5 projects, each with a session. You open each one, paste "continue with next priorities", wait, switch, repeat. You're acting as a human cron job.

## The Pattern

Separate **planning** from **execution**:

1. **Plan once** — Analyze all projects, identify highest-value work, create a prioritized backlog
2. **Dispatch automatically** — A background process picks the next task, creates a session, sends the prompt
3. **Monitor completion** — When a session goes idle with all tasks done, mark complete and dispatch next
4. **Chain work** — Sequential tasks promote automatically when predecessors complete

### Task Lifecycle

```
backlog → ready → in_progress → done
                       ↓
                    blocked
```

- **backlog**: Planned but waiting (dependencies, sequencing)
- **ready**: Can be dispatched immediately
- **in_progress**: Assigned to a session, agent is working
- **done**: Work complete, verified
- **blocked**: Something went wrong, needs human attention

### Task Schema (Tool-Agnostic)

```json
{
  "id": "unique-id",
  "title": "Short description",
  "description": "Detailed instructions for the agent",
  "directory": "/path/to/project",
  "priority": "critical | high | medium | low",
  "status": "backlog | ready | in_progress | done | blocked",
  "tags": ["security", "api", "frontend"],
  "dependsOn": ["other-task-id"],
  "createdAt": 1710000000000,
  "updatedAt": 1710000000000
}
```

### Good Task Descriptions

**Bad**: "Fix the auth bug"

**Good**:
```
Fix the session timeout race condition in auth/middleware.ts.

The bug: when two requests arrive within 50ms of session expiry,
both pass the `isValid()` check but the first one triggers a refresh
that invalidates the second.

Fix: add a mutex around the refresh logic, or use optimistic locking
on the session version field.

Test: the existing test in auth/middleware.test.ts covers the happy
path but not the race. Add a concurrent request test.
```

### Task Sizing

Break work into **5-20 minute tasks**. This:
- Gives the agent a clear finish line
- Produces frequent commits (rollback points)
- Enables parallel execution across sessions
- Makes progress visible

### Concurrency Control

Run at most 2-3 tasks simultaneously:
- More than that and you can't review the output
- Context switches between reviewing too many sessions is worse than serial execution
- Machine resources (CPU, API rate limits) become bottlenecks

## How to Plan

### Automated Planning

The agent itself is the best planner. Give it access to:
- Git status and recent log
- Open PRs and issues
- CHANGELOG.md (what's released vs unreleased)
- CLAUDE.md / AGENTS.md (project conventions)

Then ask: "What are the highest-value tasks right now?"

### Priority Framework

| Priority | Criteria | Examples |
|----------|----------|---------|
| Critical | Blocks other work or users | Broken CI, security vulnerability |
| High | High user/business value, ready to ship | Feature completion, bug fix |
| Medium | Improves quality or DX | Refactoring, test coverage, docs |
| Low | Nice to have | Code cleanup, dependency updates |

## Implementation

### Any Tool

The pattern works with any task tracking:
- **JSON file** on disk (simplest)
- **GitHub Issues** as backlog (collaborative)
- **Linear/Jira** (team scale)

The dispatch mechanism varies by tool:
- **OpenCode**: Plugin with `session.create` + `session.promptAsync`
- **Claude Code**: Shell script that launches `claude --session-id`
- **Cursor**: Workspace automation with tasks.json
- **Manual**: A checklist you work through (still better than ad-hoc)

### Reference Implementation

See: [`implementations/opencode/plugin/orchestrator.ts`](../implementations/opencode/plugin/orchestrator.ts)
