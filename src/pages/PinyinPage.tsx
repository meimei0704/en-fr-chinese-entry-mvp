import { useState } from 'react'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { pinyinCourse } from '../content/pinyin/course'
import { PinyinHero } from '../components/pinyin/PinyinHero'
import { PinyinReferenceSection } from '../components/pinyin/PinyinReferenceSection'
import { ToneGameSection } from '../components/pinyin/ToneGameSection'
import { loadPinyinProgress } from '../lib/pinyinProgress'
import { loadProgress } from '../lib/progress'

export function PinyinPage() {
  const language = loadProgress().selectedExplanationLanguage
  const copy = getUiCopy(language)
  const pinyinCopy = copy.pinyinPage
  const [progress, setProgress] = useState(() => loadPinyinProgress())
  const lesson = pinyinCourse.lesson
  const navItems = [
    { href: '#pinyin-reference', label: pinyinCopy.referenceNav },
    { href: '#pinyin-tone-game', label: pinyinCopy.toneGameNav },
    { href: '#pinyin-shadowing', label: pinyinCopy.shadowingNav },
  ] as const

  return (
    <main className="page-shell page-shell--wide pinyin-page">
      <div className="pinyin-page__content">
        <PinyinHero
          eyebrow={pinyinCopy.eyebrow}
          heading={pinyinCopy.heading}
          summary={getLocalizedText(lesson.summary, language)}
          sectionProgress={pinyinCopy.sectionProgress(progress.completedSections.length, 3)}
          sectionsNavLabel={pinyinCopy.sectionsNavLabel}
          navItems={navItems}
        />

        <PinyinReferenceSection
          groups={lesson.reference}
          language={language}
          eyebrow={pinyinCopy.lessonEyebrow}
          heading={pinyinCopy.referenceHeading}
          summary={pinyinCopy.referenceSummary}
          playAudioLabel={pinyinCopy.playReferenceAudio}
        />

        <ToneGameSection
          toneGame={lesson.toneGame}
          language={language}
          copy={{
            lessonEyebrow: pinyinCopy.lessonEyebrow,
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

        <section id="pinyin-shadowing" className="surface-card pinyin-placeholder-section">
          <p className="eyebrow">{pinyinCopy.comingNext}</p>
          <h2>{getLocalizedText(lesson.shadowing.title, language)}</h2>
          <p className="muted-text">{getLocalizedText(lesson.shadowing.instructions, language)}</p>
        </section>
      </div>
    </main>
  )
}
