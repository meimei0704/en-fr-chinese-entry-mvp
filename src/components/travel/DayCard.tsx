import { getLocalizedText, getUiCopy } from '../../content/copy'
import type { TransportOption } from '../../content/travel/types'
import type { ExplanationLanguage, LocalizedText } from '../../content/types'
import type {
  AttractionDay,
  FreeDay,
  ItineraryDay,
  ItineraryLeg,
  ScheduledAttraction,
  TravelDay,
} from '../../lib/travel/itinerary'
import { ProvenanceBadge } from './ProvenanceBadge'

interface DayCardProps {
  day: ItineraryDay
  language: ExplanationLanguage
  destinationName?: LocalizedText
  /** Grounded "getting around" options for the day's destination. */
  transportOptions?: TransportOption[]
}

const TIME_SLOT_KEYS = ['morning', 'afternoon', 'evening'] as const

export function DayCard({
  day,
  language,
  destinationName,
  transportOptions = [],
}: DayCardProps) {
  const copy = getUiCopy(language).travel.result

  function renderTransportOptions(options: TransportOption[]) {
    return (
      <ul className="day-card__transport-options">
        {options.map((option) => (
          <li key={option.id}>
            <h4 className="day-card__attraction">{getLocalizedText(option.title, language)}</h4>
            {option.notes ? (
              <p className="muted-text">{getLocalizedText(option.notes, language)}</p>
            ) : null}
            <ProvenanceBadge fact={option} language={language} />
          </li>
        ))}
      </ul>
    )
  }

  function renderAttraction(
    scheduled: ScheduledAttraction,
    slotKey: (typeof TIME_SLOT_KEYS)[number] | 'meal',
  ) {
    const { attraction } = scheduled
    return (
      <li key={attraction.id} className="day-card__block">
        <p className="day-card__slot">{copy.blocks[slotKey]}</p>
        <h4 className="day-card__attraction">{getLocalizedText(attraction.title, language)}</h4>
        <p className="muted-text day-card__area">{getLocalizedText(attraction.area, language)}</p>
        <p className="day-card__duration">{`${attraction.durationHours} h`}</p>
        <p className="day-card__description">
          {getLocalizedText(attraction.description, language)}
        </p>
        {attraction.tips ? (
          <p className="day-card__tips">
            <strong>{copy.blocks.tips}: </strong>
            {getLocalizedText(attraction.tips, language)}
          </p>
        ) : null}
        <ProvenanceBadge fact={attraction} language={language} />
      </li>
    )
  }

  function slotForKey(
    scheduled: ScheduledAttraction,
    index: number,
  ): (typeof TIME_SLOT_KEYS)[number] | 'meal' {
    if (scheduled.attraction.category === 'food') {
      return 'meal'
    }
    return TIME_SLOT_KEYS[index] ?? 'evening'
  }

  const leg: ItineraryLeg | null = day.kind === 'travel' ? (day as TravelDay).leg : null

  return (
    <article className={`day-card day-card--${day.kind}`}>
      <header className="day-card__header">
        <h3>{copy.dayHeading(day.dayNumber)}</h3>
        {destinationName ? (
          <p className="day-card__destination">{getLocalizedText(destinationName, language)}</p>
        ) : null}
      </header>

      {leg ? (
        <div className="day-card__transport">
          <p className="day-card__slot">{copy.blocks.transport}</p>
          {renderTransportOptions(leg.options)}
        </div>
      ) : null}

      {transportOptions.length > 0 ? (
        <div className="day-card__transport day-card__transport--around">
          <p className="day-card__slot">{copy.blocks.transport}</p>
          {renderTransportOptions(transportOptions)}
        </div>
      ) : null}

      {day.kind === 'attraction' ? (
        <ul className="day-card__blocks">
          {(day as AttractionDay).attractions.map((scheduled, index) =>
            renderAttraction(scheduled, slotForKey(scheduled, index)),
          )}
        </ul>
      ) : null}

      {day.kind === 'travel' && (day as TravelDay).arrivalAttractions.length > 0 ? (
        <ul className="day-card__blocks">
          {(day as TravelDay).arrivalAttractions.map((scheduled) =>
            renderAttraction(scheduled, 'afternoon'),
          )}
        </ul>
      ) : null}

      {day.kind === 'free' ? (
        <div className="day-card__free">
          <p className="day-card__free-label">{copy.freeDayLabel}</p>
          <p className="muted-text">{copy.freeDayHelper}</p>
          <p className="day-card__tips">
            <strong>{copy.blocks.tips}: </strong>
            {getLocalizedText((day as FreeDay).tips, language)}
          </p>
          {(day as FreeDay).optionalAttractions.length > 0 ? (
            <ul className="day-card__blocks">
              {(day as FreeDay).optionalAttractions.map((scheduled) =>
                renderAttraction(scheduled, 'afternoon'),
              )}
            </ul>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}
