# Account refresh v2 — local review

Run from Website Folder: `python3 preview/portal-v2/server.py`.
Open http://localhost:3000/ for the empty account design, or
http://localhost:3000/?state=error for simulated connection failures.

The server renders the actual portal HTML, CSS and controller with an offline
adapter in place of Supabase. It binds only to loopback. There are no customer
records, fake testimonials, or backend writes in this preview. Sending messages
and saving profiles are disabled. The production portal retains its login gate.

Changes: compact identity strip, semantic keyboard tabs, actionable summaries,
new enquiry action, onboarding and help cards, compact account-only footer,
scoped responsive styles, separate loading/error/empty states, and confirmed
message-read updates only when the messages tab is opened.

All runtime assets have v2 filenames. Shared layout changes are account opt-in.
Before release, authenticated read/write journeys need staging verification;
local offline checks do not establish hosted Supabase permissions or delivery.
No commit, push, PR or deployment is part of this review.
