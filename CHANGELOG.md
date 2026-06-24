# Changelog — unbound-lp

## 2026-06-23 — Move enrollment form above the fold (all chassis + variants)

**Change.** The enrollment form card was moved up into the hero so it sits above the fold on
`join.unbound.school/`, the 3 variants (`human-centric/`, `ai-driven/`, `life-skills/`), and `v2/`.

- **Desktop:** hero is now a 2-column grid — headline/subhead/CTA/stat on the left, white form
  card on the right (`.hero-grid` / `.hero-form`). Whole form sits above the fold.
- **Mobile (≤960px):** the hero stacks via flexbox with `display:contents` on `.hero-body`,
  reordering to eyebrow → H1 → **form** → subhead → button → pills, so the form heading and first
  inputs are above the fold while the headline hook stays on top.
- `id="apply"` moved onto the hero form, so all "Enroll Now" CTAs (nav, hero, final, sticky) still
  target it.
- The former form section keeps its pitch/price/reassurance/parent-quote as a centered single-column
  trust band (`.form-grid--solo`), preserving the `build-variants.mjs` per-variant copy markers.

**Verified (Playwright, local + live):** 1 form per page (moved, not duplicated), correct `lp_variant`
per variant, no horizontal scroll, and the 2026-06-12 silent-submit validation still blocks empty
submits (inline errors, no HubSpot POST, no redirect).

**Rollback.** `git revert` this commit; GitHub Pages redeploys `main` on push.

## 2026-06-12 — Fix: silent form-submission failure (all LP variants)

**Problem.** The submit handler called `await fetch(<hubspot submit>)` without checking
`response.ok`, then showed "✅ You're on your way!" and redirected to /confirmed/
UNCONDITIONALLY (the catch block also fell through to success). Any HubSpot rejection
(HTTP 4xx/5xx — bad field, 429 rate-limit, outage) or network failure was swallowed: the
visitor saw success and was redirected, but NO lead was created — and `fbq('Lead')` fired
anyway, inflating Meta's lead count vs. real HubSpot contacts. Confirmed live via a forced
400 in Playwright. Affected join.unbound.school/{human-centric,ai-driven,life-skills}/ + root.

**Fix** (chassis `index.html` → 3 variants rebuilt via `build-variants.mjs`):
- Check `res.ok`; only show success / redirect / fire `fbq` on a real 2xx.
- On HTTP error or network failure: show an inline retry error, re-enable the button, do NOT
  redirect, do NOT fire fbq.
- Retry once on a transient failure (HTTP 429 / 5xx / network) with an 800ms backoff — self-heals
  the most likely silent-loss cause (HubSpot rate-limiting during ad spikes). Permanent errors
  (e.g. 400) are not retried.
- On final failure, fire a Meta pixel `LeadSubmitFailed` custom event (pixel already on page) so the
  failure rate is visible in Meta Events Manager. No Zapier / external hook, no PII.

**Verified** (Playwright, 2026-06-12): 200 → success+redirect; 400 → inline error, no redirect,
button re-enabled, fires LeadSubmitFailed (no normal Lead event); 429-then-200 → retry succeeds; network abort → error after retry.


### Also in this commit — required-field UX + contact fallback (2026-06-12)
- Branded required-field validation replaces the native browser tooltip: red asterisks on labels,
  red border + inline "<Field> is required" on each empty field, focus the first empty field,
  errors clear as the parent types. Form is `novalidate` so the JS controls all messaging.
  (Incomplete forms were already blocked; this just makes it obvious — esp. on mobile.)
- Failure error message now gives a fallback: "call or text (602) 962-8979 or email
  admissions@unbound.school" (tappable tel:/mailto: links).

**Rollback.** `git revert <commit>` (or restore prior `index.html` + rerun build-variants.mjs), redeploy.
