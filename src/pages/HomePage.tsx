import { useState } from 'react'
import { Link } from 'react-router-dom'

import { LessonCard } from '../components/LessonCard'
import { getLocalizedText, getUiCopy } from '../content/copy'
import { course } from '../content/course'
import { journeyNodeIcons, journeyNodes } from '../content/journey'
import type { JourneyNodeId } from '../content/types'
import { getContinueLessonId, loadProgress } from '../lib/progress'

export function HomePage() {
  const progress = loadProgress()
  const language = progress.selectedExplanationLanguage
  const copy = getUiCopy(language)
  const [expandedPreviewNodeId, setExpandedPreviewNodeId] = useState<JourneyNodeId | null>(null)
  const continueLessonId = getContinueLessonId(progress)
  const continueHref = continueLessonId ? `/lesson/${continueLessonId}` : '/'
  const mockupLesson = course.lessons[0]
  const mockupPhrase = mockupLesson.vocabulary[0]
  const mockupLine = mockupLesson.dialogue.lines[0]
  const learningChips =
    language === 'fr'
      ? ['Guidage anglais/français', 'Situations réelles', 'Écouter & répéter']
      : ['English/French explanations', 'Real situations', 'Listen & repeat']

  return (
    <main className="page-shell">
      <section className="hero-card home-hero">
        <div className="home-hero__content">
          <p className="eyebrow">{copy.homePage.eyebrow}</p>
          <h1>{copy.homePage.heading}</h1>
          <p className="lede">{copy.homePage.lede}</p>

          <div className="learning-chip-row" aria-label={copy.homePage.learningHighlightsLabel}>
            {learningChips.map((chip) => (
              <span key={chip} className="badge badge--gold">
                {chip}
              </span>
            ))}
          </div>

          <nav className="home-quick-entry-grid" aria-label={copy.homePage.quickLearningPathsLabel}>
            <Link className="quick-entry-card quick-entry-card--primary" to={continueHref}>
              <span>{copy.homePage.quickEntryContinueMeta}</span>
              <strong>{copy.homePage.continueLearning}</strong>
            </Link>
            <Link className="quick-entry-card quick-entry-card--review" to="/review">
              <span>{copy.homePage.quickEntryReviewMeta}</span>
              <strong>{copy.homePage.goToReview}</strong>
            </Link>
            <Link className="quick-entry-card quick-entry-card--progress" to="/progress">
              <span>{copy.homePage.quickEntryProgressMeta}</span>
              <strong>{copy.homePage.viewProgress}</strong>
            </Link>
          </nav>
        </div>

        <section className="home-learning-mockup" aria-label={copy.homePage.learningMockupLabel}>
          <div className="mockup-window-bar" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div
            className="home-hero__phrase"
            role="group"
            aria-label={copy.homePage.heroPhraseLabel}
          >
            <span className="badge badge--jade">{copy.homePage.lessonEyebrow}</span>
            <p className="hanzi-display">{mockupPhrase.hanzi}</p>
            <p className="pinyin-line">{mockupPhrase.pinyin}</p>
          </div>
          <div className="mock-dialogue-stack">
            <p className="mock-dialogue-bubble mock-dialogue-bubble--accent">
              {getLocalizedText(mockupLine.translation, language)}
            </p>
            <p className="mock-dialogue-bubble">{copy.homePage.mockupListenLabel}</p>
          </div>
          <div
            className="home-hero__stats"
            aria-label={copy.homePage.courseProgressSummaryLabel}
          >
            <span>{copy.homePage.lessonCount(course.lessons.length)}</span>
            <span>{copy.homePage.completedLessonCount(progress.completedLessons.length)}</span>
            <span>{copy.homePage.reviewCount(progress.reviewQueue.length)}</span>
          </div>
        </section>
      </section>

      <section aria-label={copy.homePage.journeyMapLabel} className="page-grid journey-map">
        <div className="section-heading journey-map__intro">
          <div>
            <p className="eyebrow">{copy.homePage.journeyEyebrow}</p>
            <h2>{copy.homePage.journeyMapLabel}</h2>
            <p className="lede">{copy.homePage.journeyIntro}</p>
          </div>
        </div>

        <div className="journey-map__path">
          {journeyNodes.map((node) => {
            const nodeTitle = getLocalizedText(node.title, language)
            const nodeSummary = getLocalizedText(node.summary, language)
            const nodeEyebrow = getLocalizedText(node.eyebrow, language)
            const nodeIcon = journeyNodeIcons[node.id]

            if (node.kind === 'lesson' && node.lessonId) {
              return (
                <Link
                  key={node.id}
                  className="journey-node journey-node--lesson journey-node--card-link"
                  to={`/lesson/${node.lessonId}`}
                >
                  <div className="journey-node__header">
                    <span className="badge badge--jade">{nodeEyebrow}</span>
                    <span className="journey-node__stamp journey-node__stamp--lesson">
                      {copy.homePage.openLesson}
                    </span>
                  </div>

                  <span className="journey-node__doodle" aria-hidden="true">
                    {nodeIcon}
                  </span>
                  <h2>{nodeTitle}</h2>
                  <p className="muted-text">{nodeSummary}</p>
                  <span className="journey-node__cta">{copy.homePage.openLesson} →</span>
                </Link>
              )
            }

            const isExpanded = expandedPreviewNodeId === node.id
            const previewPanelId = `journey-preview-${node.id}`

            return (
              <article
                key={node.id}
                className={`journey-node journey-node--preview ${isExpanded ? 'journey-node--is-open' : ''}`}
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
                  <h2>{nodeTitle}</h2>
                  <p className="muted-text">{nodeSummary}</p>
                  <span className="journey-node__cta">
                    {isExpanded ? copy.homePage.previewHide : copy.homePage.previewPeek}
                  </span>
                </button>

                {node.previewDetails && isExpanded ? (
                  <div id={previewPanelId} className="journey-node__preview-panel" role="note">
                    <span className="journey-node__preview-stamp">{copy.homePage.comingSoon}</span>

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

      <section aria-label={copy.homePage.lessonListLabel} className="page-grid lesson-grid">
        <div className="section-heading">
          <p className="eyebrow">{copy.homePage.lessonEyebrow}</p>
          <h2>{copy.homePage.lessonListLabel}</h2>
        </div>

        {course.lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} language={language} />
        ))}
      </section>
    </main>
  )
}
