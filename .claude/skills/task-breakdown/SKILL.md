# Task Breakdown Skill

**Purpose:** Intelligent decomposition of complex tasks into trackable atomic actions with hierarchical organization

**Works With:** TodoWrite tool • Serena memory system • Sequential MCP (for analysis)

---

## Quick Start

When you receive a large or complex task:

1. **Analyze** complexity and scope
2. **Decompose** into hierarchical structure (Plan → Phase → Task → Todo)
3. **Track** with TodoWrite + Serena memory
4. **Execute** systematically with progress updates
5. **Validate** completion and outcomes

---

## Core Principles

### 1. Automatic Complexity Detection

**Triggers for breakdown:**
- Multi-step operations (>3 steps)
- Multiple file/directory scope (>2 dirs OR >5 files)
- Vague requirements needing clarification
- Long-term features requiring phases
- Cross-domain work (frontend + backend + infra)

### 2. SMART Decomposition

Every broken-down task must be:
- **S**pecific: Clear, unambiguous action
- **M**easurable: Observable completion criteria
- **A**chievable: Completable in single session
- **R**elevant: Directly contributes to goal
- **T**rackable: Progress visible via TodoWrite

### 3. Hierarchical Organization

```
📋 Plan (Goal Statement)
  → 🎯 Phase (Major Milestone)
    → 📦 Task (Deliverable Unit)
      → ✓ Todo (Atomic Action)
```

**Hierarchy Rules:**
- **Plan**: Overall objective (1 per major request)
- **Phase**: 2-5 logical stages (analysis, implementation, testing, deployment)
- **Task**: 3-10 specific deliverables per phase
- **Todo**: 5-15 atomic actions per task

---

## Breakdown Methodology

### Step 1: Complexity Analysis

**Assess the task:**

```typescript
interface ComplexityScore {
  scope: 'file' | 'module' | 'project' | 'system'    // How wide?
  depth: 'simple' | 'moderate' | 'complex' | 'deep'  // How deep?
  steps: number                                       // How many actions?
  files: number                                       // How many files?
  domains: string[]                                   // What areas? [frontend, backend, etc]
}

// Complexity threshold:
// score >= 0.7 → Requires breakdown
// score >= 0.9 → Requires sub-agent delegation
```

**Calculation:**
```
complexityScore = (
  scopeWeight * 0.3 +
  depthWeight * 0.2 +
  stepWeight * 0.3 +
  fileWeight * 0.1 +
  domainWeight * 0.1
)

// Examples:
"Fix typo" → 0.1 (no breakdown needed)
"Add dark mode toggle" → 0.6 (moderate, optional breakdown)
"Implement authentication system" → 0.9 (requires breakdown)
"Migrate to microservices" → 1.0 (requires breakdown + delegation)
```

### Step 2: Hierarchical Decomposition

**Plan Level (What & Why):**
```markdown
📋 **Plan:** [Goal statement in user's language]

**Why:** [Business value or problem being solved]
**Success Criteria:** [Observable outcomes]
**Estimated Scope:** [file | module | project | system]
```

**Phase Level (How - Milestones):**
```markdown
🎯 **Phase 1:** [Discovery & Analysis]
- Understand existing system
- Identify requirements
- Define technical approach

🎯 **Phase 2:** [Core Implementation]
- Build foundational components
- Integrate with existing system

🎯 **Phase 3:** [Validation & Polish]
- Testing and quality assurance
- Performance optimization
- Documentation
```

**Task Level (What - Deliverables):**
```markdown
📦 **Task 1.1:** [Analyze existing auth patterns]
- **Input:** Current codebase
- **Output:** Auth pattern documentation
- **Dependencies:** None
- **Estimated Actions:** 5-8 todos

📦 **Task 1.2:** [Design JWT integration approach]
- **Input:** Task 1.1 analysis
- **Output:** Technical design document
- **Dependencies:** Task 1.1
- **Estimated Actions:** 3-5 todos
```

