# China Travel Companion design — 2026-10-08

## Goal

Add a **travel-planning feature** (not an autonomous agent) to the existing
`en-fr-chinese-entry-mvp` app. A foreign visitor to China enters a short request
— destinations, trip length, interests, pace, budget — and receives a structured,
personalized itinerary covering **getting there / around, a day-by-day plan, and
where to stay**, plus practical essentials (payments, connectivity, etiquette,
safety, visa/entry).

The feature is **content-driven and works fully offline**: the accurate core is a
curated, versioned travel-content module composed by a deterministic planner.
No external API key or network call is required for the MVP.

## Why deterministic-first

Travel facts (fares, opening hours, train times, hotel prices) are perishable. A
language model asked to "write a China itinerary" will confidently invent them.
The reviewer's P1 constraint is explicit: **time-sensitive facts must come from a
grounded source or be clearly marked "reference only / verify official" — never
model memory.**

Therefore the MVP composes itineraries from curated content that is **data, not
prose**: every factual item carries a source and a `lastChecked` date, and is
classified as `stable` (etiquette, transport modes, culture) or `perishable`
(prices, hours, schedules). Each item also carries `origin: 'curated' | 'live'`
so the model can distinguish a **static reference** from future **live** data;
the UI surfaces origin only when live facts are present (per-fact chips on
pure-curated output are noise). All facts render with their source +
last-updated; `perishable` facts additionally render a prominent "Verify
official" badge. Nothing factual is free text baked into a prompt. This makes
the feature accurate, cheap, testable, and independent of any LLM.

