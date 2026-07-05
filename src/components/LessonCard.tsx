import { Link } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import type { ExplanationLanguage, LessonContent } from '../content/types'

interface LessonCardProps {
  lesson: LessonContent
  language: ExplanationLanguage
}

export function LessonCard({ lesson, language }: LessonCardProps) {
  const copy = getUiCopy(language)

  return (
    <article className="hero-card hero-card--compact">
      <p className="eyebrow">{copy.homePage.lessonEyebrow}</p>
      <h2>{getLocalizedText(lesson.title, language)}</h2>
      <p className="lede">{getLocalizedText(lesson.scenario, language)}</p>
      <Link className="secondary-link" to={`/lesson/${lesson.id}`}>
        {copy.homePage.openLesson}
      </Link>
    </article>
  )
}
