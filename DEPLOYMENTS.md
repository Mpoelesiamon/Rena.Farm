# Deployment Rules — Rena Farm Public Website

> These rules are non-negotiable. No exceptions. Every person working on this
> repository must read and follow this document before touching any code.

---

## Branch Structure

```
feature/* or fix/*
       │
       │  PR → review → merge
       ▼
      test          ← staging branch, always reflects what is being tested
       │
       │  PR → owner approval → merge
       ▼
     deploy         ← production branch, triggers live FTP deploy automatically
```

| Branch | Purpose | Who can push directly |
|---|---|---|
| `deploy` | Live production site at renafarm.co.ke | **Nobody** — PRs only |
| `test` | Staging — all features land here first | **Nobody** — PRs only |
| `feature/*` | New features | Assigned developer |
| `fix/*` | Bug fixes | Assigned developer |
| `hotfix/*` | Critical production fixes only | Senior developer only |

---

## Step-by-Step Workflow

### 1. Start a task
Every piece of work must have a ClickUp task before a branch is created.

```bash
git checkout test
git pull origin test
git checkout -b feature/your-task-name
# or
git checkout -b fix/your-task-name
```

Branch names must be lowercase with hyphens. Examples:
- `feature/gallery-mobile-layout`
- `fix/contact-form-validation`
- `feature/add-testimonials-section`

### 2. Do the work
Make changes, commit often with clear messages.

```bash
git add <specific-files>
git commit -m "short description of what and why"
```

Never use `git add .` or `git add -A` — always stage files by name to avoid
accidentally committing `.env`, `.DS_Store`, or build artifacts.

### 3. Open a PR to `test`
Push your branch and open a Pull Request targeting `test`.

```bash
git push origin feature/your-task-name
```

Then on GitHub: open a PR from `feature/your-task-name` → `test`.

- The CI workflow runs automatically and must pass
- At least one reviewer must approve
- Link the ClickUp task in the PR description

### 4. Merge to `test` — test on staging

After the PR is approved and CI passes, merge to `test`. The `test` branch
represents what is currently being reviewed before going live.

Test thoroughly. Check every page affected by the change. Check on mobile.

### 5. Open a PR to `deploy` — request production release

When the feature is verified on `test`, open a PR from `test` → `deploy`.

This PR requires:
- The Deploy Gate CI checks to pass
- **Owner approval** (Rena Farm owner must explicitly approve)

No exceptions. Do not ask anyone else to approve a production deploy PR.

### 6. Owner approves → merge → auto-deploy

Once the owner approves and the checks pass, merge the PR. The GitHub Action
runs automatically, uploads all changes to the Vimexx server via FTP, and the
live site is updated within 2 minutes.

You will see the deploy status under the Actions tab in GitHub.

---

## What You Must Never Do

- **Never push directly to `deploy` or `test`.** Branch protection blocks this,
  but do not attempt to bypass it.
- **Never merge to `deploy` without owner approval.**
- **Never commit `.env` files.** The CI pipeline will catch this and block the
  merge, but prevention is better.
- **Never commit Supabase `service_role` keys.** They grant unrestricted database
  access. If one is ever accidentally committed, rotate it immediately in Supabase.
- **Never use `git push --force` on shared branches.**
- **Never skip the ClickUp task.** No task → no branch → no work.
- **Never deploy on a Friday or before a holiday** without explicit sign-off from
  the senior developer.

---

## Hotfix Procedure (Critical Production Bug)

For urgent production bugs only — skip `test` at your own documented risk.

```bash
git checkout deploy
git pull origin deploy
git checkout -b hotfix/description-of-bug
# fix the bug
git push origin hotfix/description-of-bug
# open PR directly to deploy — state reason for bypassing test in the PR description
# get owner approval — required even for hotfixes
```

After the hotfix is deployed, immediately back-merge it into `test`:

```bash
git checkout test
git merge deploy
git push origin test
```

---

## Rollback Procedure

If a deploy breaks the site, you can roll back by reverting the merge commit on
`deploy` and the GitHub Action will re-deploy the previous version.

```bash
git checkout deploy
git pull origin deploy
git revert -m 1 <merge-commit-hash>
git push origin deploy
```

Find the merge commit hash on GitHub under the `deploy` branch commit history.

---

## GitHub Settings (One-Time Setup)

These settings must be configured in GitHub by the repo owner:

### Default branch
`Settings → General → Default branch` → set to `test`

### Branch protection — `deploy`
`Settings → Branches → Add rule → Branch name pattern: deploy`
- [x] Require a pull request before merging
- [x] Require approvals — set to **1**
- [x] Dismiss stale pull request approvals when new commits are pushed
- [x] Require status checks to pass before merging
  - Status check: `Production Deploy Gate`
- [x] Require branches to be up to date before merging
- [x] Do not allow bypassing the above settings

### Branch protection — `test`
`Settings → Branches → Add rule → Branch name pattern: test`
- [x] Require a pull request before merging
- [x] Require approvals — set to **1**
- [x] Require status checks to pass before merging
  - Status check: `Validate Site`
- [x] Require branches to be up to date before merging

---

## GitHub Secrets (One-Time Setup)

`Settings → Secrets and variables → Actions → New repository secret`

| Secret name | Value |
|---|---|
| `FTP_HOST` | Your Vimexx FTP hostname (ask Martien) |
| `FTP_USERNAME` | Your Vimexx FTP username |
| `FTP_PASSWORD` | Your Vimexx FTP password |

These secrets are used by the deploy workflow and are never exposed in logs.

---

## Files Excluded from Deployment

The following files exist in the repository but are **never uploaded** to the
live server:

- `.git/`, `.github/` — version control internals
- `DEPLOYMENTS.md`, `README.md`, `LICENSE` — documentation
- `.env`, `.env.*` — environment files (should never be committed anyway)
- `vercel.json`, `.vercelignore`, `.vercel/` — old Vercel config, no longer used
- `package.json`, `package-lock.json` — Node.js config, not needed on server
- `gallery_fix.sql`, `supabase/` — database files, managed separately
- `.DS_Store`, `node_modules/` — OS and build artifacts
- `index-coming-soon.html` — archived file, not part of live site

---

## Version History

Every production deploy is a merge commit on the `deploy` branch. The full
history of what was deployed and when is visible at:
`GitHub → Rena.Farm → deploy branch → Commits`
