import { getUiCopy } from '../../content/copy'
import type { ExplanationLanguage } from '../../content/types'

const MS_PER_DAY = 24 * 60 * 60 * 1000

interface FreshnessBannerProps {
  lastVerified: string
  language: ExplanationLanguage
  /** Injectable clock (ms since epoch). Defaults to `Date.now` so the threshold is testable. */
  now?: () => number
}

/**
 * Shows when the content was last verified and warns when it is stale. The
 * 180-day threshold is evaluated against an injectable `now` (P2-5) so tests
 * can pin "fresh" vs "stale" without time mocking.
 */
export function FreshnessBanner({
  lastVerified,
  language,
  now = Date.now,
}: FreshnessBannerProps) {
  const copy = getUiCopy(language).travel.result
  const verifiedAt = Date.parse(lastVerified)
  const ageInDays = Number.isNaN(verifiedAt)
    ? 0
    : Math.floor((now() - verifiedAt) / MS_PER_DAY)
  const isStale = ageInDays > 180

  return (
    <div
      className={`freshness-banner${isStale ? ' freshness-banner--stale' : ''}`}
      role="status"
    >
      <p className="freshness-banner__verified">{copy.freshnessBanner(lastVerified)}</p>
      {isStale ? (
        <p className="freshness-banner__warning">{copy.staleWarning(180)}</p>
      ) : null}
    </div>
  )
}
