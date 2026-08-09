#!/usr/bin/env node
// TS vs Go content API contract comparison.
//
// Normalizes each response (recursive key sort, optional ignored paths) and
// deep-compares TS and Go bodies so key order never matters.
//
// Modes:
//   - Remote:  node scripts/compare-content-api.mjs --ts <url> --go <url>
//   - Local:   node scripts/compare-content-api.mjs
//     Stands up an in-process TS server (real handlers over the static course
//     seed via vite ssr) and spawns the Go cmd/contentcompare server, then
//     compares the two. Requires a Go toolchain.
//
// Flags:
//   --ts <base-url>    TS base URL (remote mode)
//   --go <base-url>    Go base URL (remote mode)
//   --admin            also compare admin GET endpoints
//   --username <u>     admin basic-auth username (default: admin)
//   --password <p>     admin basic-auth password (default: secret)
//   --lessons a,b,c    restrict lesson endpoints to the given ids
//   --ignore a.b.c     ignore a dotted key path during comparison (repeatable)
//   --go-binary <path> reuse a prebuilt cmd/contentcompare binary
//   --go-port <port>   port for the local Go server
import { createServer } from 'vite'
import { spawn, spawnSync } from 'node:child_process'
import http from 'node:http'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const courseJSONPath = join(root, 'internal/seedgen/data/course.json')

const args = process.argv.slice(2)
function flag(name, fallback) {
  const index = args.indexOf(`--${name}`)
  return index >= 0 && args[index + 1] !== undefined ? args[index + 1] : fallback
}
const tsBase = flag('ts', null)
const goBase = flag('go', null)
const includeAdmin = args.includes('--admin')
const username = flag('username', 'admin')
const password = flag('password', 'secret')
const goBinary = flag('go-binary', null)
const goPort = flag('go-port', String(8790 + Math.floor(Math.random() * 200)))
const ignoreList = args
  .flatMap((value, index) => (value === '--ignore' ? [args[index + 1]] : []))
  .filter(Boolean)
const lessonFilter = flag('lessons', null)?.split(',').filter(Boolean)

const ignorePaths = new Set(ignoreList)
const remoteMode = Boolean(tsBase && goBase)
const localMode = !remoteMode

if (!remoteMode && !localMode) {
  console.error('Provide both --ts and --go (remote) or neither (local).')
  process.exit(2)
}

// --- normalization -------------------------------------------------------

function canonicalize(value, path = '') {
  if (Array.isArray(value)) {
    return value.map((item, index) => canonicalize(item, `${path}[${index}]`))
  }
  if (value !== null && typeof value === 'object') {
    const out = {}
    for (const key of Object.keys(value).sort()) {
      const keyPath = path ? `${path}.${key}` : key
      if (ignorePaths.has(key) || ignorePaths.has(keyPath)) {
        continue
      }
      out[key] = canonicalize(value[key], keyPath)
    }
    return out
  }
  return value
}

function canonicalString(value) {
  return JSON.stringify(canonicalize(value))
}

// --- helpers -------------------------------------------------------------

async function getJson(base, pathname, headers = {}) {
  const url = base.replace(/\/$/, '') + pathname
  const response = await fetch(url, { headers })
  const text = await response.text()
  let body
  try {
    body = JSON.parse(text)
  } catch {
    body = text
  }
  return { status: response.status, body }
}

function basicAuthHeader(user, pass) {
  return `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`
}

