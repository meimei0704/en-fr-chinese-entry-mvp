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
    <section className="surface-card lesson-section-card" aria-label="Dialogue">
      <h2>Dialogue</h2>
      <label>
        Dialogue title (en)
        <input value={titleEn} onChange={(event) => setTitleEn(event.target.value)} />
      </label>
      <label>
        Dialogue title (fr)
        <input value={titleFr} onChange={(event) => setTitleFr(event.target.value)} />
      </label>
      <label>
        First line hanzi
        <textarea value={firstLineHanzi} onChange={(event) => setFirstLineHanzi(event.target.value)} />
      </label>
      <button type="button" className="primary-button" onClick={handleSave} disabled={saving}>
        Save dialogue draft
      </button>
    </section>
  )
}
