import { getUiCopy } from '../../content/copy'
import { travelSourcesById } from '../../content/travel/content'
import type { TravelFact, TravelSourceRef } from '../../content/travel/types'
import type { ExplanationLanguage } from '../../content/types'

interface ProvenanceBadgeProps {
  fact: TravelFact
  language: ExplanationLanguage
  sourcesById?: Record<string, TravelSourceRef>
}

/**
 * Renders the provenance every fact must carry: its source(s) and the
 * `lastChecked` date. `perishable` facts additionally surface a prominent
 * "Verify official" link pointing at an official source `url`. `origin` is
 * deliberately never rendered here: a plan-level indicator is owned by
 * `ItineraryView` (P2-4).
 */
export function ProvenanceBadge({
  fact,
  language,
  sourcesById = travelSourcesById,
}: ProvenanceBadgeProps) {
  const copy = getUiCopy(language).travel.result
  const sources = fact.sourceIds
    .map((sourceId) => sourcesById[sourceId])
    .filter((source): source is TravelSourceRef => Boolean(source))
  const official = sources.find((source) => source.kind === 'official' && source.url)

  return (
    <div className="provenance-badge">
      <span className="provenance-badge__sources">
        {sources.map((source) =>
          source.url ? (
            <a key={source.id} className="provenance-badge__source" href={source.url}>
              {source.label}
            </a>
          ) : (
            <span key={source.id} className="provenance-badge__source">
              {source.label}
            </span>
          ),
        )}
      </span>
      <time className="provenance-badge__checked" dateTime={fact.lastChecked}>
        {fact.lastChecked}
      </time>
      {fact.freshness === 'perishable' && official ? (
        <a
          className="badge badge--gold provenance-badge__verify"
          href={official.url}
          title={copy.verifyOfficialHelper}
        >
          {copy.verifyOfficial}
        </a>
      ) : null}
    </div>
  )
}
