import { authHandlers } from '@/mocks/handlers/authHandlers'
import { assetHandlers } from '@/mocks/handlers/assetHandlers'

export const handlers = [...authHandlers, ...assetHandlers]
