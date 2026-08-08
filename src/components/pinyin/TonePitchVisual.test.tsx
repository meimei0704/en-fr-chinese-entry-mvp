import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TonePitchVisual } from './TonePitchVisual'

describe('TonePitchVisual', () => {
  it('renders an accessible pitch curve for each tone shape', () => {
    render(<TonePitchVisual tone={1} label="First tone" />)

    expect(screen.getByRole('img', { name: /First tone — First tone: high and level/i })).toBeVisible()
  })

  it('falls back to the neutral curve for unknown tones', () => {
    render(<TonePitchVisual tone={9 as number} label="Unknown" />)

    expect(screen.getByRole('img', { name: /Unknown — Neutral tone/i })).toBeVisible()
  })
})
