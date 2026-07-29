import { authHandlers } from '@/mocks/handlers/authHandlers'
import { assetHandlers } from '@/mocks/handlers/assetHandlers'
import { compareHandlers } from '@/mocks/handlers/compareHandlers'
import { homeHandlers } from '@/mocks/handlers/homeHandlers'
import { dashboardExtrasHandlers } from '@/mocks/handlers/dashboardExtrasHandlers'

export const handlers = [
  ...authHandlers,
  ...assetHandlers,
  ...compareHandlers,
  ...homeHandlers,
  ...dashboardExtrasHandlers
]
