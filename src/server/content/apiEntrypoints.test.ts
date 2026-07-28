import { execFile } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { readFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import ts from 'typescript'

const execFileAsync = promisify(execFile)

function formatDiagnostics(diagnostics: readonly ts.Diagnostic[]) {
  return ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => '\n',
  })
}

function emitContentApiEntrypoints(outDir: string) {
  const program = ts.createProgram(
    [
      'api/content/course.ts',
      'api/content/lessons.ts',
      'src/content/types.ts',
      'src/server/content/http.ts',
      'src/server/content/publicContent.ts',
      'src/server/content/repository.ts',
      'src/server/content/types.ts',
    ],
    {
      esModuleInterop: true,
      lib: ['lib.es2023.d.ts'],
      module: ts.ModuleKind.NodeNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
      noEmitOnError: true,
      outDir,
      rootDir: process.cwd(),
      skipLibCheck: true,
      strict: true,
      target: ts.ScriptTarget.ES2023,
      types: ['node'],
    },
  )
  const emit = program.emit()
  const diagnostics = [...ts.getPreEmitDiagnostics(program), ...emit.diagnostics]

  expect(formatDiagnostics(diagnostics)).toBe('')
}

async function runEmittedApiHandlerImport(outDir: string, handlerPath: string) {
  const handlerUrl = pathToFileURL(join(outDir, handlerPath)).href
  const script = `
    const mod = await import(${JSON.stringify(handlerUrl)})
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

  return execFileAsync(process.execPath, ['--input-type=module', '--eval', script], {
    cwd: process.cwd(),
    env: {
      PATH: process.env.PATH,
    },
  })
}

describe('Vercel content API entrypoints', () => {
  it('emit to JavaScript that can be imported by the Vercel Node runtime without a database env', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'content-api-entrypoints-'))

    try {
      emitContentApiEntrypoints(outDir)

      const course = await runEmittedApiHandlerImport(outDir, 'api/content/course.js')
      const lesson = await runEmittedApiHandlerImport(outDir, 'api/content/lessons.js')

      expect(JSON.parse(course.stdout)).toMatchObject({
        statusCode: 503,
        body: { error: 'Published content database is not configured' },
      })
      expect(JSON.parse(lesson.stdout)).toMatchObject({
        statusCode: 503,
        body: { error: 'Published content database is not configured' },
      })
    } finally {
      await rm(outDir, { force: true, recursive: true })
    }
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
