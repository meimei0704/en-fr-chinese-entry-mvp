import { useState, type FormEvent } from 'react'

interface AdminAccessFormProps {
  title?: string
  description?: string
  error?: string | null
  submitLabel?: string
  onSubmit(username: string, password: string): Promise<void>
}

export function AdminAccessForm({
  title = 'Admin sign in required',
  description = 'Enter the content admin credentials to unlock draft editing and publish tools.',
  error,
  submitLabel = 'Unlock content admin',
  onSubmit,
}: AdminAccessFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)

    try {
      await onSubmit(username, password)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="surface-card lesson-section-card admin-access-card" data-testid="admin-access-card">
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">Protected workspace</p>
          <h2>{title}</h2>
          <p className="muted-text">{description}</p>
        </div>
        <span className="badge badge--sky">Credentials required</span>
      </div>
      <div className="admin-access-card__trust">
        <div className="admin-access-card__note">
          <strong>After sign-in</strong>
          <span>Unlock draft editing, preview, publish, and rollback tools for this admin workspace.</span>
        </div>
        <div className="admin-access-card__note">
          <strong>Auth scope</strong>
          <span>UI 会优化，但现有 Basic Auth / admin 凭证校验逻辑保持不变。</span>
        </div>
      </div>
      <form className="admin-form-grid" onSubmit={(event) => void handleSubmit(event)}>
        <div className="admin-access-card__field-grid">
          <label className="admin-field">
            <span>Admin username</span>
            <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
          </label>
          <label className="admin-field">
            <span>Admin password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
        </div>
        <div className="admin-form-actions">
          {error ? <p className="admin-inline-feedback admin-inline-feedback--error">{error}</p> : <span />}
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? 'Unlocking…' : submitLabel}
          </button>
        </div>
      </form>
    </section>
  )
}
