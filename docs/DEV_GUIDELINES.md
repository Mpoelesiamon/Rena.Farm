# Rena Farm — Public Website Developer Guidelines

> How we work on `renafarm.co.ke`. Companion to `UI_GUIDELINES.md`. Where the UI doc covers what we build, this covers how we ship it. Deliberately shorter than the management platform's guidelines — this site is static + vanilla JS + FTP, and complexity is the enemy.

Last reviewed: 2026-09-03

---

## 1. First hour

```bash
git clone git@github.com:Mpoelesiamon/Rena.Farm.git "Website Folder"
cd "Website Folder"
# No build step. Just serve the files.
python3 -m http.server 5500
# Or use VS Code Live Server extension, or:
npx --yes serve -l 5500
```

Open `http://localhost:5500`. The Supabase-backed dynamic sections (products, gallery) need the same Supabase URL + anon key that the management platform uses — set them in `js/supabase-client.js` (they're currently inlined; ClickUp `869ergpg1` tracks moving to env-style config).

No `npm install`. No compiler. No hot reload. If you're used to Next.js, this feels primitive — that's the point. The whole reason this repo exists separately from the management platform is to stay deployable via cheap FTP to Vimexx shared hosting.

## 2. Repo layout

```
/
├── index.html               # Homepage
├── about.html               # About + team
├── products.html            # Product listings (dynamic — pulls from Supabase)
├── livestock.html           # Livestock for sale (dynamic)
├── fodder.html              # Fodder catalogue
├── gallery.html             # Photo gallery (dynamic)
├── events.html              # Events + past events (dynamic — CMS-driven)
├── how-to-buy.html          # Purchasing process
├── location.html            # Farm location + directions
├── contact.html             # Contact form
├── enquire.html             # Product-specific enquiry
├── portal.html              # Client portal (requires login)
├── login.html               # Client login
├── register.html            # Client registration
├── privacy-policy.html      # Legal
├── index-coming-soon.html   # Placeholder (fallback / maintenance)
├── css/
│   └── styles.css           # Global stylesheet
├── js/
│   ├── layout.js            # Injects header + footer on every page
│   ├── supabase-client.js   # Supabase queries for dynamic sections
│   └── supabase.js          # Supabase JS client init
├── img/                     # Committed images (site assets)
│   ├── hay/  pellets/  silage/  doper-rams/
├── Media/                   # NOT committed — raw/original media source
├── supabase/                # SQL migrations (mirrors backend repo where relevant)
├── .github/workflows/       # CI: ci.yml (validate) + deploy-ftp.yml + deploy-gate.yml
├── docs/                    # This file + UI_GUIDELINES.md
├── DEPLOYMENTS.md           # Deployment runbook (older doc — merge into this over time)
├── README.md                # Elevator-pitch entry point
├── package.json             # Only for dev tooling (no runtime dependencies)
├── vercel.json              # Vercel config for the preview environment
└── LICENSE
```

## 3. Two deployment targets — one repo

This site deploys to **two** places from **one** codebase:

| Target | Where | How | When |
|---|---|---|---|
| **Vercel** | `rena-farm.vercel.app` (preview URLs for PRs) | Push to any branch → Vercel builds automatically | Every push |
| **Vimexx FTP** | `renafarm.co.ke` (production, real users) | Merge to `deploy` → GitHub Actions FTP-uploads to `public_html/` | Approved releases only |

**Why both?** Vercel gives every PR a shareable preview URL — invaluable for review. Vimexx is the canonical production domain (has the `.co.ke` TLD, cheap, owner already had it). The FTP workflow uses `SamKirkland/FTP-Deploy-Action`.

## 4. Branch strategy

Four long-lived branches. This is more elaborate than a normal static site because of the dual deployment.

- **`main`** — the safe stable branch. Vercel deploys from here too but rarely used directly.
- **`develop`** — integration for larger features
- **`test`** — where most PRs land. `Validate Site` CI + Vercel preview. Every push here builds.
- **`deploy`** — production. Push here → FTP action fires → `renafarm.co.ke` updates within 2 minutes. **Only merge to `deploy` when you actually want production changed.**

The `deploy` branch is protected — merges only via PR from `test`. Required status check: `Production Deploy Gate`.

Short-lived branches: `feature/*`, `fix/*`, `hotfix/*`, `docs/*`, `chore/*`. Same conventions as the management repo — 3–5 kebab-case words, no dates or PR numbers.

### The normal PR flow

1. `git checkout test && git pull`
2. `git checkout -b feature/my-change`
3. Edit → commit → push
4. `gh pr create --base test` — verify preview URL, get review
5. Merge (squash) → `test` deploys to preview automatically
6. When ready to ship to `renafarm.co.ke`: `gh pr create --base deploy --head test` — this is the "release" PR
7. Merge → FTP action runs → site updates

### Hotfix flow

Real emergencies (site down, security incident) go straight to `deploy`:

1. `git checkout deploy && git pull`
2. `git checkout -b hotfix/short-description`
3. Fix → commit → PR `hotfix → deploy`
4. Merge → FTP runs
5. **Immediately** open a back-merge PR: `deploy → test` so the hotfix flows back into the integration branch. Otherwise the next `test → deploy` PR reverts your fix.

Real hotfixes we've done: `hotfix/fix-ftp-server-dir` (PR #10), `hotfix/force-fresh-ftp-sync` (PR #11 and #13), `hotfix/force-fresh-ftp-sync-v3` (recent). Each one prompted a back-merge PR.

## 5. Commit messages

Conventional Commits, same rules as the management repo (see its `docs/DEV_GUIDELINES.md` §4 for the full breakdown).

Common types for this repo: `feat`, `fix`, `chore`, `docs`, `hotfix`, `ci`.

Recent good examples from this repo:

- `feat(gallery): pull categories from Supabase on load`
- `hotfix: bump FTP sync state to .ftp-deploy-sync-v3 — force full re-upload`
- `chore: back-merge deploy into test after PR #10 & #11 hotfixes`
- `ci: remove deprecated 'next lint' step`

## 6. What to commit — and what NEVER

### Always commit
- HTML / CSS / JS files
- `img/` (committed site assets — real photos used on pages)
- SQL migrations under `supabase/` (mirrors are OK — backend repo is the source of truth for shared schema)
- CI workflows (`.github/workflows/*.yml`)
- Docs

### Never commit
- **`Media/`** — raw/original photos, videos, source files. This is DEV-only working directory. Already gitignored (verify with `git check-ignore Media/some-file.jpg`).
- **`.env*`** — the FTP credentials, Supabase keys, anything sensitive
- **`setup-dirs.php`** — bootstrap helper, safe to have locally, not needed on production
- **`node_modules/`** — only dev tooling should require them
- **Any file named `wp-*`, `wp-includes*`, or looking WordPress-adjacent** — this is a static site, not a WordPress site. If you see one, it's malware. Delete it, log it, escalate. (See ClickUp `869e38are`.)

### Grey area
- **`DEPLOYMENTS.md`** — older ops runbook. Kept for historical reference. Merge relevant parts into this file over time; then delete.
- **`vercel.json`** — needed for Vercel routing, safe to commit
- **`package.json`** — currently only lists dev tools; safe to commit but scrutinise new deps

### Pre-commit safety

Before commits that touch config or scripts:

```bash
git diff --staged | grep -iE "password|secret|api_key|token|service_role|ftp_pass"
```

The FTP deploy workflow has an inline `Run pre-deploy security check` step that aborts the deploy if it finds `.env` in the tree or `service_role` in code files. That's the safety net — don't rely on it.

## 7. The FTP deploy workflow — how it works, how it breaks

`.github/workflows/deploy-ftp.yml` fires on every push to `deploy`. It uses `SamKirkland/FTP-Deploy-Action@v4.3.5` which maintains a `.ftp-deploy-sync-{name}.json` state file on the server to only upload changed files.

**The state-file gotcha (real incident, twice):**
- Vimexx / the server can lose or corrupt the sync state
- Or someone edits `public_html/` directly (malware, manual upload, hosting-side maintenance page) so the state file thinks files are correct when they aren't
- Result: the FTP action reports "no changes to upload" but the site is broken

**How to force a full re-sync:** bump the `state-name` in `deploy-ftp.yml`. This makes the action treat the state as fresh and re-upload everything. We've done this three times: v1 → v2 → v3.

**Excluded from FTP:** see the `exclude:` block in the workflow. Currently: `.git*`, `.github/**`, `.DS_Store`, `.env*`, `.vercel/**`, `vercel.json`, `.vercelignore`, `README.md`, `LICENSE`, `DEPLOYMENTS.md`, `package.json`, `package-lock.json`, `gallery_fix.sql`, `supabase/**`, `.gitignore`, `index-coming-soon.html`, `node_modules/**`. **Anything you add that shouldn't ship must be added here.**

## 8. Vercel deploy quirks

Vercel builds the site as a static export (there's no `next` here — Vercel treats it as a plain HTML site). No env-var inlining needed at build time for the client-side Supabase calls; the keys are currently inlined in `js/supabase.js`.

**When Vercel doesn't reflect your change:**
- Preview URL is per-branch. `feature/foo` → `rena-farm-git-feature-foo-<team>.vercel.app`.
- When a PR merges + branch deletes, its preview URL 404s.
- Vercel deployment protection may redirect you to SSO if the project has it enabled.

## 9. Supabase — anon key, not service_role

Every Supabase call from public HTML/JS uses the **anon** key. **Never** put a service_role key in this repo. The anon key is designed to be exposed to browsers; RLS on the tables is what protects the data.

If a page needs privileged access (nothing does today), that access happens via the management dashboard, not the public site.

## 10. Security — the site was compromised once, don't let it happen again

August 2026: `public_html/` was found with `wp-log1n.php`, `wp-geren.php`, `wp-includes/`, `wp-includes88/`, `50d61/`, `50d6188/` folders — all malware backdoors typo-squatting WordPress filenames. The site is not WordPress and never has been. Someone with FTP or DirectAdmin access dropped them.

**Ongoing rules to keep it clean:**

- FTP + DirectAdmin credentials rotated after any suspected compromise (ClickUp `869erghgr`)
- GitHub Actions secret `FTP_PASSWORD` updated in sync
- No `.php` files in this repo, ever. If a `.php` file appears in the tree, it's malware.
- Weekly: log into DirectAdmin File Manager, browse `public_html/`, confirm nothing you didn't put there is present
- `.htaccess` (once we add one, ClickUp `869dwerbz`) should contain only rules we recognise — if you find injected redirect rules there, treat as compromise

## 11. Feature checklist — before opening a PR

- [ ] Opened the page in a browser at 375 px width — no horizontal scroll, no crushed content
- [ ] All new `<img>` tags have `alt` text (or `alt=""` if decorative)
- [ ] Any new dynamic Supabase call has a skeleton state, an empty state, AND an error state — never crash on the visitor
- [ ] Every new `<form>` has proper `<label>`s and disables its submit button while submitting
- [ ] No `alert()`, `confirm()`, or `prompt()` anywhere in the diff
- [ ] No inline `<style>` or `<script>` beyond ~10 lines — pull into `css/` or `js/`
- [ ] If touching CI or the deploy workflow: read the workflow file end-to-end before you edit
- [ ] Docs updated (this file + `UI_GUIDELINES.md`) if you changed any convention

## 12. PR conventions

- **Title:** Conventional Commit (`feat(gallery): infinite scroll for public gallery`)
- **Base:** `test` for normal work; `deploy` only for hotfixes
- **Body:** what changed, why it matters, what to test, screenshots at desktop + mobile
- **Preview URL:** Vercel bot posts it — link it in the body for reviewers
- **Squash** for feature branches; **merge commit** for `test → deploy` promotions to preserve release history

## 13. When things break

### Site shows "Site under maintenance"
- Someone / something uploaded a placeholder page directly to the server bypassing the FTP action
- Fix: force-resync as in §7 (bump state-name in `deploy-ftp.yml`, PR + merge to deploy)
- Then investigate WHY — rotate FTP creds if you don't recognise the change

### FTP action succeeds but no changes reflect
- The `.ftp-deploy-sync-*` state file on the server thinks the files are up-to-date
- Force full resync (bump state-name)

### Vercel build fails
- Since there's no build step, this is rare
- Usually indicates malformed HTML that Vercel's parsers can't handle
- Read the build log and fix

### 403 / permission errors from Supabase in browser console
- RLS is denying an anonymous read
- Either add a `USING (true)` policy for anon SELECT on the relevant table, OR
- Recognise it's a security issue: an anon user shouldn't see that data — investigate why the page is trying to read it

## 14. Onboarding a new contributor

- [ ] Add as GitHub collaborator on `Mpoelesiamon/Rena.Farm`
- [ ] Grant Vercel access (Team → invite)
- [ ] Grant Supabase project access
- [ ] Add to ClickUp
- [ ] Share `.env.local.example` values through a password manager
- [ ] Read `docs/UI_GUIDELINES.md` and this file
- [ ] First PR should be tiny — a typo fix or a docs update — to walk the flow

---

## Quick reference

**Two branches you care about most:** `test` (integration + Vercel preview) and `deploy` (production FTP).
**Never `.php` in this repo.** Never a `service_role` key. Never `Media/`.
**Force-resync trick:** bump `state-name` in `deploy-ftp.yml`.
**Marketing site tone:** warm, honest, competent. Photography-first.
