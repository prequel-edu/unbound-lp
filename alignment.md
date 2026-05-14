# Alignment — Unbound 3-Variant Landing Page System

**Last Updated:** 2026-05-12 (planning session via /plan)
**Owner:** Roberta Lindal
**Repo:** `prequel-edu/unbound-lp` (working dir `/tmp/unbound-lp`)
**HubSpot:** portal `49211848` (Unbound Academy)

---

## Feature

Three axis-specific landing page variants of `join.unbound.school/`, each tightly matched to one of three paid-ad messaging axes (Human-Centric, AI-Driven, Life Skills). Each variant feeds the same HubSpot form, captures an `lp_variant` value that routes the lead into one of three new branches in the existing v5 intake workflow (1797279138), each with axis-aware SMS bodies (same cadence structure) and an axis-aware nurture sequence that mimics existing sequence 274954004's flow with messaging-group-specific language swaps.

## Problem

Today all 3 ad message axes (30 Human-Centric ads, 10 AI ads, 14 Life Skills ads in the tracker) send to one generic LP. Message-match research suggests this is leaving 15–30% application-rate lift on the table. Beyond that, all leads currently funnel into one nurture sequence (274954004) regardless of which message hooked them, which dilutes the persuasion signal through the entire funnel.

## Approach (decision: 3 sub-path pages — original architecture)

Three sibling pages at `/human-centric/`, `/ai-driven/`, `/life-skills/`, each a near-clone of `index.html` with ~60–70% chassis shared and 30–40% bespoke (hero + first 2 body sections + selected imagery + CTA microcopy + accent color). The existing `/v2/` folder establishes the duplication precedent. The 3 variants share the same HubSpot form GUID with a new hidden `lp_variant` field, which the v5 workflow router uses to branch into 3 axis-aware nurture branches. `noindex` on all 3 variants (paid-only, no SEO).

## Key Decisions

1. **Sub-path structure, not query param** — Roberta's call; trades drift risk for cleaner Meta destination URLs and GTM differentiation. Drift risk mitigated by shared chassis discipline (see Risk #2 mitigation).
2. **Full sensory swap (copy + imagery + video)** — but Phase 1 ships with existing assets repurposed; axis-specific new shoots are deferred to Phase 2 (separate scope).
3. **Hidden form field `lp_variant`** — hardcoded per page, captured at HubSpot Forms API submission. **Must be added to the form definition** in HubSpot before launch (silent-drop lesson from `process_hubspot_form_field_mapping.md`).
4. **End-to-end alignment AND build in this session.**
5. **Email sequences mimic existing flow of 274954004** — same email count + cadence + Mike's voice, axis-specific language swapped into the relevant slots. Mike Goto (`michael.goto@unbound.school`, owner ID `77906684`) remains sender.
6. **SMS: replace existing workflow SMS bodies with axis-aware copy per branch.** Same workflow structure (initial → +7d × 4 ≈ 5 messages), same SalesMsg inbox (`salesmsg-138295` / Mike from Unbound Academy), axis-aware copy per branch.
7. **All 3 axes go live simultaneously** — Roberta's call; cuts wait time for value. Canary monitoring + suppression mapping mitigate brittleness (see Risk #4).
8. **Cross-axis "Other parents also explored" soft-link row on `/confirmed/`** — catches axis-persistence (parent enters AI, converts via Life Skills reassurance). NOT added to `/not-eligible/` (state/grade ineligibility, not axis-relevant).
9. **`noindex, nofollow`** on all 3 variants — they're paid-only ad LPs; no SEO value to preserve.
10. **Reframe success as a 6-month qualitative message-match commitment** — Unbound's current monthly conversion volume (likely <500) cannot reach statistical significance for variant-level A/B/C testing within 90 days. Directional indicators only: axis-specific CTR, application rate trend, sales-call quality, sequence engagement rate per axis.
11. **Visual font + color system stays IDENTICAL to existing `join.unbound.school`.** No accent-color differentiation, no new fonts, no new palette. All 3 variants inherit the existing `index.html` dark theme, neon-green primary, Satoshi + Coolvetica fonts, byte-identical CSS shell. Axis differentiation lives only in: (a) headline words (which noun gets the green accent), (b) hero photo content (9-grid Zoom mosaic for HC, single-student-at-laptop for AI, action/podium framing for LS), (c) body sections 1 and 2 content (different content TYPE per axis), and (d) CTA microcopy. Roberta's explicit direction 2026-05-14.

---

## User Flow Narrative

### Pre-LP: The Ad

A parent in Phoenix scrolls Meta. They see an ad in one of three axis buckets:
- **Human-Centric:** Latina mom testimonial, real student "Eva" podcast, ABC News validation, "2.8x faster" stat presented as caring-school proof
- **AI-Driven:** "Dramatic AI Hook," Zaki teacher newscast, Free Experience Day for AI-curious skeptics
- **Life Skills:** Sarah the tween author who beat traditional school, Ariana "Traditional vs. Virtual," Johnny/Olivia/Kelsey multi-student outcome reel

