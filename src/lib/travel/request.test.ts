import { describe, expect, it } from 'vitest'

import type { TravelDestinationId } from '../../content/travel/types'
import {
  DEFAULT_TRAVEL_REQUEST,
  validateTravelRequest,
  type TravelRequest,
  type TravelRequestErrorCode,
} from './request'

function codes(request: TravelRequest): TravelRequestErrorCode[] {
  return validateTravelRequest(request).map((error) => error.code)
}

function withRequest(overrides: Partial<TravelRequest>): TravelRequest {
  return { ...DEFAULT_TRAVEL_REQUEST, ...overrides }
}

describe('DEFAULT_TRAVEL_REQUEST', () => {
  it('is valid', () => {
    expect(validateTravelRequest(DEFAULT_TRAVEL_REQUEST)).toEqual([])
  })
})

describe('validateTravelRequest', () => {
  it('accepts a well-formed request', () => {
    const request = withRequest({
      destinations: ['beijing', 'xian', 'shanghai'],
      days: 6,
      interests: ['history'],
      pace: 'packed',
      budget: 'comfort',
      language: 'fr',
    })
    expect(validateTravelRequest(request)).toEqual([])
  })

  it('allows zero interests', () => {
    expect(codes(withRequest({ interests: [] }))).toEqual([])
  })

  it('rejects an empty destination list', () => {
    expect(codes(withRequest({ destinations: [], days: 3 }))).toContain('no-destinations')
  })

  it('rejects more than seven destinations', () => {
    const destinations = new Array<TravelDestinationId>(8).fill('beijing')
    expect(codes(withRequest({ destinations, days: 8 }))).toContain('too-many-destinations')
  })

  it('rejects unknown destinations', () => {
    const destinations = ['beijing', 'atlantis'] as unknown as TravelDestinationId[]
    expect(codes(withRequest({ destinations, days: 3 }))).toContain('unknown-destination')
  })

  it('rejects duplicate destinations', () => {
    expect(codes(withRequest({ destinations: ['beijing', 'beijing'], days: 3 }))).toContain(
      'duplicate-destination',
    )
  })

  it.each([0, 22, 1.5, Number.NaN])('rejects out-of-range days (%s)', (days) => {
    expect(codes(withRequest({ days }))).toContain('invalid-days')
  })

  it('rejects fewer days than destinations', () => {
    const request = withRequest({
      destinations: ['beijing', 'xian', 'shanghai'],
      days: 2,
    })
    expect(codes(request)).toContain('days-less-than-destinations')
  })

  it('rejects an unknown pace, budget and language', () => {
    const request = {
      ...DEFAULT_TRAVEL_REQUEST,
      pace: 'sprint',
      budget: 'luxury',
      language: 'de',
    } as unknown as TravelRequest
    const result = codes(request)
    expect(result).toContain('invalid-pace')
    expect(result).toContain('invalid-budget')
    expect(result).toContain('invalid-language')
  })

  it('rejects an unknown interest', () => {
    const request = withRequest({ interests: ['history', 'skiing'] as never })
    expect(codes(request)).toContain('unknown-interest')
  })
})
