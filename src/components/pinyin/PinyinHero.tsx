interface PinyinHeroProps {
  eyebrow: string
  heading: string
}

export function PinyinHero({ eyebrow, heading }: PinyinHeroProps) {
  return (
    <section className="hero-card pinyin-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{heading}</h1>
    </section>
  )
}
