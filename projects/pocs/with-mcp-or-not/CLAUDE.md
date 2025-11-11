# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<core_working_principles>

<investigation_first>
Read and inspect actual code files before answering questions or making changes. Never speculate about code structure, existing patterns, or functionality without opening and reading the relevant files.

Why: This prevents hallucinations and ensures accurate, grounded responses based on real code.
</investigation_first>

<action_oriented_by_default>
By default, implement changes rather than only suggesting them. When the user asks to improve, fix, or change something, execute the actual implementation. If intent is unclear, infer the most useful likely action and proceed with it.

Why: Claude 4.5 defaults toward suggestions, but in this repository we want direct implementation for faster development cycles.
</action_oriented_by_default>

<parallel_tool_execution>
Maximize efficiency by calling independent tools simultaneously in a single message rather than sequentially. For example, run multiple file reads, multiple searches, or multiple bash commands in parallel when they don't depend on each other. Only execute tools sequentially when one depends on the output of another.

Why: Parallel execution significantly reduces latency and improves overall productivity.
</parallel_tool_execution>

<communicate_progress>
After completing a task that involves tool use, provide a concise summary of the work you've done. Include file paths with line numbers (e.g., `main.ts:45-67`) for code changes.

Why: This gives the user visibility into what was accomplished without requiring them to ask.
</communicate_progress>

<context_window_management>
Your context window will be automatically compacted, allowing continued work indefinitely. Do not stop tasks early due to token concerns. Use git logs as checkpoints to understand project history. Leverage the filesystem to discover state by reviewing key files when context is cleared.

Why: The system handles context automatically, so you can focus on completing tasks fully rather than worrying about token limits.
</context_window_management>

<implement_general_solutions>
Write production-quality code that handles all valid inputs, not just test cases. Avoid hard-coding values to pass specific tests. Implement complete, general solutions that handle edge cases properly.

Why: Test-specific implementations create technical debt and don't reflect real-world usage.
</implement_general_solutions>

</core_working_principles>

## Project Overview

This is a training/POC repository containing a sample TypeScript + Vite application (`kill-the-bugs`) used for demonstrating Claude Code workflows and MCP (Model Context Protocol) integration.

## Project Structure

```
with-mcp-or-not/
├── .claude/                    # Claude Code configuration
│   ├── commands/              # Custom slash commands
│   │   ├── epct.md           # EPCT workflow (Explore, Plan, Code, Test)
│   │   └── optimize.md       # Code optimization workflow
│   └── settings.local.json   # Local Claude settings
└── kill-the-bugs/            # Sample Vite + TypeScript application
    ├── src/
    │   ├── main.ts          # Application entry point
    │   ├── counter.ts       # Counter functionality
    │   ├── style.css        # Application styles
    │   └── typescript.svg   # TypeScript logo
    ├── index.html           # HTML entry point
    ├── package.json         # Dependencies (uses rolldown-vite)
    ├── tsconfig.json        # TypeScript configuration
    └── node_modules/        # Dependencies
```

## Development Commands

### kill-the-bugs Application

Navigate to the `kill-the-bugs` directory and run:

```bash
# Start development server
npm run dev

# Build for production (runs TypeScript compiler + Vite build)
npm run build

# Preview production build
npm run preview
```

## Technology Stack

- **Build Tool**: Vite (using rolldown-vite variant @ 7.2.2)
- **Language**: TypeScript 5.9.3
- **Module System**: ESNext with bundler resolution
- **TypeScript Config**: Strict mode enabled with comprehensive linting rules

<custom_slash_commands>
This repository includes two custom slash commands defined in `.claude/commands/`:

<epct_command>
Command: /epct [feature description]

Purpose: Executes a complete software development workflow following the EPCT methodology. Create a fully-featured implementation that goes beyond the basics. Include as many relevant features and interactions as possible.

<phases>
Execute these phases sequentially:

<explore>
Use Task tool with subagent_type=Explore to investigate the codebase. Read actual files to understand patterns. Never speculate about code you haven't opened.

Why: Understanding existing patterns prevents inconsistencies and helps integrate new features seamlessly.
</explore>

<plan>
Use TodoWrite to create structured tasks. Break complex features into incremental steps. Use AskUserQuestion to clarify ambiguities before coding.

Why: Planning prevents rework and ensures all requirements are understood before implementation begins.
</plan>

<code>
Implement the complete solution incrementally. Mark each todo as in_progress immediately before starting work on it, then mark it completed immediately after finishing (do not batch completions). Implement actual functionality, not placeholders or TODOs.

Why: Incremental implementation with immediate status updates provides clear progress tracking and reduces errors.
</code>

<test>
Run automated tests and manually verify functionality. Fix any issues before marking the phase complete.