function waitForGo(port, timeoutMs) {
  const started = Date.now()
  return new Promise((resolvePromise, rejectPromise) => {
    const probe = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/api/content/course`)
        if (response.status) {
          resolvePromise()
          return
        }
      } catch {
        // not up yet
      }
      if (Date.now() - started > timeoutMs) {
        rejectPromise(new Error(`Go server on :${port} did not become ready`))
        return
      }
      setTimeout(probe, 250)
    }
    probe()
  })
}

// --- Go local server -----------------------------------------------------

let goProcess = null
let goTempDir = null

async function startGoServer() {
  let binary = goBinary
  if (!binary) {
    goTempDir = mkdtempSync(join(tmpdir(), 'contentcompare-'))
    binary = join(goTempDir, 'contentcompare')
    const build = spawnSync('go', ['build', '-o', binary, './cmd/contentcompare'], {
      cwd: root,
      stdio: 'inherit',
    })
    if (build.status !== 0) {
      throw new Error('go build ./cmd/contentcompare failed')
    }
  }
  goProcess = spawn(binary, [
    '--port',
    goPort,
    '--course-json',
    courseJSONPath,
    '--admin-user',
    username,
    '--admin-pass',
    password,
  ])
  goProcess.stdout?.on('data', (chunk) => process.stdout.write(`[go] ${chunk}`))
  goProcess.stderr?.on('data', (chunk) => process.stderr.write(`[go] ${chunk}`))
  await waitForGo(goPort, 120_000)
  return `http://127.0.0.1:${goPort}`
}

function stopGoServer() {
  if (goProcess) {
    goProcess.kill()
    goProcess = null
  }
  if (goTempDir) {
    rmSync(goTempDir, { recursive: true, force: true })
    goTempDir = null
  }
}

// --- TS in-process server ------------------------------------------------

async function buildTsHandlers() {
  const vite = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
  })

  const [courseMod, pinyinMod, seedMod, httpMod, adminHttpMod, adminRepoMod] = await Promise.all([
    vite.ssrLoadModule('/src/content/course.ts'),
    vite.ssrLoadModule('/src/content/pinyin/course.ts'),
    vite.ssrLoadModule('/src/server/content/seed.ts'),
    vite.ssrLoadModule('/src/server/content/http.ts'),
    vite.ssrLoadModule('/src/server/content/adminHttp.ts'),
    vite.ssrLoadModule('/src/server/content/adminRepository.ts'),
  ])

  const { course } = courseMod
  const { pinyinCourse } = pinyinMod
  const seed = seedMod.createInitialContentSeed(course)

  const publicRows = seed.revisions
    .filter((revision) => revision.revisionKind === 'published')
    .map((revision) => {
      const lesson = seed.lessons.find((item) => item.lessonId === revision.lessonId)
      return {
        lessonId: revision.lessonId,
        slug: lesson.slug,
        displayOrder: lesson.displayOrder,
        enabled: lesson.enabled,
        moduleType: revision.moduleType,
        revisionId: revision.revisionId,
        payload: revision.payload,
      }
    })

  const publicRepo = {
    async listPublishedCourseModules() {
      return publicRows
    },
    async listPublishedLessonModules(lessonId) {
      return publicRows.filter((row) => row.lessonId === lessonId)
    },
  }
  const contentHandlers = httpMod.createContentHttpHandlers(publicRepo)

  const history = new Map()
  const adminRows = []
  for (const lesson of seed.lessons) {
    for (const revision of seed.revisions) {
      if (revision.lessonId !== lesson.lessonId) {
        continue
      }
      if (revision.revisionKind === 'published') {
        history.set(`${lesson.lessonId}|${revision.moduleType}`, [
          {
            lessonId: revision.lessonId,
            moduleType: revision.moduleType,
            revisionId: revision.revisionId,
            payload: revision.payload,
            createdAt: revision.createdAt,
            createdBy: revision.createdBy,
            note: revision.note,
            sourceRevisionId: revision.sourceRevisionId,
          },
        ])
      }
    }
    const lessonRevisions = seed.revisions.filter((revision) => revision.lessonId === lesson.lessonId)
    const published = lessonRevisions.filter((revision) => revision.revisionKind === 'published')
    const drafts = lessonRevisions.filter((revision) => revision.revisionKind === 'draft')
    published.forEach((publishedRevision, index) => {
      const draft = drafts[index]
      adminRows.push({
        lessonId: lesson.lessonId,
        slug: lesson.slug,
        displayOrder: lesson.displayOrder,
        enabled: lesson.enabled,
        moduleType: publishedRevision.moduleType,
        draftRevisionId: draft.revisionId,
        draftPayload: draft.payload,
        draftCreatedAt: draft.createdAt,
        draftCreatedBy: draft.createdBy,
        draftNote: draft.note,
        draftSourceRevisionId: draft.sourceRevisionId,
        publishedRevisionId: publishedRevision.revisionId,
        publishedPayload: publishedRevision.payload,
        publishedCreatedAt: publishedRevision.createdAt,
        publishedCreatedBy: publishedRevision.createdBy,
        publishedNote: publishedRevision.note,
        publishedSourceRevisionId: publishedRevision.sourceRevisionId,
      })
    })
  }

  const adminStore = {
    async listCurrentModuleStates() {
      return adminRows
    },
    async listCurrentLessonModuleStates(lessonId) {
      return adminRows.filter((row) => row.lessonId === lessonId)
    },
    async getCurrentModuleState(lessonId, moduleType) {
      return adminRows.find((row) => row.lessonId === lessonId && row.moduleType === moduleType) ?? null
    },
    async listPublishedModuleHistory(lessonId, moduleType) {
      return history.get(`${lessonId}|${moduleType}`) ?? []
    },
    insertModuleRevision() {
      throw new Error('compare script: read-only TS admin store')
    },
    updateCurrentModuleState() {
      throw new Error('compare script: read-only TS admin store')
    },
    runInTransaction() {
      throw new Error('compare script: read-only TS admin store')
    },
  }
  const adminRepository = new adminRepoMod.ContentAdminRepository(adminStore)
  const adminHandlers = adminHttpMod.createAdminHttpHandlers(adminRepository, {
    CONTENT_ADMIN_USERNAME: username,
    CONTENT_ADMIN_PASSWORD: password,
  })

  return { vite, course, pinyinCourse, contentHandlers, adminHandlers }
}

