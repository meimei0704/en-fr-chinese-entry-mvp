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

Therefore the MVP composes itineraries from curated content that carries
provenance (`source` + `lastVerified`), and classifies every fact as `stable`
(etiquette, transport modes, culture) or `perishable` (prices, hours, schedules).
Perishable facts always render with a "Verify official" badge and source link.
This makes the feature accurate, cheap, testable, and independent of any LLM.

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
- `TravelSourceRef { id, label, url?, kind: 'official' | 'operator' | 'reputable', lastChecked }`.
- `Attraction { id, name: LocalizedField, category: Interest, area, durationHours,
  description: LocalizedField, tips?: LocalizedField, freshness, sourceIds }`.
- `StayArea { id, name: LocalizedField, vibe, bestFor: Interest[], priceTier, transportNotes }`.
- `TransportOption { id, mode: 'air'|'rail'|'metro'|'bus'|'taxi'|'rideshare'|'bike'|'walk',
  description: LocalizedField, freshness, notes?: LocalizedField, sourceIds }`.
- `PracticalInfo { payments, connectivity, etiquette, safety, visaEntry, emergencyNumbers }`
  (each a `LocalizedField` + `freshness` where relevant; `visaEntry`/`safety`
  carry a mandatory disclaimer flag).
- `Destination { id, name, region, summary, bestSeasons, welcome, attractions,
  stayAreas, transport: { arrival[], gettingAround[] }, practical, sources, lastVerified }`.
- `TravelContent { destinations, practical (country-level), contentVersion, generatedFrom }`.

Seed set (final list confirmed by @Dylan): `beijing`, `shanghai`, `xian`,
`chengdu`, `hangzhou`, `guilin` (≥ 3 required to make multi-city real).

Every `perishable` item must include `sourceIds` that resolve to a `TravelSourceRef`;
a content-validation test enforces this (no perishable fact without a source).

## Planner

`src/lib/travel/`:

- `request.ts` — `TravelRequest { destinations: TravelDestinationId[]; days: number;
  interests: Interest[]; pace: 'relaxed'|'standard'|'packed'; budget:
  'budget'|'mid'|'comfort'; language: ExplanationLanguage }` plus
  `validateTravelRequest` (bounds: 1–7 destinations, 1–21 days, ≥ 0 interests,
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
  - deterministic: same `(request, content.contentVersion)` → identical output.
  `deps.now` is injectable so tests are stable.
- `itinerary.ts` — `TravelItinerary { summary, legs[], days[], stays[],
  practical, disclaimers, meta: { contentVersion, lastVerified, generatedAt } }`.

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
- `ProvenanceBadge` — "Verify official" + source link + `lastChecked`, shown on
  every perishable fact; `FreshnessBanner` — content `lastVerified` + stale
  warning (threshold 180 days).
- Accessibility: labelled controls, keyboard-navigable accordion, `aria-live`
  for the generated result; copy in `src/content/copy.ts` (`uiCopy.travel`).

### Navigation

Add a `/travel` `NavLink` to `src/app/SiteHeader.tsx` with `nav.travel` copy
(en/fr), alongside Home / Pinyin / Journey / Culture.

## Acceptance criteria

1. From `/travel`, a valid request produces a deterministic itinerary covering
   **transport, a day-by-day plan, and stay areas** for every selected
   destination.
2. Every `perishable` fact renders a "Verify official" badge with a source link
   and `lastChecked`/`lastVerified` date; no perishable fact exists without a
   source (enforced by content validation).
3. The practical panel is always present and includes the visa/entry + safety
   **not-legal-advice** disclaimer.
4. UI and content render correctly in **en and fr**; the language toggle switches
   both; missing translations fail the content test rather than rendering blank.
5. Invalid input (0 destinations, out-of-range days) shows inline validation and
   never produces a crash or empty itinerary.
6. The feature works with **no network and no keys** (fully offline).
7. Same `(request, contentVersion)` yields byte-identical itinerary output.
8. A stale-content warning appears when `lastVerified` is older than 180 days.

## Evaluability

- **Unit (Vitest):** request validation bounds; day allocation and travel-day
  insertion; interest scoring + pace caps (no duplicate attractions); stay-area
  selection by budget; determinism (golden snapshots); provenance enforcement
  (throw on perishable-without-source); i18n completeness (every
  `LocalizedField` has en+fr); staleness threshold.
- **Component (Vitest + Testing Library):** form validation; generate → render
  day/stay/practical; "Verify official" badge present on perishable facts;
  disclaimer visible; stale banner; language toggle.
- **E2E (Playwright):** `/travel` renders; submit a request; itinerary + at least
  one "Verify official" badge + the disclaimer are visible. No network.
- **Metrics (lightweight):** `performance.mark` around generation for a
  client-side duration; expose a pure `summarizeItinerary()` count (days,
  attractions, perishable facts) used in tests. No analytics dependency.
- **Repo gates:** `npm run test -- --run`, `npm run lint`, `npm run build`,
  `npx playwright test`.

## Risks and mitigations

- **Content staleness / wrong facts:** every destination carries `lastVerified`,
  perishable facts carry sources + "Verify official", a stale banner appears past
  180 days, and content is reviewed like course content.
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
  prose. Provider-agnostic OpenAI-compatible adapter (same shape as `/talk`);
  key server-side only; strict system prompt: *may not introduce any perishable
  fact not present in the provided itinerary*; tolerant of missing config
  (returns the curated itinerary, `mode: 'curated'`); guard mirroring `/talk`
  (best-effort rate limit + optional non-browser token, guard-before-call).
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
