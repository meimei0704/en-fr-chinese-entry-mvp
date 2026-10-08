# China Travel Companion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/travel`, an offline, content-driven itinerary planner for foreign
visitors to China: request (destinations, days, interests, pace, budget,
language) → structured plan covering transport, day-by-day activities, and
stay areas, with provenance and "verify official" labels on perishable facts.

**Architecture:** Pure deterministic planner (`src/lib/travel/*`) over curated,
versioned content (`src/content/travel/*`); React UI (`src/pages/TravelPage.tsx`
+ `src/components/travel/*`). No server route, no key, no network in the MVP.

**Tech Stack:** React 19 + TypeScript + Vite, React Router, Vitest + Testing
Library, Playwright, oxlint.

Design source of truth: `docs/superpowers/specs/2026-10-08-china-travel-companion-design.md`.

**Repo/branch:** `~/projects/en-fr-chinese-entry-mvp`, worktree
`feat-travel-guide-1008`, branch `feat/travel-guide-1008` (base `db7583b`).

**Baseline gates (must stay green):** `npm run test -- --run`, `npm run lint`,
`npm run build`, `npx playwright test`.

---

## Task 1 — Travel content types + validation

**Files**
- Create: `src/content/travel/types.ts`, `src/content/travel/validate.ts`
- Test: `src/content/travel/validate.test.ts`

- [ ] Define `TravelDestinationId`, `Interest = 'history'|'nature'|'food'|'shopping'|'nightlife'|'art'`,
  `FactFreshness = 'stable'|'perishable'`, `FactOrigin = 'curated'|'live'`,
  `TravelSourceRef`, and the `TravelFact` base (`sourceIds`, `lastChecked`,
  `origin`, `freshness`) implemented by `Attraction`, `StayArea`,
  `TransportOption`, and each `PracticalInfo` entry; plus `Destination` and
  `TravelContent` exactly as in the design's content model.
- [ ] `validateTravelContent(content)`: unique ids; **every** `TravelFact` has
  ≥1 resolvable `sourceIds` and a valid `lastChecked`; **every `perishable` fact
  cites ≥1 source with `kind:'official'` and a non-empty `url`** (P2-3);
  `lastVerified` is a valid ISO date; `contentVersion` non-empty; every
  `LocalizedField` has en+fr; at least one `perishable` fact exists (so the badge
  path is exercised). Throw a typed `TravelContentError` with a precise message.
- [ ] Test: happy content passes; **source-less fact (stable or perishable)
  fails**; **perishable fact without an official `url` fails**; missing-fr field
  fails; duplicate ids fail; bad date fails.

## Task 2 — Seed destination content

**Files**
- Create: `src/content/travel/sources.ts`
- Create: `src/content/travel/destinations/{beijing,shanghai,xian,chengdu,hangzhou,guilin}.ts`
- Create: `src/content/travel/practical.ts` (country-level: payments,
  connectivity, etiquette, safety, visa/entry with disclaimer, emergency numbers)
- Create: `src/content/travel/content.ts` (assembles `TravelContent`, exports
  `travelContent` + `travelSourcesById`)
- Test: `src/content/travel/content.test.ts`

- [ ] Author each seed destination with: summary + welcome, `bestSeasons`, ≥4
  `attractions` spanning categories, ≥2 `stayAreas`, arrival + getting-around
  `transport`, `sources`, `lastVerified`.
- [ ] Mark prices/hours/schedules `perishable`; keep cultural/etiquette/mode
  descriptions `stable`. **Both** still carry a `sourceIds` entry + `lastChecked`
  (no fact is source-less); every perishable fact cites an official source with
  a `url`.
- [ ] `validateTravelContent(travelContent)` passes; test asserts each
  destination has ≥4 attractions, ≥2 stay areas, and ≥1 perishable fact with an
  official `url` (proves the boundary is exercised).
- [ ] Country `practical` carries the mandatory visa/entry + safety disclaimer.
- [ ] **Manual-review step (P2-6):** the content seed is human-reviewed and
  attributed like course content before merge — a short checklist in this task /
  PR description: facts checked against the cited official source, `lastChecked`
  set to the review date, no unsourced claims. Presence of a source is not proof
  of correctness; the review step is what covers correctness.

## Task 3 — Deterministic planner

**Files**
- Create: `src/lib/travel/request.ts`, `src/lib/travel/itinerary.ts`,
  `src/lib/travel/planner.ts`
- Test: `src/lib/travel/request.test.ts`, `src/lib/travel/planner.test.ts`

