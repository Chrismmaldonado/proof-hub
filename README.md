# Proof Hub

Developer proof-of-capability SPA: three tabbed demos (analytics, insurance calculator, simulated Stripe checkout).

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- Lucide React + Framer Motion

## Local

```bash
cd proof-hub
npm install
npm run dev
```

## Deploy

**GitHub:** https://github.com/Chrismmaldonado/proof-hub

**Cloudflare (Workers Git UI — build + deploy commands):**
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

`wrangler.toml` serves `./dist` as a SPA (static assets).

**Classic Pages UI** (if you find it): output directory `dist`, build `npm run build`.

## Note

This replaces the niche one-pager template gallery as the public portfolio sample. Client delivery one-pagers remain a separate product path.
