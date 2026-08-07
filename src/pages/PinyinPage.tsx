import { useMemo, useState } from 'react'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { pinyinCourse } from '../content/pinyin/course'
import { PinyinHero } from '../components/pinyin/PinyinHero'
import { PinyinReferenceSection } from '../components/pinyin/PinyinReferenceSection'
import { ToneGameSection } from '../components/pinyin/ToneGameSection'
import {
  loadPinyinProgress,
  recordPinyinReferenceComplete,
  savePinyinProgress,
} from '../lib/pinyinProgress'
import { loadProgress } from '../lib/progress'

const courseLessonIds = pinyinCourse.lessons.map((l) => l.id)

function findDefaultLesson(): (typeof courseLessonIds)[number] {
  const progress = loadPinyinProgress()

  for (const lesson of pinyinCourse.lessons) {
    const lp = progress.lessonProgress[lesson.id]
    if (!lp || lp.completedSections.length < 2) {
      return lesson.id
    }
  }

  return pinyinCourse.lessons[0].id
}

export function PinyinPage() {
  const language = loadProgress().selectedExplanationLanguage
  const copy = getUiCopy(language)
  const pinyinCopy = copy.pinyinPage
  const [progress, setProgress] = useState(() => loadPinyinProgress())
  const [selectedLessonId, setSelectedLessonId] = useState(findDefaultLesson)

  const lesson = useMemo(
    () => pinyinCourse.lessons.find((l) => l.id === selectedLessonId) ?? pinyinCourse.lessons[0],
    [selectedLessonId],
  )
  const lessonIndex = pinyinCourse.lessons.findIndex((l) => l.id === selectedLessonId)
  const lessonNumber = lessonIndex >= 0 ? lessonIndex + 1 : 1
  const sectionProgressDone = progress.lessonProgress[lesson.id]?.completedSections?.length ?? 0

  const navItems = [
    { href: '#pinyin-reference', label: pinyinCopy.referenceNav },
    { href: '#pinyin-tone-game', label: pinyinCopy.toneGameNav },
  ] as const

  function handleReferenceAudioPlay() {
    const nextProgress = recordPinyinReferenceComplete(loadPinyinProgress(), selectedLessonId)

    savePinyinProgress(nextProgress)
    setProgress(nextProgress)
  }

  return (
    <main className="page-shell page-shell--wide pinyin-page">
      <div className="pinyin-page__content">
        <PinyinHero
          eyebrow={pinyinCopy.eyebrow}
          heading={pinyinCopy.heading}
          summary={getLocalizedText(lesson.summary, language)}
          sectionProgress={pinyinCopy.sectionProgress(sectionProgressDone, 2)}
          sectionsNavLabel={pinyinCopy.sectionsNavLabel}
          navItems={navItems}
        />

        <nav role="tablist" aria-label="Pinyin lessons" className="pinyin-lesson-tabs">
          {pinyinCourse.lessons.map((l) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              className={`pinyin-lesson-tab ${l.id === selectedLessonId ? 'pinyin-lesson-tab--selected' : ''}`}
              aria-selected={l.id === selectedLessonId}
              onClick={() => {
                setProgress(loadPinyinProgress())
                setSelectedLessonId(l.id)
              }}
            >
              {getLocalizedText(l.title, language)}
            </button>
          ))}
        </nav>

        <PinyinReferenceSection
          groups={lesson.reference}
          language={language}
          eyebrow={pinyinCopy.lessonEyebrow(lessonNumber)}
          heading={pinyinCopy.referenceHeading}
          summary={pinyinCopy.referenceSummary}
          playAudioLabel={pinyinCopy.playReferenceAudio}
          onReferenceAudioPlay={handleReferenceAudioPlay}
        />

        <ToneGameSection
          toneGame={lesson.toneGame}
          language={language}
          lessonId={lesson.id}
          copy={{
            lessonEyebrow: pinyinCopy.lessonEyebrow(lessonNumber),
            questionProgress: pinyinCopy.toneGameQuestionProgress,
            playPromptAudio: pinyinCopy.playTonePromptAudio,
            choicesLegend: pinyinCopy.toneGameChoicesLegend,
            submitAnswer: pinyinCopy.submitToneAnswer,
            resultHeading: pinyinCopy.toneGameResultHeading,
            correctRate: pinyinCopy.toneGameCorrectRate,
            completedMessage: pinyinCopy.toneGameCompletedMessage,
            keepPracticingMessage: pinyinCopy.toneGameKeepPracticingMessage,
          }}
          onProgressChange={setProgress}
        />
      </div>
    </main>
  )
}