Why: Testing catches bugs early when they're easiest to fix and ensures the feature works as intended.
</test>
</phases>

<state_tracking>
Use TodoWrite throughout to track progress. This helps manage multi-context windows and provides visibility into ongoing work. Use git commits as checkpoints to preserve state.
</state_tracking>
</epct_command>

<optimize_command>
Command: /optimize [file path or code selection]

Purpose: Analyzes code for performance bottlenecks and implements concrete optimizations. Measure performance before and after changes to quantify improvements.

<phases>
<performance_analysis>
Read the target code and identify actual bottlenecks in these areas: algorithmic complexity (O(n²) → O(n log n)), memory allocations, I/O operations, database queries, bundle size, rendering performance. Use profiling tools when available.

Why: Measuring identifies real bottlenecks rather than theoretical ones, ensuring optimization efforts provide meaningful value.
</performance_analysis>

<implementation>
Apply proven optimization techniques: caching/memoization, lazy loading, debouncing/throttling, better algorithms, efficient data structures (Map/Set over arrays), code splitting. Preserve existing functionality while implementing actual performance improvements.

Why: Proven techniques reduce risk while delivering measurable improvements without breaking existing functionality.
</implementation>

<verification>
Run existing tests to ensure no regressions. Benchmark the improvements with concrete metrics (e.g., "reduced execution time from 500ms to 50ms"). Document the changes and trade-offs.

Why: Verification ensures optimizations actually improve performance without introducing bugs or regressions.
</verification>
</phases>
</optimize_command>

</custom_slash_commands>

<feature_development_workflow>
When the user requests a new feature, execute this structured workflow to gather complete requirements before implementation.

Why: This ensures proper tracking and clear success criteria before any code is written.

<gather_requirements>
Use the `AskUserQuestion` tool to collect three specific pieces of information:

<required_information>
1. Feature Name - Ask: "What is the name of the feature?"
   Why: Provides a clear identifier for tracking and communication.

2. Feature Description - Ask: "Please provide a detailed description of the feature. What should it do? Include specific behaviors and user interactions."
   Why: Defines the complete functionality and scope.

3. Expected Outcomes - Ask: "What are the expected outcomes and acceptance criteria for this feature? List specific, testable requirements (e.g., 'User can perform X action', 'System responds with Y', 'Feature handles Z edge case')."
   Why: Establishes measurable success criteria that can be verified during testing.
</required_information>
</gather_requirements>

<validate_requirements>
Present a formatted summary to the user for confirmation:

```
Feature Summary:
- Name: [exact feature name provided]
- Description: [complete description provided]
- Expected Outcomes:
  • [outcome 1 - specific and testable]
  • [outcome 2 - specific and testable]
  • [outcome 3 - specific and testable]
```

Use `AskUserQuestion` to confirm: "Is this information correct and complete? I'll create a GitHub issue with these details."

If the user confirms, proceed to create the issue. If the user requests changes, ask what needs to be modified and repeat the validation.

Why: Validation prevents misunderstandings and ensures everyone agrees on what will be built before work begins.
</validate_requirements>

<create_github_issue>
Execute this bash command to create the GitHub issue using the `gh` CLI:

```bash
gh issue create \
  --title "[Feature name]" \
  --body "$(cat <<'EOF'
## Description
[Complete feature description]

## Expected Outcomes
- [Specific testable outcome 1]
- [Specific testable outcome 2]
- [Specific testable outcome 3]

## Additional Context
Created via Claude Code EPCT workflow
EOF
)"
```

After creating the issue, provide the issue URL to the user in your response.

Why: The `gh` command-line tool provides direct GitHub integration and is the standard tool in this repository for all GitHub operations (issues and pull requests). This ensures consistent workflow and proper authentication.
</create_github_issue>

<proceed_with_implementation>
After creating the GitHub issue:
1. Show the user: "GitHub issue created: [issue URL]"
2. Ask: "Would you like me to start implementing this feature using the EPCT workflow?"
3. If the user confirms, execute the `/epct` workflow phases with the gathered requirements.

Why: Asking for confirmation ensures the user is ready to proceed and hasn't changed their mind after seeing the formalized requirements.
</proceed_with_implementation>

</feature_development_workflow>

<codacy_mcp_integration>
This repository uses Codacy's MCP Server for automated code quality and security analysis.

Why: The integration catches issues immediately after code changes, preventing them from being committed and making fixes easier and faster.

<analyze_after_file_edits>
Immediately after ANY `edit_file` or `reapply` operation, run the `codacy_cli_analyze` tool for each edited file with these parameters:
- `rootPath`: set to the workspace path
- `file`: set to the path of the edited file
- `tool`: leave empty or unset

Why: This catches code quality issues, bugs, and style violations in newly edited code before they're committed, when fixes are easiest and fastest to implement.
</analyze_after_file_edits>

