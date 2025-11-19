# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vite + TypeScript starter project using Rolldown (a Rust-based bundler) as a Vite replacement. The project structure follows the standard Vite template with TypeScript support.

## Key Commands

```bash
# Development
cd vite-project
npm run dev              # Start development server

# Build
npm run build            # TypeScript compilation + production build

# Preview
npm run preview          # Preview production build locally
```

## Project Structure

The application is organized as follows:

- **vite-project/** - Main project directory
  - **src/** - Source code
    - `main.ts` - Application entry point, renders UI and sets up counter
    - `counter.ts` - Counter functionality module
    - `style.css` - Application styles
  - `index.html` - HTML entry point (references /src/main.ts)
  - `tsconfig.json` - TypeScript configuration with strict mode enabled
  - `package.json` - Uses `rolldown-vite@7.2.2` instead of standard Vite

## TypeScript Configuration

The project uses strict TypeScript settings:
- Target: ES2022
- Module: ESNext with bundler resolution
- Strict mode enabled with additional linting rules
- `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch` enforced

## Build Tool

This project uses **Rolldown** (via `rolldown-vite@7.2.2`) instead of standard Vite. Rolldown is a Rust-based bundler that provides a Vite-compatible API. The configuration is specified in package.json overrides.
