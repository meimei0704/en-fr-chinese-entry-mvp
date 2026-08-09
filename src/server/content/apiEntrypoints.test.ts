import { execFile } from 'node:child_process'
import { mkdtemp, rm, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
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

// The TS content and admin entrypoints (api/content/course|lessons and
// api/admin/content/lessons|draft|publish|rollback) have been removed — Go
// Functions now serve those routes (api/content/index.go and
// api/admin/content/index.go). Only the voice entrypoints remain as TS
// Vercel Functions, so this emit smoke test covers those and records the Go
// takeover of the content routes via vercel.json.
async function emitContentApiEntrypoints(outDir: string) {
  const program = ts.createProgram(
    [
      'api/admin/voice/generate.ts',
      'api/admin/voice/samples.ts',
      'src/content/types.ts',
      'src/content/schema.ts',
      'src/server/content/adminHttp.ts',
      'src/server/content/adminRepository.ts',
      'src/server/content/adminStoreMysql.ts',
      'src/server/content/adminTypes.ts',
      'src/server/content/http.ts',
      'src/server/content/publicContent.ts',
      'src/server/content/repository.ts',
      'src/server/content/types.ts',
      'src/server/voice/adminHttp.ts',
      'src/server/voice/provider.ts',
      'src/server/voice/storage.ts',
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
  await symlink(resolve('node_modules'), join(outDir, 'node_modules'), 'dir')
}

async function runEmittedApiHandlerImport(outDir: string, handlerPath: string, method = 'GET') {
  const handlerUrl = pathToFileURL(join(outDir, handlerPath)).href
  const script = `
    const mod = await import(${JSON.stringify(handlerUrl)})
    const handler = mod.default
    const req = { method: ${JSON.stringify(method)}, query: { lessonId: 'self-intro' } }
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
      await emitContentApiEntrypoints(outDir)

      const adminVoiceGenerate = await runEmittedApiHandlerImport(outDir, 'api/admin/voice/generate.js', 'POST')
      const adminVoiceSamples = await runEmittedApiHandlerImport(outDir, 'api/admin/voice/samples.js', 'POST')

      expect(JSON.parse(adminVoiceGenerate.stdout)).toMatchObject({
        statusCode: 503,
        body: { error: 'Content admin authentication is not configured' },
      })
      expect(JSON.parse(adminVoiceSamples.stdout)).toMatchObject({
        statusCode: 503,
        body: { error: 'Content admin authentication is not configured' },
      })
    } finally {
      await rm(outDir, { force: true, recursive: true })
    }
  })

  it('does not pin Vercel functions to an unverified region and preserves API rewrites before the SPA fallback', async () => {
    const vercelConfig = JSON.parse(await readFile('vercel.json', 'utf8')) as {
      regions?: string[]
      rewrites?: Array<{ destination: string; source: string }>
    }

    expect(vercelConfig.regions).toBeUndefined()
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
