# Task Breakdown Command

Break down a complex task into trackable atomic actions with hierarchical organization.

## Usage

```
/breakdown <task description>
```

## Examples

```
/breakdown Implement authentication system with JWT
/breakdown Add dark mode support to the blog
/breakdown Migrate from React 18 to React 19
/breakdown Fix performance issues in dashboard
```

## What This Command Does

1. **Analyzes complexity** of the provided task
2. **Decomposes** into hierarchical structure (Plan → Phase → Task → Todo)
3. **Creates TodoWrite** entries for tracking
4. **Saves to Serena memory** for persistence
5. **Provides execution roadmap** with clear milestones

## Complexity Detection

The command automatically assesses:
- **Scope:** file | module | project | system
- **Depth:** simple | moderate | complex | deep
- **Steps:** Number of actions required
- **Files:** How many files affected
- **Domains:** Areas involved (frontend, backend, infra, etc.)

**Breakdown threshold:**
- Score < 0.5: Simple task, minimal breakdown
- Score 0.5-0.7: Moderate, use TodoWrite for tracking
- Score >= 0.7: Complex, full hierarchical breakdown
- Score >= 0.9: Very complex, consider sub-agent delegation

## Output Format

### Simple Task (Score < 0.5)
```
📋 Task: Fix typo in README

Complexity: 0.1 (Simple)
Actions: 2 steps
No breakdown needed

✓ Todo 1: Read README.md
✓ Todo 2: Fix typo and save
```

### Moderate Task (Score 0.5-0.7)
```
📋 Task: Add dark mode toggle

Complexity: 0.6 (Moderate)
TodoWrite tracking enabled

✓ Todo 1: Create ThemeContext
✓ Todo 2: Build toggle component
✓ Todo 3: Add dark mode CSS variables
✓ Todo 4: Integrate into Settings
✓ Todo 5: Test theme switching
✓ Todo 6: Update documentation

Saved to memory: "plan_dark_mode"
```

### Complex Task (Score >= 0.7)
```
📋 Plan: JWT Authentication System

Complexity: 0.95 (Complex)
Estimated: 30+ actions, 15+ files
Full hierarchical breakdown

🎯 Phase 1: Analysis & Design (20% effort)
  📦 Task 1.1: Research existing auth patterns
    ✓ Todo 1.1.1: Search auth files with Grep
    ✓ Todo 1.1.2: Read existing middleware
    ✓ Todo 1.1.3: Document current flow
    ✓ Todo 1.1.4: Identify security gaps

  📦 Task 1.2: Design JWT integration
    ✓ Todo 1.2.1: Research JWT best practices
    ✓ Todo 1.2.2: Design token structure
    ✓ Todo 1.2.3: Plan refresh token flow

🎯 Phase 2: Core Implementation (50% effort)
  📦 Task 2.1: Auth middleware (8 todos)
  📦 Task 2.2: Token management (6 todos)
  📦 Task 2.3: Frontend integration (7 todos)

🎯 Phase 3: Testing & Polish (30% effort)
  📦 Task 3.1: Unit tests (5 todos)
  📦 Task 3.2: E2E tests (4 todos)
  📦 Task 3.3: Documentation (3 todos)

Total: 33 atomic actions
Saved to memory: "plan_auth_jwt"
Ready to execute Phase 1, Task 1.1
```

## Execution Pattern

After breakdown, execute systematically:

1. **Start Phase 1, Task 1:**
   - Mark first todo as `in_progress`
   - Execute action
   - Mark `completed` immediately
   - Move to next todo

2. **At task boundaries:**
   - Save progress to memory: `write_memory("task_1.1_complete", "...")`
   - Think about collected information
   - Update TodoWrite for next task

3. **At phase boundaries:**
   - Save checkpoint: `write_memory("phase_1_complete", "...")`
   - Think about task adherence
   - Review if on track with original plan

4. **Session interruptions:**
   - Checkpoint to memory
   - TodoWrite state preserved automatically
   - Resume with `list_memories()` and `read_memory()`

5. **Before completion:**
   - `think_about_whether_you_are_done()`
   - Validate all todos completed
   - Clean up temporary memory
   - Write final summary

## Tips

### When to Use This Command
- ✅ Starting a new complex feature
- ✅ Unclear how to approach a problem
- ✅ Need to plan before execution
- ✅ Want to track progress systematically
- ✅ Large scope spanning multiple files/domains

### When NOT to Use
- ❌ Simple one-step operations
- ❌ Clear and straightforward tasks
- ❌ Already have a clear plan
- ❌ Single file, single change

### Best Practices
- Provide clear task description
- Include context if available (e.g., "in the blog app", "using TypeScript")
- Specify constraints if any (e.g., "without external libraries")
- Mention preferred approach if you have one

### Integration
- Works with **TodoWrite** for progress tracking
- Works with **Serena memory** for session persistence
- Works with **Sequential MCP** for analysis phases
- Works with **SuperClaude framework** modes

## Related

- `/sc:task` - Execute complex tasks with intelligent workflow
- `/sc:design` - Design system architecture before implementation
- `/sc:workflow` - Generate implementation workflows from PRDs
- `task-breakdown` skill - Auto-activated for complex requests
