# Rena Farm — Public Website

Static HTML/CSS/JS website for [Rena Farm](https://rena-farm.vercel.app), Kajiado Central, Kenya.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Static HTML, CSS, Vanilla JS |
| Backend / Database | Supabase (PostgreSQL + Auth + Storage) |
| Deployment | Vercel (auto-deploy from `main`) |
| Media | Supabase Storage (`website-media` bucket) |

## Project Structure

```
/
├── css/styles.css          # Global stylesheet
├── js/
│   ├── layout.js           # Shared navbar + footer injected on every page
│   └── supabase-client.js  # All Supabase query helpers
├── img/                    # Locally committed images (tracked by git)
│   ├── hay/
│   ├── pellets/
│   ├── silage/
│   └── doper-rams/
├── .github/workflows/      # CI checks (runs on push + PRs)
├── *.html                  # One file per page
└── Media/                  # Raw/original media (NOT tracked by git)
```

## Pages

| File | Route | Description |
|---|---|---|
| index.html | / | Homepage |
| about.html | /about | About & team |
| products.html | /products | Product listings (dynamic) |
| livestock.html | /livestock | Livestock breeds |
| fodder.html | /fodder | Fodder & feeds |
| gallery.html | /gallery | Photo gallery (dynamic) |
| events.html | /events | Events & EXPOs (dynamic) |
| how-to-buy.html | /how-to-buy | Purchasing process |
| location.html | /location | Farm location & directions |
| contact.html | /contact | Contact form + enquiry |
| enquire.html | /enquire | Product-specific enquiry form |
| portal.html | /portal | Client portal (requires login) |
| login.html | /login | Client login |
| register.html | /register | Client registration |

## Environment Variables

The Supabase anon key is a **public** key — safe to expose in frontend code.
See `.env.example` for the variables used.

For Vercel deployment, add these in the Vercel dashboard under Project → Settings → Environment Variables.

## Development

No build step required. Open any `.html` file in a browser, or use a local server:

```bash
npx serve .
```

## Deployment

Push to `main` → Vercel auto-deploys.

**Never push directly to `main`.** Use `develop` or a feature branch and open a PR.

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — protected, requires PR |
| `develop` | Integration — merge features here first |
| `feature/*` | New features |
| `fix/*` | Bug fixes |

## CI

GitHub Actions runs on every push and PR to `main`/`develop`:
- Checks all local image `src` references resolve to real files
- Checks all internal `href` links point to existing pages
- Guards against accidentally committed `.env` files
