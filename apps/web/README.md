# portfolio

developer portfolio — tokyo night, monospace everything, and maybe a few secrets.

## stack

- React 19, TypeScript, Vite
- Tailwind CSS 4, Radix UI, shadcn/ui
- Framer Motion, Zustand
- Iosevka mono, Tokyo Night

## run locally

```sh
bun install
bun dev
```

## build

```sh
bun run build
bun preview
```

## deployment

This app uses React Router with browser-history routes. Static hosts must rewrite nested
routes back to `index.html` so direct visits like `/projects/mdt` and `/blog/<slug>` load
correctly.

The Vite build copies `public/_redirects` into `dist/_redirects`:

```txt
/* /index.html 200
```

This works for Cloudflare Pages and Netlify-style static redirects.

## license

MIT
