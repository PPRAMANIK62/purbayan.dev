# CLAUDE.md — apps/vault

Astro 5 + Markdown knowledge base app.

## Commands

```bash
bun run dev      # dev server
bun run build    # astro build
bun run preview  # preview production build
```

## Architecture

**Content:** Markdown files in `src/content/vault/<category>/<slug>.md`. Each file requires a `title` frontmatter field. The index page automatically groups and lists docs by their category directory name.

**Routing:** Astro file-based routing.

- `src/pages/index.astro` — file explorer index (auto-built from content collection)
- `src/pages/[category]/[...slug].astro` — handles all individual doc pages

**Layout:** All pages use `src/layouts/VaultLayout.astro`.

**Content collection:** Defined in `src/content.config.ts`. Schema requires only `title: string`.

## Adding Content

1. Create a Markdown file at `src/content/vault/<category>/<slug>.md`
2. Add frontmatter:
   ```md
   ---
   title: "Your Title"
   ---
   ```
3. Write content below — the index and routing are automatic

Existing categories: `interview/`, `roadmaps/`

## Styling

- Tailwind CSS 4
- Tokyo Night theme via CSS custom properties in `src/styles/`
- Iosevka mono primary font
- Syntax highlighting via Shiki with `tokyo-night` theme (configured in `astro.config.mjs`)

## Conventions

- No new dependencies without good reason
- Keep content flat within categories — no deep nesting
- `title` frontmatter is the only required field
