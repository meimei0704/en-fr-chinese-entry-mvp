import { useState } from 'react'
import type { FormEvent } from 'react'

import { getLocalizedText, getUiCopy } from '../../content/copy'
import { travelContent } from '../../content/travel/content'
import type { Interest, TravelDestinationId } from '../../content/travel/types'
import type { ExplanationLanguage } from '../../content/types'
import {
  DEFAULT_TRAVEL_REQUEST,
  MAX_TRAVEL_DAYS,
  TRAVEL_BUDGETS,
  TRAVEL_INTERESTS,
  TRAVEL_PACES,
  validateTravelRequest,
} from '../../lib/travel/request'
import type {
  TravelBudget,
  TravelPace,
  TravelRequest,
  TravelRequestError,
} from '../../lib/travel/request'
import { LanguageToggle } from '../LanguageToggle'

interface TravelRequestFormProps {
  initialRequest?: TravelRequest
  onGenerate: (request: TravelRequest) => void
}

function messageForError(
  error: TravelRequestError,
  copy: ReturnType<typeof getUiCopy>['travel']['validation'],
): string {
  switch (error.code) {
    case 'no-destinations':
      return copy.noDestinations
    case 'invalid-days':
      return copy.daysOutOfRange
    case 'unknown-destination':
    case 'duplicate-destination':
      return copy.unknownDestination
    case 'days-less-than-destinations':
      return copy.daysBelowDestinations
    default:
      return copy.generic
  }
}

export function TravelRequestForm({
  initialRequest = DEFAULT_TRAVEL_REQUEST,
  onGenerate,
}: TravelRequestFormProps) {
  const [request, setRequest] = useState<TravelRequest>(initialRequest)
  const [errors, setErrors] = useState<string[]>([])
  const copy = getUiCopy(request.language).travel
  const validationCopy = copy.validation

  function updateRequest(patch: Partial<TravelRequest>) {
    setRequest((current) => ({ ...current, ...patch }))
  }

  function toggleDestination(id: TravelDestinationId) {
    updateRequest({
      destinations: request.destinations.includes(id)
        ? request.destinations.filter((destination) => destination !== id)
        : [...request.destinations, id],
    })
  }

  function toggleInterest(interest: Interest) {
    updateRequest({
      interests: request.interests.includes(interest)
        ? request.interests.filter((item) => item !== interest)
        : [...request.interests, interest],
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const issues = validateTravelRequest(request)
    if (issues.length > 0) {
      setErrors(
        Array.from(new Set(issues.map((issue) => messageForError(issue, validationCopy)))),
      )
      return
    }
    setErrors([])
    onGenerate(request)
  }

  function resetToDefaults() {
    setRequest(DEFAULT_TRAVEL_REQUEST)
    setErrors([])
  }

  return (
    <form className="travel-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="travel-form__group">
        <legend>{copy.form.destinationsLabel}</legend>
        <div className="travel-form__chips">
          {travelContent.destinations.map((destination) => {
            const selected = request.destinations.includes(destination.id)
            return (
              <button
                key={destination.id}
                type="button"
                className={`option-button${selected ? ' option-button--selected' : ''}`}
                aria-pressed={selected}
                onClick={() => toggleDestination(destination.id)}
              >
                {getLocalizedText(destination.name, request.language)}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="travel-form__field">
        <label htmlFor="travel-days">{copy.form.daysLabel}</label>
        <input
          id="travel-days"
          type="number"
          min={1}
          max={MAX_TRAVEL_DAYS}
          value={Number.isNaN(request.days) ? '' : request.days}
          onChange={(event) =>
            updateRequest({
              days: event.target.value === '' ? Number.NaN : Number(event.target.value),
            })
          }
        />
      </div>

      <fieldset className="travel-form__group">
        <legend>{copy.form.interestsLabel}</legend>
        <div className="travel-form__chips">
          {TRAVEL_INTERESTS.map((interest) => {
            const selected = request.interests.includes(interest)
            return (
              <button
                key={interest}
                type="button"
                className={`option-button${selected ? ' option-button--selected' : ''}`}
                aria-pressed={selected}
                onClick={() => toggleInterest(interest)}
              >
                {copy.form.interests[interest]}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="travel-form__field">
        <label htmlFor="travel-pace">{copy.form.paceLabel}</label>
        <select
          id="travel-pace"
          value={request.pace}
          onChange={(event) => updateRequest({ pace: event.target.value as TravelPace })}
        >
          {TRAVEL_PACES.map((pace) => (
            <option key={pace} value={pace}>
              {copy.form.pace[pace]}
            </option>
          ))}
        </select>
      </div>

      <div className="travel-form__field">
        <label htmlFor="travel-budget">{copy.form.budgetLabel}</label>
        <select
          id="travel-budget"
          value={request.budget}
          onChange={(event) => updateRequest({ budget: event.target.value as TravelBudget })}
        >
          {TRAVEL_BUDGETS.map((budget) => (
            <option key={budget} value={budget}>
              {copy.form.budget[budget]}
            </option>
          ))}
        </select>
      </div>

      <div className="travel-form__field">
        <span className="travel-form__label">{copy.form.languageLabel}</span>
        <LanguageToggle
          selectedLanguage={request.language}
          onSelect={(language: ExplanationLanguage) => updateRequest({ language })}
          ariaLabel={copy.form.languageLabel}
        />
      </div>

      {errors.length > 0 ? (
        <ul className="travel-form__errors" role="alert">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      ) : null}

      <div className="travel-form__actions">
        <button type="submit" className="primary-button">
          {copy.form.generate}
        </button>
        <button type="button" className="secondary-button" onClick={resetToDefaults}>
          {copy.form.resetDefaults}
        </button>
      </div>
    </form>
  )
}
