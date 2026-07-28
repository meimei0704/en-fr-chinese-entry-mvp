import { useEffect, useState } from 'react'

interface JsonModuleEditorProps {
  label: string
  payload: unknown
  onSave(payload: unknown): Promise<void>
}

export function JsonModuleEditor({ label, payload, onSave }: JsonModuleEditorProps) {
  const [value, setValue] = useState(JSON.stringify(payload, null, 2))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setValue(JSON.stringify(payload, null, 2))
    setError(null)
  }, [payload])

  async function handleSave() {
    let parsed: unknown

    try {
      parsed = JSON.parse(value)
      setError(null)
    } catch {
      setError(`Invalid JSON for ${label.toLowerCase()}`)
      return
    }

    setSaving(true)
    try {
      await onSave(parsed)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="surface-card lesson-section-card admin-module-card" aria-label={label}>
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">JSON editor</p>
          <h2>{label}</h2>
          <p className="muted-text">Keep the payload valid JSON. The browser validates this before any draft save request.</p>
        </div>
        <span className="badge badge--sky">Flexible module</span>
      </div>
      <label className="admin-field">
        <span>{label} JSON</span>
        <textarea
          className="admin-code-area"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={10}
        />
      </label>
      <div className="admin-card-actions">
        {error ? <p className="admin-inline-feedback admin-inline-feedback--error">{error}</p> : <span />}
        <button type="button" className="primary-button" onClick={handleSave} disabled={saving}>
          Save {label.toLowerCase()} draft
        </button>
      </div>
    </section>
  )
}
