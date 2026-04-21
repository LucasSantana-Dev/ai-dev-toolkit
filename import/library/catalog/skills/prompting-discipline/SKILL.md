---
name: prompting-discipline
description: Use this skill for any non-trivial AI coding request. Structure prompts with the Goal/Method/Constraints/Validation blocks so the agent doesn't have to guess intent.
---

# Prompting Discipline

Every non-trivial request carries four blocks:

```
Goal: <one sentence>

Method: <1-3 sentences — which file, which pattern, which layer>

Constraints:
- do NOT <banned approach 1>
- do NOT <banned approach 2>
- keep <existing contract>

Validation:
- run <command>
- check <observable>
```

One-liners ("rename this var") skip the structure. The discipline kicks in when misunderstanding would cost rework.

## When to apply

- You're about to describe a multi-file change.
- The request touches a system the agent hasn't loaded into context yet.
- You've had a prior iteration rejected and are retrying — use the block structure to make the constraints explicit.

## Common failure modes this prevents

- Agent refactors unrelated code because constraints were implicit.
- Agent picks the first plausible library/pattern because the Method was missing.
- Agent reports success without the Validation step, so regressions land silently.
