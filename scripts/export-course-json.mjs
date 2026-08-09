import { createServer } from 'vite'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = resolve(root, 'pkg/seedgen/data/course.json')

const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

try {
  const mod = await server.ssrLoadModule('/src/content/course.ts')
  const { course } = mod
  const snapshot = {
    supportedExplanationLanguages: course.supportedExplanationLanguages,
    estimatedDailyMinutes: course.estimatedDailyMinutes,
    lessons: course.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      scenario: lesson.scenario,
      dialogue: lesson.dialogue,
      sentencePatterns: lesson.sentencePatterns,
      vocabulary: lesson.vocabulary,
      practice: lesson.practice,
      reviewCards: lesson.reviewCards,
    })),
  }
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, `${JSON.stringify(snapshot)}\n`)
  console.log(`wrote ${outPath}`)
} finally {
  await server.close()
}
