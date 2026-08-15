import type { ReactNode } from 'react'

interface PinyinHeroProps {
  heading: string
  children?: ReactNode
}

export function PinyinHero({ heading, children }: PinyinHeroProps) {
  return (
    <section className="hero-card pinyin-hero">
      <h1>{heading}</h1>
      {children}
    </section>
  )
}
