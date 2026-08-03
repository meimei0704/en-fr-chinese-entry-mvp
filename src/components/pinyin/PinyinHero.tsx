interface PinyinHeroProps {
  eyebrow: string
  heading: string
  summary: string
  sectionProgress: string
  sectionsNavLabel: string
  navItems: readonly {
    href: string
    label: string
  }[]
}

export function PinyinHero({
  eyebrow,
  heading,
  summary,
  sectionProgress,
  sectionsNavLabel,
  navItems,
}: PinyinHeroProps) {
  return (
    <section className="hero-card pinyin-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{heading}</h1>
      <p className="lede">{summary}</p>
      <p className="pinyin-hero__progress">{sectionProgress}</p>
      <nav className="button-row pinyin-hero__nav" aria-label={sectionsNavLabel}>
        {navItems.map((item) => (
          <a key={item.href} className="secondary-link" href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </section>
  )
}
