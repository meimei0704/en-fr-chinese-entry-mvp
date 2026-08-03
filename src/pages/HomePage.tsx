import { useState } from 'react'
import { Link } from 'react-router-dom'

import { LanguageToggle } from '../components/LanguageToggle'
import { LessonTopicTitle } from '../components/LessonTopicTitle'
import { getLocalizedText, getUiCopy } from '../content/copy'
import { journeyNodeIcons, journeyNodes } from '../content/journey'
import type { ExplanationLanguage, JourneyNodeId } from '../content/types'
import { loadProgress, saveProgress } from '../lib/progress'

export function HomePage() {
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

  return (
    <main className="page-shell">
      <section className="hero-card home-hero home-hero--centered" aria-label="Home hero">
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

                    <LessonTopicTitle as="h2" lessonId={node.lessonId} language={language} />
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

                    <LessonTopicTitle as="h2" title={node.title} language={language} />
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
    </main>
  )
}
