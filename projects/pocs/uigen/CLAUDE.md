# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. It uses Claude AI (via Vercel AI SDK) to generate React components in a virtual file system with real-time preview capabilities. The application can run without an API key using static code fallback.

## Core Commands

### Development
```bash
npm run dev          # Start Next.js dev server with Turbopack
npm run dev:daemon   # Start dev server in background, logs to logs.txt
npm run build        # Build for production
npm start            # Start production server
```

### Database
```bash
npm run setup        # Install deps + generate Prisma client + run migrations
npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma migrate dev  # Create and apply new migration
npm run db:reset     # Reset database (WARNING: deletes all data)
```

### Testing
```bash
npm test            # Run Vitest tests
npm run lint        # Run ESLint
```

### Running Single Tests
```bash
npx vitest run src/lib/__tests__/file-system.test.ts  # Run specific test file
npx vitest run -t "test name"                          # Run tests matching pattern
```

## Architecture

### Virtual File System (VFS)

The core architecture revolves around an in-memory virtual file system that never writes to disk:

- **VirtualFileSystem class** (`src/lib/file-system.ts`): Tree-based file system using Map for children
- **FileSystemContext** (`src/lib/contexts/file-system-context.tsx`): React context providing VFS access throughout the app
- **Serialization**: VFS serializes to JSON for database storage in Project.data field

### AI-Powered Component Generation

The chat interface (`src/app/api/chat/route.ts`) streams responses from Claude using the Vercel AI SDK:

- **Tools**: AI has access to `str_replace_editor` and `file_manager` tools that manipulate the VFS
- **System Prompt**: Located in `src/lib/prompts/generation.tsx`, instructs AI to create React components with `/App.jsx` as entry point
- **Import Alias**: All local imports must use `@/` alias (e.g., `@/components/Button`)
- **Fallback Mode**: Without ANTHROPIC_API_KEY, returns static code instead of AI generation

### JSX Transform & Preview

Components are transformed and previewed using a client-side bundling approach:

- **JSX Transformer** (`src/lib/transform/jsx-transformer.ts`): Uses Babel standalone to transform JSX/TSX to JavaScript
- **Import Maps**: Generates ES Module import maps with blob URLs for transformed code
- **External Deps**: Third-party packages load from esm.sh CDN
- **CSS Handling**: CSS files are collected and injected into preview iframe
- **Preview Frame** (`src/components/preview/PreviewFrame.tsx`): Sandboxed iframe rendering generated HTML with error boundaries

### Authentication & Persistence

- **JWT Auth** (`src/lib/auth.ts`): Simple JWT-based authentication stored in cookies
- **Anonymous Mode**: Users can work without login; work tracked via `anon-work-tracker.ts` for later project creation
- **Database**: SQLite via Prisma with User and Project models
- **Prisma Output**: Custom output path at `src/generated/prisma`
- **Project Storage**: Messages (chat history) and VFS data stored as JSON strings in Project table

### State Management

- **FileSystemContext**: Manages VFS, selected file, and tool call handling
- **ChatContext** (`src/lib/contexts/chat-context.tsx`): Manages chat messages, streaming responses, and AI tool calls
- **Tool Call Sync**: AI tool calls trigger VFS updates which reflect in the UI through context

## Key Patterns

### Tool Integration

When AI makes tool calls, the client-side contexts handle them:

1. AI returns tool call via Vercel AI SDK stream
2. ChatContext receives tool call data
3. FileSystemContext.handleToolCall() executes the operation on VFS
4. UI re-renders with updated file tree and preview

### File Path Handling

- All VFS paths are absolute (start with `/`)
- `@/` alias maps to root directory
- Import resolution supports extensions (.js, .jsx, .ts, .tsx) and without extensions
- Path normalization handles multiple slashes and trailing slashes

### Preview Updates

When files change:
1. VFS updates trigger FileSystemContext refresh
2. Preview component detects file changes
3. JSX transformer regenerates import map with new blob URLs
4. Preview iframe reloads with updated HTML

## Environment Configuration

Required only for AI features:
```
ANTHROPIC_API_KEY=your-api-key  # Optional - app works without it
```

## Path Aliases

TypeScript path mapping in `tsconfig.json`:
- `@/*` → `./src/*`

This maps directly to the VFS root in generated components.

## Testing Strategy

- **Vitest** with jsdom environment for React components
- Tests located in `__tests__` directories next to source files
- File system tests: `src/lib/__tests__/file-system.test.ts`
- Component tests: `src/components/*/__tests__/*.test.tsx`
- Context tests: `src/lib/contexts/__tests__/*.test.tsx`