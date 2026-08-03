import '@testing-library/jest-dom/vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { LessonCard } from './LessonCard'
import { course } from '../content/course'
import { getUiCopy } from '../content/copy'
import type { ExplanationLanguage } from '../content/types'
import {
  expectedLessonTopicOrder,
  expectedLessonTopicPattern,
} from '../test/lessonTopicExpectations'

describe('LessonCard', () => {
  it.each(['en', 'fr'] as const)(
    'renders every lesson topic as Chinese plus the %s explanation line without changing links',
    (language: ExplanationLanguage) => {
      const { container } = render(
        <MemoryRouter>
          {course.lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} language={language} />
          ))}
        </MemoryRouter>,
      )

      expect(container).not.toHaveTextContent(' / ')
      const cards = screen.getAllByRole('article')
      const copy = getUiCopy(language)

      expect(cards).toHaveLength(expectedLessonTopicOrder.length)

      for (const [index, topic] of expectedLessonTopicOrder.entries()) {
        const card = cards[index]
        const heading = within(card).getByRole('heading', {
          level: 2,
          name: expectedLessonTopicPattern(topic, language),
        })

        expect(within(heading).getByText(topic.hanzi)).toHaveClass('lesson-topic-title__primary')
        expect(within(heading).getByText(topic[language])).toHaveClass(
          'lesson-topic-title__secondary',
        )
        expect(within(card).getByRole('link', { name: copy.homePage.openLesson })).toHaveAttribute(
          'href',
          `/lesson/${topic.id}`,
        )
      }
    },
  )
})