- [ ] `TravelRequest` + `DEFAULT_TRAVEL_REQUEST` + `validateTravelRequest`
  (1–7 destinations, 1–21 days, known ids; return typed errors).
- [ ] `TravelItinerary` shape: `summary`, `legs[]`, `days[]`, `stays[]`,
  `practical`, `disclaimers`, `meta { contentVersion, lastVerified, generatedAt,
  freeDays }`. `practical` is the **country-level** `PracticalInfo` only — do
  **not** add a per-destination practical block (per-city practical is a phase-2
  slot; the seed's per-destination practical is validated content but is not
  surfaced, to avoid duplicating identical boilerplate per city). `legs[0]` is
  the international arrival (`fromDestinationId: null`) and is rendered by the
  Getting-there block (Task 5), so it must be produced.
- [ ] `buildItinerary(request, content, deps?)`: allocate days (multi-city
  travel half-day), interest scoring, pace caps (`relaxed`1/`standard`2/`packed`3),
  no duplicate attractions, budget-matched stay area, provenance carried through.
  `deps.now` injectable.
- [ ] **Capacity / surplus (P1-2)** — implement the design's exact formulas:
  consume one ordered `usable(d)` list front-to-back (so no attraction repeats);
  `arrivalAttractions(d) = min(floor(paceCap/2), N_d)` for a non-first
  destination (relaxed 0 / standard 1 / packed 1); those first items are reserved
  for the arrival half-day of the **travel day**;
  `capacityDays(d) = ceil(max(0, N_d − arrivalAttractions(d)) / paceCap)`;
  `attractionDays(d) = max(0, min(allocated(d) − arrivalDays(d),
  capacityDays(d)))`; full days take the next
  `min(attractionDays(d) * paceCap, N_d − arrivalAttractions(d))` items;
  `freeDays = Σ max(0, (allocated(d) − arrivalDays(d)) − capacityDays(d))`
  recorded in `meta.freeDays`. Over-capacity days render as `free` blocks
  (destination tips only — the optional-attraction list is empty by construction;
  no fabricated attraction); a
  thin-content request must succeed, not error.
- [ ] `interestMatchCount(d)` = count of `d`'s attraction entries whose category
  is in `interests` (used only for allocation weight).
- [ ] `usable(d)` ordering: `interestScore(a) = interests.length −
  interests.indexOf(a.category)` (0 when not requested), sort desc then by
  stable `id` asc; when no attraction matches, use all attractions in `id`
  order.
- [ ] **Allocation:** reserve 1 day per selected destination, then distribute the
  remaining `days − destinations.length` by `weight = 1 + interestMatchCount`
  (floor + largest-remainder, tie-break by input order), so `Σallocated = days`
  and every destination gets ≥1. `validateTravelRequest` also requires
  `days ≥ destinations.length` so allocation is well-defined.
- [ ] **Determinism (P1-1):** compare the plan body only; `meta.generatedAt` is
  excluded from byte-identity and is clock-injected in tests.
- [ ] Test: determinism (two calls equal with a fixed `deps.now` **and** plan-body
  equality with `generatedAt` excluded; snapshot one golden itinerary);
  allocation for 1 city vs 3 cities; pace caps respected; no repeats; budget
  changes selected stay area; **over-capacity duration → `days.length === days`,
  `meta.freeDays > 0`, free blocks present**; **a multi-city itinerary containing
  a travel day schedules no duplicate attractions and totals ≤ `N_d` per city**
  (the arrival half-day draws from the same ordered list);
  `days < destinations` rejected; invalid request rejected; `generatedAt` uses
  injected clock.

## Task 4 — i18n copy + content wiring

**Files**
- Modify: `src/content/copy.ts` (+ `src/content/copy.test.ts`)
- Test: extend existing copy test

- [ ] Add `uiCopy.{en,fr}.nav.travel` and `uiCopy.{en,fr}.travel.*` (form labels,
  pace/budget names, section headings, "Verify official", freshness banner,
  disclaimer text, validation messages).
- [ ] Test: both languages complete; no missing keys; travel copy present in
  `getUiCopy` for en and fr.

## Task 5 — Travel components

**Files**
- Create: `src/components/travel/TravelRequestForm.tsx`,
  `ItineraryView.tsx`, `DayCard.tsx`, `StayCard.tsx`,
  `PracticalPanel.tsx`, `ProvenanceBadge.tsx`, `FreshnessBanner.tsx`
- Test: colocated `*.test.tsx` per component

- [ ] `TravelRequestForm`: destination chips, days, interests, pace, budget,
  language, Generate; inline validation; a valid default.
