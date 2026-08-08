interface TonePitchVisualProps {
  tone: number
  label: string
}

const curves: Record<number, string> = {
  1: 'M6 22 L58 22',
  2: 'M6 34 L58 10',
  3: 'M6 22 L32 40 L58 10',
  4: 'M6 10 L58 34',
  0: 'M6 28 L58 28',
}

const ariaDescriptions: Record<number, { en: string; fr: string }> = {
  1: { en: 'First tone: high and level', fr: 'Premier ton : haut et plat' },
  2: { en: 'Second tone: rising', fr: 'Deuxième ton : montant' },
  3: { en: 'Third tone: low dipping', fr: 'Troisième ton : bas avec un creux' },
  4: { en: 'Fourth tone: sharp falling', fr: 'Quatrième ton : descendant net' },
  0: { en: 'Neutral tone: light and short', fr: 'Ton neutre : léger et court' },
}

export function TonePitchVisual({ tone, label }: TonePitchVisualProps) {
  const description = ariaDescriptions[tone] ?? ariaDescriptions[0]

  return (
    <svg
      aria-label={`${label} — ${description.en}`}
      role="img"
      className="pinyin-tone-pitch"
      viewBox="0 0 64 48"
      focusable="false"
    >
      <path d="M6 8 L58 8" className="pinyin-tone-pitch__guide" />
      <path d="M6 18 L58 18" className="pinyin-tone-pitch__guide" />
      <path d="M6 28 L58 28" className="pinyin-tone-pitch__guide" />
      <path d="M6 38 L58 38" className="pinyin-tone-pitch__guide" />
      <path d={curves[tone] ?? curves[0]} className="pinyin-tone-pitch__curve" />
    </svg>
  )
}
