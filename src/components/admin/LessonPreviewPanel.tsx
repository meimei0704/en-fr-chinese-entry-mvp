import { getEnglishText } from '../../admin/localized.js'
import type { LessonContent } from '../../content/types.js'

interface LessonPreviewPanelProps {
  lesson: LessonContent | null
}

export function LessonPreviewPanel({ lesson }: LessonPreviewPanelProps) {
  return (
    <section className="surface-card lesson-section-card admin-preview-card" aria-label="Draft preview">
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">Side preview</p>
          <h2>Draft Preview</h2>
          <p className="muted-text">A compact learner-facing snapshot to spot obvious copy or structure issues before publish.</p>
        </div>
        <span className="badge badge--jade">Draft view</span>
      </div>
      {lesson ? (
        <div className="admin-preview-stack">
          <div className="admin-preview-stat">
            <span>Lesson id</span>
            <strong>{lesson.id}</strong>
          </div>
          <div className="admin-preview-stat">
            <span>English title</span>
            <strong>{getEnglishText(lesson.title)}</strong>
          </div>
          <div className="admin-preview-callout">
            <span>First line preview</span>
            <p className="hanzi-display hanzi-display--dialogue">{lesson.dialogue.lines[0]?.hanzi}</p>
          </div>
        </div>
      ) : (
        <p className="admin-inline-feedback">No draft preview available.</p>
      )}
    </section>
  )
}
