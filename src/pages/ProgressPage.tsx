import { useState } from 'react'
import { Link } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { course } from '../content/course'
import { journeyNodeIcons, journeyNodes } from '../content/journey'
import type { JourneyNode, LessonId } from '../content/types'
import { loadProgress } from '../lib/progress'

type LessonJourneyNode = JourneyNode & { kind: 'lesson'; lessonId: LessonId }
type JourneyNodeStatus = 'complete' | 'current' | 'upcoming' | 'preview'

const orderedJourneyNodes = [...journeyNodes].sort((left, right) => left.pathOrder - right.pathOrder)
const lessonJourneyNodes = orderedJourneyNodes.filter(isLessonJourneyNode)
const lessonJourneyLessonIds = new Set(lessonJourneyNodes.map((node) => node.lessonId))

function isLessonJourneyNode(node: JourneyNode): node is LessonJourneyNode {
  return node.kind === 'lesson' && node.lessonId !== undefined
}

export function ProgressPage() {
  const progress = loadProgress()
  const language = progress.selectedExplanationLanguage
  const copy = getUiCopy(language)
  const [expandedPreviewNodeId, setExpandedPreviewNodeId] = useState<JourneyNode['id'] | null>(null)
  const currentLesson = course.lessons.find(
    (lesson) => lesson.id === progress.lastVisitedLesson,
  )
  const completedLessonIds = new Set(
    progress.completedLessons.filter((lessonId) => lessonJourneyLessonIds.has(lessonId)),
  )
  const completedLessonsCount = completedLessonIds.size
  const totalLessons = lessonJourneyNodes.length
  const completionPercent = totalLessons === 0
    ? 0
    : Math.round((completedLessonsCount / totalLessons) * 100)
  const currentLessonTitle = currentLesson
    ? getLocalizedText(currentLesson.title, language)
    : copy.progressPage.notStartedYet

  function getJourneyNodeStatus(node: JourneyNode): JourneyNodeStatus {
    if (!isLessonJourneyNode(node)) {
      return 'preview'
    }

    if (completedLessonIds.has(node.lessonId)) {
      return 'complete'
    }

    if (progress.lastVisitedLesson === node.lessonId) {
      return 'current'
    }

    return 'upcoming'
  }

  function getStatusLabel(status: JourneyNodeStatus) {
    switch (status) {
      case 'complete':
        return copy.progressPage.lessonStatusComplete
      case 'current':
        return copy.progressPage.lessonStatusCurrent
      case 'preview':
        return copy.progressPage.lessonStatusPreview
      case 'upcoming':
        return copy.progressPage.lessonStatusUpcoming
    }
  }

  return (
    <main className="page-shell page-shell--wide">
      <section className="hero-card progress-page-card">
        <header className="progress-hero__header">
          <div>
            <p className="eyebrow">{copy.progressPage.eyebrow}</p>
            <h1>{copy.progressPage.heading}</h1>
            <p className="lede">
              {copy.progressPage.completedSummary(completedLessonsCount, totalLessons)}
            </p>
          </div>
          <div className="progress-hero__seal" aria-hidden="true">
            进
          </div>
        </header>

        <section
          className="surface-card progress-summary-card"
          aria-label={copy.progressPage.summaryLabel}
        >
          <div>
            <p className="eyebrow">{copy.progressPage.nextStepEyebrow}</p>
            <h2>{copy.progressPage.currentLesson}</h2>
            <p className="progress-current-lesson">{currentLessonTitle}</p>
            <p className="muted-text">
              {copy.progressPage.reviewItemsWaiting(progress.reviewQueue.length)}
            </p>
          </div>

          <nav className="button-row" aria-label={copy.progressPage.progressActionsLabel}>
            <Link className="primary-button" to="/home">
              {copy.progressPage.backToHome}
            </Link>
            <Link className="secondary-link" to="/review">
              {copy.progressPage.goToReview}
            </Link>
          </nav>
        </section>

        <section
          className="progress-stats-grid"
          aria-label={copy.progressPage.statsLabel}
        >
          <article className="stat-card">
            <p className="stat-card__label">{copy.progressPage.completedLessonsLabel}</p>
            <p className="stat-card__value">
              {completedLessonsCount}/{totalLessons}
            </p>
            <p className="stat-card__meta">
              {copy.progressPage.completedSummary(completedLessonsCount, totalLessons)}
            </p>
          </article>

          <article className="stat-card">
            <p className="stat-card__label">{copy.progressPage.reviewQueue}</p>
            <p className="stat-card__value">{progress.reviewQueue.length}</p>
            <p className="stat-card__meta">
              {copy.progressPage.reviewItemsWaiting(progress.reviewQueue.length)}
            </p>
          </article>

          <article className="stat-card stat-card--accent">
            <p className="stat-card__label">{copy.progressPage.masteryLabel}</p>
            <p className="stat-card__value">{completionPercent}%</p>
            <div
              className="progress-bar"
              aria-hidden="true"
            >
              <span
                className="progress-bar__fill"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </article>
        </section>

        <section
          className="surface-card progress-journey-card"
          aria-label={copy.progressPage.progressJourneyMapLabel}
        >
          <div className="progress-list-card__header">
            <div>
              <p className="eyebrow">{copy.progressPage.lessonProgressEyebrow}</p>
              <h2>{copy.progressPage.lessonProgressLabel}</h2>
            </div>
            <span className="badge badge--sky">
              {copy.progressPage.completedSummary(completedLessonsCount, totalLessons)}
            </span>
          </div>

          <div className="progress-journey-map__path">
            {orderedJourneyNodes.map((node) => {
              const status = getJourneyNodeStatus(node)
              const statusLabel = getStatusLabel(status)
              const nodeTitle = getLocalizedText(node.title, language)
              const nodeSummary = getLocalizedText(node.summary, language)
              const nodeEyebrow = getLocalizedText(node.eyebrow, language)
              const nodeIcon = journeyNodeIcons[node.id]

              if (isLessonJourneyNode(node)) {
                return (
                  <Link
                    key={node.id}
                    className={`journey-node progress-journey-node journey-node--lesson journey-node--card-link progress-journey-node--lesson progress-journey-node--${status}`}
                    data-journey-node-id={node.id}
                    to={`/lesson/${node.lessonId}`}
                    aria-label={`${nodeTitle}: ${statusLabel}`}
                  >
                    <div className="journey-node__header">
                      <span className="badge badge--jade">{nodeEyebrow}</span>
                      <span className="journey-node__stamp journey-node__stamp--lesson">
                        {copy.progressPage.openLesson}
                      </span>
                    </div>

                    <span className="journey-node__doodle" aria-hidden="true">
                      {nodeIcon}
                    </span>

                    <div>
                      <span className={`progress-status-seal progress-status-seal--${status}`}>
                        {statusLabel}
                      </span>
                      <h3>{nodeTitle}</h3>
                      <p className="muted-text">{nodeSummary}</p>
                    </div>

                    <span className="journey-node__cta">{copy.progressPage.openLesson} →</span>
                  </Link>
                )
              }

              const isExpanded = expandedPreviewNodeId === node.id
              const previewPanelId = `progress-journey-preview-${node.id}`

              return (
                <article
                  key={node.id}
                  className={`journey-node progress-journey-node journey-node--preview progress-journey-node--preview progress-journey-node--${status} ${isExpanded ? 'journey-node--is-open' : ''}`}
                  data-journey-node-id={node.id}
                  aria-label={`${nodeTitle}: ${statusLabel}`}
                >
                  <button
                    type="button"
                    className="journey-node__preview-button"
                    aria-expanded={isExpanded}
                    aria-controls={previewPanelId}
                    onClick={() =>
                      setExpandedPreviewNodeId((currentNodeId) =>
                        currentNodeId === node.id ? null : node.id,
                      )
                    }
                  >
                    <div className="journey-node__header">
                      <span className="badge badge--gold">{nodeEyebrow}</span>
                      <span className="journey-node__stamp">{copy.homePage.comingSoon}</span>
                    </div>

                    <span className="journey-node__doodle" aria-hidden="true">
                      {nodeIcon}
                    </span>

                    <div>
                      <span className={`progress-status-seal progress-status-seal--${status}`}>
                        {statusLabel}
                      </span>
                      <h3>{nodeTitle}</h3>
                      <p className="muted-text">{nodeSummary}</p>
                    </div>

                    <span className="journey-node__cta">
                      {isExpanded ? copy.homePage.previewHide : copy.homePage.previewPeek}
                    </span>
                  </button>

                  {node.previewDetails && isExpanded ? (
                    <div id={previewPanelId} className="journey-node__preview-panel" role="note">
                      <span className="journey-node__preview-stamp">
                        {copy.homePage.comingSoon}
                      </span>

                      <div className="journey-node__phrase-card">
                        <span className="journey-node__panel-label">
                          {copy.homePage.previewKeyPhraseLabel}
                        </span>
                        <strong>{node.previewDetails.phrase}</strong>
                        <span className="pinyin-line">{node.previewDetails.pinyin}</span>
                        <span className="journey-node__phrase-meaning">
                          {copy.homePage.previewMeaningLabel}:{' '}
                          {getLocalizedText(node.previewDetails.meaning, language)}
                        </span>
                      </div>

                      <p className="journey-node__goal">
                        <span>{copy.homePage.previewGoalLabel}</span>
                        {getLocalizedText(node.previewDetails.goal, language)}
                      </p>
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        </section>
      </section>
    </main>
  )
}
