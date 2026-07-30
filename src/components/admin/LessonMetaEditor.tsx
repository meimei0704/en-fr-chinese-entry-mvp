import { useEffect, useMemo, useState } from 'react'

import { toEditableLocalizedText } from '../../admin/localized.js'
import type { LessonContent } from '../../content/types.js'

interface LessonMetaEditorProps {
  lesson: LessonContent
  onSave(payload: { id: string; title: LessonContent['title']; scenario: LessonContent['scenario'] }): Promise<void>
  onDirtyChange?(dirty: boolean): void
}

export function LessonMetaEditor({ lesson, onSave, onDirtyChange }: LessonMetaEditorProps) {
  const initialTitle = toEditableLocalizedText(lesson.title)
  const initialScenario = toEditableLocalizedText(lesson.scenario)
  const [titleEn, setTitleEn] = useState(initialTitle.en)
  const [titleFr, setTitleFr] = useState(initialTitle.fr)
  const [scenarioEn, setScenarioEn] = useState(initialScenario.en)
  const [scenarioFr, setScenarioFr] = useState(initialScenario.fr)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const nextTitle = toEditableLocalizedText(lesson.title)
    const nextScenario = toEditableLocalizedText(lesson.scenario)
    setTitleEn(nextTitle.en)
    setTitleFr(nextTitle.fr)
    setScenarioEn(nextScenario.en)
    setScenarioFr(nextScenario.fr)
  }, [lesson])

  const initialPayload = useMemo(
    () => ({
      id: lesson.id,
      title: {
        en: initialTitle.en,
        fr: initialTitle.fr,
      },
      scenario: {
        en: initialScenario.en,
        fr: initialScenario.fr,
      },
    }),
    [initialScenario.en, initialScenario.fr, initialTitle.en, initialTitle.fr, lesson.id],
  )

  const draftPayload = useMemo(
    () => ({
      id: lesson.id,
      title: { en: titleEn, fr: titleFr },
      scenario: { en: scenarioEn, fr: scenarioFr },
    }),
    [lesson.id, scenarioEn, scenarioFr, titleEn, titleFr],
  )

  useEffect(() => {
    onDirtyChange?.(JSON.stringify(draftPayload) !== JSON.stringify(initialPayload))
  }, [draftPayload, initialPayload, onDirtyChange])

  async function handleSave() {
    setSaving(true)
    try {
      await onSave({
        id: draftPayload.id,
        title: draftPayload.title,
        scenario: draftPayload.scenario,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="surface-card lesson-section-card admin-module-card" aria-label="Lesson meta">
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">Structured editor</p>
          <h2>Lesson Meta</h2>
          <p className="muted-text">Keep the headline and scenario copy aligned across English and French.</p>
        </div>
        <span className="badge badge--jade">High visibility</span>
      </div>
      <div className="admin-field-grid admin-field-grid--two-column">
        <label className="admin-field">
          <span>Lesson title (en)</span>
          <input value={titleEn} onChange={(event) => setTitleEn(event.target.value)} />
        </label>
        <label className="admin-field">
          <span>Lesson title (fr)</span>
          <input value={titleFr} onChange={(event) => setTitleFr(event.target.value)} />
        </label>
        <label className="admin-field admin-field--full">
          <span>Scenario (en)</span>
          <textarea value={scenarioEn} onChange={(event) => setScenarioEn(event.target.value)} />
        </label>
        <label className="admin-field admin-field--full">
          <span>Scenario (fr)</span>
          <textarea value={scenarioFr} onChange={(event) => setScenarioFr(event.target.value)} />
        </label>
      </div>
      <div className="admin-card-actions">
        <span className="muted-text">Edits stay in draft until you publish from the side panel.</span>
        <button type="button" className="primary-button" onClick={handleSave} disabled={saving}>
          Save lesson meta draft
        </button>
      </div>
    </section>
  )
}
