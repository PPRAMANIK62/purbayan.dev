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
- Tailwind CSS v4 for styling consistency
- `@fontsource/iosevka` for the mono font

**Pages:**

1. **Index** (`/`) — lists all documents grouped by category (interview, roadmaps). Each entry links to its document page. Shows document title and category. Minimal, clean layout.

2. **Document** (`/[category]/[slug]`) — renders the markdown document. Auto-generated TOC from headings. File metadata (word count, reading time). Shiki-highlighted code blocks.

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

- `apps/web` deploys to `<domain>` (Vercel project, root directory: `apps/web`)
- `apps/vault` deploys to `vault.<domain>` (separate Vercel project, root directory: `apps/vault`)
- Both share the same git repo

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
