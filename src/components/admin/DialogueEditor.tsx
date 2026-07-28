import { useEffect, useState } from 'react'

import { toEditableLocalizedText } from '../../admin/localized.js'
import type { LessonContent } from '../../content/types.js'

interface DialogueEditorProps {
  dialogue: LessonContent['dialogue']
  onSave(payload: LessonContent['dialogue']): Promise<void>
}

export function DialogueEditor({ dialogue, onSave }: DialogueEditorProps) {
  const initialTitle = toEditableLocalizedText(dialogue.title)
  const [titleEn, setTitleEn] = useState(initialTitle.en)
  const [titleFr, setTitleFr] = useState(initialTitle.fr)
  const [firstLineHanzi, setFirstLineHanzi] = useState(dialogue.lines[0]?.hanzi ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const nextTitle = toEditableLocalizedText(dialogue.title)
    setTitleEn(nextTitle.en)
    setTitleFr(nextTitle.fr)
    setFirstLineHanzi(dialogue.lines[0]?.hanzi ?? '')
  }, [dialogue])

  async function handleSave() {
    setSaving(true)
    try {
      await onSave({
        ...dialogue,
        title: { en: titleEn, fr: titleFr },
        lines: dialogue.lines.map((line, index) =>
          index === 0
            ? {
                ...line,
                hanzi: firstLineHanzi,
              }
            : line,
        ),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="surface-card lesson-section-card admin-module-card" aria-label="Dialogue">
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">Structured editor</p>
          <h2>Dialogue</h2>
          <p className="muted-text">Focus this quick editor on the bilingual title and the first visible spoken line.</p>
        </div>
        <span className="badge badge--gold">Learner-facing</span>
      </div>
      <div className="admin-field-grid admin-field-grid--two-column">
        <label className="admin-field">
          <span>Dialogue title (en)</span>
          <input value={titleEn} onChange={(event) => setTitleEn(event.target.value)} />
        </label>
        <label className="admin-field">
          <span>Dialogue title (fr)</span>
          <input value={titleFr} onChange={(event) => setTitleFr(event.target.value)} />
        </label>
        <label className="admin-field admin-field--full">
          <span>First line hanzi</span>
          <textarea value={firstLineHanzi} onChange={(event) => setFirstLineHanzi(event.target.value)} />
        </label>
      </div>
      <div className="admin-card-actions">
        <span className="muted-text">Use the side preview to confirm the dialogue still reads naturally in context.</span>
        <button type="button" className="primary-button" onClick={handleSave} disabled={saving}>
          Save dialogue draft
        </button>
      </div>
    </section>
  )
}
