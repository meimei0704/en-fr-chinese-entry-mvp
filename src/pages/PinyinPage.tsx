import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { ContentLoading } from '../components/ContentState'
import type { PinyinModuleKey } from '../content/types'
import { PinyinHero } from '../components/pinyin/PinyinHero'
import { PinyinReferenceSection } from '../components/pinyin/PinyinReferenceSection'
import { PinyinWholeSyllablesSection } from '../components/pinyin/PinyinWholeSyllablesSection'
import {
  loadPinyinProgress,
  recordPinyinReferenceComplete,
  savePinyinProgress,
} from '../lib/pinyinProgress'
import { loadProgress } from '../lib/progress'
import { usePinyinCourse } from '../lib/pinyinContentProvider'

const moduleKeys: PinyinModuleKey[] = ['initials', 'finals', 'tones', 'whole-syllables']

function findDefaultModuleKey(): PinyinModuleKey {
  const progress = loadPinyinProgress()

  for (const moduleId of moduleKeys) {
    if (moduleId === 'whole-syllables') {
      continue
    }
    if (!progress.completedSections.includes('reference')) {
      return moduleId
    }
  }

  return moduleKeys[0]
}

export function PinyinPage() {
  const { course: pinyinCourse, error, reload } = usePinyinCourse()
  const language = loadProgress().selectedExplanationLanguage
  const copy = getUiCopy(language)
  const pinyinCopy = copy.pinyinPage
  const [, setProgress] = useState(() => loadPinyinProgress())
  const [selectedModuleKey, setSelectedModuleKey] = useState<PinyinModuleKey>(findDefaultModuleKey)

  const module = useMemo(
    () =>
      pinyinCourse?.modules.find((m) => m.id === selectedModuleKey) ?? pinyinCourse?.modules[0],
    [pinyinCourse, selectedModuleKey],
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

  if (!pinyinCourse || !module) {
    return <ContentLoading />
  }

  function handleReferenceAudioPlay() {
    const nextProgress = recordPinyinReferenceComplete(loadPinyinProgress(), selectedModuleKey)

    savePinyinProgress(nextProgress)
    setProgress(nextProgress)
  }

  return (
    <main className="page-shell page-shell--wide pinyin-page">
      <div className="pinyin-page__content">
        <PinyinHero eyebrow={pinyinCopy.eyebrow} heading={pinyinCopy.heading} />

        <nav role="tablist" aria-label="Pinyin modules" className="pinyin-lesson-tabs">
          {pinyinCourse.modules.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              className={`pinyin-lesson-tab pinyin-lesson-tab--${m.id} ${
                m.id === selectedModuleKey ? 'pinyin-lesson-tab--selected' : ''
              }`}
              aria-selected={m.id === selectedModuleKey}
              onClick={() => {
                setProgress(loadPinyinProgress())
                setSelectedModuleKey(m.id)
              }}
            >
              <span className="pinyin-lesson-tab__badge" aria-hidden="true">
                {getModuleBadge(m.id)}
              </span>
              {getLocalizedText(m.title, language)}
            </button>
          ))}
        </nav>

        {module.intro ? (
          <p className="pinyin-module-intro muted-text">{getLocalizedText(module.intro, language)}</p>
        ) : null}

        {module.id === 'whole-syllables' && module.wholeSyllables ? (
          <PinyinWholeSyllablesSection
            items={module.wholeSyllables}
            language={language}
            playAudioLabel={pinyinCopy.playReferenceAudio}
            onReferenceAudioPlay={handleReferenceAudioPlay}
          />
        ) : (
          <PinyinReferenceSection
            groups={module.reference}
            language={language}
            playAudioLabel={pinyinCopy.playReferenceAudio}
            onReferenceAudioPlay={handleReferenceAudioPlay}
          />
        )}

        <nav className="button-row lesson-actions lesson-action-dock" aria-label={pinyinCopy.lessonActions}>
          {module.toneGame ? (
            <Link className="primary-button" to={`/pinyin/practice?module=${selectedModuleKey}`}>
              {pinyinCopy.goToPractice}
            </Link>
          ) : null}
          <Link className="secondary-link" to="/home">
            {pinyinCopy.backToHome}
          </Link>
        </nav>
      </div>
    </main>
  )
}

function getModuleBadge(moduleKey: PinyinModuleKey): string {
  const badges: Record<PinyinModuleKey, string> = {
    initials: '①',
    finals: '②',
    tones: '③',
    'whole-syllables': '④',
  }
  return badges[moduleKey]
}
