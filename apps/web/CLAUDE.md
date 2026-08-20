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

**Routing:** React Router DOM v7. All routes defined in `src/App.tsx`. The home page carries intro, work, projects, also-built and writing as sections; `/about`, `/experience` and `/projects` are kept alive as redirects into home anchors.

**Data:** Structured site data (projects, experience, uses, social links) lives in `src/data/` as TypeScript files. Blog posts live in `src/content/blog/*.md` and are loaded by `src/data/blog.ts`. No CMS or API calls.

**Content authoring:** Add a new blog post by creating a Markdown file in `src/content/blog/`. The filename becomes the route slug. Required frontmatter: `title`, `date`, `tags`, `summary`, and `readingTime`.

**Path alias:** `@` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Styling

- Tailwind CSS 4
- Palette lives as `--c-*` custom properties in `src/index.css`, exposed to Tailwind via `@theme inline`. Use the semantic utilities: `bg-ground`, `bg-raise`, `bg-sink`, `text-ink`, `text-dim`, `text-faint`, `border-line`, `text-brand`.
- `--c-*` names are deliberately distinct from shadcn's: shadcn's `--muted`/`--accent` are _surfaces_, while this design's dim/brand are a text colour and a signal colour.
- Dark only. `data-theme="dark"` is hardcoded on `<html>` in `index.html` purely so the `dark:` variant resolves for the shadcn primitives — there is no theme toggle and no light palette.
- Fonts: `font-display` (Bricolage Grotesque) for headings, `font-sans` (Instrument Sans) for body. Both self-hosted in `src/styles/fonts.css`.
- Use `cn()` from `src/lib/utils.ts` for conditional classnames
- shadcn/ui primitives live in `src/components/ui/` — only `button`, `command`, `dialog` and `sheet` remain

## Key Directories

```
src/
  App.tsx              # route definitions
  index.css            # design tokens, theme states, global styles
  content/blog/        # Markdown blog posts
  data/                # typed structured data + blog loader
  components/
    sections/          # home page sections
    ui/                # shadcn/ui primitives
  lib/
    utils.ts           # cn() helper
  pages/               # page-level components
  hooks/               # custom React hooks
```

## Conventions

- No new dependencies without good reason — stack is intentionally lean
- Keep page components in `src/pages/`, reusable components in `src/components/`
- Blog writing goes in `src/content/blog/`; structured portfolio data goes in `src/data/`
- Never hardcode content in components
- Any animation that hides content must opt out under `prefers-reduced-motion` with `useReducedMotion()` — motion writes inline styles that the global CSS rule cannot override
