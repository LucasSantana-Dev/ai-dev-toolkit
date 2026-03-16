# Memory Index

## User
- [User Preferences](user-preferences.md) - Coding style, workflow preferences, tech stack
- Default model: Sonnet (Opus only for complex architecture)
- Prefers lean setup, no bloat, no speculative features
- Commit constantly: after each functional step, commit + push

## Project
- [Project Decisions](project-decisions.md) - Architectural decisions and rationale
- [Stack & Tools](stack-tools.md) - Tech stack, libraries, tooling choices
- TypeScript + React + Node.js + PostgreSQL
- Monorepo with Turborepo, pnpm workspaces

## Feedback
- [Common Mistakes](common-mistakes.md) - Patterns to avoid based on past feedback
- [Quality Standards](quality-standards.md) - Code review criteria and expectations

## References
- [External APIs](external-apis.md) - Third-party service integration details
- [Deployment](deployment.md) - CI/CD pipelines, environments, secrets

## Task Context
- Current sprint: Authentication & API security (TASK-001, TASK-002)
- Known blockers: Database migration for dashboard filters (TASK-003)
- Next up: Rate limiting implementation after auth flow complete
