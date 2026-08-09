import { describe, expect, it } from 'vitest'

import { getLocalizedText } from './copy'
import { course } from './course'
import { journeyNodeIcons, journeyNodes, journeyStages } from './journey'

const expectedJourneyNodeIds = [
  'daily-greetings',
  'airport-immigration',
  'taxi-to-stay',
  'hotel-check-in',
  'phone-and-payment',
  'restaurant-order',
  'train-station-ticket',
  'metro-ticket',
  'convenience-store-run',
  'ask-for-help-problem',
  'pharmacy-help',
  'small-talk',
] as const

const expectedEnglishTitles = [
  '打招呼 / Daily greetings',
  '到达机场 / Arrival at the airport',
  '打车 / Take a taxi',
  '酒店入住 / At the hotel',
  '中国电话卡 / SIM card setup',
  '点餐 / Order a meal',
  '坐火车 / Take the train',
  '坐地铁 / Subway ride',
  '购物 / Shopping',
  '寻求帮助 / Ask for help',
  '买药，看医生 / Hospital and pharmacy',
  '闲聊 / Small talk',
]

const expectedFrenchTitles = [
  '打招呼 / Salutations quotidiennes',
  '到达机场 / Arrivée à l’aéroport',
  '打车 / Prendre un taxi',
  '酒店入住 / À l’hôtel',
  '中国电话卡 / Configuration de la carte SIM',
  '点餐 / Commander un repas',
  '坐火车 / Prendre le train',
  '坐地铁 / En métro',
  '购物 / Shopping',
  '寻求帮助 / Demander de l’aide',
  '买药，看医生 / Hôpital et pharmacie',
  '闲聊 / Petite conversation',
]

describe('journey content', () => {
  it('exposes exactly twelve ordered lesson nodes and no route node', () => {
    expect(journeyStages.map((stage) => stage.id)).toEqual(['arrival-in-china'])
    expect(journeyNodes).toHaveLength(12)
    expect(journeyNodes.map((node) => node.pathOrder)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    expect(journeyNodes.map((node) => node.id)).toEqual(expectedJourneyNodeIds)
    expect(journeyNodes.every((node) => node.kind === 'lesson')).toBe(true)
    expect(journeyNodes.map((node) => node.lessonId)).toEqual(course.lessons.map((lesson) => lesson.id))
    expect(journeyNodes.every((node) => node.previewDetails === undefined)).toBe(true)
    expect(journeyNodes.every((node) => !Object.hasOwn(node, 'routeDetails'))).toBe(true)
    expect(JSON.stringify(journeyNodes)).not.toContain('/pinyin')
    expect(JSON.stringify(journeyNodes)).not.toContain('pinyin-foundations')
  })

  it('pins the EN/FR Journey copy and icons for the same twelve lessons', () => {
    expect(journeyNodes.map((node) => getLocalizedText(node.title, 'en'))).toEqual(expectedEnglishTitles)
    expect(journeyNodes.map((node) => getLocalizedText(node.title, 'fr'))).toEqual(expectedFrenchTitles)
    expect(journeyNodeIcons).toEqual({
      'daily-greetings': '👋',
      'airport-immigration': '✈️',
      'taxi-to-stay': '🚕',
      'hotel-check-in': '🏨',
      'phone-and-payment': '📱',
      'restaurant-order': '🍜',
      'train-station-ticket': '🚄',
      'metro-ticket': '🚇',
      'convenience-store-run': '🛒',
      'ask-for-help-problem': '🆘',
      'pharmacy-help': '💊',
      'small-talk': '💬',
    })
  })
})