async function startTsServer(state) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1')
    const query = {}
    for (const [key, value] of url.searchParams) {
      query[key] = value
    }
    const headers = { ...req.headers }
    const pathname = url.pathname
    const adapter = {
      status(code) {
        this.code = code
        return this
      },
      setHeader(name, value) {
        res.setHeader(name, value)
      },
      json(value) {
        res.statusCode = this.code ?? 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(value))
      },
    }

    const dispatch = async () => {
      if (pathname === '/api/content/course') {
        return state.contentHandlers.course({ method: req.method, query }, adapter)
      }
      if (pathname === '/api/content/lessons') {
        return state.contentHandlers.lesson({ method: req.method, query }, adapter)
      }
      if (pathname === '/api/content/pinyin/course') {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(state.pinyinCourse))
        return undefined
      }
      if (pathname === '/api/admin/content/lessons') {
        return state.adminHandlers.lessons({ method: req.method, query, headers }, adapter)
      }
      res.statusCode = 404
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Not found' }))
      return undefined
    }

    dispatch().catch(() => {
      if (!res.headersSent) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Unable to read published content' }))
      } else {
        res.end()
      }
    })
  })

  await new Promise((resolvePromise) => {
    server.listen(0, '127.0.0.1', () => resolvePromise())
  })
  const address = server.address()
  return { server, base: `http://127.0.0.1:${address.port}` }
}

// --- comparison ----------------------------------------------------------

function buildEndpointList(lessonIds) {
  const endpoints = [
    { name: 'course', method: 'GET', path: '/api/content/course' },
    { name: 'pinyin course', method: 'GET', path: '/api/content/pinyin/course' },
  ]
  for (const lessonId of lessonIds) {
    endpoints.push({
      name: `lesson:${lessonId}`,
      method: 'GET',
      path: `/api/content/lessons?lessonId=${encodeURIComponent(lessonId)}`,
    })
  }
  if (includeAdmin) {
    endpoints.push({ name: 'admin lessons list', method: 'GET', path: '/api/admin/content/lessons' })
    if (lessonIds.length > 0) {
      endpoints.push({
        name: `admin lessons snapshot:${lessonIds[0]}`,
        method: 'GET',
        path: `/api/admin/content/lessons?lessonId=${encodeURIComponent(lessonIds[0])}`,
      })
    }
  }
  return endpoints
}

async function runComparison(tsUrl, goUrl) {
  const tsCourse = await getJson(tsUrl, '/api/content/course')
  if (tsCourse.status !== 200 || !Array.isArray(tsCourse.body?.lessons)) {
    throw new Error(`TS course endpoint returned unexpected payload (status ${tsCourse.status})`)
  }
  let lessonIds = tsCourse.body.lessons.map((lesson) => lesson.id)
  if (lessonFilter) {
    lessonIds = lessonIds.filter((id) => lessonFilter.includes(id))
  }

  const endpoints = buildEndpointList(lessonIds)
  const adminHeaders = includeAdmin
    ? { authorization: basicAuthHeader(username, password) }
    : {}
  const tsHeaders = includeAdmin ? adminHeaders : {}

  let failures = 0
  for (const endpoint of endpoints) {
    const ts = await getJson(tsUrl, endpoint.path, tsHeaders)
    const go = await getJson(goUrl, endpoint.path, adminHeaders)
    const statusMatch = ts.status === go.status
    const bodyMatch = canonicalString(ts.body) === canonicalString(go.body)
    const ok = statusMatch && bodyMatch
    if (!ok) {
      failures += 1
      console.error(`FAIL ${endpoint.name} [${endpoint.method} ${endpoint.path}]`)
      if (!statusMatch) {
        console.error(`  status: ts=${ts.status} go=${go.status}`)
      }
      if (!bodyMatch) {
        console.error(`  ts: ${JSON.stringify(ts.body)}`)
        console.error(`  go: ${JSON.stringify(go.body)}`)
      }
    } else {
      console.log(`PASS ${endpoint.name} [${endpoint.method} ${endpoint.path}]`)
    }
  }
  return failures
}

// --- main ----------------------------------------------------------------

let tsState = null
let tsServer = null
let goUrl = null

async function main() {
  let tsUrl = tsBase
  if (localMode) {
    tsState = await buildTsHandlers()
    const tsServerInfo = await startTsServer(tsState)
    tsServer = tsServerInfo.server
    tsUrl = tsServerInfo.base
    goUrl = await startGoServer()
  }

  const failures = await runComparison(tsUrl, remoteMode ? goBase : goUrl)

  if (failures === 0) {
    console.log('\nAll responses match between TS and Go.')
  } else {
    console.error(`\n${failures} endpoint(s) differ between TS and Go.`)
  }
  process.exitCode = failures === 0 ? 0 : 1
}

try {
  await main()
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  if (tsServer) {
    await new Promise((resolvePromise) => tsServer.close(() => resolvePromise()))
  }
  if (tsState?.vite) {
    await tsState.vite.close()
  }
  stopGoServer()
}
