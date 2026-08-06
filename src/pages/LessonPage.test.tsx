import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { course } from '../content/course'
import { createDefaultProgress, loadProgress, saveProgress } from '../lib/progress'
import { expectedLessonTopicOrder, expectedLessonTopicPattern } from '../test/lessonTopicExpectations'
import { renderRoute } from '../test/renderRoute'

class MockUtterance {
  lang = ''
  rate = 1
  text: string

  constructor(text: string) {
    this.text = text
  }
}

describe('LessonPage', () => {
  const speak = vi.fn()
  const cancel = vi.fn()
  const audioPlay = vi.fn()
  const audioConstructor = vi.fn()

  beforeEach(() => {
    localStorage.clear()
    speak.mockReset()
    cancel.mockReset()
    audioPlay.mockReset()
    audioConstructor.mockReset()
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance)
    vi.stubGlobal('speechSynthesis', {
      cancel,
      speak,
      getVoices: () => [],
    })

    class MockAudio {
      addEventListener = vi.fn()
      currentTime = 0
      pause = vi.fn()
      play = audioPlay.mockResolvedValue(undefined)
      src: string

      constructor(src: string) {
        audioConstructor(src)
        this.src = src
      }
    }

    vi.stubGlobal('Audio', MockAudio)
  })

  it('wraps the lesson in scannable overview and dialogue regions', () => {
    renderRoute('/lesson/self-intro')

    expect(screen.getByRole('region', { name: /lesson overview/i })).toBeVisible()
    expect(screen.getByRole('region', { name: /dialogue practice/i })).toBeVisible()
    expect(screen.getAllByLabelText(/dialogue line speaker traveler/i)[0]).toHaveTextContent('您好')
    expect(screen.getAllByLabelText(/dialogue line speaker traveler/i)[0]).toHaveTextContent('Nín hǎo')
  })

  it.each([
    ['en', 'We couldn’t find that lesson.', 'Back to home'],
    ['fr', 'Impossible de trouver cette leçon.', 'Retour à l’accueil'],
  ] as const)(
    'keeps progress unchanged for a missing lesson in %s',
    (language, heading, backLabel) => {
      const before = createDefaultProgress()
      before.selectedExplanationLanguage = language
      before.completedLessons = ['self-intro']
      before.reviewQueue = ['self-intro-review-1']
      before.lastVisitedLesson = 'self-intro'
      before.lessonStepProgress = {
        'self-intro': { completedSections: ['dialogue'], shortInputComplete: true },
      }
      saveProgress(before)

      renderRoute('/lesson/not-a-lesson')

      expect(screen.getByRole('heading', { level: 1, name: heading })).toBeVisible()
      expect(screen.getByRole('link', { name: backLabel })).toHaveAttribute('href', '/home')
      expect(loadProgress()).toEqual(before)
    },
  )

  it('updates only lastVisitedLesson when a valid lesson opens', () => {
    const before = createDefaultProgress()
    before.selectedExplanationLanguage = 'fr'
    before.completedLessons = ['self-intro']
    before.reviewQueue = ['self-intro-review-1']
    before.lastVisitedLesson = 'self-intro'
    before.lessonStepProgress = {
      'self-intro': { completedSections: ['dialogue'], shortInputComplete: true },
    }
    saveProgress(before)

    renderRoute('/lesson/ask-directions')

    expect(loadProgress()).toEqual({ ...before, lastVisitedLesson: 'ask-directions' })
  })

  it('renders the full lesson template and lets the user switch explanations without changing progress', async () => {
    const user = userEvent.setup()
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
    })

    renderRoute('/lesson/self-intro')

    expect(
      screen.getByRole('heading', { level: 1, name: /到达机场\s+Arrivée à l’aéroport/i }),
    ).toBeVisible()
    expect(screen.queryByText(/到达机场 \/ Arrivée à l’aéroport/i)).not.toBeInTheDocument()
    expect(screen.getByText('到达机场')).toHaveClass('lesson-topic-title__primary')
    expect(screen.getByText('Arrivée à l’aéroport')).toHaveClass('lesson-topic-title__secondary')
    expect(screen.getByRole('region', { name: /aperçu de la leçon/i })).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: /objectif de la scène/i }),
    ).toBeVisible()
    expect(screen.getByRole('region', { name: /aperçu de progression de la leçon/i })).toBeVisible()
    expect(screen.getByRole('region', { name: /pratique du dialogue/i })).toBeVisible()
    expect(screen.getAllByLabelText(/ligne de dialogue, interlocuteur voyageur/i)[0]).toHaveTextContent(
      '您好',
    )
    expect(screen.getByRole('heading', { level: 2, name: /dialogue/i })).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: /structures utiles/i }),
    ).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: /vocabulaire/i }),
    ).toBeVisible()
    expect(screen.getByText(/voici mon passeport/i)).toBeVisible()
    expect(screen.getByRole('link', { name: /passer à la pratique/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /retour à l’accueil/i })).toBeVisible()
    expect(screen.queryByRole('region', { name: /lesson overview/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'English' }))

    expect(screen.getByText(/this is my passport/i)).toBeVisible()
    expect(loadProgress().selectedExplanationLanguage).toBe('en')
  })

  it.each(['en', 'fr'] as const)(
    'renders all lesson page top headings as Chinese plus the %s explanation line',
    (language) => {
      for (const topic of expectedLessonTopicOrder) {
        localStorage.clear()
        saveProgress({
          ...createDefaultProgress(),
          selectedExplanationLanguage: language,
        })

        const { unmount } = renderRoute(`/lesson/${topic.id}`)
        const heading = screen.getByRole('heading', {
          level: 1,
          name: expectedLessonTopicPattern(topic, language),
        })

        expect(heading).toBeVisible()
        expect(heading).not.toHaveTextContent(' / ')
        expect(within(heading).getByText(topic.hanzi)).toHaveClass('lesson-topic-title__primary')
        expect(within(heading).getByText(topic[language])).toHaveClass(
          'lesson-topic-title__secondary',
        )

        unmount()
      }
    },
  )

  it.each([
    {
      language: 'en',
      count: '3 study layers',
      summary: 'This lesson covers dialogue, useful patterns, and vocabulary.',
      removed: /pronunciation|hanzi recognition/i,
      dialogueTitle: 'Ask for help from baggage claim to the taxi pickup',
    },
    {
      language: 'fr',
      count: '3 étapes d’étude',
      summary: 'Cette leçon couvre le dialogue, les structures utiles et le vocabulaire.',
      removed: /prononciation|reconnaissance des hanzi|hanzi à reconnaître/i,
      dialogueTitle: 'Demander de l’aide des bagages jusqu’au taxi',
    },
  ] as const)(
    'shows only the three learner layers in $language',
    ({ language, count, summary, removed, dialogueTitle }) => {
      saveProgress({ ...createDefaultProgress(), selectedExplanationLanguage: language })
      renderRoute('/lesson/self-intro')

      const preview = screen.getByRole('region', {
        name:
          language === 'en'
            ? /lesson progress preview/i
            : /aperçu de progression/i,
      })
      const steps = within(preview).getAllByRole('listitem')
      expect(preview).toHaveTextContent(count)
      expect(steps).toHaveLength(3)
      expect(steps.map((step) => step.textContent)).toEqual(
        language === 'en'
          ? ['1Dialogue', '2Useful patterns', '3Vocabulary']
          : ['1Dialogue', '2Structures utiles', '3Vocabulaire'],
      )
      expect(steps[0]).toHaveClass('is-current')
      expect(preview).not.toHaveTextContent(removed)
      const retainedHeadings =
        language === 'en'
          ? ['Dialogue', 'Useful patterns', 'Vocabulary']
          : ['Dialogue', 'Structures utiles', 'Vocabulaire']
      for (const heading of retainedHeadings) {
        expect(screen.getByRole('heading', { level: 2, name: heading })).toBeVisible()
      }
      const overview = screen.getByRole('region', {
        name: language === 'en' ? /lesson overview/i : /aperçu de la leçon/i,
      })
      expect(within(overview).getByText(summary)).toBeVisible()
      expect(overview).not.toHaveTextContent(removed)
      expect(
        screen.queryByRole('heading', { level: 2, name: removed }),
      ).not.toBeInTheDocument()
      expect(screen.queryByText(dialogueTitle)).not.toBeInTheDocument()
    },
  )

  it('keeps only Practice and Home in the lesson action dock', () => {
    renderRoute('/lesson/self-intro')
    const actions = screen.getByRole('navigation', { name: /lesson actions/i })

    expect(within(actions).getAllByRole('link')).toHaveLength(2)
    expect(within(actions).getByRole('link', { name: /go to practice/i })).toHaveAttribute(
      'href',
      '/lesson/self-intro/practice',
    )
    expect(within(actions).getByRole('link', { name: /back to home/i })).toHaveAttribute(
      'href',
      '/home',
    )
    expect(
      within(actions).queryByRole('link', { name: /finish with short input/i }),
    ).not.toBeInTheDocument()
  })

  it('adds MP3-first playback controls for retained lesson materials', async () => {
    const user = userEvent.setup()
    const lesson = course.lessons[0]

    renderRoute('/lesson/self-intro')

    const playbackButtons = screen.getAllByRole('button', { name: /play chinese/i })
    expect(playbackButtons).toHaveLength(
      lesson.dialogue.lines.length +
        lesson.sentencePatterns.length +
        lesson.vocabulary.length,
    )
    expect(screen.queryAllByText(/^Play Chinese$/i)).toHaveLength(0)
    playbackButtons.forEach((button) => {
      expect(button).toHaveAttribute('title', 'Play Chinese')
      expect(button).not.toHaveTextContent(/play chinese/i)
    })

    await user.click(playbackButtons[0])
    await user.click(playbackButtons[lesson.dialogue.lines.length])
    await user.click(
      playbackButtons[lesson.dialogue.lines.length + lesson.sentencePatterns.length],
    )

    expect(audioConstructor).toHaveBeenNthCalledWith(1, '/audio/self-intro/line-01.mp3')
    expect(audioConstructor).toHaveBeenNthCalledWith(2, '/audio/self-intro/pattern-01.mp3')
    expect(audioConstructor).toHaveBeenNthCalledWith(3, '/audio/self-intro/vocab-01.mp3')
    expect(audioPlay).toHaveBeenCalledTimes(3)
    expect(cancel).toHaveBeenCalledTimes(3)
    expect(speak).not.toHaveBeenCalled()
  })
})
