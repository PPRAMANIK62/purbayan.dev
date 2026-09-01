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

**Routing:** React Router DOM v7. Routes defined in `src/App.tsx`.

**Data layer:** All content (projects, experience, skills, blog posts) lives as TypeScript files in `src/data/`. No CMS or API calls — edit these files to update site content.

**Path alias:** `@` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).

**Styling:** Tailwind CSS 4. The palette lives as `--c-*` custom properties in `src/index.css` and is exposed to Tailwind through `@theme inline` (`bg-ground`, `text-ink`, `text-dim`, `text-faint`, `border-line`, `text-brand`). Use `cn()` from `src/lib/utils.ts` for conditional classnames. A trimmed set of shadcn/ui primitives lives in `src/components/ui/`.

**Theming:** dark only. `data-theme="dark"` is hardcoded on `<html>` in `index.html` so Tailwind's `dark:` variant still resolves for the shadcn primitives; there is no toggle, no light palette, and no `prefers-color-scheme` branch. The palette is a single `:root` block.

**Inspector easter egg:** press `i` anywhere to overlay inspector chrome on the page (`src/components/inspector-mode.tsx`). Esc exits.

**Hero canvas:** `src/components/hero-canvas.tsx` is an imperative canvas with a real object model — hit-testing, drag-to-move, marquee select, Alt/middle-drag pan. It is deliberately _not_ driven by React state; per-frame re-renders would tank it.

## Vault App Architecture (`apps/vault`)

**Content:** Markdown files in `src/content/vault/<category>/<slug>.md`. Each file needs a `title` frontmatter field. The index page automatically groups docs by category directory name.

**Routing:** Astro file-based. `src/pages/[category]/[...slug].astro` handles all doc pages. `src/pages/index.astro` builds the file explorer index.

**Syntax highlighting:** Shiki's `css-variables` theme, mapped to the shared syntax palette in `src/styles/global.css`.

## Design Conventions

- **Theme:** Both apps use the same dark-only editorial palette and typography. Each app owns its CSS tokens so it can build and deploy independently.
- **Typography:** Bricolage Grotesque (display, `font-display`) and Instrument Sans (body, `font-sans`), self-hosted via `@fontsource-variable`. Monospace is system-only, for code blocks.
- **Motion:** `motion` v12. Any component that hides content while animating must opt out under `prefers-reduced-motion` via `useReducedMotion()` — motion writes inline styles, so the global CSS reduced-motion rule cannot reach it.
- **No new dependencies** without good reason — the stack is intentionally lean
