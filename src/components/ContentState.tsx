import { getUiCopy } from '../content/copy'
import type { ExplanationLanguage } from '../content/types'

export function ContentLoading({ language = 'en' }: { language?: ExplanationLanguage }) {
  const copy = getUiCopy(language).contentState

  return (
    <main className="page-shell" role="status" aria-live="polite">
      <section className="hero-card hero-card--compact">
        <p className="eyebrow">{copy.loadingEyebrow}</p>
        <h1>{copy.loadingHeading}</h1>
      </section>
    </main>
  )
}

export function ContentError({
  language = 'en',
  onRetry,
}: {
  language?: ExplanationLanguage
  onRetry: () => void
}) {
  const copy = getUiCopy(language).contentState

  return (
    <main className="page-shell">
      <section className="hero-card hero-card--compact">
        <p className="eyebrow">{copy.errorEyebrow}</p>
        <h1>{copy.errorHeading}</h1>
        <p className="muted-text">{copy.errorBody}</p>
        <button type="button" className="primary-button" onClick={onRetry}>
          {copy.retry}
        </button>
      </section>
    </main>
  )
}
