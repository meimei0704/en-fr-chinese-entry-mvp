import { useCallback, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { PracticeChallenge } from '../components/PracticeChallenge'
import { pinyinCourse } from '../content/pinyin/course'
import type { PinyinModuleContent, PinyinModuleKey } from '../content/types'
import { buildPinyinPracticeChallenge } from '../lib/practiceChallenge'
import { loadProgress } from '../lib/progress'
import {
  loadPinyinProgress,
  recordPinyinPracticeComplete,
  savePinyinProgress,
} from '../lib/pinyinProgress'

function findPinyinModule(moduleKey: string | null): PinyinModuleContent {
  return (
    pinyinCourse.modules.find((module) => module.id === moduleKey) ?? pinyinCourse.modules[0]
  )
}

export function PinyinPracticePage() {
  const [searchParams] = useSearchParams()
  const module = findPinyinModule(searchParams.get('module'))
  const [seed] = useState(() => Math.floor(Math.random() * 2 ** 31))
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const selectedLanguage = loadProgress().selectedExplanationLanguage
  const copy = getUiCopy(selectedLanguage)

  const buildChallenge = useCallback(
    (nextSeed: number) =>
      module.toneGame
        ? buildPinyinPracticeChallenge(module, selectedLanguage, 5, nextSeed)
        : { questions: [], maxScore: 0 },
    [module, selectedLanguage],
  )

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
