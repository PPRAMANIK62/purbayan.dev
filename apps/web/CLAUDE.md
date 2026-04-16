# CLAUDE.md — apps/web

React 19 + Vite + TypeScript portfolio app.

## Commands

```bash
bun run dev          # dev server
bun run build        # typecheck then vite build
bun run typecheck    # type-check only
bun run preview      # preview production build
```

## Architecture

**Routing:** React Router DOM v7. All routes defined in `src/App.tsx`. The `/terminal` route is lazy-loaded via `React.lazy`.

**Data:** All content (projects, experience, skills, blog posts, social links) lives in `src/data/` as TypeScript files. No CMS, no API calls — edit these to update site content.

**State:** Zustand store at `src/stores/terminal-store.ts` manages terminal open/close state and Konami code flag.

**Path alias:** `@` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Styling

- Tailwind CSS 4
- Tokyo Night theme defined as CSS custom properties in `src/index.css` — use existing vars like `--color-tokyo-cyan`, `--color-tokyo-green`, etc.
- Iosevka mono is the primary font
- Use `cn()` from `src/lib/utils.ts` for conditional classnames
- shadcn/ui components live in `src/components/ui/`

## Key Directories

```
src/
  App.tsx              # route definitions
  index.css            # Tokyo Night CSS vars + global styles
  data/                # all site content as TS files
  components/
    ui/                # shadcn/ui primitives
    terminal/          # terminal easter egg
      filesystem/      # virtual filesystem
      commands/        # command handlers
  stores/
    terminal-store.ts  # Zustand store
  lib/
    utils.ts           # cn() helper
  pages/               # page-level components
  hooks/               # custom React hooks
```

## Terminal Easter Egg

Triggered by Konami code (↑↑↓↓←→←→BA) or Ctrl+`. Implementation lives entirely in `src/components/terminal/`. Has a virtual filesystem and command registry — add new commands in `src/components/terminal/commands/`.

## Conventions

- No new dependencies without good reason — stack is intentionally lean
- Keep page components in `src/pages/`, reusable components in `src/components/`
- All content edits go in `src/data/` — never hardcode content in components
