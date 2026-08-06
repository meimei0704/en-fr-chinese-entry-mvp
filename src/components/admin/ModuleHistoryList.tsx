import type { AdminLessonSnapshot } from '../../admin/types.js'

interface ModuleHistoryListProps {
  snapshot: AdminLessonSnapshot
  modules: AdminLessonSnapshot['modules']
  pendingAction:
    | {
        moduleType: string
        kind: 'publish' | 'rollback'
        revisionId?: number
      }
    | null
  onPublish(moduleType: string): Promise<void>
  onRollback(moduleType: string, revisionId: number): Promise<void>
}

function moduleLabel(moduleType: string) {
  switch (moduleType) {
    case 'lessonMeta':
      return 'Lesson Meta'
    case 'sentencePatterns':
      return 'Sentence Patterns'
    case 'reviewCards':
      return 'Review Cards'
    case 'shortInput':
      return 'Short Input'
    default:
      return moduleType.charAt(0).toUpperCase() + moduleType.slice(1)
  }
}

export function ModuleHistoryList({
  snapshot,
  modules,
  pendingAction,
  onPublish,
  onRollback,
}: ModuleHistoryListProps) {
  return (
    <section className="surface-card lesson-section-card admin-history-card" aria-label="Module history">
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">Publish controls</p>
          <h2>Module History</h2>
          <p className="muted-text">Publish changed modules intentionally and keep a readable rollback trail for every revision.</p>
        </div>
        <span className="badge badge--gold">Review carefully</span>
      </div>
      {modules.map((module) => {
        const label = moduleLabel(module.moduleType)
        const history = snapshot.publishedHistory[module.moduleType] ?? []
        const moduleActionPending = pendingAction?.moduleType === module.moduleType

        return (
          <article key={module.moduleType} className="admin-history-module">
            <div className="admin-history-module__header">
              <div>
                <h3>{label}</h3>
                <p className="muted-text">
                  {module.hasUnpublishedChanges ? 'Draft differs from published' : 'Published in sync'}
                </p>
              </div>
              <span className={`badge ${module.hasUnpublishedChanges ? 'badge--gold' : 'badge--jade'}`}>
                {module.hasUnpublishedChanges ? 'Needs publish' : 'Published'}
              </span>
            </div>
            {module.hasUnpublishedChanges ? (
              <button
                type="button"
                className="primary-button"
                onClick={() => void onPublish(module.moduleType)}
                disabled={moduleActionPending}
              >
                {moduleActionPending && pendingAction?.kind === 'publish'
                  ? `Publishing ${label.toLowerCase()}…`
                  : `Publish ${label.toLowerCase()}`}
              </button>
            ) : null}
            <ul className="admin-history-list">
              {history.map((entry) => (
                <li key={entry.revisionId} className="admin-history-entry">
                  <div className="admin-history-entry__meta">
                    <strong>{entry.note ?? `Published revision ${entry.revisionId}`}</strong>
                    <span>
                      Revision {entry.revisionId} · {entry.createdBy} · {entry.createdAt}
                    </span>
                  </div>
                  {entry.revisionId !== module.publishedRevisionId ? (
                    <button
                      type="button"
                      className="secondary-link"
                      onClick={() => void onRollback(module.moduleType, entry.revisionId)}
                      disabled={moduleActionPending}
                    >
                      {moduleActionPending &&
                      pendingAction?.kind === 'rollback' &&
                      pendingAction.revisionId === entry.revisionId
                        ? `Rolling back ${label.toLowerCase()}…`
                        : `Rollback ${label.toLowerCase()} to revision ${entry.revisionId}`}
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          </article>
        )
      })}
    </section>
  )
}
