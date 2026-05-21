# Observe Room Demo

Standalone desktop demo for the Cookiy AI Observe Room interface.

## Local Preview

```bash
npm ci
npm run dev
```

Open the local Vite URL, usually `http://localhost:5173/`.

## Build

```bash
npm run build
```

## GitHub Pages

This repository deploys `dist/` to GitHub Pages on every push to `main`.

Production URL:

```text
https://devin55iwl.github.io/observe-room-demo/
```

## Notes

- This is a frontend demo with mocked interview data.
- The Observe Room layout is optimized for desktop viewports `1024px` and wider.
- Figma Make image imports are resolved through Vite fallback mappings in `vite.config.ts`.
