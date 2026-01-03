# /compact

Generate a compact state snapshot to reduce context usage before continuing work.

---

## Required Reads

1. `dev/active/CURRENT-WORK.md`
2. `dev/active/TODO.md`

Optional (if quick and helpful): `git status` summary.

---

## Output Format

Return ONLY the following sections:

```markdown
# /compact

## Current Work
- Active task: <one line>
- Current focus: <1-3 bullets>
- Blockers: <0-2 bullets>

## Todos
- <copy todos from dev/active/TODO.md, keep it short>

## Next Action
- <single most valuable next step>
```

---

## Notes

- Keep it short and operational.
- Do not restate long background.
- If CURRENT-WORK.md and TODO.md disagree, treat TODO.md as the live execution list and note the mismatch.
