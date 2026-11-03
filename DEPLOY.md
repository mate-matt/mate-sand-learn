# Deploy — mate-sand-learn

Live site (GitHub Pages):

https://mate-matt.github.io/mate-sand-learn/

## How it ships

Push to `main` runs `.github/workflows/pages.yml`:

1. `npm ci`
2. `npm test`
3. `npm run build` (`dist/`, Vite `base` is `/mate-sand-learn/`)
4. `actions/upload-pages-artifact` then `actions/deploy-pages`

Pages source is GitHub Actions, not a `gh-pages` branch.

The first deploy returns 404 until a repo admin opens **Settings → Pages → Build and deployment → Source: GitHub Actions**. The automation token used here cannot change that setting. After it is on, re-run the "Deploy GitHub Pages" workflow.

## Local preview

```bash
npm install
npm run dev
npm run build
npm run preview
```

WebGPU hardware is required. There is no CSS sand fallback.
