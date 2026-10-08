import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { getUiCopy } from '../../content/copy'
import { FreshnessBanner } from './FreshnessBanner'

const lastVerified = '2026-10-08'
const verifiedAt = Date.parse(lastVerified)
const DAY = 24 * 60 * 60 * 1000

describe('FreshnessBanner', () => {
  it('shows the verification date without a warning when content is fresh', () => {
    const copy = getUiCopy('en').travel.result
    render(
      <FreshnessBanner
        lastVerified={lastVerified}
        language="en"
        now={() => verifiedAt + 30 * DAY}
      />,
    )

    expect(screen.getByText(copy.freshnessBanner(lastVerified))).toBeInTheDocument()
    expect(screen.queryByText(copy.staleWarning(180))).not.toBeInTheDocument()
  })

  it('warns when content is older than 180 days using the injected clock', () => {
    const copy = getUiCopy('en').travel.result
    render(
      <FreshnessBanner
        lastVerified={lastVerified}
        language="en"
        now={() => verifiedAt + 200 * DAY}
      />,
    )

    expect(screen.getByText(copy.staleWarning(180))).toBeInTheDocument()
  })

  it('localizes the verification banner for French', () => {
    const copy = getUiCopy('fr').travel.result
    render(
      <FreshnessBanner
        lastVerified={lastVerified}
        language="fr"
        now={() => verifiedAt + 10 * DAY}
      />,
    )

    expect(screen.getByText(copy.freshnessBanner(lastVerified))).toBeInTheDocument()
  })
})
