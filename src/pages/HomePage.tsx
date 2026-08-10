import { useState } from 'react'
import { Link } from 'react-router-dom'

import { CourseSeriesTitle } from '../components/CourseSeriesTitle'
import { ContentLoading } from '../components/ContentState'
import { HomeHeroIllustration } from '../components/HomeHeroIllustration'
import { LanguageToggle } from '../components/LanguageToggle'
import { LessonTopicTitle } from '../components/LessonTopicTitle'
import { getLocalizedText, getUiCopy } from '../content/copy'
import { buildJourney, journeyNodeIcons } from '../content/journey'
import type { ExplanationLanguage, JourneyNodeId } from '../content/types'
import { loadProgress, saveProgress } from '../lib/progress'
import { useCourse } from '../lib/contentProvider'

export function HomePage() {
  const { course, error, reload } = useCourse()
  const [progress, setProgress] = useState(() => loadProgress())
  const language = progress.selectedExplanationLanguage
  const copy = getUiCopy(language)
  const [expandedPreviewNodeId, setExpandedPreviewNodeId] = useState<JourneyNodeId | null>(null)

  function handleLanguageSelect(nextLanguage: ExplanationLanguage) {
    setProgress((currentProgress) => {
      if (currentProgress.selectedExplanationLanguage === nextLanguage) {
        return currentProgress
      }

      const nextProgress = {
        ...loadProgress(),
        selectedExplanationLanguage: nextLanguage,
      }

      saveProgress(nextProgress)
      return nextProgress
    })
  }

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

  const journeyNodes = buildJourney(course).nodes

  return (
    <main className="page-shell">
      <section className="hero-card home-hero home-hero--centered" aria-label="Home hero">
        <HomeHeroIllustration />

        <div className="home-language-switcher home-language-switcher--floating">
          <LanguageToggle
            selectedLanguage={language}
            onSelect={handleLanguageSelect}
            ariaLabel={copy.languageToggleLabel}
          />
        </div>

        <div className="home-hero__content">
          <h1 className="home-hero__title">{copy.homePage.heading}</h1>
          <div className="home-hero__slogan-stack" aria-label="Mandarin learning slogans">
            <p lang={language}>{copy.homePage.heroSlogan}</p>
          </div>
        </div>
      </section>

      <section
        className="page-grid course-series"
        aria-label={copy.courseSeries.label}
      >
        <p className="eyebrow course-series__label">{copy.courseSeries.label}</p>

        <div className="course-series__list">
          <section
            className="course-series__panel course-series__panel--pinyin"
            aria-labelledby="home-pinyin-series-title"
          >
            <Link
              className="course-series__entry-card course-series__pinyin-link"
              to="/pinyin"
              aria-labelledby="home-pinyin-series-title"
            >
              <span className="course-series__pinyin-mark" aria-hidden="true">
                拼
              </span>
              <CourseSeriesTitle
                id="home-pinyin-series-title"
                title={copy.courseSeries.pinyinTitle}
              />
              <span className="course-series__entry-cue" aria-hidden="true">
                →
              </span>
            </Link>
          </section>

          <section
            aria-labelledby="home-journey-series-title"
            className="course-series__panel course-series__panel--journey"
          >
            <a
              className="course-series__entry-card course-series__journey-link"
              href="#home-basic-expressions-path"
              aria-labelledby="home-journey-series-title"
            >
              <span className="course-series__journey-mark" aria-hidden="true">
                旅
              </span>
              <CourseSeriesTitle
                id="home-journey-series-title"
                title={copy.courseSeries.basicExpressionsTitle}
              />
              <span className="course-series__entry-cue" aria-hidden="true">
                ↓
              </span>
            </a>

            <div
              id="home-basic-expressions-path"
              className="course-series__journey-path journey-map"
            >
              <div className="journey-map__path">
                {journeyNodes.map((node) => {
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
                        <div className="journey-node__body">
                          <div className="journey-node__header">
                            <span className="badge badge--jade">{nodeEyebrow}</span>
                          </div>

                          <LessonTopicTitle as="h3" lessonId={node.lessonId} language={language} />
                          <p className="muted-text">{nodeSummary}</p>
                        </div>

                        <span
                          className="journey-node__illustration-slot journey-node__illustration-slot--stamp"
                          aria-hidden="true"
                        >
                          <span className="journey-node__doodle journey-node__doodle--stamp">
                            {nodeIcon}
                          </span>
                        </span>
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
                        <div className="journey-node__body">
                          <div className="journey-node__header">
                            <span className="badge badge--gold">{nodeEyebrow}</span>
                            <span className="journey-node__stamp">{copy.homePage.comingSoon}</span>
                          </div>

                          <LessonTopicTitle as="h3" title={node.title} language={language} />
                          <p className="muted-text">{nodeSummary}</p>
                          <span className="journey-node__cta">
                            {isExpanded ? copy.homePage.previewHide : copy.homePage.previewPeek}
                          </span>
                        </div>

                        <span
                          className="journey-node__illustration-slot journey-node__illustration-slot--stamp"
                          aria-hidden="true"
                        >
                          <span className="journey-node__doodle journey-node__doodle--stamp">
                            {nodeIcon}
                          </span>
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
    </main>
  )
}