**Todo Level (How - Actions):**
```markdown
✓ **Todo 1.1.1:** Search for auth-related files using Grep
✓ **Todo 1.1.2:** Read existing auth middleware implementation
✓ **Todo 1.1.3:** Document current auth flow in memory
✓ **Todo 1.1.4:** Identify security gaps and improvements
✓ **Todo 1.1.5:** Create auth pattern summary
```

### Step 3: TodoWrite Integration

**Always use TodoWrite for todos:**

```typescript
// Initial breakdown
TodoWrite([
  { content: "Search for auth files", status: "pending", activeForm: "Searching for auth files" },
  { content: "Read existing auth middleware", status: "pending", activeForm: "Reading existing auth middleware" },
  { content: "Document current auth flow", status: "pending", activeForm: "Documenting current auth flow" },
  // ...
])

// During execution - mark in_progress BEFORE starting
TodoWrite([
  { content: "Search for auth files", status: "completed", activeForm: "Searching for auth files" },
  { content: "Read existing auth middleware", status: "in_progress", activeForm: "Reading existing auth middleware" },
  // ...
])

// CRITICAL: Exactly ONE todo in_progress at a time
// Complete current todo IMMEDIATELY after finishing
```

### Step 4: Memory Persistence

**Use Serena memory for context:**

```typescript
// Session start - check existing context
list_memories() → Shows existing work
read_memory("plan_auth_system") → Resume from interruption

// During work - save important decisions
write_memory("plan_auth_system", "Implement JWT authentication with refresh tokens")
write_memory("phase_1_analysis", "Found 3 auth patterns: session, JWT, OAuth")
write_memory("task_1.1_findings", "Current system uses session-based auth")

// Checkpoints every 30 minutes
write_memory("checkpoint_timestamp", { phase: 2, task: 3, progress: "70%" })

// Session end - save state
write_memory("session_summary", "Completed phase 1 analysis, starting phase 2 implementation")
```

---

## Execution Workflow

### Pattern 1: New Task (No Context)

```
1. User: "Implement authentication system"

2. Analyze complexity:
   - Scope: project
   - Depth: complex
   - Steps: ~20+
   - Files: ~10+
   - Domains: [backend, security, frontend]
   - Score: 0.95 → Requires breakdown

3. Create hierarchical plan:
   📋 Plan: JWT authentication system

   🎯 Phase 1: Analysis (2-3 hours)
     📦 Task 1.1: Analyze existing patterns → 5 todos
     📦 Task 1.2: Design approach → 3 todos

   🎯 Phase 2: Implementation (5-8 hours)
     📦 Task 2.1: Auth middleware → 8 todos
     📦 Task 2.2: Token management → 6 todos
     📦 Task 2.3: Frontend integration → 7 todos

   🎯 Phase 3: Testing (2-3 hours)
     📦 Task 3.1: Unit tests → 5 todos
     📦 Task 3.2: E2E tests → 4 todos

4. Write to memory:
   write_memory("plan_auth", "JWT authentication system")
   write_memory("phase_1", "Analysis and design phase")

5. Initialize TodoWrite with Phase 1 todos:
   TodoWrite([
     { content: "Search auth patterns with Grep", status: "in_progress", ... },
     { content: "Read existing middleware", status: "pending", ... },
     // ... 5 todos for Task 1.1
   ])

6. Execute systematically:
   - Mark in_progress BEFORE starting
   - Complete IMMEDIATELY after finishing
   - Update memory at task boundaries
   - Checkpoint every 30min

7. Session end:
   write_memory("session_summary", "Phase 1 complete, ready for Phase 2")
```

### Pattern 2: Resume Interrupted Work

```
1. User: "Continue with authentication"

2. Check memory:
   list_memories() → ["plan_auth", "phase_1", "checkpoint_last"]
   read_memory("plan_auth") → "JWT authentication system"
   read_memory("checkpoint_last") → { phase: 2, task: 1, progress: "40%" }

3. Think about collected information:
   think_about_collected_information()
   → "Phase 1 complete, Phase 2 Task 1 at 40%"

4. Resume from checkpoint:
   - Load existing TodoWrite state
   - Continue with next pending todo
   - Update memory as you progress

5. Validate adherence:
   think_about_task_adherence()
   → "Still on track with original plan"
```

