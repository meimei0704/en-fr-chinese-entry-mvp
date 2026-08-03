interface PinyinHeroProps {
  summary: string
  completedSectionCount: number
  totalSectionCount: number
}

const navItems = [
  { href: '#pinyin-reference', label: 'Reference' },
  { href: '#pinyin-tone-game', label: 'Tone game' },
  { href: '#pinyin-shadowing', label: 'Shadowing' },
] as const

export function PinyinHero({
  summary,
  completedSectionCount,
  totalSectionCount,
}: PinyinHeroProps) {
  return (
    <section className="hero-card pinyin-hero">
      <p className="eyebrow">Pinyin</p>
      <h1>Pinyin（零基础第一课）</h1>
      <p className="lede">{summary}</p>
      <p className="pinyin-hero__progress">
        {completedSectionCount} of {totalSectionCount} sections complete
      </p>
      <nav className="button-row pinyin-hero__nav" aria-label="Pinyin lesson sections">
        {navItems.map((item) => (
          <a key={item.href} className="secondary-link" href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </section>
  )
}
