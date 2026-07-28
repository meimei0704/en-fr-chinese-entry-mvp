import type { AdminLessonSnapshot } from '../../admin/types.js'

interface ModuleHistoryListProps {
  snapshot: AdminLessonSnapshot
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
    case 'hanziRecognition':
      return 'Hanzi Recognition'
    case 'reviewCards':
      return 'Review Cards'
    case 'shortInput':
      return 'Short Input'
    default:
      return moduleType.charAt(0).toUpperCase() + moduleType.slice(1)
  }
}

export function ModuleHistoryList({ snapshot, pendingAction, onPublish, onRollback }: ModuleHistoryListProps) {
  return (
    <section className="surface-card lesson-section-card" aria-label="Module history">
      <h2>Module History</h2>
      {snapshot.modules.map((module) => {
        const label = moduleLabel(module.moduleType)
        const history = snapshot.publishedHistory[module.moduleType] ?? []
        const moduleActionPending = pendingAction?.moduleType === module.moduleType

        return (
          <article key={module.moduleType}>
            <h3>{label}</h3>
            <p>{module.hasUnpublishedChanges ? 'Draft differs from published' : 'Published in sync'}</p>
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
            <ul>
              {history.map((entry) => (
                <li key={entry.revisionId}>
                  <span>{entry.note ?? `Published revision ${entry.revisionId}`}</span>
                  <span>
                    {' '}
                    · Revision {entry.revisionId} · {entry.createdBy} · {entry.createdAt}
                  </span>{' '}
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
