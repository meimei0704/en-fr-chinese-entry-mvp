import type {
  BilingualExplanation,
  ExplanationLanguage,
  LessonContent,
  LocalizedField,
} from '../content/types'
import { getLocalizedText } from '../content/copy'

export type PracticeChallengeKind = 'listen' | 'read' | 'speak' | 'review'

export interface PracticeChallengeOption {
  id: string
  label: string
}

export interface PracticeChallengeQuestion {
  id: string
  kind: PracticeChallengeKind
  prompt: LocalizedField
  target: string
  correctOptionId: string
  audio?: string
  audioFallback?: string
  options: PracticeChallengeOption[]
  explanation: BilingualExplanation
}

export type ChallengeRating = 'S' | 'A' | 'B' | 'C'

export interface PracticeChallenge {
  questions: PracticeChallengeQuestion[]
  maxScore: number
}

export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(items: T[], rng: () => number): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1))
    const current = result[index]
    result[index] = result[swapIndex]
    result[swapIndex] = current
  }
  return result
}

function pickUnique(
  candidates: string[],
  exclude: string,
  count: number,
  rng: () => number,
): string[] {
  const shuffled = shuffle(candidates.filter((candidate) => candidate !== exclude), rng)
  return shuffled.slice(0, count)
}

interface StructuredPair {
  id: string
  hanzi: string
  meaning: LocalizedField
  explanation: BilingualExplanation
}

function buildChoiceOptions(
  correct: string,
  distractors: string[],
  rng: () => number,
): PracticeChallengeOption[] {
  return shuffle([correct, ...distractors], rng).map((label, index) => ({
    id: `opt-${index}`,
    label,
  }))
}

function hanziCandidates(lesson: LessonContent): string[] {
  const candidates: string[] = []
  const seen = new Set<string>()

  const add = (value: string | undefined) => {
    if (value && !seen.has(value)) {
      seen.add(value)
      candidates.push(value)
    }
  }

  for (const item of [...lesson.practice.listening, ...lesson.practice.speaking, ...lesson.practice.reading]) {
    add(item.target)
  }
  for (const card of lesson.reviewCards) {
    add(card.front)
  }
  for (const item of lesson.vocabulary) {
    add(item.hanzi)
  }

  return candidates
}

function meaningCandidates(
  lesson: LessonContent,
  language: ExplanationLanguage,
): string[] {
  const candidates: string[] = []
  const seen = new Set<string>()

  const add = (value: LocalizedField | undefined) => {
    if (!value) {
      return
    }
    const label = getLocalizedText(value, language)
    if (!seen.has(label)) {
      seen.add(label)
      candidates.push(label)
    }
  }

  for (const card of lesson.reviewCards) {
    add(card.back)
  }
  for (const item of lesson.vocabulary) {
    add(item.meaning)
  }

  return candidates
}

function listenQuestion(
  item: { id: string; prompt: LocalizedField; target: string; audio: string; audioFallback?: string; explanation: BilingualExplanation },
  candidates: string[],
  rng: () => number,
): PracticeChallengeQuestion {
  const options = buildChoiceOptions(
    item.target,
    pickUnique(candidates, item.target, 3, rng),
    rng,
  )

  return {
    id: item.id,
    kind: 'listen',
    prompt: item.prompt,
    target: item.target,
    correctOptionId: options.find((option) => option.label === item.target)?.id ?? options[0].id,
    audio: item.audio,
    audioFallback: item.audioFallback,
    options,
    explanation: item.explanation,
  }
}

function readQuestionFromPair(
  pair: StructuredPair,
  direction: 'hanzi-to-meaning' | 'meaning-to-hanzi',
  language: ExplanationLanguage,
  hanziCandidatesPool: string[],
  meaningCandidatesPool: string[],
  rng: () => number,
  kind: PracticeChallengeKind = 'read',
): PracticeChallengeQuestion {
  const meaning = getLocalizedText(pair.meaning, language)

  if (direction === 'hanzi-to-meaning') {
    const options = buildChoiceOptions(
      meaning,
      pickUnique(meaningCandidatesPool, meaning, 3, rng),
      rng,
    )

    return {
      id: `${pair.id}-meaning`,
      kind,
      prompt: { en: `What does ${pair.hanzi} mean?`, fr: `Que signifie ${pair.hanzi} ?` },
      target: meaning,
      correctOptionId: options.find((option) => option.label === meaning)?.id ?? options[0].id,
      options,
      explanation: pair.explanation,
    }
  }

  const options = buildChoiceOptions(
    pair.hanzi,
    pickUnique(hanziCandidatesPool, pair.hanzi, 3, rng),
    rng,
  )

  return {
    id: `${pair.id}-hanzi`,
    kind,
    prompt: { en: `Which hanzi means “${meaning}”?`, fr: `Quel hanzi signifie « ${meaning} » ?` },
    target: pair.hanzi,
    correctOptionId: options.find((option) => option.label === pair.hanzi)?.id ?? options[0].id,
    options,
    explanation: pair.explanation,
  }
}

