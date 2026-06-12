# Changelog — unbound-lp

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
