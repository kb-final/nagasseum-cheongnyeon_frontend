import { authHandlers } from '@/mocks/handlers/authHandlers'
import { compareHandlers } from '@/mocks/handlers/compareHandlers'

export const handlers = [...authHandlers, ...compareHandlers]
