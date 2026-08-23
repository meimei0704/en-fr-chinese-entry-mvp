import process from 'node:process'
import { readFile, writeFile } from 'node:fs/promises'
import { createConnection } from 'mysql2/promise'

const MIGRATION_NOTE = 'deploy:2026-08-23 example audio backfill (134 examples across 12 lessons)'
const CREATED_BY = 'deploy:example-audio-backfill'
const SEED_SQL_PATH = 'db/seeds/0001_initial_content_admin.sql'

const lessonIds = [
  'daily-greetings',
  'self-intro',
  'ask-directions',
  'order-food',
  'phone-and-payment',
  'restaurant-order',
  'train-station-ticket',
  'metro-ticket',
  'convenience-store-run',
  'ask-for-help-problem',
  'pharmacy-help',
  'small-talk',
]

const MODULE_TYPE = 'sentencePatterns'

function parseSeedPayloads(seedSql: string): Map<string, string> {
  const payloads = new Map<string, string>()
  for (const line of seedSql.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('(')) continue

    const match = trimmed.match(/^\((\d+),\s*'([^']+)',\s*'([^']+)',\s*'((?:[^']|'')*)',\s*'(published|draft)',/)
    if (!match) continue

    const lessonId = match[2]
    const moduleType = match[3]
    const rawPayload = match[4]
    const revisionKind = match[5]

    if (revisionKind !== 'published') continue
    if (moduleType !== MODULE_TYPE) continue
    if (!lessonIds.includes(lessonId)) continue

    payloads.set(lessonId, rawPayload.replaceAll("''", "'"))
  }

  return payloads
}

function countExamplesInPayload(payload: string): { count: number; missingAudio: number } {
  const parsed = JSON.parse(payload) as Array<{ examples?: Array<{ audio?: string }> }>
  let count = 0
  let missingAudio = 0
  for (const pattern of parsed) {
    for (const example of pattern.examples ?? []) {
      count += 1
      if (!example.audio) missingAudio += 1
    }
  }
  return { count, missingAudio }
}

