interface PinyinHeroProps {
  heading: string
}

export function PinyinHero({ heading }: PinyinHeroProps) {
  return (
    <section className="hero-card pinyin-hero">
      <h1>{heading}</h1>
    </section>
  )
}