<security_scan_after_dependencies>
Immediately after installing dependencies or modifying package files (package.json, requirements.txt, pom.xml, build.gradle), run `codacy_cli_analyze` with:
- `rootPath`: set to the workspace path
- `tool`: set to "trivy"
- `file`: leave empty or unset

If vulnerabilities are found, stop all other operations, propose fixes, and only continue after security issues are resolved.

Why: This identifies security vulnerabilities in newly added dependencies before they're committed. Security issues should block further work until resolved to prevent introducing known vulnerabilities into production.
</security_scan_after_dependencies>

<handle_missing_cli>
If `codacy_cli_analyze` fails because Codacy CLI is not installed, ask: "Codacy CLI is not installed. Would you like me to install it now?" Wait for the user's response. If they confirm, run the `codacy_cli_install` tool. If they decline, inform them they can disable automatic analysis in extension settings.

Why: Never install tools without explicit permission, as this could affect the user's development environment and system configuration.
</handle_missing_cli>

<repository_parameters>
Only send `provider`, `organization`, and `repository` parameters to Codacy tools if the project is a git repository with remote configured.

Why: These parameters are only relevant for projects tracked in remote repositories and will cause errors for local-only projects.
</repository_parameters>

<analysis_scope>
Run analysis for code quality issues, security vulnerabilities, and complexity issues. Do not run analysis specifically looking for changes in: duplicated code detection, complexity metrics, or code coverage percentages.

Why: These metrics are tracked separately and shouldn't block immediate code quality checks. They're informational rather than actionable blockers.
</analysis_scope>

<handle_404_errors>
If a Codacy tool returns a 404 error related to repository or organization parameters, offer to run `codacy_setup_repository` to add the repository to Codacy. Wait for user confirmation before executing.

Why: The repository may not be configured in Codacy yet, and setup requires user authorization and proper access permissions.
</handle_404_errors>

</codacy_mcp_integration>

## TypeScript Configuration

The TypeScript configuration uses strict settings:
- Target: ES2022
- Module: ESNext with bundler resolution
- Strict mode enabled
- Additional checks: noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch
- No emit (build handled by Vite)

<github_integration>

<use_gh_cli>
Execute all GitHub operations (creating issues, creating pull requests, managing repositories) using the `gh` command-line tool via the Bash tool. Never use GitHub web APIs or other methods directly.

Why: The `gh` CLI is the standard tool in this repository, providing proper authentication, consistent workflow, and better error handling than manual API calls.

<creating_issues>
```bash
gh issue create --title "Issue title" --body "Issue description"
```
</creating_issues>

<creating_pull_requests>
```bash
gh pr create --title "PR title" --body "PR description"
```
</creating_pull_requests>
</use_gh_cli>

<repository_information>
- Current branch: master
- Main branch: (not configured - use master for pull requests if needed)
- Repository is part of a larger training template structure
</repository_information>

<git_history_as_context>
Use `git log` to understand project history and recent changes when context is cleared. Git commits serve as checkpoints for understanding what work has been done.

Why: Git history provides a reliable record of changes and helps reconstruct project state after context window compaction.
</git_history_as_context>

</github_integration>

<state_tracking_and_progress_management>

<structured_formats_for_state>
- Use JSON format for discrete information like test results and configuration
- Use freeform text for progress notes and explanations
- Use TodoWrite for tracking task lists and implementation progress
- Use git commits as permanent checkpoints

Why: Different formats serve different purposes - JSON for machine-readable data, text for human context, TodoWrite for active tasks, git for permanent history.
</structured_formats_for_state>

<incremental_progress>
Break large tasks into smaller, incremental steps. Complete and verify each step before moving to the next.

Why: This makes progress easier to track across context windows and reduces the risk of errors by catching issues early when they're localized to a small change.
</incremental_progress>

<reflect_after_tool_execution>
After receiving tool results (especially file reads, searches, or command outputs), take a moment to reflect on the quality of the results and determine the optimal next steps before proceeding.

Why: This prevents rushing into incorrect implementations based on misunderstood information and ensures decisions are based on accurate understanding.
</reflect_after_tool_execution>

<context_window_awareness>
Your context window will be automatically compacted when needed, allowing indefinite continued work. When context is cleared, discover the current state by:
1. Reading key files (package.json, tsconfig.json, recent source files)
2. Checking git log for recent commits and work history
3. Reviewing TodoWrite state if tasks are in progress
4. Reading test output or build logs to understand current status

Do not stop tasks early due to token concerns - the system will manage context automatically.

Why: Automatic context management means you can focus on completing tasks fully rather than prematurely stopping due to perceived token limits. The system handles compaction transparently.
</context_window_awareness>

</state_tracking_and_progress_management>