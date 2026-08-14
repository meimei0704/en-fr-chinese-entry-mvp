import type {
  BilingualExplanation,
  ExplanationLanguage,
  LessonContent,
  LocalizedField,
} from '../content/types'
import { getLocalizedText } from '../content/copy'

export type PracticeChallengeKind = 'listen' | 'read' | 'review'

export interface PracticeChallengeOption {
  id: string
  label: string
  pinyin?: string
  audio?: string
}

export interface PracticeChallengeQuestion {
  id: string
  kind: PracticeChallengeKind
  prompt: LocalizedField
  target: string
  targetPinyin?: string
  correctOptionId: string
  audio?: string
  audioFallback?: string
  options: PracticeChallengeOption[]
  explanation: BilingualExplanation
}

export interface PracticeChallenge {
  questions: PracticeChallengeQuestion[]
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
  pinyinMap?: ReadonlyMap<string, string>,
): PracticeChallengeOption[] {
  return shuffle([correct, ...distractors], rng).map((label, index) => ({
    id: `opt-${index}`,
    label,
    pinyin: pinyinMap?.get(label),
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

function hanziToPinyinMap(lesson: LessonContent): Map<string, string> {
  const map = new Map<string, string>()
  const add = (hanzi: string, pinyin: string) => {
    if (hanzi && !map.has(hanzi)) {
      map.set(hanzi, pinyin)
    }
  }

  for (const line of lesson.dialogue.lines) {
    add(line.hanzi, line.pinyin)
  }
  for (const item of lesson.vocabulary) {
    add(item.hanzi, item.pinyin)
  }
  for (const item of [...lesson.practice.listening, ...lesson.practice.speaking, ...lesson.practice.reading]) {
    if (item.pinyin) {
      add(item.target, item.pinyin)
    }
  }

  return map
}

function hanziToAudioMap(lesson: LessonContent): Map<string, string> {
  const map = new Map<string, string>()
  const add = (hanzi: string, audio: string) => {
    if (hanzi && !map.has(hanzi)) {
      map.set(hanzi, audio)
    }
  }

  for (const line of lesson.dialogue.lines) {
    add(line.hanzi, line.audio)
    if (line.audioFallback) {
      add(line.hanzi, line.audioFallback)
    }
  }
  for (const item of lesson.vocabulary) {
    add(item.hanzi, item.audio)
    if (item.audioFallback) {
      add(item.hanzi, item.audioFallback)
    }
  }
  for (const item of [...lesson.practice.listening, ...lesson.practice.speaking, ...lesson.practice.reading]) {
    add(item.target, item.audio)
    if (item.audioFallback) {
      add(item.target, item.audioFallback)
    }
  }

  return map
}

function looksLikeHanzi(value: string) {
  return /[\u3400-\u9fff]/.test(value)
}

function attachPinyinToQuestions(
  questions: PracticeChallengeQuestion[],
  pinyinMap: ReadonlyMap<string, string>,
): PracticeChallengeQuestion[] {
  return questions.map((question) => ({
    ...question,
    targetPinyin: pinyinMap.get(question.target),
    options: question.options.map((option) =>
      looksLikeHanzi(option.label) && !option.pinyin
        ? { ...option, pinyin: pinyinMap.get(option.label) }
        : option,
    ),
  }))
}

function attachOptionAudio(
  questions: PracticeChallengeQuestion[],
  audioMap: ReadonlyMap<string, string>,
): PracticeChallengeQuestion[] {
  return questions.map((question) => ({
    ...question,
    options: question.options.map((option) =>
      looksLikeHanzi(option.label) && !option.audio
        ? { ...option, audio: audioMap.get(option.label) }
        : option,
    ),
  }))
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
  audioMap?: ReadonlyMap<string, string>,
): PracticeChallengeQuestion {
  const meaning = getLocalizedText(pair.meaning, language)
  const hanziAudio = audioMap?.get(pair.hanzi)

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
      audio: hanziAudio,
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
    audio: hanziAudio,
    correctOptionId: options.find((option) => option.label === pair.hanzi)?.id ?? options[0].id,
    options,
    explanation: pair.explanation,
  }
}

function reviewQuestionFromCard(
  card: StructuredPair,
  direction: 'front-to-back' | 'back-to-front',
  language: ExplanationLanguage,
  hanziCandidatesPool: string[],
  meaningCandidatesPool: string[],
  rng: () => number,
  audioMap?: ReadonlyMap<string, string>,
): PracticeChallengeQuestion {
  return readQuestionFromPair(
    card,
    direction === 'front-to-back' ? 'hanzi-to-meaning' : 'meaning-to-hanzi',
    language,
    hanziCandidatesPool,
    meaningCandidatesPool,
    rng,
    'review',
    audioMap,
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
  const pinyinMap = hanziToPinyinMap(lesson)
  const audioMap = hanziToAudioMap(lesson)

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
    readQuestionFromPair(pair, 'hanzi-to-meaning', language, hanziPool, meaningPool, rng, 'read', audioMap),
  )
  const reviewQuestions = reviewPairs.flatMap((card, index) => {
    const direction: 'front-to-back' | 'back-to-front' = index % 2 === 0 ? 'front-to-back' : 'back-to-front'
    return [reviewQuestionFromCard(card, direction, language, hanziPool, meaningPool, rng, audioMap)]
  })

  const groups: Record<PracticeChallengeKind, PracticeChallengeQuestion[]> = {
    listen: shuffle(listenQuestions, rng),
    read: shuffle(readQuestions, rng),
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
    questions: shuffle(
      attachOptionAudio(attachPinyinToQuestions(selected, pinyinMap), audioMap),
      rng,
    ),
  }
}