### Pattern 3: Completion Validation

```
1. Think about whether done:
   think_about_whether_you_are_done()
   → "All phases complete? All tests passing? Documentation written?"

2. Final validation:
   - ✅ All todos completed
   - ✅ Tests passing
   - ✅ Build succeeding
   - ✅ Documentation updated
   - ✅ No blockers remaining

3. Memory cleanup:
   delete_memory("checkpoint_*") → Remove temporary states
   write_memory("outcome_auth", "JWT auth system complete with 95% test coverage")

4. Summary for user:
   - What was accomplished
   - Key decisions made
   - Any follow-up items
```

---

## Breakdown Templates

### Template 1: Feature Implementation

```markdown
📋 **Plan:** [Feature name and description]

🎯 **Phase 1: Discovery** (20% of effort)
  📦 Task 1.1: Research existing patterns
  📦 Task 1.2: Define requirements
  📦 Task 1.3: Design technical approach

🎯 **Phase 2: Core Implementation** (50% of effort)
  📦 Task 2.1: Backend API
  📦 Task 2.2: Database schema
  📦 Task 2.3: Frontend UI
  📦 Task 2.4: Integration

🎯 **Phase 3: Quality** (30% of effort)
  📦 Task 3.1: Unit tests
  📦 Task 3.2: Integration tests
  📦 Task 3.3: Performance optimization
  📦 Task 3.4: Documentation
```

### Template 2: Bug Fix / Investigation

```markdown
📋 **Plan:** [Bug description and expected behavior]

🎯 **Phase 1: Investigation** (40% of effort)
  📦 Task 1.1: Reproduce issue
  📦 Task 1.2: Analyze error logs
  📦 Task 1.3: Identify root cause

🎯 **Phase 2: Fix** (40% of effort)
  📦 Task 2.1: Implement fix
  📦 Task 2.2: Add regression test
  📦 Task 2.3: Verify fix works

🎯 **Phase 3: Validation** (20% of effort)
  📦 Task 3.1: Test edge cases
  📦 Task 3.2: Code review
  📦 Task 3.3: Deploy and monitor
```

### Template 3: Refactoring / Optimization

```markdown
📋 **Plan:** [What to refactor and why]

🎯 **Phase 1: Analysis** (30% of effort)
  📦 Task 1.1: Measure current state
  📦 Task 1.2: Identify bottlenecks
  📦 Task 1.3: Design improvement approach

🎯 **Phase 2: Refactoring** (50% of effort)
  📦 Task 2.1: Extract reusable components
  📦 Task 2.2: Optimize critical paths
  📦 Task 2.3: Update tests
  📦 Task 2.4: Verify no regressions

🎯 **Phase 3: Measurement** (20% of effort)
  📦 Task 3.1: Benchmark improvements
  📦 Task 3.2: Update documentation
  📦 Task 3.3: Monitor production
```

### Template 4: Migration / Upgrade

```markdown
📋 **Plan:** [What to migrate and target version]

🎯 **Phase 1: Preparation** (25% of effort)
  📦 Task 1.1: Review migration guide
  📦 Task 1.2: Identify breaking changes
  📦 Task 1.3: Plan migration strategy

🎯 **Phase 2: Incremental Migration** (60% of effort)
  📦 Task 2.1: Update dependencies
  📦 Task 2.2: Fix breaking changes (module 1)
  📦 Task 2.3: Fix breaking changes (module 2)
  📦 Task 2.4: Update configuration
  📦 Task 2.5: Verify all tests pass

🎯 **Phase 3: Validation** (15% of effort)
  📦 Task 3.1: E2E testing
  📦 Task 3.2: Performance comparison
  📦 Task 3.3: Update documentation
```

---

## Advanced Patterns

