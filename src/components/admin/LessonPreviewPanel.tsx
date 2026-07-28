import { getEnglishText } from '../../admin/localized.js'
import type { LessonContent } from '../../content/types.js'

interface LessonPreviewPanelProps {
  lesson: LessonContent | null
}

export function LessonPreviewPanel({ lesson }: LessonPreviewPanelProps) {
  return (
    <section className="surface-card lesson-section-card" aria-label="Draft preview">
      <h2>Draft Preview</h2>
      {lesson ? (
        <>
          <p>{lesson.id}</p>
          <p>{getEnglishText(lesson.title)}</p>
          <p>{lesson.dialogue.lines[0]?.hanzi}</p>
        </>
      ) : (
        <p>No draft preview available.</p>
      )}
    </section>
  )
}
