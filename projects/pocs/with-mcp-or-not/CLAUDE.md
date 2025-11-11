# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Custom Slash Commands

This repository includes two custom slash commands defined in `.claude/commands/`:

### `/epct [feature description]`
Executes a complete software development workflow following the EPCT methodology:
1. **Explore** the codebase using Task tool with subagent_type=Explore
2. **Plan** the implementation using TodoWrite
3. **Code** the solution incrementally
4. **Test** the implementation

Key requirements:
- Never skip phases; execute sequentially
- Use TodoWrite to track progress
- Mark todos as in_progress before starting, completed immediately after finishing
- Use AskUserQuestion for clarifications rather than making assumptions

### `/optimize [file path or code selection]`
Analyzes code for performance issues and implements optimizations:
1. **Performance Analysis**: Identify bottlenecks (algorithmic, memory, I/O, rendering, etc.)
2. **Implementation**: Apply proven optimization techniques with before/after comparisons
3. **Verification**: Measure improvements and document changes

Focus areas: algorithmic complexity, memory usage, I/O operations, bundle size, database queries.

## Feature Development Workflow

When the user requests a new feature, follow this structured workflow to gather requirements and create proper tracking:

### 1. Gather Feature Requirements

Use the `AskUserQuestion` tool to collect the following information:

**Question 1: Feature Name**
- Ask: "What is the name of the feature?"
- Purpose: Clear, concise identifier for the feature

**Question 2: Feature Description**
- Ask: "Please provide a detailed description of the feature. What should it do?"
- Purpose: Comprehensive explanation of the feature's functionality and purpose

**Question 3: Expected Outcomes (Acceptance Criteria)**
- Ask: "What are the expected outcomes and acceptance criteria for this feature?"
- Purpose: Define success criteria and testable requirements
- Examples to guide user:
  - User can perform X action
  - System should respond with Y
  - Feature must handle Z edge case

### 2. Validate and Confirm

Once all information is gathered:
1. Present a summary of the feature to the user:
   ```
   Feature Summary:
   - Name: [feature name]
   - Description: [feature description]
   - Expected Outcomes:
     • [outcome 1]
     • [outcome 2]
     • [outcome 3]
   ```
2. Use `AskUserQuestion` to confirm: "Is this information correct and complete?"
3. If user confirms "yes", proceed to create the GitHub issue
4. If user says "no", ask what needs to be modified and repeat the validation

### 3. Create GitHub Issue

Once validated, use the `gh` command via the Bash tool to create the GitHub issue:

```bash
gh issue create \
  --title "[Feature name]" \
  --body "$(cat <<'EOF'
## Description
[Feature description]

## Expected Outcomes
- [outcome 1]
- [outcome 2]
- [outcome 3]

## Additional Context
Created via Claude Code EPCT workflow
EOF
)"
```

**Important Notes:**
- ALWAYS use the `gh` CLI tool to create GitHub issues (never use web APIs directly)
- Include all gathered information in the issue body
- Use proper markdown formatting in the issue body
- After creating the issue, provide the issue URL to the user

### 4. Proceed with EPCT Workflow

After the GitHub issue is created:
1. Inform the user: "GitHub issue created: [issue URL]"
2. Ask: "Would you like me to start implementing this feature using the EPCT workflow?"
3. If yes, proceed with the `/epct` workflow phases

## Codacy MCP Server Integration

**Critical Rules:**
- After ANY `edit_file` or `reapply` operation, IMMEDIATELY run `codacy_cli_analyze` tool for each edited file
- After installing dependencies or modifying package files, run `codacy_cli_analyze` with `tool: "trivy"` for security scanning
- If Codacy CLI is not installed, ask the user before installing via `codacy_cli_install` tool
- Only send provider/organization/repository parameters if the project is a git repository

**Important Notes:**
- Do NOT run analysis for duplicated code, complexity metrics, or code coverage
- Focus on complexity issues, not metrics
- Never manually install Codacy CLI via brew, npm, or npx
- If a tool returns 404, offer to run `codacy_setup_repository`

## TypeScript Configuration

The TypeScript configuration uses strict settings:
- Target: ES2022
- Module: ESNext with bundler resolution
- Strict mode enabled
- Additional checks: noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch
- No emit (build handled by Vite)

## Git Information

- **Current branch**: master
- **Main branch**: (not configured)
- Repository contains custom commands and is part of a larger training template structure
- always use gh to create issue in github
- always use gh to create pull request