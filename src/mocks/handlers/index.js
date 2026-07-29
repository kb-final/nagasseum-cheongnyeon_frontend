import { authHandlers } from '@/mocks/handlers/authHandlers'
import { compareHandlers } from '@/mocks/handlers/compareHandlers'
import { homeHandlers } from '@/mocks/handlers/homeHandlers'
import { dashboardExtrasHandlers } from '@/mocks/handlers/dashboardExtrasHandlers'

export const handlers = [
  ...authHandlers,
  ...compareHandlers,
  ...homeHandlers,
  ...dashboardExtrasHandlers
]
