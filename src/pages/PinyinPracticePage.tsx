import { useCallback, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { PracticeChallenge } from '../components/PracticeChallenge'
import type { PinyinModuleContent, PinyinModuleKey } from '../content/types'
import { buildPinyinPracticeChallenge } from '../lib/practiceChallenge'
import { loadProgress } from '../lib/progress'
import {
  loadPinyinProgress,
  recordPinyinPracticeComplete,
  savePinyinProgress,
} from '../lib/pinyinProgress'
import { usePinyinCourse } from '../lib/pinyinContentProvider'

function findPinyinModule(
  modules: PinyinModuleContent[],
  moduleKey: string | null,
): PinyinModuleContent {
  return modules.find((module) => module.id === moduleKey) ?? modules[0]
}

export function PinyinPracticePage() {
  const [searchParams] = useSearchParams()
  const { course: pinyinCourse, error, reload } = usePinyinCourse()
  const selectedLanguage = loadProgress().selectedExplanationLanguage
  const copy = getUiCopy(selectedLanguage)
  const [seed] = useState(() => Math.floor(Math.random() * 2 ** 31))
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const module = pinyinCourse
    ? findPinyinModule(pinyinCourse.modules, searchParams.get('module'))
    : undefined
  const buildChallenge = useCallback(
    (nextSeed: number) =>
      module?.toneGame
        ? buildPinyinPracticeChallenge(module, selectedLanguage, 5, nextSeed)
        : { questions: [], maxScore: 0 },
    [module, selectedLanguage],
  )

  if (error) {
    return (
      <main className="page-shell">
        <section className="hero-card hero-card--compact">
          <p className="eyebrow">{copy.contentState.errorEyebrow}</p>
          <h1>{copy.contentState.errorHeading}</h1>
          <button type="button" className="primary-button" onClick={reload}>
            {copy.contentState.retry}
          </button>
        </section>
      </main>
    )
  }

  if (!module) {
    return (
      <main className="page-shell" role="status" aria-live="polite">
        <section className="hero-card hero-card--compact">
          <p className="eyebrow">{copy.contentState.loadingEyebrow}</p>
          <h1>{copy.contentState.loadingHeading}</h1>
        </section>
      </main>
    )
  }

  const moduleKey = module.id as PinyinModuleKey

  return (
    <main className="page-shell page-shell--wide practice-page">
      <section className="hero-card lesson-header-card practice-page__header">
        <header className="lesson-header-card__title">
          <p className="eyebrow">{copy.practicePage.eyebrow}</p>
          <h1>{getLocalizedText(module.title, selectedLanguage)}</h1>
        </header>
      </section>

      <section className="page-grid practice-page__body">
        <PracticeChallenge
          buildChallenge={buildChallenge}
          language={selectedLanguage}
          copy={copy.practiceChallenge}
          seed={seed}
          onComplete={() => {
            savePinyinProgress(recordPinyinPracticeComplete(loadPinyinProgress(), moduleKey))
          }}
          onCompleteLesson={() => {
            savePinyinProgress(recordPinyinPracticeComplete(loadPinyinProgress(), moduleKey))
          }}
          onLessonCompletedChange={setLessonCompleted}
        />

        <nav className="button-row" aria-label={copy.practicePage.practiceActions}>
          {lessonCompleted ? (
            <>
              <Link className="secondary-link" to="/progress">
                {copy.practicePage.viewProgress}
              </Link>
            </>
          ) : null}
          <Link className="secondary-link" to="/pinyin">
            {copy.practicePage.backToLesson}
          </Link>
        </nav>
      </section>
    </main>
  )
}