An optional, separately-gated AI enrichment layer and read-only live adapters are
designed here but **deferred** (see [Deferred](#deferred-phase-2)); the MVP
ships and is testable without them.

## Scope

### In scope (MVP)

- New `/travel` route with a **request form**: destinations (from a curated
  list), days, interests, pace, budget, output language.
- A **deterministic planner** that allocates days, selects attractions by
  interest/pace, and assembles a structured itinerary.
- Itinerary output: trip summary, per-day plan (attraction + suggested duration +
  transport between + a meal suggestion + tips), stay-area recommendations, and
  a practical block.
- **Provenance model**: `stable` vs `perishable` facts; perishable facts carry a
  source reference and a `lastVerified` date and always show a
  "Verify official" affordance.
- **Disclaimers**: visa/entry and safety content is explicitly informational,
  not legal advice; a content-freshness banner shows the content verification
  date and warns when it is stale.
- **Bilingual UI + content**: en (default) and fr, matching the app's existing
  languages; an output-language toggle.
- Full unit + component + e2e coverage, including failure/empty-input paths.

### Out of scope (explicitly deferred)

- Live booking, payments, or reservations of any kind.
- Live prices, live timetables, real-time transit/rail/weather feeds (phase 2
  adapters, see [Deferred](#deferred-phase-2)).
- User accounts, cloud trip saving, sharing. (Optional browser-local saving only.)
- Visa eligibility decisions (only general reminders + official links).
- Coverage of every Chinese city — MVP ships a bounded, curated seed set.

## Architecture

```
Browser (/travel)
  ├─ TravelRequestForm ──► TravelRequest (validated, bounded)
  ├─ buildItinerary(request, travelContent)   ← pure, deterministic, no network
  │     ├─ allocate days across destinations (interest/pace weighted)
  │     ├─ select attractions by interest score + pace cap per day
  │     ├─ attach stay-area suggestion per destination (by budget)
  │     └─ attach practical block + disclaimers + provenance
  └─ ItineraryView ──► summary · day cards · stay cards · practical panel
```

- **No database.** The request/intinerary live in component state; optionally
  persisted to `localStorage` (existing `src/lib/storage.ts` pattern).
- **No server route in MVP.** The planner is pure client code over bundled
  content (the app already ships content client-side; e.g. `src/content/*`).
- Follows the app's established layering: content in `src/content/travel/`,
  logic in `src/lib/travel/`, UI in `src/pages/` + `src/components/travel/`.

> Phase 2 adds `api/travel/index.ts` → `src/server/travel/*` mirroring the
> `src/server/voice/*` lazy-handler pattern. It is **not** part of the MVP and
> must not block it.

## Content model

`src/content/travel/types.ts` (exact shapes finalized in the plan):

- `TravelDestinationId` — union of the seed city ids.
- `FactFreshness = 'stable' | 'perishable'`.
- `FactOrigin = 'curated' | 'live'`.
- `TravelSourceRef { id, label, url?, kind: 'official' | 'operator' | 'reputable', lastChecked }`.
- `TravelFact` (base for every factual item) — `{ id, text/title: LocalizedField,
  origin: FactOrigin, freshness: FactFreshness, sourceIds: string[],
  lastChecked: string }`. **Every** factual item extends this; there is no
  source-less fact.
- `Attraction extends TravelFact { category: Interest, area, durationHours,
  description, tips? }`.
- `StayArea extends TravelFact { name, vibe, bestFor: Interest[], priceTier, transportNotes }`.
- `TransportOption extends TravelFact { mode: 'air'|'rail'|'metro'|'bus'|'taxi'|'rideshare'|'bike'|'walk',
  notes? }`.
- `PracticalInfo { payments, connectivity, etiquette, safety, visaEntry, emergencyNumbers }`
  — each entry is a `TravelFact` (so it too carries a source); `visaEntry`/`safety`
  additionally carry a mandatory disclaimer flag.
- `Destination { id, name, region, summary, bestSeasons, welcome, attractions,
  stayAreas, transport: { arrival[], gettingAround[] }, practical, sources, lastVerified }`.
- `TravelContent { destinations, practical (country-level), contentVersion, generatedFrom }`.

Seed set (final list confirmed by @Dylan): `beijing`, `shanghai`, `xian`,
`chengdu`, `hangzhou`, `guilin` (≥ 3 required to make multi-city real).

Content validation enforces: every `TravelFact` has ≥1 resolvable `sourceIds`
entry and a valid `lastChecked`/`lastVerified`; `perishable` items are present so
the "Verify official" path is exercised; every `LocalizedField` has en+fr. No
fact — perishable or stable — may exist without a source. In addition, **every
`perishable` fact must cite at least one source with `kind: 'official'` and a
non-empty `url`**, so its "Verify official" affordance is always actionable (P2-3:
a perishable badge must never be a dead link). `TravelSourceRef.url` stays
optional in the type, but this validation rule makes it effectively required for
perishable facts.

## Planner

`src/lib/travel/`:

- `request.ts` — `TravelRequest { destinations: TravelDestinationId[]; days: number;
  interests: Interest[]; pace: 'relaxed'|'standard'|'packed'; budget:
  'budget'|'mid'|'comfort'; language: ExplanationLanguage }` plus
  `validateTravelRequest` (bounds: 1–7 destinations, 1–21 days,
  `days ≥ destinations.length` so day allocation is well-defined, ≥ 0 interests,
  unknown id → error) and `DEFAULT_TRAVEL_REQUEST`.
- `planner.ts` — `buildItinerary(request, content, deps?)`:
  - dedupe/validate destinations; allocate `days` across them (longer trips get
    multiple days; multi-city inserts a travel half-day), weighted by interest
    match and attraction count;
  - select attractions per destination by `Interest` score + `pace` daily cap
    (`relaxed` 1, `standard` 2, `packed` 3), no repeats, prefer higher score then
    stable id order for determinism;
  - choose a `StayArea` per destination matching `budget` and top interest;
  - assemble `practical` + disclaimers + provenance;
  - deterministic: same `(request, content.contentVersion)` → identical **plan
    body** (see [Determinism contract](#determinism-contract-p1-1)).
  `deps.now` is injectable so tests are stable.
- `itinerary.ts` — `TravelItinerary { summary, legs[], days[], stays[],
  practical, disclaimers, meta: { contentVersion, lastVerified, generatedAt,
  freeDays } }`.

### Determinism contract (P1-1)

Determinism is defined over the **plan body** —
`summary`, `legs`, `days`, `stays`, `practical`, `disclaimers`, and the
`contentVersion`/`lastVerified`/`freeDays` parts of `meta`. The clock-derived
`meta.generatedAt` is explicitly **outside** the determinism contract (it cannot
be byte-identical across two real calls). Concretely:

- AC7's "byte-identical" compares the plan body only; the golden snapshot
  normalizes/omits `generatedAt`.
- Task 3's "two calls equal" test injects a fixed `deps.now` (so `generatedAt` is
  also equal in-test) **and** asserts the body equality independently of the
  clock. Both mechanisms are required so the golden can never be flaky.

### Day allocation vs. attraction capacity (P1-2)

Requests allow 1–7 cities and 1–21 days, but each seed city publishes a bounded
set of attractions (≥4) at pace caps of 1–3/day with no repeats. A request can
therefore ask for more attraction-days than a city can fill. The exact rules
(no interpretation room for the golden):

**Definitions**

- `paceCap` = `relaxed` 1 · `standard` 2 · `packed` 3 attractions/day.
- `usable(d)` = attractions of `d` whose category is in `request.interests`,
  ordered by (interest score desc, stable `id` asc). If the intersection is
  empty, `usable(d)` = all attractions of `d` (a city is never unusable).
  `N_d = |usable(d)|` (≥4 by content validation).
- `capacityDays(d) = ceil(N_d / paceCap)` — the maximum number of
  attraction-bearing days the city can fill without repeating an attraction. The
  final day may be partially filled (the remainder attractions), hence `ceil`.
- **Travel day:** the arrival day of every destination after the first is a
  relocation day. It consumes a day slot but **does not count against
  `capacityDays`**; it shows the inter-city transport leg plus an arrival
  half-day carrying at most `halfCap = floor(paceCap / 2)` attractions
  (`relaxed` 0, `standard` 1, `packed` 1).

**Day allocation (deterministic)**

- `weight(d) = 1 + interestMatchCount(d)` (a city's attractions' categories in
  `request.interests`); if `interests` is empty every weight is 1.
- `allocated(d) = floor(days * weight(d) / Σweight)`, then the remaining
  `days − Σallocated` days are given by largest fractional remainder, tie-break
  by request input order. Every selected destination gets ≥1 day; the request is
  valid only when `days ≥ destinations.length` (see request validation).
- `days.length = Σallocated(d) = request.days` — **every requested day is
  assigned; no day is silently dropped.**

**Capacity & surplus**

- `attractionDays(d) = max(0, min(allocated(d) − arrivalDays(d), capacityDays(d)))`,
  where `arrivalDays(d) = 1` for a non-first destination, else `0`.
- `freeDays = Σ_d max(0, (allocated(d) − arrivalDays(d)) − capacityDays(d))` —
  over-capacity days, recorded in `meta.freeDays`.
- A free day renders a clearly-labelled "free / flexible day" block with the
  destination's general tips and optional (non-scheduled) suggestions — never a
  fabricated attraction, and it is **not** an error.
- Travel days are neither attraction days nor free days; they render the leg +
  arrival half-day.

This is the contract for AC1/AC5 and the Task 3 golden.

## UI

`src/pages/TravelPage.tsx` + `src/components/travel/*`:

- `TravelRequestForm` — destination multi-select (from curated content), days
  number, interest chips, pace/budget selects, language toggle, Generate button;
  inline validation; a sensible default so the page is never empty.
- `ItineraryView` — trip summary; `DayCard` per day (morning/afternoon/evening,
  attraction, duration, transport between, meal suggestion, tips); `StayCard` per
  destination (area + why + "book via official/OTA — prices vary").
- `PracticalPanel` — accordion: payments, connectivity, etiquette, safety, visa/
  entry (with disclaimer), emergency numbers.
- `ProvenanceBadge` — source link + `lastChecked` on every fact; on `perishable`
  facts it adds the prominent "Verify official" badge, whose link is the fact's
  official `url` (guaranteed present by content validation). `origin` lives in
  the data model but is surfaced by the UI **only when the plan contains at least
  one `live` fact** (e.g. a single "includes live data" indicator), so
  pure-curated output is not littered with a per-fact "static reference" chip.
  `FreshnessBanner` — content `lastVerified` + stale warning (threshold 180 days);
  it accepts an injectable `now` prop (defaults to `Date.now`) so the threshold is
  testable without time mocking.
- Accessibility: labelled controls, keyboard-navigable accordion, `aria-live`
  for the generated result; copy in `src/content/copy.ts` (`uiCopy.travel`).

### Navigation

Add a `/travel` `NavLink` to `src/app/SiteHeader.tsx` with `nav.travel` copy
(en/fr), alongside Home / Pinyin / Journey / Culture.

## Acceptance criteria

1. From `/travel`, a valid request produces a deterministic itinerary covering
   **transport, a day-by-day plan, and stay areas** for every selected
   destination. `days.length` equals the requested `days`; any days beyond a
   city's attraction capacity are labelled **free / optional** days (P1-2), never
   dropped or errored.
2. Every fact renders its source + `lastChecked`; every `perishable` fact
   additionally renders a prominent "Verify official" badge (with an actionable
   official `url`). `origin` is **carried in the data model** and asserted by
   unit tests to survive planning, but the UI renders an origin indicator **only
   when at least one `live` fact is present** in the plan (P2-4 — a per-fact
   "static reference" chip on pure-curated output is noise and misleading). A
   content-validation test fails the build if any fact — stable or perishable —
   has no source, and if any perishable fact lacks an official `url`.
3. The practical panel is always present and includes the visa/entry + safety
   **not-legal-advice** disclaimer.
4. UI and content render correctly in **en and fr**; the language toggle switches
   both; missing translations fail the content test rather than rendering blank.
5. Invalid input (0 destinations, out-of-range days) shows inline validation and
   never produces a crash or empty itinerary. A valid request whose duration
   exceeds a city's attraction capacity still succeeds — it fills capacity and
   marks the remainder free/optional (P1-2), it is **not** an error.
6. The feature works with **no network and no keys** (fully offline).
7. Same `(request, contentVersion)` yields a byte-identical **plan body**;
   determinism excludes `meta.generatedAt`, which is clock-injected (see
   [Determinism contract](#determinism-contract-p1-1)).
8. A stale-content warning appears when `lastVerified` is older than 180 days;
   `FreshnessBanner` takes an injectable `now` (defaulting to the real clock) so
   the threshold is testable without time mocking (P2-5).

## Evaluability

- **Unit (Vitest):** request validation bounds; day allocation and travel-day
  insertion; interest scoring + pace caps (no duplicate attractions); stay-area
  selection by budget; determinism (golden snapshots, `deps.now` injected, plan
  body compared with `generatedAt` excluded); **over-capacity durations produce
  free days** (`meta.freeDays > 0`, `days.length === request.days`); provenance
  enforcement (throw on *any* source-less fact, not only perishable; and on a
  perishable fact without an official `url`); `origin` carried through; i18n
  completeness (every `LocalizedField` has en+fr); staleness threshold.
- **Failure-path cases (required):** invalid/empty request; unknown destination;
  days out of range; **stale content** (>180 days) → visible warning; content
  that fails validation → surfaced error, never a silent empty plan. (A duration
  exceeding attraction capacity is **not** a failure — it yields free days.) When
  phase-2 adapters land, add: no key, upstream timeout, empty result — each
  degrading visibly to curated reference text, never fabricated.
- **Component (Vitest + Testing Library):** form validation; generate → render
  day/stay/practical; source + `lastChecked` on all facts, "Verify official"
  badge on perishable facts, and an actionable official link; the origin
  indicator appears **only** when an injected fixture contains a `live` fact and
  is absent for pure-curated plans; disclaimer visible; stale banner driven by an
  injected `now`; free-day block renders for an over-capacity request; language
  toggle.
- **E2E (Playwright):** `/travel` renders; submit a request; itinerary + at least
  one "Verify official" badge + the disclaimer are visible; invalid submit shows
  inline validation. No network.
- **Metrics (lightweight):** `performance.mark` around generation for a
  client-side duration; expose a pure `summarizeItinerary()` count (days,
  attractions, perishable facts) used in tests. No analytics dependency.
- **Repo gates:** `npm run test -- --run`, `npm run lint`, `npm run build`,
  `npx playwright test`.

## Risks and mitigations

- **Content staleness / wrong facts:** every fact carries a source +
  `lastChecked`; destinations carry `lastVerified`; perishable facts add the
  prominent "Verify official" badge; a stale banner appears past 180 days; and
  content is reviewed like course content.
- **Hallucination:** MVP uses no model, so this risk is structurally removed;
  phase-2 LLM is constrained not to introduce facts (see below).
- **Scope creep:** bounded seed city set; live booking/feeds explicitly deferred.
- **Multi-city realism:** simplistic day allocation is acceptable for MVP and
  covered by golden tests; refinement is phase 2.
- **i18n gaps:** content tests fail on missing en/fr fields.

## Deferred (phase 2)

Designed but **not** in the MVP; no MVP code depends on them:

- **AI enrichment** — `POST /api/travel` (`api/travel/index.ts` →
  `src/server/travel/*`) that turns the deterministic itinerary into friendlier
  prose. Provider-agnostic OpenAI-compatible adapter following the existing
  lazy-handler pattern in `src/server/voice/*` (present on base `db7583b`), and
  the same shape as the `/talk` design on `feat-voice-chat-buddy-0930`; key
  server-side only; strict system prompt: *may not introduce any perishable
  fact not present in the provided itinerary*; tolerant of missing config
  (returns the curated itinerary, `mode: 'curated'`); guard following the talk
  design's "Endpoint guard" (best-effort rate limit + optional non-browser
  token, guard-before-call).
- **Read-only live adapters** — allowlisted tools (e.g. weather, exchange rate)
  with per-call timeout, returning `{ value, source, asOf }`; any adapter failure
  degrades to "verify official" curated text, never fabricates. Tool allowlist +
  timeout + provenance are contract requirements when this lands.

## Thread decision log

- **Approach** — recommended and assumed here: **deterministic curated planner
  (MVP)**, with optional AI enrichment deferred to phase 2. Alternatives:
  LLM-generated from the start (accuracy/cost risk), or hybrid now (larger MVP).
- **Seed destinations** — assumed: beijing, shanghai, xian, chengdu, hangzhou,
  guilin. @Dylan to confirm/replace.
- **AI enrichment timing** — assumed deferred to phase 2. @Dylan to confirm.
- **Landing point** — assumed: a new `/travel` page in the existing app (not a
  separate app). @Dylan to confirm.

## Handoff notes

- Design owner: `@dylan-t1-planner-ds`.
- Implementation owner: `@dylan-t1-opencode-ds`.
- Review owner: `@dylan-t1-reviewer-ds` (blocker-first: data provenance /
  "verify official" boundary, failure paths, disclaimer/compliance, secret
  hygiene, determinism, tested failure cases).
- Branch: `feat/travel-guide-1008` (base `origin/main` `db7583b`).