- [ ] `ItineraryView` / `DayCard`: render summary, a **Getting-there** block for
  the first destination built from `itinerary.legs[0]` (arrival options +
  provenance; always present for a valid itinerary), per-day blocks with
  attraction + duration + transport + meal + tips; and a distinct **free day**
  block for over-capacity days (P1-2), never a blank or faked
  attraction.
- [ ] `StayCard`: area, why, and "book via official/OTA — prices vary".
- [ ] `PracticalPanel`: accessible accordion incl. visa/entry + safety
  disclaimer + emergency numbers; renders the **country-level** practical only
  (no per-destination block).
- [ ] `ProvenanceBadge`: source + `lastChecked` on **all** facts; adds the
  prominent "Verify official" badge on `perishable` facts only, linking to the
  official `url`. Origin is **not** rendered per fact; show a single origin
  indicator only when the plan contains a `live` fact (P2-4). `FreshnessBanner`:
  `lastVerified` + stale warning, with an injectable `now` prop (default
  `Date.now`) so the 180-day threshold is tested without time mocking (P2-5).
- [ ] Test each: rendering, labels, source shown on all facts, "Verify official"
  only on perishable with an official link, **origin indicator present only with
  an injected `live` fixture and absent for pure-curated plans** (P2-4),
  **Getting-there block renders `legs[0]` arrival options for the first
  destination**, disclaimer visible, accordion keyboard behavior, stale banner
  with an injected `now`, free-day block for an over-capacity request.

## Task 6 — Travel page + route + nav

**Files**
- Create: `src/pages/TravelPage.tsx`, `src/pages/TravelPage.test.tsx`
- Modify: `src/app/router.tsx` (add `{ path: '/travel', element: <TravelPage/> }`),
  `src/app/SiteHeader.tsx` (+ `SiteHeader.test.tsx`)

- [ ] Page wires form → `validateTravelRequest` → `buildItinerary` →
  `ItineraryView`; keeps result in state (optional `localStorage`), shows
  validation errors, `aria-live` on result.
- [ ] Add `/travel` nav link (localized).
- [ ] Test: default render; submit a request renders itinerary; invalid input
  shows inline error; language toggle switches labels; nav link present/active.

## Task 7 — E2E smoke + docs

**Files**
- Create: `tests/travel.spec.ts` (Playwright)
- Modify: `README.md` (feature blurb + "verify official" boundary)

- [ ] E2E: `/travel` renders; submit a request; itinerary (including the
  Getting-there block) + ≥1 "Verify official" badge + the disclaimer are visible.
  No network.
- [ ] README: describe the feature, the content/provenance model, and the
  "reference only — confirm with official sources" boundary.

## Task 8 — Travel UI styling

**Files**
- Modify: `src/styles/global.css` (+ `global.test.ts` if it asserts token/section
  coverage)

- [ ] Style every `/travel` component with the existing design tokens and utility
  classes (`page-shell`, `hero-card`, `badge`, `muted-text`, …): request form,
  Getting-there block, day cards (attraction/travel/free variants), stay cards,
  practical accordion, provenance/freshness badges. No new CSS framework.
- [ ] Responsive layout; visible keyboard focus states; readable contrast.
- [ ] Test/extend the style test to assert the travel class names have rules
  (mirroring how other page class names are covered).

## Task 9 — Full verification + handoff

- [ ] `npm run test -- --run`, `npm run lint`, `npm run build`,
  `npx playwright test` all green; paste exact outputs.
- [ ] Confirm generation is deterministic (golden test) and offline.
- [ ] Confirm AC9: `/travel` renders styled (no unstyled markup), responsive.
- [ ] Post gate handoff (head SHA, range, scope, evidence) to the Loop thread.

---

## Deferred (phase 2) — do NOT implement in this plan

- `api/travel/index.ts` + `src/server/travel/*` AI enrichment (OpenAI-compatible,
  server-only key, constrained not to introduce facts, degrade to curated).
- Read-only live adapters (weather/exchange) with allowlist + timeout +
  `{ value, source, asOf }` provenance.
- Live prices/schedules/bookings.

## Thread decision log (open)

- **Approach** — deterministic curated MVP (assumed/recommended); AI enrichment
  deferred. @Dylan to confirm.
- **Seed destinations** — beijing, shanghai, xian, chengdu, hangzhou, guilin
  (assumed). @Dylan to confirm/replace.
- **Landing point** — new `/travel` page in the existing app (assumed). @Dylan to
  confirm.
