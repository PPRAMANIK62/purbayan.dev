# Monorepo + Vault Migration Design

## Problem

The Vite portfolio app reinvents markdown rendering and syntax highlighting (react-markdown, remark-gfm, custom CodeBlock components) for its vault feature. This duplicates what Astro handles natively. The vault also carries unnecessary complexity: password gate, bookmarks, progress tracking, redacted views, demo mode.

## Decision

Split the project into a Bun workspaces monorepo with two apps:

- `apps/web` — existing Vite React portfolio (stripped of vault code)
- `apps/vault` — new Astro site for markdown content

The vault becomes a public, statically-rendered Astro site deployed at `vault.<domain>` (subdomain). No password protection. No interactive features beyond reading markdown.

## Monorepo Structure

```
portfolio/
├── apps/
│   ├── web/              # Vite React portfolio
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── index.html
│   └── vault/            # Astro markdown vault
│       ├── src/
│       │   ├── content/
│       │   │   └── vault/
│       │   │       ├── interview/
│       │   │       │   ├── interview-prep.md
│       │   │       │   ├── shopflo-prep.md
│       │   │       │   ├── how-to-answer.md
│       │   │       │   ├── my-work.md
│       │   │       │   └── fiddle-and-projects.md
│       │   │       └── roadmaps/
│       │   │           ├── games.md
│       │   │           ├── web3.md
│       │   │           └── build-ideas.md
│       │   ├── layouts/
│       │   │   └── VaultLayout.astro
│       │   ├── pages/
│       │   │   ├── index.astro          # category listing
│       │   │   └── [category]/
│       │   │       └── [slug].astro     # individual doc
│       │   └── styles/
│       │       └── global.css           # Tokyo Night theme + Iosevka
│       ├── astro.config.mjs
│       ├── package.json
│       └── tsconfig.json
├── package.json          # workspace root
└── bun.lock
```

## Apps Detail

### `apps/web` (Vite Portfolio)

Move all existing files into `apps/web`. Then delete:

**Files to remove:**

- `src/pages/vault.tsx`
- `src/components/vault/` (all 9 files: markdown-components.tsx, vault-demo.tsx, vault-content.tsx, vault-sidebar.tsx, redacted-view.tsx, terminal-catalog.tsx, redacted-components.tsx, vault-mode-switcher.tsx, password-gate.tsx)
- `src/hooks/use-vault-bookmarks.ts`
- `src/hooks/use-vault-progress.ts`
- `src/lib/vault-utils.ts`
- `src/content/vault/` (entire directory — files move to Astro)
- `public/demo-vault.md`

**Dependencies to remove:**

- `react-markdown`
- `remark-gfm`

**Code changes:**

- `App.tsx` — remove vault route and lazy import
- `navbar.tsx` — change `/vault` link to external `vault.<domain>` URL
- `command-palette.tsx` — change vault entry to external link or remove

### `apps/vault` (Astro)

**Stack:**

- Astro with content collections
- Shiki (built-in) for syntax highlighting with Tokyo Night theme
- Tailwind CSS v4 via `@tailwindcss/vite` (Astro uses Vite under the hood)
- `@fontsource/iosevka` for the mono font

**Content Collections:**

The existing markdown files have no frontmatter. Add minimal frontmatter to each file:

```yaml
---
title: "Interview Prep"
---
```

Content collection schema in `src/content.config.ts`:

```ts
import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const vault = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/vault" }),
  schema: z.object({
    title: z.string(),
  }),
})

export const collections = { vault }
```

Category is derived from the file path (the subdirectory name: `interview/`, `roadmaps/`). Title comes from frontmatter.

**Pages:**

1. **Index** (`/`) — lists all documents grouped by category (derived from file path). Each entry shows its frontmatter title and links to its document page. Minimal, clean layout.

2. **Document** (`/[category]/[slug]`) — renders the markdown document with Shiki-highlighted code blocks. File metadata (word count, reading time) computed from the raw content at build time.

3. **Category index** (`/[category]/`) — not implemented. Navigating to `/interview/` returns 404. All navigation goes through the root index.

**Layout:**

- Single `VaultLayout.astro` — Tokyo Night dark background, Iosevka font, centered content column, nav back to portfolio
- Header with "Vault" title + link back to main portfolio site

**Styling (Tokyo Night palette):**

- Background: `#1a1b26`
- Foreground: `#a9b1d6`
- Primary/cyan: `#7dcfff`
- Green: `#9ece6a`
- Magenta: `#bb9af7`
- Yellow: `#e0af68`
- Red: `#f7768e`
- Border: `#292e42`
- Muted: `#414868`

## Deployment

Two separate Vercel projects linked to the same git repo:

- **Web:** root directory `apps/web`, build command `bun run build`, install command `cd ../.. && bun install`
- **Vault:** root directory `apps/vault`, build command `bun run build`, install command `cd ../.. && bun install`

The `cd ../.. && bun install` is needed because Bun workspaces resolves dependencies from the monorepo root.

## Workspace Config

Root `package.json`:

```json
{
  "name": "portfolio-monorepo",
  "private": true,
  "workspaces": ["apps/*"]
}
```

Each app has its own `package.json` with its own dependencies and scripts. No shared packages needed — the two apps have no code overlap.

## Root-Level Tooling

- `husky` + `lint-staged` stay at the root level and apply to the entire repo
- `oxlint` and `oxfmt` work on file globs, so they apply to both apps without config changes
- The root `package.json` gets convenience scripts: `"dev:web": "bun --filter web dev"`, `"dev:vault": "bun --filter vault dev"`, `"build:web": "bun --filter web build"`, `"build:vault": "bun --filter vault build"`

## Dependencies Note

- `zustand` stays in `apps/web` — still used by the terminal store
- `react-markdown` and `remark-gfm` are removed from `apps/web`
- `husky`, `lint-staged`, `oxlint`, `oxfmt` remain as root devDependencies
