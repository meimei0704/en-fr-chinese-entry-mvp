import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { pinyinCourse } from '../content/pinyin/course'
import { PinyinHero } from '../components/pinyin/PinyinHero'
import { PinyinReferenceSection } from '../components/pinyin/PinyinReferenceSection'
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
  const [, setProgress] = useState(() => loadPinyinProgress())
  const [selectedLessonId, setSelectedLessonId] = useState(findDefaultLesson)

  const lesson = useMemo(
    () => pinyinCourse.lessons.find((l) => l.id === selectedLessonId) ?? pinyinCourse.lessons[0],
    [selectedLessonId],
  )
  const lessonIndex = pinyinCourse.lessons.findIndex((l) => l.id === selectedLessonId)
  const lessonNumber = lessonIndex >= 0 ? lessonIndex + 1 : 1

  function handleReferenceAudioPlay() {
    const nextProgress = recordPinyinReferenceComplete(loadPinyinProgress(), selectedLessonId)

    savePinyinProgress(nextProgress)
    setProgress(nextProgress)
  }

  return (
    <main className="page-shell page-shell--wide pinyin-page">
      <div className="pinyin-page__content">
        <PinyinHero eyebrow={pinyinCopy.eyebrow} heading={pinyinCopy.heading} />

        <nav role="tablist" aria-label="Pinyin lessons" className="pinyin-lesson-tabs">
          {pinyinCourse.lessons.map((l, index) => (
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
              <span>{index + 1}</span>
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

        <nav className="button-row lesson-actions lesson-action-dock" aria-label={pinyinCopy.lessonActions}>
          <Link className="primary-button" to={`/pinyin/practice?lesson=${selectedLessonId}`}>
            {pinyinCopy.goToPractice}
          </Link>
          <Link className="secondary-link" to="/home">
            {pinyinCopy.backToHome}
          </Link>
        </nav>
      </div>
    </main>
  )
}
