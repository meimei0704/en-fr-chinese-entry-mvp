import { Link } from 'react-router-dom'

import { AdminAccessForm } from './AdminAccessForm.js'

interface AdminAccessScreenProps {
  eyebrow?: string
  heroTitle: string
  heroDescription: string
  formTitle?: string
  formDescription?: string
  error?: string | null
  submitLabel?: string
  backHref?: string
  backLabel?: string
  onSubmit(username: string, password: string): Promise<void>
}

export function AdminAccessScreen({
  eyebrow = 'Content Admin',
  heroTitle,
  heroDescription,
  formTitle,
  formDescription,
  error,
  submitLabel,
  backHref,
  backLabel,
  onSubmit,
}: AdminAccessScreenProps) {
  return (
    <main className="page-shell admin-auth-layout" data-testid="admin-auth-layout">
      <section className="hero-card admin-auth-shell">
        <div className="admin-auth-shell__header">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{heroTitle}</h1>
          <p className="lede">{heroDescription}</p>
        </div>
        <div className="admin-auth-shell__chips">
          <span className="badge badge--sky">Centered sign-in</span>
          <span className="badge badge--gold">Draft editing</span>
          <span className="badge badge--jade">Logic unchanged</span>
        </div>
        <AdminAccessForm
          title={formTitle}
          description={formDescription}
          error={error}
          submitLabel={submitLabel}
          onSubmit={onSubmit}
        />
        {backHref && backLabel ? (
          <div className="admin-auth-shell__footer">
            <Link className="secondary-link" to={backHref}>
              {backLabel}
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  )
}
