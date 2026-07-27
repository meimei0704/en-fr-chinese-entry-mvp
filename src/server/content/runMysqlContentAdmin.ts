import process from 'node:process'
import { redactDatabaseUrl, resolveMysqlRunnerUrl, runMysqlSqlFiles } from './mysqlRunner.ts'

export const contentAdminSqlFiles = [
  'db/migrations/0001_content_admin.sql',
  'db/seeds/0001_initial_content_admin.sql',
]

export async function runContentAdminMysqlMigration(env = process.env) {
  const databaseUrl = resolveMysqlRunnerUrl(env)

  if (!databaseUrl) {
    throw new Error('Missing MySQL connection env. Expected MYSQL_DATABASE_URL, MYSQL_URL, or DATABASE_URL.')
  }

  console.log(`Applying content admin SQL files to ${redactDatabaseUrl(databaseUrl)}`)
  await runMysqlSqlFiles({ databaseUrl, files: contentAdminSqlFiles })
  console.log('Content admin MySQL migration and seed completed.')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runContentAdminMysqlMigration().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
