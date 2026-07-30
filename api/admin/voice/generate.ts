import { createLazyAdminVoiceHttpHandlers } from '../../../src/server/voice/adminHttp.js'

const handlers = createLazyAdminVoiceHttpHandlers()

export default handlers.generate
