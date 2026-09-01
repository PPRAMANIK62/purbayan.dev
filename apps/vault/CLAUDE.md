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
- Dark-only editorial palette shared with `apps/web`, exposed as semantic Tailwind tokens in `src/styles/global.css`
- Bricolage Grotesque for display type, Instrument Sans for body copy, and system mono for code
- Syntax highlighting uses Shiki's `css-variables` theme, mapped to the shared syntax palette in `src/styles/global.css`

## Conventions

- No new dependencies without good reason
- Keep content flat within categories — no deep nesting
- `title` frontmatter is the only required field