The ad URL points to the axis-specific LP with UTMs:
- `join.unbound.school/human-centric/?utm_source=meta&utm_campaign=human_centric_q2&utm_content=ad_16U`
- `join.unbound.school/ai-driven/?utm_source=meta&utm_campaign=ai_driven_q2&utm_content=ad_20U`
- `join.unbound.school/life-skills/?utm_source=meta&utm_campaign=life_skills_q2&utm_content=ad_24U`

### Screen 1: The Variant Landing Page (`/human-centric/`, `/ai-driven/`, or `/life-skills/`)

**What the parent sees** depends on which axis they landed on, but the chassis is the same.

**ASCII wireframe (axis-agnostic):**
```
+──────────────────────────────────────────────────+
│ [Unbound logo]            Home About Why  [Apply]│  ← nav (shared, byte-identical)
├──────────────────────────────────────────────────┤
│                                                   │
│  [eyebrow chip — axis-specific accent color]      │  ← Human=peach, AI=cyan, LS=yellow
│                                                   │
│  AXIS-SPECIFIC HEADLINE                           │
│  (e.g. "Your child will know their teacher's      │
│   name. And their teacher will know theirs.")     │
│                                                   │
│  Axis-specific subhead — one line, parent doubt   │
│                                                   │
│  [PRIMARY CTA →]     secondary axis-tuned link    │
│                                                   │
│  ✓ Arizona ✓ Grades 4-8 ✓ Virtual ✓ Tuition-free │
│                                                   │
│        [ AXIS-SPECIFIC STATIC HERO IMAGE ]        │  ← no hero video (load/bounce)
+──────────────────────────────────────────────────+
│ "As Seen In" press marquee (SHARED, byte-id'l)    │
+──────────────────────────────────────────────────+
│ FORM SECTION — left pitch + right form card       │  ← form copy slightly axis-tuned
│                                                   │     (form fields identical)
+──────────────────────────────────────────────────+
│ BODY SECTION 1 — content type varies by axis      │  ← see table below
│ ┌─Human: parent testimonial spotlight (video)     │
│ ├─AI: stats bar with MAP chart                    │
│ └─Life Skills: student outcome story card         │
+──────────────────────────────────────────────────+
│ BODY SECTION 2 — content type varies by axis      │  ← see table below
│ ┌─Human: teacher trio (3 portraits + pull-quote)  │
│ ├─AI: "How AI tutor works" 3-step explainer       │
│ └─Life Skills: workshop catalog (6 tiles)         │
+──────────────────────────────────────────────────+
│ "Unstoppable Students" portrait cards (SHARED)    │
+──────────────────────────────────────────────────+
│ "A Day at Unbound" schedule timeline (SHARED)     │
│   ▸ 2.8× faster stat callout (SHARED)             │
+──────────────────────────────────────────────────+
│ Clubs section + YouTube embed (SHARED)            │
+──────────────────────────────────────────────────+
│ Events carousel (SHARED)                          │
+──────────────────────────────────────────────────+
│ Testimonials — Rochelle/Breanna/Lauren            │  ← order varies per variant:
│                                                   │     Human: Rochelle leads
│                                                   │     AI: Lauren leads
│                                                   │     LS: Breanna leads
+──────────────────────────────────────────────────+
│ Podcast embed (SHARED)                            │
+──────────────────────────────────────────────────+
│ FAQ accordion — 9 Qs (SHARED, byte-id'l)          │
+──────────────────────────────────────────────────+
│ Final CTA — axis-aware microcopy                  │  ← same green bg, axis-tuned copy
+──────────────────────────────────────────────────+
│ Footer (SHARED, byte-identical)                   │
+──────────────────────────────────────────────────+
  [Sticky mobile CTA — axis-aware copy]
```

**Visual differentiation — CORRECTED from designer's initial proposal:**

Analysis of Pantelope's actual New Messaging Batch 1 statics (Ad 26U Human / Ad 27U AI / Ad 28U Life Skills) revealed that **all three axes use the same brand visual system**: cream/off-white background, neon-green accent on key noun, bold condensed display type, "Virtual Charter School Grades 4-8" eyebrow, real-student photography, "LEARN MORE" pill CTA. **Differentiation is through HEADLINE WORDS and PHOTOGRAPHY CONTENT, not through accent color.** The designer's peach/cyan/yellow proposal would break brand consistency.

