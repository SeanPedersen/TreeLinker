# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Tree Linker?

A Chrome/Edge browser extension (Manifest V3) that visualizes and manages open tabs as a tree structure. Built with React 18 + TypeScript, using jQuery Fancytree for the tree UI and Dexie (IndexedDB) for persistence.

## Commands

```bash
pnpm start          # Dev server with HMR (Vite, Chrome target)
pnpm start:edge     # Dev server (Edge target)
pnpm build          # Production build (Chrome)
pnpm build-edge     # Production build (Edge)
pnpm lint           # ESLint + Stylelint
pnpm lint:es        # ESLint only (.ts/.tsx/.js)
pnpm lint:style     # Stylelint only (.css/.less/.scss)
pnpm test-ext       # Jest unit tests
pnpm clean          # Remove build artifacts (extension/ dir)
pnpm package        # Package for distribution
```

Requires Node v22+ (see `.nvmrc`). Package manager is **pnpm** (enforced).

## Architecture

### Extension entry points + background service worker

| Entry | Path | Description |
|-------|------|-------------|
| **Background** | `src/background/index.ts` | Service worker — listens to tab/window events, no React |
| **Tree** (main UI) | `src/tree/index.tsx` | Side Panel — primary tree view for tab management |
| **Popup** | `src/popup/index.tsx` | Extension icon click action (minimal) |

### Data flow

1. Background service worker captures browser tab/window events
2. Messages sent to tree UI via `@garinz/webext-bridge`
3. Fancytree instance updates the tree view
4. Changes persisted to IndexedDB via Dexie (`src/storage/idb.ts`)
5. Settings propagated via React Context (`src/tree/context.ts`)

### Key technology choices

- **Fancytree (jQuery)** wraps the tree UI — React wrapper at `src/tree/features/tab-master-tree/`
- **Dexie/IndexedDB** for persistence instead of Redux — tree snapshots need storage anyway
- **Vite 8** with `@crxjs/vite-plugin` for extension bundling, manifest generation, and HMR
- **Ant Design 5** for UI components
- **Firebase** for user auth and data sync

### Feature modules

Features are organized under `src/tree/features/` — each is self-contained:
- `tab-master-tree/` — core tree logic, node renderers, plugins, templates
- `search/`, `settings/`, `operation-bar/`, `shortcuts/`, `tutorial/`, `help/`, `login/`

### Build system

Vite 8 + CRXJS plugin:
- `vite.config.ts` — single build config (replaces old `server/` webpack pipeline)
- `src/manifest.ts` — manifest definition consumed by CRXJS (uses source file paths)
- HTML entry points live alongside their TSX entries (e.g., `src/tree/tree.html`)

Global defines available in code: `__ENV__`, `__VERSION__`, `__TARGET__`.

### Path alias

`@/*` maps to `src/*` (configured in tsconfig.json and vite.config.ts).

## Code style

- TypeScript strict mode with decorators enabled
- JSX transform: `react-jsx` (no `import React` needed)
- jQuery is set up globally via `src/jquery-global.ts` (imported at top of entry points that need it)
- Prettier config: `@yutengjing/prettier-config`
- ESLint config: `@yutengjing/eslint-config-react`
