# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Link Map?

A Chrome/Edge browser extension (Manifest V3) that visualizes and manages open tabs as a tree structure. Built with React 18 + TypeScript, using jQuery Fancytree for the tree UI and Dexie (IndexedDB) for persistence.

## Commands

```bash
pnpm start          # Dev server with HMR (Express + Webpack, Chrome target)
pnpm build          # Production build (Chrome)
pnpm build-edge     # Production build (Edge)
pnpm lint           # ESLint + Stylelint
pnpm lint:es        # ESLint only (.ts/.tsx/.js)
pnpm lint:style     # Stylelint only (.css/.less/.scss)
pnpm test-ext       # Jest unit tests
pnpm clean          # Remove build artifacts (extension/ dir)
pnpm package        # Package for distribution
```

Requires Node v18.12.1 (see `.nvmrc`). Package manager is **pnpm** (enforced).

## Architecture

### Multi-page extension with 4 entry points + background service worker

| Entry | Path | Description |
|-------|------|-------------|
| **Background** | `src/background/index.ts` | Service worker — listens to tab/window events, no React |
| **Tree** (main UI) | `src/tree/index.tsx` | Sidebar tree view for tab management |
| **Popup** | `src/popup/index.tsx` | Extension icon click action |
| **Options** | `src/options/index.tsx` | Settings page |
| **Import** | `src/import/index.tsx` | Data import utility |

Content scripts are auto-discovered from `src/contents/*/index.{ts,tsx}`.

### Data flow

1. Background service worker captures browser tab/window events
2. Messages sent to tree UI via `@garinz/webext-bridge`
3. Fancytree instance updates the tree view
4. Changes persisted to IndexedDB via Dexie (`src/storage/idb.ts`)
5. Settings propagated via React Context (`src/tree/context.ts`)

### Key technology choices

- **Fancytree (jQuery)** wraps the tree UI — React wrapper at `src/tree/features/tab-master-tree/`
- **Dexie/IndexedDB** for persistence instead of Redux — tree snapshots need storage anyway
- **Webpack 5** (not Vite) — required for extension multi-page setup, manifest generation, HMR in extension context
- **Ant Design 5** for UI components
- **Firebase** for user auth and data sync

### Feature modules

Features are organized under `src/tree/features/` — each is self-contained:
- `tab-master-tree/` — core tree logic, node renderers, plugins, templates
- `search/`, `settings/`, `operation-bar/`, `shortcuts/`, `tutorial/`, `help/`, `login/`, `feedback/`

### Build system

Custom Webpack pipeline in `server/`:
- `server/configs/webpack.common.ts` — shared config (entries, loaders, plugins)
- `server/configs/webpack.dev.ts` — HMR + source maps
- `server/configs/webpack.prod.ts` — SWC minification, CSS optimization, bundle analyzer
- `server/utils/entry.ts` — dynamic entry point generation
- `server/generateManifest.ts` — manifest generation from `src/manifest.ts`

Global defines available in code: `__ENV__`, `__VERSION__`, `__TARGET__`.

### Path alias

`@/*` maps to `src/*` (configured in tsconfig.json and webpack).

## Code style

- TypeScript strict mode with decorators enabled
- JSX transform: `react-jsx` (no `import React` needed)
- jQuery is globally provided via webpack `ProvidePlugin`
- Pre-commit hook runs lint-staged (ESLint, stylelint, prettier, format-imports)
- Prettier config: `@yutengjing/prettier-config`
- ESLint config: `@yutengjing/eslint-config-react`
