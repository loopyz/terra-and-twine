# Terra & Twine 🌿

A demo full-stack e-commerce storefront built with Next.js (App Router), used as a
test bed for [Trevo](https://trevosdk.com) — an AI experimentation platform that
proposes A/B tests from your codebase and ships them as pull requests.

## Stack

- Next.js 15 (App Router, server components) + TypeScript + Tailwind CSS
- API routes for cart, checkout, and newsletter (cookie-backed cart, no database)
- `@trevosdk/nextjs` + `@trevosdk/react` for experiments and event tracking

## Conversion events

| Event | Where |
|---|---|
| `page_view` | automatic, every page |
| `add_to_cart` | product page → Add to cart |
| `checkout_started` | cart → Proceed to checkout |
| `purchase_completed` | checkout → Place order (with `value`) |
| `newsletter_signup` | footer subscribe form |

## Running locally

```bash
npm install
cp .env.example .env.local   # add your Trevo API key
npm run dev
```

## Environment

- `NEXT_PUBLIC_TREVO_API_KEY` — Trevo SDK key (`tsk_live_…`), from
  app.trevosdk.com → Settings → API keys. Leave unset to disable the SDK.

This is a demo: checkout takes no payment and stores nothing server-side.
