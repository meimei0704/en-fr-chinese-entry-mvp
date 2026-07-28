import { createLazyDatabaseAdminHttpHandlers } from '../../../src/server/content/adminHttp.js'

const handlers = createLazyDatabaseAdminHttpHandlers()

export default handlers.draft
