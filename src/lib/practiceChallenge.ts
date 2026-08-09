import type {
  BilingualExplanation,
  ExplanationLanguage,
  LessonContent,
  LocalizedField,
  PinyinModuleContent,
  ToneGameQuestion,
} from '../content/types'
import { getLocalizedText } from '../content/copy'

export type PracticeChallengeKind = 'listen' | 'read' | 'speak' | 'review'

export interface PracticeChallengeOption {
  id: string
  label: string
  pinyin?: string
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
  /** Text the pronunciation button should speak when it differs from `target` (e.g. a hanzi vs an English meaning). */
  speechText?: string
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
  pinyinMap?: ReadonlyMap<string, string>,
): PracticeChallengeOption[] {
  return shuffle([correct, ...distractors], rng).map((label, index) => ({
    id: `opt-${index}`,
    label,
    pinyin: pinyinMap?.get(label),
  }))
}

function asBilingualExplanation(value: LocalizedField): BilingualExplanation {
  if (typeof value === 'string') {
    return { en: value, fr: value }
  }

  return value
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
      speechText: pair.hanzi,
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
    speechText: pair.hanzi,
    audio: hanziAudio,
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

function pinyinToneListenQuestion(
  question: ToneGameQuestion,
  language: ExplanationLanguage,
): PracticeChallengeQuestion {
  const correctChoice =
    question.choices.find((choice) => choice.id === question.correctChoiceId) ?? question.choices[0]
  const correctLabel = getLocalizedText(correctChoice.toneLabel, language)
  const options = question.choices.map((choice, index) => ({
    id: `opt-${index}`,
    label: getLocalizedText(choice.toneLabel, language),
  }))
  const explanation: BilingualExplanation = {
    en: question.explanation ?? getLocalizedText(correctChoice.toneLabel, 'en'),
    fr: getLocalizedText(correctChoice.toneLabel, 'fr'),
  }

  return {
    id: `tone-${question.id}`,
    kind: 'listen',
    prompt: question.promptText
      ? {
          en: `Which tone matches “${question.promptText}”?`,
          fr: `Quel ton correspond à « ${question.promptText} » ?`,
        }
      : { en: 'Which tone is this?', fr: 'Quel est ce ton ?' },
    target: correctLabel,
    correctOptionId: options.find((option) => option.label === correctLabel)?.id ?? options[0].id,
    audio: question.promptAudio,
    options,
    explanation,
  }
}

export function buildPinyinPracticeChallenge(
  pinyinModule: PinyinModuleContent,
  language: ExplanationLanguage,
  count: number,
  seed: number,
): PracticeChallenge {
  const rng = createSeededRandom(seed)
  const referenceItems = pinyinModule.reference.flatMap((group) => group.items)
  const pinyinPool = referenceItems.map((item) => item.pinyin)

  const toneQuestions: PracticeChallengeQuestion[] = (pinyinModule.toneGame?.questions ?? []).map(
    (question) => pinyinToneListenQuestion(question, language),
  )

  const referenceListen: PracticeChallengeQuestion[] = referenceItems.map((item) =>
    listenQuestion(
      {
        id: `${item.id}-listen`,
        prompt: { en: 'Which pinyin is this?', fr: 'Quel est ce pinyin ?' },
        target: item.pinyin,
        audio: item.audio,
        explanation: asBilingualExplanation(item.description),
      },
      pinyinPool,
      rng,
    ),
  )

  const referenceRead: PracticeChallengeQuestion[] = referenceItems.map((item) => {
    const options = buildChoiceOptions(
      item.pinyin,
      pickUnique(pinyinPool, item.pinyin, 3, rng),
      rng,
    )

    return {
      id: `${item.id}-read`,
      kind: 'read',
      prompt: item.description,
      target: item.pinyin,
      speechText: item.pinyin,
      audio: item.audio,
      correctOptionId: options.find((option) => option.label === item.pinyin)?.id ?? options[0].id,
      options,
      explanation: asBilingualExplanation(item.description),
    }
  })

  const groups: Record<'listen' | 'read', PracticeChallengeQuestion[]> = {
    listen: shuffle([...toneQuestions, ...referenceListen], rng),
    read: shuffle(referenceRead, rng),
  }

  const kinds = ['listen', 'read'] as const
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
  const speakQuestions = lesson.practice.speaking.map((item) => speakQuestion(item))
  const reviewQuestions = reviewPairs.flatMap((card, index) => {
    const direction: 'front-to-back' | 'back-to-front' = index % 2 === 0 ? 'front-to-back' : 'back-to-front'
    return [reviewQuestionFromCard(card, direction, language, hanziPool, meaningPool, rng, audioMap)]
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
    questions: shuffle(attachPinyinToQuestions(selected, pinyinMap), rng),
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
