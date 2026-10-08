import { getLocalizedText, getUiCopy } from '../../content/copy'
import type { ExplanationLanguage } from '../../content/types'
import type { ItineraryStay } from '../../lib/travel/itinerary'
import { ProvenanceBadge } from './ProvenanceBadge'

interface StayCardProps {
  stay: ItineraryStay
  language: ExplanationLanguage
}

export function StayCard({ stay, language }: StayCardProps) {
  const copy = getUiCopy(language).travel.result
  const { stayArea } = stay

  return (
    <article className="stay-card">
      <p className="stay-card__destination">{getLocalizedText(stay.destinationName, language)}</p>
      <h3>{getLocalizedText(stayArea.name, language)}</h3>
      <p className="stay-card__why">{getLocalizedText(stayArea.vibe, language)}</p>
      <p className="muted-text">{getLocalizedText(stayArea.transportNotes, language)}</p>
      <p className="stay-card__booking">{copy.stayBookingNote}</p>
      <ProvenanceBadge fact={stayArea} language={language} />
    </article>
  )
}
