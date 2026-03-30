This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

This app is built as a **static export** (`output: 'export'`), so it can run on any static host.

### GitHub Pages (automatic on push to `main`)

A workflow in `.github/workflows/deploy-github-pages.yml` builds the site and publishes the `out/` folder.

1. Create the repository on GitHub and push this `main` branch.
2. In the repo **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions** (not “Deploy from a branch”).
3. After the first workflow run completes, the site is available at  
   `https://<your-username>.github.io/<repo-name>/`  
   The workflow sets `NEXT_PUBLIC_BASE_PATH` to `/<repo-name>` so assets resolve correctly.

### Vercel

Import the repo on [Vercel](https://vercel.com/new). Use the default build command (`next build`); no extra config is required for this static export. The site is served from the project root (no `basePath`).
