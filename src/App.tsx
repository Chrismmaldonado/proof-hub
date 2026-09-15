import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  Calculator,
  CreditCard,
  Menu,
  Moon,
  PanelBottom,
  Sun,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { AnalyticsApp } from './apps/analytics/AnalyticsApp'
import { CheckoutApp } from './apps/checkout/CheckoutApp'
import { InsuranceApp } from './apps/insurance/InsuranceApp'
import { EventStream } from './components/ui/EventStream'
import { EventLogProvider, useEventLog } from './context/EventLogContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { cn } from './lib/cn'
import type { AppId } from './types'

const NAV: {
  id: AppId
  label: string
  short: string
  icon: typeof BarChart3
  blurb: string
}[] = [
  {
    id: 'analytics',
    label: 'Analytics dashboard',
    short: 'Analytics',
    icon: BarChart3,
    blurb: 'Filters, KPIs, SVG trends',
  },
  {
    id: 'insurance',
    label: 'Insurance calculator',
    short: 'Insurance',
    icon: Calculator,
    blurb: 'Wizard + live premium math',
  },
  {
    id: 'checkout',
    label: 'SaaS checkout',
    short: 'Checkout',
    icon: CreditCard,
    blurb: 'Simulated Stripe flow',
  },
]

function Shell() {
  const [app, setApp] = useState<AppId>('analytics')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [streamOpen, setStreamOpen] = useState(true)
  const { theme, toggle } = useTheme()
  const { log } = useEventLog()

  function select(id: AppId) {
    setApp(id)
    setMobileOpen(false)
    log('hub', `Switched to ${id}`, 'action')
  }

  const active = NAV.find((n) => n.id === app)!

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <aside className="sticky top-0 z-30 border-b border-[var(--color-line)] bg-[var(--color-surface-elevated)]/95 backdrop-blur md:flex md:h-dvh md:w-64 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-2 px-4 py-3 md:block md:px-5 md:py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Proof of capability
            </p>
            <h1 className="text-lg font-semibold tracking-tight">Proof Hub</h1>
            <p className="mt-0.5 hidden text-xs text-[var(--color-ink-muted)] md:block">
              Capability demos
            </p>
          </div>
          <div className="flex items-center gap-1 md:mt-4 md:justify-between">
            <button
              type="button"
              onClick={toggle}
              className="rounded-lg border border-[var(--color-line)] p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>
            <button
              type="button"
              className="rounded-lg border border-[var(--color-line)] p-2 md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        <nav
          className={cn(
            'flex-1 space-y-1 px-3 pb-4 md:block',
            mobileOpen ? 'block' : 'hidden',
          )}
        >
          {NAV.map((item) => {
            const Icon = item.icon
            const on = item.id === app
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => select(item.id)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition',
                  on
                    ? 'bg-sky-500/10 text-sky-800 dark:text-sky-200'
                    : 'text-[var(--color-ink-muted)] hover:bg-slate-100 hover:text-[var(--color-ink)] dark:hover:bg-zinc-800',
                )}
              >
                <Icon className={cn('mt-0.5 size-4 shrink-0', on && 'text-sky-600')} />
                <span>
                  <span className="block text-sm font-semibold tracking-tight">
                    {item.short}
                  </span>
                  <span className="block text-[11px] opacity-80">{item.blurb}</span>
                </span>
              </button>
            )
          })}
        </nav>

        <p className="hidden border-t border-[var(--color-line)] px-5 py-3 text-[10px] leading-relaxed text-[var(--color-ink-muted)] md:block">
          Modular React demos — analytics filtering, pricing algorithms, and checkout
          UX. Not live client work.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-[var(--color-line)] px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs text-[var(--color-ink-muted)]">Now viewing</p>
            <p className="text-sm font-semibold tracking-tight">{active.label}</p>
          </div>
          <button
            type="button"
            onClick={() => setStreamOpen((v) => !v)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs',
              streamOpen
                ? 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300'
                : 'border-[var(--color-line)] text-[var(--color-ink-muted)]',
            )}
          >
            <PanelBottom className="size-3.5" />
            Event stream
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={app}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {app === 'analytics' ? <AnalyticsApp /> : null}
              {app === 'insurance' ? <InsuranceApp /> : null}
              {app === 'checkout' ? <CheckoutApp /> : null}
            </motion.div>
          </AnimatePresence>
        </main>

        <EventStream open={streamOpen} />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <EventLogProvider>
        <Shell />
      </EventLogProvider>
    </ThemeProvider>
  )
}
