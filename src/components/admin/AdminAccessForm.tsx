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
    <section className="surface-card lesson-section-card">
      <h2>{title}</h2>
      <p>{description}</p>
      <form className="button-row" onSubmit={(event) => void handleSubmit(event)}>
        <label>
          Admin username
          <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
        </label>
        <label>
          Admin password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error ? <p>{error}</p> : null}
        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? 'Unlocking…' : submitLabel}
        </button>
      </form>
    </section>
  )
}
