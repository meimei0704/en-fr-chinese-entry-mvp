import { useState } from 'react'
import { Link } from 'react-router-dom'

import { CourseSeriesTitle } from '../components/CourseSeriesTitle'
import { ContentLoading } from '../components/ContentState'
import { JourneyNodeCourseImage } from '../components/JourneyNodeCourseImage'
import { LessonTopicTitle } from '../components/LessonTopicTitle'
import { getLocalizedText, getUiCopy } from '../content/copy'
import { buildJourney, journeyNodeIcons, journeyNodeImages } from '../content/journey'
import { getLessonTopicText } from '../content/lessonTopics'
import type { JourneyNode, LessonId } from '../content/types'
import { loadPinyinProgress } from '../lib/pinyinProgress'
import { getContinueLessonId, loadProgress } from '../lib/progress'
import { useCourse } from '../lib/contentProvider'

type LessonJourneyNode = JourneyNode & { kind: 'lesson'; lessonId: LessonId }
type JourneyNodeStatus = 'complete' | 'current' | 'upcoming' | 'preview'

function isLessonJourneyNode(node: JourneyNode): node is LessonJourneyNode {
  return node.kind === 'lesson' && node.lessonId !== undefined
}

export function ProgressPage() {
  const { course, error, reload } = useCourse()
  const progress = loadProgress()
  const pinyinProgress = loadPinyinProgress()
  const language = progress.selectedExplanationLanguage
  const copy = getUiCopy(language)
  const completedPinyinSectionsCount = pinyinProgress.completedSections.length
  const totalPinyinSections = 2
  const [expandedPreviewNodeId, setExpandedPreviewNodeId] = useState<JourneyNode['id'] | null>(null)

  if (error) {
    return (
      <main className="page-shell">
        <section className="hero-card hero-card--compact">
          <p className="eyebrow">{copy.contentState.errorEyebrow}</p>
          <h1>{copy.contentState.errorHeading}</h1>
          <button type="button" className="primary-button" onClick={reload}>
            {copy.contentState.retry}
          </button>
        </section>
      </main>
    )
  }

  if (!course) {
    return <ContentLoading />
  }

  const journey = buildJourney(course)
  const orderedJourneyNodes = [...journey.nodes].sort((left, right) => left.pathOrder - right.pathOrder)
  const lessonJourneyNodes = orderedJourneyNodes.filter(isLessonJourneyNode)
  const lessonJourneyLessonIds = new Set(lessonJourneyNodes.map((node) => node.lessonId))
  const currentLessonId =
    progress.lastVisitedLesson === null ? null : getContinueLessonId(course, progress)
  const currentLesson = course.lessons.find((lesson) => lesson.id === currentLessonId)
  const completedLessonIds = new Set(
    progress.completedLessons.filter((lessonId) => lessonJourneyLessonIds.has(lessonId)),
  )
  const completedLessonsCount = completedLessonIds.size
  const totalLessons = lessonJourneyNodes.length
  const completionPercent = totalLessons === 0
    ? 0
    : Math.round((completedLessonsCount / totalLessons) * 100)
  function getJourneyNodeStatus(node: JourneyNode): JourneyNodeStatus {
    if (!isLessonJourneyNode(node)) {
      return 'preview'
    }

    if (completedLessonIds.has(node.lessonId)) {
      return 'complete'
    }

    if (currentLessonId === node.lessonId) {
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
            {currentLesson ? (
              <LessonTopicTitle
                as="p"
                lessonId={currentLesson.id}
                language={language}
                className="progress-current-lesson"
              />
            ) : (
              <p className="progress-current-lesson">{copy.progressPage.notStartedYet}</p>
            )}
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
          className="course-series progress-course-series"
          aria-label={copy.courseSeries.label}
        >
          <p className="eyebrow course-series__label">{copy.courseSeries.label}</p>

          <div className="course-series__list">
            <section
              className="course-series__panel course-series__panel--pinyin"
              aria-labelledby="progress-pinyin-series-title"
            >
              <Link
                className="course-series__entry-card course-series__pinyin-link"
                to="/pinyin"
                aria-labelledby="progress-pinyin-series-title"
              >
                <span className="course-series__pinyin-mark" aria-hidden="true">
                  拼
                </span>
                <CourseSeriesTitle
                  id="progress-pinyin-series-title"
                  title={copy.courseSeries.pinyinTitle}
                />
                <p className="course-series__progress">
                  {copy.pinyinPage.sectionProgress(
                    completedPinyinSectionsCount,
                    totalPinyinSections,
                  )}
                </p>
              </Link>
            </section>

            <section
              className="course-series__panel course-series__panel--culture"
              aria-labelledby="progress-culture-series-title"
            >
              <Link
                className="course-series__entry-card course-series__culture-link"
                to="/culture"
                aria-labelledby="progress-culture-series-title"
              >
                <span className="course-series__culture-mark" aria-hidden="true">
                  文
                </span>
                <CourseSeriesTitle
                  id="progress-culture-series-title"
                  title={copy.courseSeries.cultureTitle}
                />
              </Link>
            </section>

            <section
              className="course-series__panel course-series__panel--journey"
              aria-labelledby="progress-journey-series-title"
            >
              <a
                className="course-series__entry-card course-series__journey-link"
                href="#progress-basic-expressions-path"
                aria-labelledby="progress-journey-series-title"
              >
                <span className="course-series__journey-mark" aria-hidden="true">
                  旅
                </span>
                <CourseSeriesTitle
                  id="progress-journey-series-title"
                  title={copy.courseSeries.basicExpressionsTitle}
                />
                <p className="course-series__progress">
                  {copy.progressPage.completedSummary(completedLessonsCount, totalLessons)}
                </p>
              </a>

              <div
                id="progress-basic-expressions-path"
                className="surface-card progress-journey-card course-series__journey-path"
              >
                <div className="progress-journey-map__path">
                  {orderedJourneyNodes.map((node) => {
                    const nodeTitle = isLessonJourneyNode(node)
                      ? getLessonTopicText(node.lessonId, language)
                      : getLocalizedText(node.title, language)
                    const nodeSummary = getLocalizedText(node.summary, language)
                    const nodeEyebrow = getLocalizedText(node.eyebrow, language)
                    const nodeIcon = journeyNodeIcons[node.id]
                    const nodeImage = journeyNodeImages[node.id]

                    if (isLessonJourneyNode(node)) {
                      const status = getJourneyNodeStatus(node)
                      const statusLabel = getStatusLabel(status)

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
                            <JourneyNodeCourseImage src={nodeImage} fallback={nodeIcon} />
                          </span>

                          <div>
                            <span className={`progress-status-seal progress-status-seal--${status}`}>
                              {statusLabel}
                            </span>
                            <LessonTopicTitle
                              as="h3"
                              lessonId={node.lessonId}
                              language={language}
                            />
                            <p className="muted-text">{nodeSummary}</p>
                          </div>

                          <span className="journey-node__cta">
                            {copy.progressPage.openLesson} →
                          </span>
                        </Link>
                      )
                    }

                    const status = getJourneyNodeStatus(node)
                    const statusLabel = getStatusLabel(status)
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
                            <span className="journey-node__stamp">
                              {copy.homePage.comingSoon}
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
              </div>
            </section>
          </div>
        </section>
      </section>
    </main>
  )
}
