interface PinyinHeroProps {
  eyebrow: string
  heading: string
  summary: string
  sectionProgress: string
}

export function PinyinHero({
  eyebrow,
  heading,
  summary,
  sectionProgress,
}: PinyinHeroProps) {
  return (
    <section className="hero-card pinyin-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{heading}</h1>
      <p className="lede">{summary}</p>
      <p className="pinyin-hero__progress">{sectionProgress}</p>
    </section>
  )
}
