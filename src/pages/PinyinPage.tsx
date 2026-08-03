import { getLocalizedText } from '../content/copy'
import { pinyinCourse } from '../content/pinyin/course'
import { PinyinHero } from '../components/pinyin/PinyinHero'
import { PinyinReferenceSection } from '../components/pinyin/PinyinReferenceSection'
import { loadPinyinProgress } from '../lib/pinyinProgress'
import { loadProgress } from '../lib/progress'

export function PinyinPage() {
  const language = loadProgress().selectedExplanationLanguage
  const progress = loadPinyinProgress()
  const lesson = pinyinCourse.lesson

  return (
    <main className="page-shell page-shell--wide pinyin-page">
      <div className="pinyin-page__content">
        <PinyinHero
          summary={getLocalizedText(lesson.summary, language)}
          completedSectionCount={progress.completedSections.length}
          totalSectionCount={3}
        />

        <PinyinReferenceSection groups={lesson.reference} language={language} />

        <section id="pinyin-tone-game" className="surface-card pinyin-placeholder-section">
          <p className="eyebrow">Coming next</p>
          <h2>{getLocalizedText(lesson.toneGame.title, language)}</h2>
          <p className="muted-text">{getLocalizedText(lesson.toneGame.instructions, language)}</p>
        </section>

        <section id="pinyin-shadowing" className="surface-card pinyin-placeholder-section">
          <p className="eyebrow">Coming next</p>
          <h2>{getLocalizedText(lesson.shadowing.title, language)}</h2>
          <p className="muted-text">{getLocalizedText(lesson.shadowing.instructions, language)}</p>
        </section>
      </div>
    </main>
  )
}
