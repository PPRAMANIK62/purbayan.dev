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

**Routing:** React Router DOM v7. All routes defined in `src/App.tsx`.

**Data:** Structured site data (projects, experience, social links, about content) lives in `src/data/` as TypeScript files. Blog posts live in `src/content/blog/*.md` and are loaded by `src/data/blog.ts`. No CMS or API calls.

**Content authoring:** Add a new blog post by creating a Markdown file in `src/content/blog/`. The filename becomes the route slug. Required frontmatter: `title`, `date`, `tags`, `summary`, and `readingTime`.

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
  content/blog/        # Markdown blog posts
  data/                # typed structured data + blog loader
  components/
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
