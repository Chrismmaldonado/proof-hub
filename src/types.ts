export type AppId = 'analytics' | 'insurance' | 'checkout'

export type EventLevel = 'info' | 'action' | 'success' | 'error'

export interface StreamEvent {
  id: string
  ts: number
  app: AppId | 'hub'
  level: EventLevel
  message: string
  payload?: Record<string, unknown>
}
