import { createServer } from 'vite'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = resolve(root, 'pkg/pinyincontent/data/pinyin_course.json')

const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

try {
  const mod = await server.ssrLoadModule('/src/content/pinyin/course.ts')
  const { pinyinCourse } = mod
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, `${JSON.stringify(pinyinCourse)}\n`)
  console.log(`wrote ${outPath}`)
} finally {
  await server.close()
}
