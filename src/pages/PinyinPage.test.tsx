import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getLocalizedText } from '../content/copy'
import { pinyinCourse } from '../content/pinyin/course'
import { loadPinyinProgress } from '../lib/pinyinProgress'
import { createDefaultProgress, saveProgress } from '../lib/progress'
import { speakChinese } from '../lib/speech'
import { renderRoute } from '../test/renderRoute'

vi.mock('../lib/speech', () => ({
  speakChinese: vi.fn(),
}))

const courseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'

describe('PinyinPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(speakChinese).mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the Pinyin lesson hero', () => {
    renderRoute('/pinyin')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Pinyin（零基础第一课）' }),
    ).toBeVisible()
  })

  it('renders numbered lesson tab badges for every pinyin lesson', () => {
    renderRoute('/pinyin')

    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(pinyinCourse.lessons.length)
    expect(tabs.map((tab) => tab.querySelector('span')?.textContent)).toEqual(
      pinyinCourse.lessons.map((_, index) => String(index + 1)),
    )
  })

  it('renders reference cards with audio playback entry points', () => {
    renderRoute('/pinyin')

    expect(screen.getByRole('heading', { level: 2, name: 'Reference' })).toBeVisible()
    expect(screen.getByRole('heading', { level: 3, name: 'Initials' })).toBeVisible()
    expect(screen.getByText('bo')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Play bo' })).toBeVisible()
  })

  it('marks the reference section complete after the learner plays a reference audio sample', async () => {
    const user = userEvent.setup()
    const existingCourseProgress = JSON.stringify({
      selectedExplanationLanguage: 'en',
      completedLessons: ['self-intro'],
      reviewQueue: [],
      lastVisitedLesson: 'self-intro',
      lessonStepProgress: {},
    })

    localStorage.setItem(courseProgressStorageKey, existingCourseProgress)
    renderRoute('/pinyin')

    await user.click(screen.getByRole('button', { name: 'Play bo' }))

    expect(vi.mocked(speakChinese)).toHaveBeenCalledWith({
      text: 'bo',
      audioSrc: '/audio/pinyin/lesson-1/reference-initial-b.mp3',
    })
    expect(loadPinyinProgress()).toMatchObject({
      completedSections: ['reference'],
    })
    expect(localStorage.getItem(courseProgressStorageKey)).toBe(existingCourseProgress)
  })

  it('finishes the fixed eight-question tone game and records the score', async () => {
    const user = userEvent.setup()
    const questions = pinyinCourse.lessons[0].toneGame.questions

    renderRoute('/pinyin')

    expect(screen.getByRole('heading', { level: 2, name: 'Tone ear check' })).toBeVisible()

    for (const [index, question] of questions.entries()) {
      const correctChoice = question.choices.find((choice) => choice.id === question.correctChoiceId)

      expect(correctChoice).toBeDefined()
      expect(screen.getByText(`Question ${index + 1} of ${questions.length}`)).toBeVisible()

      const correctToneLabel = correctChoice ? getLocalizedText(correctChoice.toneLabel, 'en') : ''

      await user.click(screen.getByRole('radio', { name: new RegExp(correctToneLabel) }))
      await user.click(screen.getByRole('button', { name: 'Submit answer' }))
    }

    expect(screen.getByRole('heading', { level: 3, name: 'Tone game result' })).toBeVisible()
    expect(screen.getByText('Correct rate')).toBeVisible()
    expect(screen.getByText('8/8')).toBeVisible()
    expect(loadPinyinProgress()).toMatchObject({
      toneGameLastScore: 8,
      toneGameBestScore: 8,
      completedSections: ['tone-game'],
    })
  })

  it('localizes Pinyin page chrome and audio labels for French learners', () => {
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
    })

    renderRoute('/pinyin')

    expect(screen.getAllByText('Leçon 1')).toHaveLength(2)
    expect(screen.getByRole('heading', { level: 2, name: 'Référence' })).toBeVisible()
    expect(screen.getByText(/Construisez une première carte sonore/i)).toBeVisible()
    expect(screen.getByText('Premier ton')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Écouter bo' })).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: 'Écoute des tons' })).toBeVisible()
    expect(screen.getByText('Question 1 sur 8')).toBeVisible()
    expect(screen.getByText('Premier ton : haut et plat')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Écouter l’extrait de ton 1' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Valider la réponse' })).toBeVisible()

    expect(screen.queryByText('Reference')).not.toBeInTheDocument()
    expect(screen.queryByText('First tone: high and level')).not.toBeInTheDocument()
    expect(screen.queryByText('Coming next')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Play Chinese' })).not.toBeInTheDocument()
  })
})
