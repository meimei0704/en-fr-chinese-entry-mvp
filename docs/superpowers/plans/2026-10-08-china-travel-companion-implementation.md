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
  `FactFreshness = 'stable'|'perishable'`, `TravelSourceRef`, `Attraction`,
  `StayArea`, `TransportOption`, `PracticalInfo`, `Destination`, `TravelContent`
  exactly as in the design's content model.
- [ ] `validateTravelContent(content)`: assert unique ids; every `perishable`
  fact has ≥1 resolvable `sourceIds`; every `LocalizedField` has en+fr;
  `lastVerified` is a valid ISO date; `contentVersion` non-empty. Throw a typed
  `TravelContentError` with a precise message.
- [ ] Test: happy content passes; perishable-without-source fails;
  missing-fr field fails; duplicate ids fail; bad date fails.

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
- [ ] Mark prices/hours/schedules `perishable` and attach a `sourceIds` entry
  (official/operator). Keep cultural/etiquette/mode descriptions `stable`.
- [ ] `validateTravelContent(travelContent)` passes; test asserts each
  destination has ≥4 attractions, ≥2 stay areas, and ≥1 perishable fact with a
  source (proves the boundary is exercised).
- [ ] Country `practical` carries the mandatory visa/entry + safety disclaimer.

## Task 3 — Deterministic planner

**Files**
- Create: `src/lib/travel/request.ts`, `src/lib/travel/itinerary.ts`,
  `src/lib/travel/planner.ts`
- Test: `src/lib/travel/request.test.ts`, `src/lib/travel/planner.test.ts`

- [ ] `TravelRequest` + `DEFAULT_TRAVEL_REQUEST` + `validateTravelRequest`
  (1–7 destinations, 1–21 days, known ids; return typed errors).
- [ ] `TravelItinerary` shape: `summary`, `legs[]`, `days[]`, `stays[]`,
  `practical`, `disclaimers`, `meta { contentVersion, lastVerified, generatedAt }`.
- [ ] `buildItinerary(request, content, deps?)`: allocate days (multi-city
  travel half-day), interest scoring, pace caps (`relaxed`1/`standard`2/`packed`3),
  no duplicate attractions, budget-matched stay area, provenance carried through.
  `deps.now` injectable.
- [ ] Test: determinism (two calls equal; snapshot one golden itinerary);
  allocation for 1 city vs 3 cities; pace caps respected; no repeats; budget
  changes selected stay area; invalid request rejected; `generatedAt` uses
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
- [ ] `ItineraryView` / `DayCard`: render summary, per-day blocks with
  attraction + duration + transport + meal + tips.
- [ ] `StayCard`: area, why, and "book via official/OTA — prices vary".
- [ ] `PracticalPanel`: accessible accordion incl. visa/entry + safety
  disclaimer + emergency numbers.
- [ ] `ProvenanceBadge`: "Verify official" + source link + `lastChecked`, on
  perishable facts only. `FreshnessBanner`: `lastVerified` + stale warning.
- [ ] Test each: rendering, labels, badge only on perishable, disclaimer
  visible, accordion keyboard behavior, stale banner.

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

- [ ] E2E: `/travel` renders; submit a request; itinerary + ≥1 "Verify official"
  badge + the disclaimer are visible. No network.
- [ ] README: describe the feature, the content/provenance model, and the
  "reference only — confirm with official sources" boundary.

## Task 8 — Full verification + handoff

- [ ] `npm run test -- --run`, `npm run lint`, `npm run build`,
  `npx playwright test` all green; paste exact outputs.
- [ ] Confirm generation is deterministic (golden test) and offline.
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