### Pattern 1: Parallel Execution Identification

**During planning, identify parallelizable tasks:**

```markdown
🎯 **Phase 2: Implementation**

  📦 **Parallel Group A** (can run simultaneously):
    - Task 2.1: Backend API (independent)
    - Task 2.2: Frontend UI (independent)
    - Task 2.3: Database schema (independent)

  📦 **Sequential Group B** (must run after Group A):
    - Task 2.4: Integration (depends on 2.1, 2.2, 2.3)
    - Task 2.5: E2E tests (depends on 2.4)
```

**TodoWrite for parallel execution:**
```typescript
// Mark multiple todos as in_progress simultaneously
// when they are truly independent
TodoWrite([
  { content: "Implement backend API", status: "in_progress", activeForm: "Implementing backend API" },
  { content: "Build frontend UI", status: "in_progress", activeForm: "Building frontend UI" },
  { content: "Create database schema", status: "in_progress", activeForm: "Creating database schema" },
  // Other todos remain pending
])

// This signals parallel work to user
// Complete each as it finishes
```

### Pattern 2: Adaptive Breakdown

**Adjust breakdown as you learn:**

```markdown
Initial Plan:
  🎯 Phase 2: Implementation (5 tasks estimated)

After Task 2.1 discovery:
  🎯 Phase 2: Implementation (8 tasks - adjusted)
    📦 Task 2.1: Core logic ✅ (completed)
    📦 Task 2.2: Error handling (new - discovered during 2.1)
    📦 Task 2.3: Validation layer (new - discovered during 2.1)
    📦 Task 2.4: Integration (original 2.2)
    // ...

Memory update:
  write_memory("phase_2_adjustment", "Added 3 tasks after discovering complexity in Task 2.1")
```

### Pattern 3: Blocker Management

**When blocked:**

```markdown
Current todo: "Integrate with external API"
Status: Blocked (API credentials not available)

Actions:
1. Mark current todo as blocked:
   TodoWrite([
     { content: "Integrate with external API (BLOCKED: awaiting credentials)", status: "pending", ... }
   ])

2. Create blocker todo:
   TodoWrite([
     { content: "Request API credentials from user", status: "in_progress", ... }
   ])

3. Update memory:
   write_memory("blocker_api_creds", "Cannot proceed with API integration until credentials provided")

4. Ask user:
   AskUserQuestion("I need API credentials to continue. Where can I find them?")

5. Work on alternative tasks while blocked
```

---

## Quality Checklist

### Breakdown Quality
- [ ] Every todo is a single, atomic action
- [ ] Each todo has clear completion criteria
- [ ] Todos are properly sequenced (dependencies clear)
- [ ] Parallelizable tasks identified
- [ ] Estimated total todos: 10-50 (if more, consider phases)
- [ ] Each todo is achievable in 5-15 minutes

### Tracking Quality
- [ ] TodoWrite used from the start
- [ ] Exactly ONE todo marked in_progress at a time
- [ ] Todos marked completed IMMEDIATELY after finishing
- [ ] Memory checkpoints every 30 minutes
- [ ] Blocker todos created when stuck
- [ ] Phase transitions documented in memory

### Completion Quality
- [ ] think_about_whether_you_are_done() called before claiming done
- [ ] All todos completed (or explicitly deferred)
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Memory cleaned up (temporary states removed)
- [ ] Final outcome summary written to memory

---

## Examples

### Example 1: Simple Task (No Breakdown Needed)

```
User: "Fix typo in README"

Analysis:
- Scope: file
- Depth: simple
- Steps: 2
- Files: 1
- Complexity: 0.1

Decision: No breakdown needed

Action: Read README → Edit typo → Done
```

### Example 2: Moderate Task (Optional Breakdown)