async function main(env = process.env) {
  const databaseUrl = env.MYSQL_DATABASE_URL ?? env.MYSQL_URL ?? env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('Missing MySQL connection env. Expected MYSQL_DATABASE_URL, MYSQL_URL, or DATABASE_URL.')
  }

  const sslMode = env.MYSQL_SSL ?? ''
  const ssl =
    sslMode === 'required'
      ? { rejectUnauthorized: true }
      : sslMode === 'true' || sslMode === 'insecure'
        ? { rejectUnauthorized: false }
        : undefined
  const connection = await createConnection({ uri: databaseUrl, ssl })

  try {
    console.log('== Step 1: backup ==')
    for (const table of ['lessons', 'lesson_modules', 'module_revisions']) {
      const [rows] = await connection.execute(`select * from \`${table}\``)
      const file = `backup-example-audio-2026-08-23-${table}.json`
      await writeFile(file, JSON.stringify(rows, null, 2))
      console.log(`  dumped ${table}: ${(rows as unknown[]).length} rows -> ${file}`)
    }

    console.log('== Step 2: load new payloads from seed SQL ==')
    const seedSql = await readFile(SEED_SQL_PATH, 'utf8')
    const newPayloads = parseSeedPayloads(seedSql)
    let expectedExamples = 0
    for (const lessonId of lessonIds) {
      const payload = newPayloads.get(lessonId)
      if (!payload) {
        throw new Error(`No seed payload for ${lessonId}`)
      }
      const { count, missingAudio } = countExamplesInPayload(payload)
      if (missingAudio > 0) {
        throw new Error(`${lessonId}: ${missingAudio} examples missing audio in seed`)
      }
      expectedExamples += count
      console.log(`  ${lessonId}: ${count} examples, all with audio`)
    }
    console.log(`  total examples with audio in seed: ${expectedExamples}`)
    if (expectedExamples !== 134) {
      throw new Error(`Unexpected example count ${expectedExamples} (expected 134)`)
    }

    console.log('== Step 3: pre-migration check (null-pointer gate) ==')
    for (const lessonId of lessonIds) {
      const [rows] = await connection.execute(
        `select current_published_revision_id, current_draft_revision_id
         from lesson_modules where lesson_id = ? and module_type = ?`,
        [lessonId, MODULE_TYPE],
      )
      const row = (rows as Array<Record<string, unknown>>)[0]
      if (
        !row ||
        row.current_published_revision_id === null ||
        row.current_published_revision_id === undefined ||
        row.current_draft_revision_id === null ||
        row.current_draft_revision_id === undefined
      ) {
        throw new Error(`NULL/undefined pointer for ${lessonId}/${MODULE_TYPE}, aborting before any write`)
      }
      console.log(
        `  ${lessonId}/${MODULE_TYPE}: publishedId=${row.current_published_revision_id} draftId=${row.current_draft_revision_id}`,
      )
    }

    console.log('== Step 4: insert new revisions + move pointers (transaction) ==')
    await connection.beginTransaction()
    try {
      for (const lessonId of lessonIds) {
        const [rows] = await connection.execute(
          `select current_published_revision_id
           from lesson_modules where lesson_id = ? and module_type = ?`,
          [lessonId, MODULE_TYPE],
        )
        const current = (rows as Array<Record<string, unknown>>)[0]
        if (!current) throw new Error(`Missing module row for ${lessonId}/${MODULE_TYPE}`)
        const currentPublishedId = current.current_published_revision_id as number

        const payloadSql = newPayloads.get(lessonId)!

        const [publishedResult] = await connection.execute(
          `insert into module_revisions (lesson_id, module_type, payload, revision_kind, source_revision_id, created_by, note)
           values (?, ?, ?, 'published', ?, ?, ?)`,
          [lessonId, MODULE_TYPE, payloadSql, currentPublishedId, CREATED_BY, MIGRATION_NOTE],
        )
        const publishedId = (publishedResult as { insertId: number }).insertId

        const [draftResult] = await connection.execute(
          `insert into module_revisions (lesson_id, module_type, payload, revision_kind, source_revision_id, created_by, note)
           values (?, ?, ?, 'draft', ?, ?, ?)`,
          [lessonId, MODULE_TYPE, payloadSql, publishedId, CREATED_BY, MIGRATION_NOTE],
        )
        const draftId = (draftResult as { insertId: number }).insertId

        await connection.execute(
          `update lesson_modules
           set current_published_revision_id = ?, current_draft_revision_id = ?
           where lesson_id = ? and module_type = ?`,
          [publishedId, draftId, lessonId, MODULE_TYPE],
        )

        console.log(
          `  ${lessonId}/${MODULE_TYPE}: published ${currentPublishedId} -> ${publishedId}, draft -> ${draftId}`,
        )
      }
      await connection.commit()
      console.log('  COMMIT OK')
    } catch (error) {
      await connection.rollback()
      throw error
    }

    console.log('== Step 5: verify (post-migration) ==')
    let ok = true
    let verifiedExamples = 0
    for (const lessonId of lessonIds) {
      const [rows] = await connection.execute(
        `select pr.payload
         from lesson_modules lm
         join module_revisions pr on pr.revision_id = lm.current_published_revision_id
         where lm.lesson_id = ? and lm.module_type = ?`,
        [lessonId, MODULE_TYPE],
      )
      const row = (rows as Array<Record<string, unknown>>)[0]
      if (!row) {
        console.log(`  ${lessonId}/${MODULE_TYPE}: NO published payload`)
        ok = false
        continue
      }
      const payload = typeof row.payload === 'string' ? row.payload : JSON.stringify(row.payload)
      let examples = 0
      let missingAudio = 0
      try {
        const result = countExamplesInPayload(payload)
        examples = result.count
        missingAudio = result.missingAudio
      } catch (error) {
        console.log(`  ${lessonId}/${MODULE_TYPE}: payload parse error: ${(error as Error).message}`)
        ok = false
        continue
      }
      verifiedExamples += examples
      const line = `  ${lessonId}/${MODULE_TYPE}: examples=${examples} missingAudio=${missingAudio}`
      console.log(line)
      if (missingAudio > 0) ok = false
    }
    console.log(`  total examples verified: ${verifiedExamples}`)
    if (verifiedExamples !== 134) ok = false
    console.log(ok ? 'VERIFY OK' : 'VERIFY FAILED')
    if (!ok) process.exitCode = 1
  } finally {
    await connection.end()
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
