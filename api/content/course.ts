import { createLazyDatabaseContentHttpHandlers } from '../../src/server/content/http.js'

const handlers = createLazyDatabaseContentHttpHandlers()

export default handlers.course
