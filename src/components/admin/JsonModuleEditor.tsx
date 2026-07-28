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
    <section className="surface-card lesson-section-card" aria-label={label}>
      <h2>{label}</h2>
      <label>
        {label} JSON
        <textarea value={value} onChange={(event) => setValue(event.target.value)} rows={10} />
      </label>
      {error ? <p>{error}</p> : null}
      <button type="button" className="primary-button" onClick={handleSave} disabled={saving}>
        Save {label.toLowerCase()} draft
      </button>
    </section>
  )
}
