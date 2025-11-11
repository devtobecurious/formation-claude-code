---
description: Execute a complete EPCT workflow (Explore, Plan, Code, Test)
argument-hint: [feature description]
allowed-tools: Task, TodoWrite, Read, Edit, Write, Glob, Grep, Bash
---

# EPCT Workflow: $ARGUMENTS

<workflow_overview>
Execute a complete software development workflow following the EPCT methodology:
- **E**xplore the codebase
- **P**lan the implementation
- **C**ode the solution
- **T**est the implementation

Execute all phases sequentially. Do not skip phases.
</workflow_overview>

## Phase 1: Explore

<task>
Understand the codebase context relevant to: $ARGUMENTS
</task>

<instructions>
1. Use the Task tool with `subagent_type=Explore` to investigate:
   - Current architecture and file structure
   - Related existing code and patterns
   - Dependencies and integration points
   - Naming conventions and code style
2. Read relevant files identified during exploration
3. Document your findings clearly:
   - What exists currently
   - Where the changes should be made
   - What patterns to follow
</instructions>

<important_constraints>
- Never make assumptions about code you haven't read
- Always explore even if the task seems simple
- Read actual file contents, do not speculate
</important_constraints>

<expected_output>
After completing exploration, provide:
- Summary of relevant code locations with file paths and line numbers
- Key patterns and conventions found
- Proposed approach based on existing architecture
</expected_output>

## Phase 2: Plan

<task>
Create a detailed, actionable implementation plan based on exploration findings
</task>

<instructions>
1. Use TodoWrite to create a structured task list including:
   - Specific files to create or modify (with absolute paths)
   - Order of implementation (dependencies first)
   - Testing strategy
   - Potential risks or edge cases
2. Break down complex tasks into smaller, manageable steps
3. Include verification steps after implementation
</instructions>

<plan_requirements>
Your plan must specify:
- Exact functions/classes to create or modify
- Data structures and their relationships
- Integration points with existing code
- Test scenarios to cover (including edge cases)
</plan_requirements>

<clarification_protocol>
If requirements are unclear or ambiguous:
- Use AskUserQuestion to clarify requirements
- Ask about architectural preferences
- Confirm assumptions before proceeding to coding
- Do NOT proceed with guesses or assumptions
</clarification_protocol>

<expected_output>
After completing planning:
- Complete todo list with all tasks
- Any clarifications obtained from the user
- Confirmation that plan is ready for implementation
</expected_output>

## Phase 3: Code

<task>
Implement the solution following your plan exactly
</task>

<instructions>
1. Mark each todo as `in_progress` BEFORE starting work on it
2. Implement changes incrementally, one todo at a time
3. Mark each todo as `completed` IMMEDIATELY after finishing it (do not batch completions)
4. Follow existing code patterns and conventions from Phase 1
5. Write clean, maintainable code:
   - Add comments for complex logic
   - Use descriptive variable and function names
   - Follow the project's style guide
</instructions>

<critical_implementation_rules>
- Implement actual solutions, NOT placeholder code
- Complete all logic fully, do not leave TODOs or incomplete sections
- Handle edge cases properly
- Ensure code works for all valid inputs, not just test cases
- If you encounter blockers, create new todos to track them but do NOT mark incomplete work as completed
</critical_implementation_rules>

<security_requirements>
You must avoid these vulnerabilities:
- Command injection
- Cross-Site Scripting (XSS)
- SQL injection
- Unvalidated user inputs
- Hardcoded secrets

If you write insecure code, fix it immediately before proceeding.
</security_requirements>

<expected_output>
After completing coding:
- List of files modified/created with line references (e.g., file.js:25-48)
- Brief description of changes made in each file
- Confirmation that all planned todos are completed
</expected_output>

## Phase 4: Test

<task>
Verify the implementation works correctly and meets all requirements
</task>

<instructions>
1. Run existing tests if applicable:
   ```bash
   npm test
   # or appropriate test command for this project
   ```
2. Test the implementation manually:
   - Verify main functionality works
   - Test edge cases identified in planning
   - Check error handling
   - Test with various inputs
3. If tests fail:
   - Keep the todo `in_progress`, do NOT mark as completed
   - Investigate and fix the issues
   - Re-run tests until passing
4. Use the running application if applicable:
   ```bash
   npm start
   # or npm run dev, or appropriate start command
   ```
</instructions>

<success_criteria>
Mark this phase as complete ONLY when:
- All automated tests pass
- Manual testing confirms feature works as intended
- No regressions in existing functionality
- Code follows project conventions
- Edge cases are handled properly
</success_criteria>

<expected_output>
After completing testing:
- Test results (pass/fail with details)
- Manual testing confirmation
- Confirmation of success or description of remaining issues
- Any follow-up recommendations or concerns
</expected_output>

---

<final_reminder>
- Execute all phases sequentially in order: Explore → Plan → Code → Test
- Use tools proactively (Task, TodoWrite, Read, Edit, Write, Bash)
- Mark todos immediately upon completion, do not batch updates
- Provide clear output after each phase completion
- If stuck or uncertain, use AskUserQuestion rather than guessing
</final_reminder>