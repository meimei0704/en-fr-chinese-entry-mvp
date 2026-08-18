import { Link } from 'react-router-dom'

import { getUiCopy } from '../content/copy'
import type { ExplanationLanguage } from '../content/types'

export function ContentLoading() {
  return (
    <main className="brand-loading" role="status" aria-live="polite">
      <img className="brand-loading__logo" src="/favicon.svg" alt="" width="72" height="69" />
      <p className="brand-loading__title">轻松学中文</p>
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
      <section className="hero-card hero-card--compact content-error-card">
        <div className="content-error-card__badge" aria-hidden="true">
          <img className="content-error-card__logo" src="/favicon.svg" alt="" width="48" height="46" />
        </div>
        <p className="eyebrow">{copy.errorEyebrow}</p>
        <h1>{copy.errorHeading}</h1>
        <p className="muted-text">{copy.errorBody}</p>
        <div className="button-row content-error-card__actions">
          <button type="button" className="primary-button" onClick={onRetry}>
            {copy.retry}
          </button>
          <Link className="secondary-link" to="/home">
            {copy.backToHome}
          </Link>
        </div>
      </section>
    </main>
  )
}
