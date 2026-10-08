import { useState } from 'react'

import { ItineraryView } from '../components/travel/ItineraryView'
import { TravelRequestForm } from '../components/travel/TravelRequestForm'
import { getUiCopy } from '../content/copy'
import { travelContent } from '../content/travel/content'
import { loadProgress } from '../lib/progress'
import type { TravelItinerary } from '../lib/travel/itinerary'
import { buildItinerary } from '../lib/travel/planner'
import {
  DEFAULT_TRAVEL_REQUEST,
  TravelRequestValidationError,
  validateTravelRequest,
} from '../lib/travel/request'
import type { TravelRequest } from '../lib/travel/request'

export function TravelPage() {
  const language = loadProgress().selectedExplanationLanguage
  const copy = getUiCopy(language).travel
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleGenerate(request: TravelRequest) {
    if (validateTravelRequest(request).length > 0) {
      setItinerary(null)
      setError(copy.validation.generic)
      return
    }

    try {
      setItinerary(buildItinerary(request, travelContent))
      setError(null)
    } catch (caught) {
      if (caught instanceof TravelRequestValidationError) {
        setItinerary(null)
        setError(copy.validation.generic)
        return
      }
      throw caught
    }
  }

  return (
    <main className="page-shell page-shell--wide pinyin-page">
      <div className="pinyin-page__content">
        <section className="hero-card pinyin-hero">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.heading}</h1>
          <p className="muted-text">{copy.intro}</p>
        </section>

        <TravelRequestForm
          initialRequest={{ ...DEFAULT_TRAVEL_REQUEST, language }}
          onGenerate={handleGenerate}
        />

        <div className="travel-page__result" aria-live="polite">
          {error ? (
            <p className="travel-page__error" role="alert">
              {error}
            </p>
          ) : null}
          {itinerary ? (
            <ItineraryView itinerary={itinerary} language={itinerary.summary.language} />
          ) : null}
        </div>
      </div>
    </main>
  )
}