```
User: "Add dark mode toggle to settings"

Analysis:
- Scope: module
- Depth: moderate
- Steps: 6-8
- Files: 3-4
- Complexity: 0.6

Decision: Use TodoWrite for tracking, but no phases

TodoWrite([
  { content: "Create ThemeContext", status: "in_progress", ... },
  { content: "Build toggle component", status: "pending", ... },
  { content: "Add dark mode CSS variables", status: "pending", ... },
  { content: "Integrate toggle in Settings", status: "pending", ... },
  { content: "Test theme switching", status: "pending", ... },
  { content: "Update documentation", status: "pending", ... }
])
```

### Example 3: Complex Task (Full Breakdown)

```
User: "Implement full authentication system with JWT"

Analysis:
- Scope: project
- Depth: complex
- Steps: 25+
- Files: 15+
- Complexity: 0.95

Decision: Full hierarchical breakdown

📋 Plan: JWT Authentication System
write_memory("plan_auth_jwt", "Complete JWT auth with refresh tokens")

🎯 Phase 1: Analysis & Design
  📦 Task 1.1: Research existing auth patterns
    ✓ Todo: Search auth files with Grep
    ✓ Todo: Read existing middleware
    ✓ Todo: Document current flow
    ✓ Todo: Identify gaps

  📦 Task 1.2: Design JWT integration
    ✓ Todo: Research JWT best practices with Context7
    ✓ Todo: Design token structure
    ✓ Todo: Plan refresh token flow
    ✓ Todo: Security review

🎯 Phase 2: Implementation
  [15+ todos across 3-4 tasks]

🎯 Phase 3: Testing & Documentation
  [8+ todos across 2-3 tasks]

Total: ~30 todos organized hierarchically
Execution: Systematic, phase by phase
Tracking: TodoWrite + Serena memory
```

---

## Tips & Best Practices

### Do's ✅
- Always analyze complexity before starting
- Break down to atomic actions (single tool call or simple operation)
- Use TodoWrite from the beginning for >3 steps
- Mark todos completed IMMEDIATELY after finishing
- Write to memory at phase boundaries and checkpoints
- Identify parallel execution opportunities during planning
- Ask user for clarification on vague requirements
- Adapt breakdown as you learn more
- Create blocker todos when stuck

### Don'ts ❌
- Don't skip complexity analysis
- Don't create vague todos like "implement feature"
- Don't mark multiple todos as in_progress (except true parallelism)
- Don't batch complete todos - complete as you go
- Don't skip memory checkpoints (every 30min)
- Don't guess user requirements - ask questions
- Don't claim done without validation
- Don't leave temporary memory states at session end

### Common Pitfalls
1. **Too coarse:** "Build auth system" → Break into 5+ specific actions
2. **Too fine:** "Type character 'i'" → Combine into meaningful actions
3. **Wrong order:** Dependencies not clear → Sequence properly
4. **Missing validation:** No completion criteria → Add observable outcomes
5. **No checkpoints:** Long work without saves → Risk losing progress

---

## Integration with SuperClaude Framework

### Works With Other Modes
- **Brainstorming Mode:** Use before breakdown when requirements unclear
- **Task Management Mode:** This skill implements task management patterns
- **Introspection Mode:** Use think tools during breakdown and execution
- **Token Efficiency Mode:** Use compressed format for status updates

### Works With MCP Servers
- **Sequential MCP:** For complex analysis during planning phase
- **Serena MCP:** For memory persistence and session management
- **Context7 MCP:** For research during analysis phase
- **Morphllm MCP:** For bulk edits identified during breakdown

---

## Summary

✅ **Automatic complexity detection** → breakdown when score >= 0.7
✅ **Hierarchical organization** → Plan → Phase → Task → Todo
✅ **SMART decomposition** → Specific, Measurable, Achievable, Relevant, Trackable
✅ **TodoWrite integration** → Track progress systematically
✅ **Serena memory persistence** → Resume from interruptions
✅ **Parallel execution identification** → Optimize execution time
✅ **Adaptive breakdown** → Adjust as you learn
✅ **Blocker management** → Handle obstacles systematically
✅ **Completion validation** → Always verify before claiming done

**Core Pattern:**
```
Analyze → Decompose → Track → Execute → Validate
```
