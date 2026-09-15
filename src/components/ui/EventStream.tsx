import { AnimatePresence, motion } from 'framer-motion'
import { Eraser, Radio } from 'lucide-react'
import { useEventLog } from '../../context/EventLogContext'
import { cn } from '../../lib/cn'

const levelColor: Record<string, string> = {
  info: 'text-slate-500 dark:text-zinc-400',
  action: 'text-sky-600 dark:text-sky-400',
  success: 'text-emerald-600 dark:text-emerald-400',
  error: 'text-rose-600 dark:text-rose-400',
}

export function EventStream({ open }: { open: boolean }) {
  const { events, clear } = useEventLog()

  return (
    <AnimatePresence>
      {open ? (
        <motion.section
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-t border-[var(--color-line)] bg-[var(--color-surface-elevated)]"
        >
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-tight">
              <Radio className="size-3.5 text-[var(--color-accent)]" />
              Event stream
            </div>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-[var(--color-ink-muted)] hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              <Eraser className="size-3" />
              Clear
            </button>
          </div>
          <div className="max-h-40 space-y-1 overflow-y-auto px-4 pb-3 font-mono text-[11px]">
            {events.length === 0 ? (
              <p className="text-[var(--color-ink-muted)]">No events yet.</p>
            ) : (
              events.map((e) => (
                <div key={e.id} className="flex flex-wrap gap-x-2 gap-y-0.5">
                  <span className="text-slate-400 dark:text-zinc-500">
                    {new Date(e.ts).toLocaleTimeString()}
                  </span>
                  <span className="uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    {e.app}
                  </span>
                  <span className={cn('font-medium', levelColor[e.level])}>
                    {e.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  )
}
