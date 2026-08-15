export interface PinyinSyllableIntroCopy {
  description: string
  figureLabel: string
  pinyinLabel: string
  initialLabel: string
  finalLabel: string
  toneLabel: string
}

interface PinyinSyllableIntroProps {
  copy: PinyinSyllableIntroCopy
}

export function PinyinSyllableIntro({ copy }: PinyinSyllableIntroProps) {
  const parts = [
    {
      key: 'initial',
      label: copy.initialLabel,
      value: 'm',
    },
    {
      key: 'final',
      label: copy.finalLabel,
      value: 'a',
    },
    {
      key: 'tone',
      label: copy.toneLabel,
      value: '¯',
    },
  ] as const

  return (
    <figure
      className="pinyin-syllable-intro"
      aria-label={copy.figureLabel}
    >
      <figcaption className="pinyin-syllable-intro__description">
        {copy.description}
      </figcaption>

      <div className="pinyin-syllable-intro__diagram">
        <div className="pinyin-syllable-intro__example">
          <span className="pinyin-syllable-intro__pinyin">mā</span>
          <span className="pinyin-syllable-intro__hanzi" lang="zh-Hans">
            妈
          </span>
        </div>

        <span className="pinyin-syllable-intro__arrow" aria-hidden="true">
          →
        </span>

        <div className="pinyin-syllable-intro__composition">
          <p className="pinyin-syllable-intro__heading">
            {copy.pinyinLabel}
          </p>
          <dl className="pinyin-syllable-intro__parts">
            {parts.map((part) => (
              <div
                key={part.key}
                className={`pinyin-syllable-intro__part pinyin-syllable-intro__part--${part.key}`}
              >
                <dt>{part.label}</dt>
                <dd>{part.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </figure>
  )
}
