import { getLocalizedText, getUiCopy } from '../../content/copy'
import { travelContent } from '../../content/travel/content'
import type { TransportOption, TravelDestinationId, TravelFact } from '../../content/travel/types'
import type { ExplanationLanguage, LocalizedText } from '../../content/types'
import type {
  ItineraryDay,
  ItineraryPractical,
  TravelItinerary,
} from '../../lib/travel/itinerary'
import { DayCard } from './DayCard'
import { FreshnessBanner } from './FreshnessBanner'
import { PracticalPanel } from './PracticalPanel'
import { StayCard } from './StayCard'

interface ItineraryViewProps {
  itinerary: TravelItinerary
  language: ExplanationLanguage
  now?: () => number
}

function factsInDay(day: ItineraryDay): TravelFact[] {
  switch (day.kind) {
    case 'attraction':
      return day.attractions.map((item) => item.attraction)
    case 'travel':
      return [
        ...day.leg.options,
        ...day.arrivalAttractions.map((item) => item.attraction),
      ]
    case 'free':
      return day.optionalAttractions.map((item) => item.attraction)
  }
}

function practicalFacts(practical: ItineraryPractical): TravelFact[] {
  const country = practical.country
  return [
    country.payments,
    country.connectivity,
    country.etiquette,
    country.safety,
    country.visaEntry,
    country.emergencyNumbers,
    ...practical.byDestination.flatMap((entry) => [
      entry.practical.payments,
      entry.practical.connectivity,
      entry.practical.etiquette,
      entry.practical.safety,
      entry.practical.visaEntry,
      entry.practical.emergencyNumbers,
    ]),
  ]
}

/** True when at least one fact in the plan carries `origin: 'live'` (P2-4). */
function itineraryHasLiveFact(itinerary: TravelItinerary): boolean {
  const facts: TravelFact[] = [
    ...itinerary.days.flatMap(factsInDay),
    ...itinerary.stays.map((stay) => stay.stayArea),
    ...practicalFacts(itinerary.practical),
    ...itinerary.disclaimers.map((disclaimer) => disclaimer.fact),
  ]
  return facts.some((fact) => fact.origin === 'live')
}

export function ItineraryView({ itinerary, language, now }: ItineraryViewProps) {
  const copy = getUiCopy(language).travel.result
  const destinationNames = new Map<string, LocalizedText>(
    itinerary.summary.entries.map((entry) => [entry.destinationId, entry.name]),
  )
  const gettingAround = new Map<TravelDestinationId, TransportOption[]>(
    travelContent.destinations.map((destination) => [
      destination.id,
      destination.transport.gettingAround,
    ]),
  )
  const hasLiveFact = itineraryHasLiveFact(itinerary)

  return (
    <section className="itinerary-view" aria-label={copy.summaryHeading}>
      <header className="itinerary-view__summary">
        <h2>{copy.summaryHeading}</h2>
        <p className="itinerary-view__title">
          {getLocalizedText(itinerary.summary.title, language)}
        </p>
        {hasLiveFact ? (
          <p className="badge badge--sky itinerary-view__live">{copy.liveIndicator}</p>
        ) : null}
      </header>

      <FreshnessBanner
        lastVerified={itinerary.meta.lastVerified}
        language={language}
        now={now}
      />

      <div className="itinerary-view__days">
        {itinerary.days.map((day) => (
          <DayCard
            key={`${day.kind}-${day.dayNumber}`}
            day={day}
            language={language}
            destinationName={destinationNames.get(day.destinationId)}
            transportOptions={gettingAround.get(day.destinationId)}
          />
        ))}
      </div>

      <section className="itinerary-view__stays" aria-label={copy.stayHeading}>
        <h2>{copy.stayHeading}</h2>
        {itinerary.stays.map((stay) => (
          <StayCard key={stay.destinationId} stay={stay} language={language} />
        ))}
      </section>

      <PracticalPanel
        practical={itinerary.practical}
        disclaimers={itinerary.disclaimers}
        language={language}
      />
    </section>
  )
}