function speakQuestion(
  item: { id: string; prompt: LocalizedField; target: string; audio: string; audioFallback?: string; explanation: BilingualExplanation },
): PracticeChallengeQuestion {
  return {
    id: item.id,
    kind: 'speak',
    prompt: item.prompt,
    target: item.target,
    correctOptionId: 'fluent',
    audio: item.audio,
    audioFallback: item.audioFallback,
    options: [
      { id: 'fluent', label: 'fluent' },
      { id: 'needs-practice', label: 'needs-practice' },
      { id: 'show-me', label: 'show-me' },
    ],
    explanation: item.explanation,
  }
}

function reviewQuestionFromCard(
  card: StructuredPair,
  direction: 'front-to-back' | 'back-to-front',
  language: ExplanationLanguage,
  hanziCandidatesPool: string[],
  meaningCandidatesPool: string[],
  rng: () => number,
): PracticeChallengeQuestion {
  return readQuestionFromPair(
    card,
    direction === 'front-to-back' ? 'hanzi-to-meaning' : 'meaning-to-hanzi',
    language,
    hanziCandidatesPool,
    meaningCandidatesPool,
    rng,
    'review',
  )
}

export function buildPracticeChallenge(
  lesson: LessonContent,
  language: ExplanationLanguage,
  count: number,
  seed: number,
): PracticeChallenge {
  const rng = createSeededRandom(seed)
  const hanziPool = hanziCandidates(lesson)
  const meaningPool = meaningCandidates(lesson, language)

  const pairs: StructuredPair[] = lesson.vocabulary.map((item) => ({
    id: item.id,
    hanzi: item.hanzi,
    meaning: item.meaning,
    explanation: item.explanation,
  }))

  const reviewPairs: StructuredPair[] = lesson.reviewCards.map((card) => ({
    id: card.id,
    hanzi: card.front,
    meaning: card.back,
    explanation: card.explanation,
  }))

  const listenQuestions = lesson.practice.listening.map((item) =>
    listenQuestion(item, hanziPool, rng),
  )
  const readQuestions = pairs.map((pair) =>
    readQuestionFromPair(pair, 'hanzi-to-meaning', language, hanziPool, meaningPool, rng),
  )
  const speakQuestions = lesson.practice.speaking.map((item) => speakQuestion(item))
  const reviewQuestions = reviewPairs.flatMap((card, index) => {
    const direction: 'front-to-back' | 'back-to-front' = index % 2 === 0 ? 'front-to-back' : 'back-to-front'
    return [reviewQuestionFromCard(card, direction, language, hanziPool, meaningPool, rng)]
  })

  const groups: Record<PracticeChallengeKind, PracticeChallengeQuestion[]> = {
    listen: shuffle(listenQuestions, rng),
    read: shuffle(readQuestions, rng),
    speak: shuffle(speakQuestions, rng),
    review: shuffle(reviewQuestions, rng),
  }

  const kinds = Object.keys(groups) as PracticeChallengeKind[]
  const selected: PracticeChallengeQuestion[] = []
  let pickIndex = 0

  while (selected.length < count) {
    const kind = kinds[pickIndex % kinds.length]
    const next = groups[kind].shift()

    if (next) {
      selected.push(next)
    } else if (kinds.every((key) => groups[key].length === 0)) {
      break
    }

    pickIndex += 1
  }

  return {
    questions: shuffle(selected, rng),
    maxScore: 100,
  }
}

export function pointsForCorrect(questionCount: number): number {
  return Math.round(100 / questionCount)
}

export function remainingPoints(questionCount: number): number {
  return 100 - pointsForCorrect(questionCount) * questionCount
}

export function computeRating(score: number, maxScore: number): ChallengeRating {
  if (maxScore <= 0) {
    return 'C'
  }

  const ratio = score / maxScore
  if (ratio >= 0.9) {
    return 'S'
  }
  if (ratio >= 0.7) {
    return 'A'
  }
  if (ratio >= 0.5) {
    return 'B'
  }
  return 'C'
}