| Axis | Brand colors (SAME across all 3) | Headline accent | Hero photo content (the actual differentiator) |
|------|----------------------------------|-----------------|------------------------------------------------|
| Human-Centric | Cream bg + neon-green key-word + dark navy text | Green on **"REAL TEACHERS"** / **"HUMAN TOUCH"** | 9-grid Zoom-mosaic of real student & teacher faces (Pantelope's flagship visual for this axis) |
| AI-Driven | Same | Green on **"AI"** | Single student at laptop with subtle AI-glow particle overlay (NOT cyan chrome) |
| Life Skills | Same | Green on **"REAL-LIFE SKILLS"** / **"THE REAL WORLD"** | Student at podium / building / writing / pitching — "in action" framing |

**Existing LP color system stays:** `index.html` uses a dark theme (navy bg, neon green primary). The 3 variants keep this exact palette — only the hero photo + headline accent word + body section content swaps.

**Hero copy — two sources now mapped, Roberta to pick H1 per axis:**

Two source documents inform LP hero copy:
- **Ivy's "Refreshed Messaging Strategy"** (Nov 25, 2025) — strategic positioning copy used as Meta Lead Gen form Headline + Description. Validated by performance (HC $28.73 CPL vs General $65.10).
- **Pantelope's top-performing ad scripts + Claude's Copy Brief** (provided by Roberta 2026-05-14) — hookier, more direct, drawn from highest-performing ad creatives.

**The shared spine across all 3 variants:** the **"2-hour learning"** hook. Every top ad references it. Each LP must establish this in the hero or directly below. It's the unique mechanism that makes the rest of the message land.

**Headlines — tailored per axis (Roberta's direction 2026-05-14):**

Each axis gets a headline tailored to its specific parent psychology. Final picks:

| Axis | Hero H1 | Why this works for this axis | Hero subhead (Ivy's description, trimmed) |
|------|---------|------------------------------|-------------------------------------------|
| **Human-Centric** | Real teachers. Real time. 2 hours a day. | Hits HC parent's #1 doubt (real teachers = not robots/recordings), adds "real time" (live/synchronous), anchors 2-hour mechanism. Echoes Pantelope's winning "REAL TEACHERS" static. | At Unbound Academy, your child is known, supported, and taught by real Arizona-certified teachers who meet with them every day. Our 2-Hour Learning model blends human connection with smart AI tools—freeing teachers to give more 1:1 attention and helping students learn faster, not lonelier. |
| **AI-Driven** | AI-powered learning. Real teachers at the center. | Hits AI promise then immediately disarms the AI-skeptic reflex. Adapts Ivy's positioning headline to LP-hero length. | Unbound Academy uses advanced AI to tailor every lesson while teachers lead, guide, and mentor daily. Students finish academics in 2 hours, then join live workshops with peers to build skills for the real world. |
| **Life Skills** | 2 hours of academics. Afternoons for life. | Parallel cadence, makes the shocking 2-hour hook pay off (why so short → so afternoons are free for life skills). Strongest LS-distinctive framing. | At Unbound Academy, students master core academics in just 2 hours with AI-personalized learning—then spend their afternoons in live life-skills workshops. From entrepreneurship and financial literacy to public speaking and grit, students learn from real teachers and collaborate with real classmates every day. |

**Headline accent treatment** (matches Pantelope's pattern of green-on-key-word):
- HC: green on **"Real teachers."** (first sentence) — leans into HC's strongest signal
- AI: green on **"Real teachers"** in "...at the center" — reassurance gets the visual weight
- LS: green on **"Afternoons for life"** — the LS-distinctive payoff gets the visual weight

**CTAs (consistent with winning-ad CTAs from Claude's brief):**

| Axis | Primary CTA | Secondary CTA |
|------|-------------|---------------|
| Human-Centric | Reserve your spot → | Book a free info session |
| AI-Driven | Learn more today → | Watch the 90-second teacher explainer |
| Life Skills | Enroll today → | See what students built |

**Voice note:** Ivy's subhead copy uses "kids" in 2 spots. Swapping to "students" on LPs to honor Roberta's writing rules. All other phrasing is Ivy's verbatim.

**Real testimonial pull-quote blocks per axis (from actual top-performing ads):**

| Axis | Pull-quote 1 (lead) | Pull-quote 2 (support) |
|------|---------------------|------------------------|
| **Human-Centric** | "When my mom brought it up to me first, I was hesitant because I didn't want to start over. But once I started, I realized this is a school for me." — **Elijah, Unbound Academy student** (Ad U25) | "My child went from struggling to thriving in just a few months. Kids build confidence, curiosity, and get the time to explore what they love." — **Unbound Academy parent** (Ad 50U) |
| **AI-Driven** | "I'm a real teacher at one of these so-called AI schools. We're not replacing teachers — I've never had more time to actually teach. AI handles the busy work, I get to work one-on-one with my students, lead live workshops, and help them build real projects they actually care about." — **Zack, Unbound Academy teacher** (Ad 19U) | "At first learning about an AI-driven school is a little bit intimidating and almost a little scary, but now my perspective has changed and I'm really leaning into the concept of it." — **Unbound parent** (Ad 19U) |
| **Life Skills** | "My mom was like, 'Only two hours of school? That's not enough.' But I'm actually ahead in math and reading. I got 90th percentile on my last test. Now my mom tells all her friends about my school." — **Unbound student** (Ad 8U — strongest LS performer) | "With traditional schools, students are stuck learning academics for six-plus hours. Here we do two hours where their brains are working way more effectively. And they're getting to apply actual life skills — entrepreneurship, grit, financial literacy — things they'd never get in a regular middle school." — **Unbound teacher** (Ad 23U) |

**Life Skills-specific comparison block (added per Claude's brief recommendation):**

| Traditional school | Unbound Academy |
|--------------------|-----------------|
| 6–8 hours of academics | 2 hours of AI-personalized academics |
| Standard electives (music, art) | Live life-skills workshops every afternoon |
| Mass-paced instruction | Mastery-based personalization |
| Teacher serves the class | Teacher serves the individual |

**Description meta tags per page (drafted from Ivy's copy):**
- HC page meta description: "Real Arizona-certified teachers, 1:1 attention, 2-Hour Learning model. Tuition-free online charter for grades 4–8."
- AI page meta description: "Arizona's most advanced AI-powered tuition-free charter school for grades 4–8. Real teachers + personalized AI tutoring."
- LS page meta description: "Tuition-free virtual charter for grades 4–8. 2 hours of academics, afternoons of life skills workshops."

**Performance data (Dec 2025–Jan 2026 review, source: Drive doc `1UuzRW9bBoqAWqEXQIwqVbp3Tu7aFgfZsgP7lNqdfEw0`):** Each axis campaign outperforms General Enrollment on CPL by **2.0–2.3×**. Human-Centric leads volume (70 leads, $28.73 CPL) and CPL (vs. General at $65.10). Life Skills + AI follow closely. This is real signal that the 3-axis strategy works at the ad layer — the LP work extends a proven approach, not a speculative one.

| Axis | Leads (2wk) | CPL | Spend |
|------|-------------|-----|-------|
| Human-Centric | 70 | **$28.73** | $2,011 |
| Life Skills | 66 | $30.57 | $2,018 |
| AI | 59 | $34.18 | $2,017 |
| General Enrollment (baseline) | 31 | $65.10 | $2,018 |

**Description meta tags per page (drafted from Ivy's copy):**
- HC page meta description: "Real Arizona-certified teachers, 1:1 attention, 2-Hour Learning model. Tuition-free online charter for grades 4–8."
- AI page meta description: "Arizona's most advanced AI-powered tuition-free charter school for grades 4–8. Real teachers + personalized AI tutoring."
- LS page meta description: "Tuition-free virtual charter for grades 4–8. 2 hours of academics, afternoons of life skills workshops."

**Body sections 1 + 2 — content type per variant (now anchored to real on-creative phrases + Life Skills Y2 doc):**

Source: on-image copy from Ad 26U/27U/28U statics + `Clubs/Life Skills - Year 2` doc (`1KTWkDSAVlrHXAULiHCqcdgiv8eujcnEqVJW-hYlM-7s`).

| Variant | Section 1 (Proof) | Section 2 (Mechanism) |
|---------|-------------------|----------------------|
| **Human-Centric** | Headline: "Your child is never alone." Visual: 9-grid Zoom mosaic of real student + teacher faces (matches Ad 26U Human-1 hero). Body pulls verbatim from on-creative: "the most interactive virtual school with high levels of teacher-student engagement." | Headline: "How real teacher-student interaction works at a virtual school." Visual: existing teacher portraits/screenshots. Body: explains Mike's daily check-ins, 1:1 office hours, live class sizes, Arizona-certified teacher credentials. |
| **AI-Driven** | Headline: "Personalized learning with AI." Body verbatim: "With AI, we adapt lessons to your child's needs, helping them accelerate their learning while staying engaged." Visual: single student at laptop, mastery progress indicator pulled in as a graphic element. Stat: "2.8× faster" cited from existing LP schedule section. | Headline: "How AI-powered learning works." Visual: 3-step explainer — diagnostic → personalized plan → mastery check. Body: explains the 2-hour academic block, AI tutor (Phoebe-like) workflow, mastery-based progression. |
| **Life Skills** | Headline: "School isn't just about grades." Body verbatim from Ad 28U: "At Unbound, we focus on life skills—coding, leadership, entrepreneurship, and more." Visual: student at podium / building / making (Ad 28U LS-2 hero). | Headline: "The 9 life skills your child will build at Unbound" — pulled directly from Life Skills Y2 doc: Grit, Critical Thinking, Giving & Receiving Feedback, Teamwork & Social Intelligence, Public Speaking, Storytelling, Entrepreneurship, Financial Literacy, Coding & Digital Literacy. Visual: 9-tile badge grid (or 3×3 club catalog: Business, Finance, Film, Debate, Robotics, Public Speaking, Storytelling, Entrepreneurship, Coding). Concrete outcomes: "Start a business, make $50–100 revenue" • "Score 70–90% on National Financial Literacy Exam" • "30-day Duolingo streak" — all pulled from Life Skills Y2 doc. |

**Phase 1 imagery reality check:** sections above describe the eventual state. Phase 1 ships with the existing photo/video library (Rochelle/Breanna/Lauren screenshots + 4 event photos + `prequel-transcode.mp4`) restyled with accent colors and reordered per axis. Stats bar and workshop tiles can be built from copy alone. New axis-specific photo/video shoots = Phase 2 ask to Pantelope.

**Interactive elements on the LP:**
| Element | Type | Action | Result |
|---------|------|--------|--------|
| Primary CTA button | scroll-to-form | Click | Smooth scrolls to `#apply` section, focuses first input |
| Secondary CTA | varies per axis | Click | Human/AI: opens modal with 60-sec video. LS: anchor-jumps to outcome gallery |
| Form (visible fields) | first_name, last_name, email, phone, state_code dropdown, zip_code, grade_eligibility dropdown | Submit | See Form Submission flow below |
| Form (hidden fields) | utm_source/medium/campaign/term/content + **NEW**: `lp_variant` | Auto-filled on page load | Captured and sent on submit |
| FAQ accordion | Click question | Click | Toggle answer reveal (existing behavior) |
| Sticky mobile CTA | Scroll-to-form | Click | Same as primary CTA |

**Hidden field per page:**
| Page | `lp_variant` value |
|------|-------------------|
| `/human-centric/index.html` | `human_centric` |
| `/ai-driven/index.html` | `ai_driven` |
| `/life-skills/index.html` | `life_skills` |
| `/index.html` (existing) | (not set — default branch) |
| `/v2/index.html` | (not set — default branch) |

**States — variant LP:**
- **Loading:** Hero image lazy-loaded; sticky CTA visible immediately
- **Form empty:** Default state, all fields blank, hidden fields auto-filled from URL params + variant hardcode
- **Form submitting:** Button spins, reCAPTCHA v3 fires invisibly, Forms API call to `api.hsforms.com/submissions/v3/integration/submit/49211848/92ec0262-...`
- **Form success (AZ + eligible grade):** Redirect to `/confirmed/?state=arizona&grade=eligible&variant=human_centric` (variant param NEW)
- **Form success (any other state OR ineligible grade):** Redirect to `/not-eligible/?state=...&grade=...&variant=...`
- **Form error (validation):** Inline error below invalid field, focus moves to first error
- **Form error (network):** Toast "Couldn't submit. Try again?" — form data preserved
- **reCAPTCHA fail:** Submit blocked, generic "Please try again" message

### Screen 2: Form submission → HubSpot

**On submit, the LP JS:**
1. Reads all visible + hidden inputs
2. Remaps field names to HubSpot internal names (existing JS at `index.html:1104–1112`)
3. Appends reCAPTCHA token
4. POSTs to `https://api.hsforms.com/submissions/v3/integration/submit/49211848/92ec0262-98d4-4aa7-be7f-812ca5f0ec2f`
5. On success: fires FB Pixel `Lead` event, redirects to `/confirmed/` or `/not-eligible/` based on state + grade

**Where `lp_variant` flows:**
1. HTML hidden input on LP → POST body
2. **Form definition in HubSpot includes `lp_variant`** (must be added — see Risk #4)
3. → Contact property `lp_variant` set on contact creation
4. v5 workflow trigger fires
5. Workflow snapshots `lp_variant` + UTMs to a Deal property at the appropriate stage (NEW — prevents revisit overwrite, see Risk #3 mitigation)

### Screen 3: v5 Workflow Router (workflow `1797279138`)

The current workflow runs:
- Spam filter (action 3)
- Marketable status set (action 4)
- Returning Inquiry vs. New Lead branch (action 812)
- AZ vs. Out-of-State (action 5)
- Grade gate: Too Young, Too Old, Eligible (action 6)
- For Eligible AZ leads with email: Slack notify (9) → Active lead status (10) → Lifecycle (11) → Owner = Mike (815) → Sequence 274954004 enrollment (732) → SMS cadence (101 → +7d → 723 → +7d → 726 → +7d → 729 → +7d → set Non-Responsive)

**The router insertion:** Add a NEW branch on `lp_variant` AFTER action 815 (owner assignment), BEFORE action 732 (sequence enrollment). Routes to 1 of 4 branches:

```
After action 815 (owner = Mike, 77906684):
  │
  ▼
┌─ NEW: LIST_BRANCH on lp_variant ──────────────────────┐
│                                                        │
│   IF lp_variant = "human_centric"                     │
│     → enroll sequence_HC (NEW)                        │
│     → SMS cadence with HC-aware bodies                │
│                                                        │
│   IF lp_variant = "ai_driven"                         │
│     → enroll sequence_AI (NEW)                        │
│     → SMS cadence with AI-aware bodies                │
│                                                        │
│   IF lp_variant = "life_skills"                       │
│     → enroll sequence_LS (NEW)                        │
│     → SMS cadence with LS-aware bodies                │
│                                                        │
│   DEFAULT (no lp_variant)                             │
│     → enroll sequence 274954004 (current behavior)    │
│     → SMS cadence with current bodies                 │
└────────────────────────────────────────────────────────┘
```

Each branch then runs the same delay structure as today (+7d × 4 ≈ 5 SMS touches over 28 days), with axis-specific message bodies. Final action in each branch sets `hs_lead_status = Non Responsive` if no engagement, matching current behavior.

**Suppression mapping (Risk #5 mitigation):**
- Variant sequences (HC, AI, LS) and 274954004 are mutually exclusive — contacts cannot be enrolled in two simultaneously
- Existing v5 unenroll companion (1801281945 if applicable for Unbound — check Novatio retro for pattern) extended to also exit variant sequences on `hs_lead_status` change to Booked Call / Connected / Applied
- Cap sends per contact per week at 4 (workflow-level guard or sequence-level pacing)

### Screen 4a: Confirmed page (`/confirmed/`)

For AZ + grade-4-8 eligible leads. Current page is message-agnostic; **adds** a new "Other parents also explored" soft-link row below the existing "what to expect" steps. Row contains 3 cards linking to the *other two* axes the parent didn't enter through (catches axis-persistence behavior).

**ASCII wireframe (new addition only):**
```
[existing "what to expect" 1-2-3 steps]
[existing "Start Your Application" CTA]
[existing podcast embed]
[existing event/luma CTAs]

────────────────────────────────────────
   "Other parents also explored:"
   (smaller type, neutral copy)

   [card 1]       [card 2]       [card 3]
   minimal        minimal        minimal
   border only    border only    border only
   "Curious      "Real           "How AI
    about        teachers,        tutoring
    student      small            works?"
    outcomes?"   groups?"         → /ai-driven/
   → /life-     → /human-
     skills/      centric/
   ────────────────────────────────────────
[existing footer]
```

The 2 cards shown are always the OTHER two axes (read from URL param `?variant=`). Variant param is appended on the redirect from the LP form submit.

### Screen 4b: Not-Eligible page (`/not-eligible/`)

No changes. Existing variants (out-of-state, too-young, too-old, default) cover state/grade ineligibility — axis-relevance doesn't apply here.

### Screen 5: Email Sequences (3 new + 1 existing default)

**Approach: mimic 274954004's structure** (same count, cadence, voice, Mike's signoff) with axis-specific language in the relevant slots — typically headline, opening hook, 1–2 body paragraphs, and CTA microcopy. Closing paragraphs converge to unified Unbound messaging by emails 4+ (per critic's #3 mitigation).

**Per-axis sequence (axis hooks below; full drafts produced in build phase via `/email` skill):**

| Email | Cadence | Human-Centric hook | AI-Driven hook | Life Skills hook |
|-------|---------|-------------------|----------------|------------------|
| 1 | Day 0 | "I want you to meet our teachers" | "Let me show you how your child's tutor works" | "Sage published her book at 12. Here's how" |
| 2 | Day 3 | Parent voices (Rochelle's story) | Mastery proof (MAP scores + chart) | Student outcomes (workshop showcase) |
| 3 | Day 7 | Day in the life — community angle | Day in the life — learning velocity angle | Day in the life — afternoon projects angle |
| 4 | Day 14 | (Converging) "Unbound is human, AI-driven, and skills-rich — here's all 3" | (same convergence) | (same convergence) |
| 5 | Day 21 | Direct ask + book a call w/ Mike | Direct ask + 90-sec demo invite | Direct ask + apply now |

Sequence count and cadence to match 274954004's existing count once Roberta confirms it. If 274954004 has more or fewer emails, mirror that exactly. Sender stays Mike (`michael.goto@unbound.school`).

### Screen 6: SMS cadence (workflow-embedded, replacing 274954004's SMS bodies in branches)

Existing SMS pattern in workflow:
1. Action 101 (immediate after sequence enroll): "Hey - it's Mike, Head of School at Unbound Academy! So excited you're exploring us..."
2. Action 723 (+7d): "Mike here - just following up! Our students average 2.5x growth on their MAP scores..."
3. Action 726 (+7d): "Just checking in - still exploring school options? ..."
4. Action 729 (+7d): "One more thing - we have a pre-recorded open house..."

**Per-axis SMS bodies (axis-aware first 1–2 SMS, converging by SMS 3+). Drafts use Chris Brisson "tiny text" rules: <160 chars, lowercase, one idea, question-based.**

| SMS step | Cadence | Human-Centric | AI-Driven | Life Skills |
|----------|---------|---------------|-----------|-------------|
| 1 (immediate) | day 0 | hey, it's mike from unbound. saw you checked us out — what grade is your kiddo in? wanted to make sure I send you the right teacher intro | hey, it's mike from unbound. saw you checked out the AI tutor side — what subject does your child struggle with most? | hey, it's mike from unbound. you saw what our students build — what's your child into right now? building, writing, business? |
| 2 (+7d) | day 7 | wanted to share a quick parent story — rochelle's daughter went from anxious about school to running the homework club. happy to text you the video? | quick thing — our students average 2.5x MAP growth in 1 year. want me to send the report on how AI tutoring drives that? | sage published a book at 12. ian started a business at 13. want me to send their stories? |
| 3 (+7d) | day 14 (converging) | still exploring? happy to hop on a call — 15 min. https://meetings.hubspot.com/michael-goto | same convergence | same convergence |
| 4 (+7d) | day 21 (converging, unified) | one last thing — pre-recorded open house you can watch on your time. https://luma.com/UnboundSchool | same | same |
| 5 (+7d) | day 28 (status set: Non-Responsive) | (no SMS — just sets status; could optionally send "no rush, here when you're ready" final) | same | same |

(SMS bodies above are drafts — final copy reviewed against Mike's voice + Roberta's writing-rules feedback in build phase.)

---

## External Research Findings

### Sources Consulted
| Source | Insight | Credibility |
|--------|---------|-------------|
| [Unbounce — Message Match](https://unbounce.com/conversion-glossary/definition/message-match/) | onX case: strong-match LP +50%; campaign-specific email LP +77% | H (anecdote, not meta) |
| [CXL — LP Optimization Case Study](https://cxl.com/blog/case-study-how-we-improved-landing-page-conversion/) | +21.7% opt-ins after iteration, 99.7% confidence | H |
| [Truth Tree — School Admissions LP](https://truthtree.com/post/the-essential-school-landing-page-for-2022-23-admissions) | Hero answers what/who/next-step in 5 seconds | M |
| [Attribution Academy — UTM to Deal Mapping](https://www.attribution.academy/blog/how-to-capture-and-map-utm-parameters-to-custom-deal-properties-in-hubspot-for-attribution) | Snapshot UTMs to Deal at creation to prevent overwrite | H |
| [Bing Webmaster — Duplicate Content](https://blogs.bing.com/webmaster/December-2025/Does-Duplicate-Content-Hurt-SEO-and-AI-Search-Visibility) | Canonical or noindex variants to avoid SEO dilution | H |
| [ConvertFlow — Single Product LPs](https://www.convertflow.com/landing-pages/single-product) | AG1's "shared chassis + swapped narrative layer" pattern | M |

### Best Practices Applied
- Shared chassis 60–70%, bespoke 30–40% — not full duplication (saves maintenance debt)
- "Your child will…" parent-as-hero voice, not "We offer…"
- Static hero + below-fold testimonial reel, not hero video (load/bounce)
- `noindex` paid-only variants (no SEO value to preserve)
- 3-layer tracking: UTMs + hardcoded `lp_variant` + Deal-snapshot at creation
- First-touch AND last-touch `lp_variant` as separate Deal properties (axis-persistence mitigation)

### Warnings Addressed (each → mitigation in plan)
- ⚠️ Statistical impotence at <500 conv/mo split 3 ways → reframed as 6-month qualitative bet, not measurable A/B test (Key Decision #10)
- ⚠️ Maintenance entropy (3 files drift) → shared-chassis discipline + monthly chassis-diff audit (Risk #2)
- ⚠️ Axis non-persistence → first/last-touch capture + cross-axis cards on `/confirmed/` (Key Decision #8)
- ⚠️ Silent form-field drop → add `lp_variant` to form definition before launch (Key Decision #3)
- ⚠️ Sequence contradiction → mutual suppression + 4-sends-per-week cap (Risk #5)

---

## Agent Contributions

| Agent | Contribution |
|-------|-------------|
| `res--codebase-explorer` | Full anatomy of `/tmp/unbound-lp/index.html` with line citations, form integration details (portal `49158869` → corrected to `49211848`, form GUID `92ec0262-...`), GTM `GTM-TXR4Q7DK`, asset map, `/v2/` precedent confirmed |
| `str--researcher` | Message-match lift evidence (15–30% realistic), shared-chassis pattern, 3-layer tracking stack, "axis persistence" original insight |
| `str--critic` | 5 failure modes pre-mortem: stat-significance, drift, axis non-persistence, silent mis-route, sequence contradiction. Recommended pivot to single-page-with-param (overruled by Roberta — sub-paths chosen). |
| `imp--ui-designer` | 200ms visual key strategy per axis, hero drafts, dual CTA per variant, anti-template guardrails (different content TYPE in body sections, not just different words), testimonial reorder per variant |
| (direct via Composio SDK) | Ad tracker: 54 axis-tagged Unbound ads parsed (30 Human, 10 AI, 14 LS) |
| (direct via HubSpot MCP) | v5 workflow 1797279138 inspected: sender = Mike Goto, SMS inbox `salesmsg-138295`, existing sequence 274954004, 39+ form-GUID trigger list (form already in trigger) |

### Preserved Dissent

- **`str--critic` maintained concerns after deliberation:**
  - 80% confidence the 3-page architecture is over-engineered for volume. Recommended single-page-with-param. **Roberta overruled** — accepted maintenance risk to preserve Meta destination URL cleanliness and GTM differentiation. Mitigation: monthly chassis-diff audit.
  - Creative supply (not LP supply) is the durability bottleneck. By month 3, if Pantelope can't sustain 3 distinct axis-coherent creative streams, message-match breaks at the ad layer. **Open Phase 2 ask to audit Pantelope capacity.**

---

## Risks Accepted

| # | Risk | Source | Severity | Mitigation Baked In |
|---|------|--------|----------|---------------------|
| 1 | Statistical impotence at <500 conv/mo ÷ 3 | str--critic | High | Reframed success as 6-mo qualitative bet (Key Decision #10) — directional indicators only, no re-litigating on weekly noise |
| 2 | Three LPs drift over 6 months | str--critic | High | Shared chassis discipline; monthly chassis-diff audit (post-launch); flag any change touching shared sections in PR/commit |
| 3 | Axis non-persistence (multi-touch parent) | str--critic + str--researcher | Medium-High | First-touch + last-touch `lp_variant` as separate Deal properties; cross-axis "other parents also explored" cards on `/confirmed/`; emails 4+ converge to unified message |
| 4 | Silent form-field drop on `lp_variant` | str--critic + own memory | High | Add `lp_variant` as known field to HubSpot form definition BEFORE launch; canary list "paid-social leads created in last 7d with `lp_variant IS_UNKNOWN`" checked daily for 14 days post-launch (lesson from `process_workflow_monitoring.md`) |
| 5 | Sequence contradiction / over-emailing | str--critic + feedback_workflow_suppression_check.md | Medium | Variant sequences mutually exclusive with each other AND with 274954004; cap sends per contact per week at 4; map all active Unbound sequences before enabling router |
| 6 | Cutover gap (Novatio v4 lesson) | retros/RETRO-2026-04-08 | Medium | Enable new workflow router BEFORE switching ad URLs; 30-min overlap window per Sarah Gartin gap lesson |
| 7 | Phase 1 imagery looks like AI-slop copy-paste | imp--ui-designer | Medium | Different content TYPE in body sections 1+2 per variant (not just different words); same student cast reordered per variant; accent color in 2–3 spots max |
| 8 | Creative supply dries up at month 3 | str--critic | Medium-High | Phase 2 ask: audit Pantelope capacity for 6 months of 3-axis creative; if can't sustain, collapse to 2 axes |

---

## What We're NOT Doing (Explicit Exclusions)

- ❌ Refactoring the LP into a partials/template system (each page stays self-contained HTML — matches /v2 precedent)
- ❌ Hero video on the variant pages (static hero + below-fold reel — research-aligned)
- ❌ Separate HubSpot form per LP (one form `92ec0262-...` with `lp_variant` hidden field — see codebase note: HubSpot Forms API silent-drops unknown fields, must patch form definition)
- ❌ Per-variant `/confirmed/` and `/not-eligible/` pages (those stay axis-agnostic; soft cross-axis cards added to `/confirmed/` only)
- ❌ Canonical tags (using `noindex` instead — paid-only, no SEO to preserve)
- ❌ A/B/C statistical testing claims (insufficient volume; positioned as 6-mo qualitative bet)
- ❌ New imagery/video production (Phase 1 uses existing assets; new shoots = Phase 2)
- ❌ Enabling anything live in HubSpot without explicit go-ahead (workflows stay disabled until Roberta says "go")

---

## Confidence Level

**Medium-High (75%)** that the build executes cleanly with the risks above mitigated. **Medium (65%)** on application-rate lift materializing in the realistic 15–30% range — the underlying creative quality and Unbound's product-market fit do more heavy lifting than the LP architecture.

The dissent is preserved: if at 90 days `lp_variant IS_UNKNOWN` rate is >5% of paid leads, or chassis drift is observed across files, or unsubscribe rate jumps >1.5×, revisit the single-page-with-param architecture.

---

## Cutover Plan (all 3 axes simultaneously per Key Decision #7)

| Day | Action | Verification |
|-----|--------|--------------|
| Build day 1–3 | Build 3 LP HTML files, draft 3 sequences, draft SMS bodies, design workflow router (disabled) | File diffs reviewed, copy approved by Roberta |
| Build day 4 | Add `lp_variant` to HubSpot form definition | Test submission with curl confirms field accepted, value reaches contact property |
| Build day 5 | Create 3 new HubSpot sequences (HC, AI, LS) — disabled / draft state | Sequence IDs captured; emails reviewed |
| Build day 6 | Build workflow router branch in HubSpot UI (workflow 1797279138) — branch ADDED but not yet routing (defaults to current behavior) | Workflow revision incremented; clone of pre-change action graph saved |
| Build day 7 | Deploy 3 LP HTMLs to GitHub Pages | Manual visit + form submission test each variant; verify hidden field captures; verify redirect to `/confirmed/` with `variant=` param |
| Build day 8 | Switch Meta ads on Human-Centric axis to point to `/human-centric/` | First 5 leads verified end-to-end through workflow + sequence + SMS |
| Build day 9 | Switch AI-Driven + Life Skills ads to their variant URLs | Canary list checked: leads with `lp_variant IS_UNKNOWN` should be ~0 |
| Days 10–24 | Daily canary check; weekly sequence-engagement review | If `lp_variant IS_UNKNOWN` >5% → rollback ad URL routing, investigate before re-enabling |

**Rollback path:** Pause workflow router branch (default to current 274954004 behavior); switch Meta ads back to `/` root. Variant LPs stay live but unused. Zero-data-loss because variant sequences enroll on event, not on demand.

---

## ✅ Ready to Build

Phases 1–8 complete. Next: build artifacts directly in `/tmp/unbound-lp/` and in HubSpot (workflows disabled / sequences in draft until Roberta says "go live").

**Build order:**
1. 3 LP HTML files (in `/tmp/unbound-lp/human-centric/`, `/ai-driven/`, `/life-skills/`)
2. v5 router workflow spec (JSON + screenshots of intended HubSpot UI state)
3. 3 email sequence drafts via `/email` skill (mimicking 274954004 structure)
4. 3 SMS body sets (workflow-embedded, drafted per Brisson tiny-text rules)
5. Canary monitoring list spec + cutover runbook

Once built, Roberta reviews before any deploy or workflow enable.
