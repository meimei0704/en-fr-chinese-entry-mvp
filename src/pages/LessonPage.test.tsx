import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { course } from '../content/course'
import { createDefaultProgress, loadProgress, saveProgress } from '../lib/progress'
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
    expect(screen.getAllByLabelText(/dialogue line speaker officer/i)[0]).toHaveTextContent('你好')
    expect(screen.getAllByLabelText(/dialogue line speaker officer/i)[0]).toHaveTextContent('Nǐ hǎo')
  })

  it('renders the full lesson template and lets the user switch explanations without changing progress', async () => {
    const user = userEvent.setup()
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
    })

    renderRoute('/lesson/self-intro')

    expect(
      screen.getByRole('heading', { level: 1, name: /bases du passage à l’immigration/i }),
    ).toBeVisible()
    expect(screen.getByRole('region', { name: /aperçu de la leçon/i })).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: /objectif de la scène/i }),
    ).toBeVisible()
    expect(screen.getByRole('region', { name: /aperçu de progression de la leçon/i })).toBeVisible()
    expect(screen.getByRole('region', { name: /pratique du dialogue/i })).toBeVisible()
    expect(screen.getAllByLabelText(/ligne de dialogue, interlocuteur agent/i)[0]).toHaveTextContent(
      '你好',
    )
    expect(screen.getByRole('heading', { level: 2, name: /dialogue/i })).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: /structures utiles/i }),
    ).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: /vocabulaire/i }),
    ).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: /prononciation/i }),
    ).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: /reconnaissance des hanzi/i }),
    ).toBeVisible()
    expect(screen.getByText(/voici mon passeport/i)).toBeVisible()
    expect(screen.getByRole('link', { name: /passer à la pratique/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /terminer avec la mini-réponse/i })).toBeVisible()
    expect(screen.queryByRole('region', { name: /lesson overview/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'English' }))

    expect(screen.getByText(/this is my passport/i)).toBeVisible()
    expect(loadProgress().selectedExplanationLanguage).toBe('en')
  })

  it('adds polished study status cues around the existing lesson flow', () => {
    renderRoute('/lesson/self-intro')

    const progressPreview = screen.getByRole('region', { name: /lesson progress preview/i })
    expect(progressPreview).toHaveClass('lesson-progress-preview')
    expect(progressPreview).toHaveTextContent(/5 study layers/i)
    expect(progressPreview).toHaveTextContent(/dialogue/i)
    expect(progressPreview).toHaveTextContent(/practice next/i)
    expect(progressPreview).toHaveTextContent(/immigration/i)

    const overview = screen.getByRole('region', { name: /lesson overview/i })
    expect(overview).toHaveClass('lesson-overview-card')
    expect(overview).toHaveTextContent(/scenario/i)

    expect(screen.getByRole('navigation', { name: /lesson actions/i })).toHaveClass(
      'lesson-action-dock',
    )
  })

  it('adds MP3-first playback controls for sentence patterns, vocabulary, and pronunciation materials', async () => {
    const user = userEvent.setup()
    const lesson = course.lessons[0]

    renderRoute('/lesson/self-intro')

    const playbackButtons = screen.getAllByRole('button', { name: /play chinese/i })
    expect(playbackButtons).toHaveLength(
      lesson.dialogue.lines.length +
        lesson.sentencePatterns.length +
        lesson.vocabulary.length +
        lesson.pronunciation.length,
    )
    expect(screen.queryAllByText(/^Play Chinese$/i)).toHaveLength(0)
    playbackButtons.forEach((button) => {
      expect(button).toHaveAttribute('title', 'Play Chinese')
      expect(button).not.toHaveTextContent(/play chinese/i)
    })

    await user.click(playbackButtons[lesson.dialogue.lines.length])
    await user.click(
      playbackButtons[lesson.dialogue.lines.length + lesson.sentencePatterns.length],
    )
    await user.click(playbackButtons.at(-1)!)

    expect(audioConstructor).toHaveBeenNthCalledWith(1, '/audio/self-intro/pattern-01.mp3')
    expect(audioConstructor).toHaveBeenNthCalledWith(2, '/audio/self-intro/vocab-01.mp3')
    expect(audioConstructor).toHaveBeenNthCalledWith(3, '/audio/self-intro/pronunciation-01.mp3')
    expect(audioPlay).toHaveBeenCalledTimes(3)
    expect(cancel).toHaveBeenCalledTimes(3)
    expect(speak).not.toHaveBeenCalled()
  })
})
