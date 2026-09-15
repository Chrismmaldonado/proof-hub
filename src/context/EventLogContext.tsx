import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppId, EventLevel, StreamEvent } from '../types'

interface EventLogContextValue {
  events: StreamEvent[]
  log: (
    app: AppId | 'hub',
    message: string,
    level?: EventLevel,
    payload?: Record<string, unknown>,
  ) => void
  clear: () => void
}

const EventLogContext = createContext<EventLogContextValue | null>(null)

let seq = 0

export function EventLogProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<StreamEvent[]>([
    {
      id: 'boot',
      ts: Date.now(),
      app: 'hub',
      level: 'info',
      message: 'Proof Hub mounted — three capability demos ready',
    },
  ])

  const log = useCallback(
    (
      app: AppId | 'hub',
      message: string,
      level: EventLevel = 'info',
      payload?: Record<string, unknown>,
    ) => {
      const entry: StreamEvent = {
        id: `evt-${++seq}-${Date.now()}`,
        ts: Date.now(),
        app,
        level,
        message,
        payload,
      }
      setEvents((prev) => [entry, ...prev].slice(0, 80))
      const tag = `[${app}/${level}] ${message}`
      if (level === 'error') console.warn(tag, payload ?? '')
      else console.log(tag, payload ?? '')
    },
    [],
  )

  const clear = useCallback(() => setEvents([]), [])

  const value = useMemo(() => ({ events, log, clear }), [events, log, clear])

  return (
    <EventLogContext.Provider value={value}>{children}</EventLogContext.Provider>
  )
}

export function useEventLog() {
  const ctx = useContext(EventLogContext)
  if (!ctx) throw new Error('useEventLog must be used within EventLogProvider')
  return ctx
}
