import { authHandlers } from '@/mocks/handlers/authHandlers'
import { homeHandlers } from '@/mocks/handlers/homeHandlers'
import { dashboardExtrasHandlers } from '@/mocks/handlers/dashboardExtrasHandlers'

export const handlers = [...authHandlers, ...homeHandlers, ...dashboardExtrasHandlers]
