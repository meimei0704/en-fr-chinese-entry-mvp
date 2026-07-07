import { Link } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import type { ExplanationLanguage, LessonContent } from '../content/types'

interface LessonCardProps {
  lesson: LessonContent
  language: ExplanationLanguage
}

export function LessonCard({ lesson, language }: LessonCardProps) {
  const copy = getUiCopy(language)
  const miniPhrase = lesson.vocabulary[0]

  return (
    <article className="lesson-card">
      <span className="badge badge--sky">
        {copy.homePage.lessonScenarioBadges[lesson.id]}
      </span>
      <h2>{getLocalizedText(lesson.title, language)}</h2>
      <p className="lede">{getLocalizedText(lesson.scenario, language)}</p>

      {miniPhrase ? (
        <p className="lesson-card__phrase">
          <span>{miniPhrase.hanzi}</span>
          <span>{miniPhrase.pinyin}</span>
        </p>
      ) : null}

      <Link className="secondary-link lesson-card__link" to={`/lesson/${lesson.id}`}>
        {copy.homePage.openLesson}
      </Link>
    </article>
  )
}
