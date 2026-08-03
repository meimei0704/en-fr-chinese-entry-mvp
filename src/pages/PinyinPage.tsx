import { useState } from 'react'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { pinyinCourse } from '../content/pinyin/course'
import { PinyinHero } from '../components/pinyin/PinyinHero'
import { PinyinReferenceSection } from '../components/pinyin/PinyinReferenceSection'
import { ShadowingPracticeSection } from '../components/pinyin/ShadowingPracticeSection'
import { ToneGameSection } from '../components/pinyin/ToneGameSection'
import {
  loadPinyinProgress,
  recordPinyinReferenceComplete,
  savePinyinProgress,
} from '../lib/pinyinProgress'
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

  function handleReferenceAudioPlay() {
    const nextProgress = recordPinyinReferenceComplete(loadPinyinProgress())

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
          onReferenceAudioPlay={handleReferenceAudioPlay}
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

        <ShadowingPracticeSection
          shadowing={lesson.shadowing}
          language={language}
          progress={progress}
          copy={{
            lessonEyebrow: pinyinCopy.lessonEyebrow,
            promptProgress: pinyinCopy.shadowingPromptProgress,
            promptCompletionProgress: pinyinCopy.shadowingPromptCompletionProgress,
            playPromptAudio: pinyinCopy.playShadowingPromptAudio,
            startRecording: pinyinCopy.startRecording,
            stopRecording: pinyinCopy.stopRecording,
            recordAgain: pinyinCopy.recordAgain,
            nextPrompt: pinyinCopy.nextShadowingPrompt,
            recordingInProgress: pinyinCopy.recordingInProgress,
            localOnlyNotice: pinyinCopy.localOnlyRecordingNotice,
            localPlaybackLabel: pinyinCopy.localPlaybackLabel,
            completedMessage: pinyinCopy.shadowingCompletedMessage,
            recordingErrors: {
              unsupported: pinyinCopy.recordingUnsupportedMessage,
              'permission-denied': pinyinCopy.recordingPermissionDeniedMessage,
              'init-failed': pinyinCopy.recordingInitFailedMessage,
              'empty-recording': pinyinCopy.recordingEmptyMessage,
            },
          }}
          onProgressChange={setProgress}
        />
      </div>
    </main>
  )
}
