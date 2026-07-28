import { execFile } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

async function runNativeApiHandlerImport(handlerPath: string) {
  const script = `
    const mod = await import('./${handlerPath}')
    const handler = mod.default
    const req = { method: 'GET', query: { lessonId: 'self-intro' } }
    const res = {
      statusCode: 200,
      body: undefined,
      headers: {},
      status(code) {
        this.statusCode = code
        return this
      },
      setHeader(name, value) {
        this.headers[name] = value
      },
      json(value) {
        this.body = value
        return value
      },
    }

    await handler(req, res)
    console.log(JSON.stringify({ statusCode: res.statusCode, body: res.body }))
  `

  return execFileAsync(process.execPath, ['--experimental-strip-types', '--input-type=module', '--eval', script], {
    cwd: process.cwd(),
    env: {
      PATH: process.env.PATH,
    },
  })
}

describe('Vercel content API entrypoints', () => {
  it('can be imported by native Node TypeScript runtime without a database env', async () => {
    const course = await runNativeApiHandlerImport('api/content/course.ts')
    const lesson = await runNativeApiHandlerImport('api/content/lessons.ts')

    expect(JSON.parse(course.stdout)).toMatchObject({
      statusCode: 503,
      body: { error: 'Published content database is not configured' },
    })
    expect(JSON.parse(lesson.stdout)).toMatchObject({
      statusCode: 503,
      body: { error: 'Published content database is not configured' },
    })
  })

  it('rewrites lesson detail API paths to the lesson API function before the SPA fallback', async () => {
    const vercelConfig = JSON.parse(await readFile('vercel.json', 'utf8')) as {
      rewrites?: Array<{ destination: string; source: string }>
    }

    expect(vercelConfig.rewrites?.[0]).toEqual({
      source: '/api/content/lessons/:lessonId',
      destination: '/api/content/lessons?lessonId=:lessonId',
    })
    expect(vercelConfig.rewrites?.at(-1)).toEqual({
      source: '/(.*)',
      destination: '/index.html',
    })
  })
})
