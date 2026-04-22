# Deploy to Cloudflare Pages + custom domain

Target: **`library.lucassantana.tech`**. Free tier. Works with the private GitHub repo.

Cloudflare builds and deploys on every push to `main` via its Git integration. No GitHub Actions workflow needed — the `.github/workflows/cloudflare-pages.yml` we previously had was removed in favor of this path (recover it from git history if you ever need it: `git log --all --diff-filter=D --name-only -- .github/workflows/cloudflare-pages.yml`).

---

## 1. Create the Pages project (one-time, ~10 min)

1. Log in to Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorize the Cloudflare GitHub app for `LucasSantana-Dev/ai-dev-toolkit-library`.
3. Project settings:
   - **Project name:** `ai-dev-toolkit-library` *(becomes `ai-dev-toolkit-library.pages.dev`)*
   - **Production branch:** `main`
   - **Framework preset:** Astro
   - **Build command:** `pnpm install --frozen-lockfile && pnpm --filter web run build`
   - **Build output directory:** `web/dist`
   - **Root directory:** *(leave empty)*
4. **Environment variables** (Production):
   - `NODE_VERSION` = `20`
   - `ASTRO_SITE` = `https://library.lucassantana.tech`
   - `ASTRO_BASE` = `/`
5. **Save and deploy.** First build takes ~2 min; subsequent rebuilds ~30–60s.

Every push to `main` rebuilds and publishes. Every non-main push gets a preview deploy at `<hash>.<project>.pages.dev`.

## 2. Custom domain — `library.lucassantana.tech`

In the Pages project → **Custom domains** → **Set up a custom domain** → enter `library.lucassantana.tech`.

- **If `lucassantana.tech` is on Cloudflare DNS:** CF auto-adds the CNAME — done in ~30s. Verify in the DNS tab:
  ```
  library  CNAME  ai-dev-toolkit-library.pages.dev  (Proxied)
  ```
- **If `lucassantana.tech` is on another registrar:** CF shows DNS instructions — add at your registrar:
  ```
  Host:   library
  Type:   CNAME
  Value:  ai-dev-toolkit-library.pages.dev
  TTL:    300
  ```

SSL propagates automatically (CF issues a Universal cert). Site live in 1–2 min.

## 3. Rollback

Cloudflare dashboard → Pages → project → **Deployments** → pick any historical deploy → **Rollback**. Instant, zero-downtime.

## 4. Cost

Free tier: 500 builds/month, unlimited requests, unlimited bandwidth, unlimited sites. We won't approach the ceiling with a static catalog.

## Troubleshooting

- **Build fails with `pnpm: command not found`** — add `PNPM_VERSION=9.12.0` to env vars. CF detects pnpm from `packageManager` in `package.json`, but being explicit helps.
- **Site loads but assets 404** — `ASTRO_BASE` must be `/` for root-of-domain deploys. It gets baked into every asset URL at build time.
- **Custom domain stuck on "Verifying"** — usually DNS propagation. Wait 5 min, or check `dig library.lucassantana.tech CNAME` resolves to `ai-dev-toolkit-library.pages.dev`.
