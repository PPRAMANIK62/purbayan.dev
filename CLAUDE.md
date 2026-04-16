# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

Bun workspaces with two apps:

- `apps/web` — Main portfolio (React 19 + Vite + TypeScript)
- `apps/vault` — Knowledge base (Astro 5 + Markdown content)

## Commands

All commands run from repo root unless noted.

```bash
# Install dependencies
bun install

# Development
bun run dev:web       # React portfolio on localhost
bun run dev:vault     # Astro vault on localhost

# Build
bun run build:web     # Typecheck then vite build
bun run build:vault   # Astro build

# Linting / Formatting (runs automatically on commit via lint-staged)
bunx oxlint           # Lint TS/JS
bunx oxfmt            # Format all files
```

From within an app directory:

```bash
cd apps/web && bun run typecheck   # Type-check only
cd apps/vault && bun run preview   # Preview production build
```

## Tooling

- **Formatter:** oxfmt — config in `.oxfmtrc.jsonc` (100 char width, no semis, double quotes, trailing commas, 2-space tabs)
- **Linter:** oxlint
- **Pre-commit:** Husky runs `bunx lint-staged` automatically

## Web App Architecture (`apps/web`)

**Routing:** React Router DOM v7. Routes defined in `src/App.tsx`. The `/terminal` route is lazy-loaded.

**Data layer:** All content (projects, experience, skills, blog posts) lives as TypeScript files in `src/data/`. No CMS or API calls — edit these files to update site content.

**State:** Zustand store at `src/stores/terminal-store.ts` manages terminal open/close state and Konami code flag.

**Path alias:** `@` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).

**Styling:** Tailwind CSS 4 with Tokyo Night theme defined as CSS custom properties in `src/index.css`. Use `cn()` from `src/lib/utils.ts` for conditional classnames. shadcn/ui components live in `src/components/ui/`.

**Terminal easter egg:** Triggered by Konami code (↑↑↓↓←→←→BA) or Ctrl+`. Implementation in `src/components/terminal/` with a virtual filesystem (`src/components/terminal/filesystem/`) and commands (`src/components/terminal/commands/`).

## Vault App Architecture (`apps/vault`)

**Content:** Markdown files in `src/content/vault/<category>/<slug>.md`. Each file needs a `title` frontmatter field. The index page automatically groups docs by category directory name.

**Routing:** Astro file-based. `src/pages/[category]/[...slug].astro` handles all doc pages. `src/pages/index.astro` builds the file explorer index.

**Syntax highlighting:** Shiki with `tokyo-night` theme (configured in `astro.config.mjs`).

## Design Conventions

- **Theme:** Tokyo Night throughout both apps — use existing CSS custom properties (e.g., `--color-tokyo-cyan`, `--color-tokyo-green`)
- **Typography:** Iosevka mono is the primary font
- **No new dependencies** without good reason — the stack is intentionally lean
