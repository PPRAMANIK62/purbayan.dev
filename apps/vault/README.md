# vault

Personal knowledge base — roadmaps, interview prep, project notes.

## stack

- Astro 5, TypeScript
- Tailwind CSS 4, Iosevka mono, Tokyo Night
- Shiki syntax highlighting

## run locally

```sh
bun install
bun run dev
```

## adding content

Drop a Markdown file in `src/content/vault/<category>/`:

```md
---
title: "Your Title"
---

Content goes here.
```

The index and routing are fully automatic — no config needed.

## build

```sh
bun run build
bun run preview
```

## license

MIT
