import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  CreditCard,
  Download,
  Loader2,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react'
import { TechBadge } from '../../components/ui/TechBadge'
import { formatCurrency } from '../../lib/format'
import { cn } from '../../lib/cn'
import {
  formatCardNumber,
  formatExpiry,
  useCheckout,
} from './useCheckout'

export function CheckoutApp() {
  const {
    state,
    pricing,
    formValid,
    patch,
    setCycle,
    submit,
    reset,
  } = useCheckout()

  if (state.phase === 'success') {
    return (
      <div className="relative mx-auto max-w-lg space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-500/30 bg-[var(--color-surface-elevated)] p-6 text-center"
        >
          <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Payment confirmed</h2>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Simulated Stripe success — receipt {state.receiptId}
          </p>
          <div className="mt-5 rounded-lg border border-[var(--color-line)] p-4 text-left text-sm">
            <div className="flex justify-between">
              <span>{pricing.plan}</span>
              <span>{formatCurrency(pricing.unit)}</span>
            </div>
            <div className="mt-1 flex justify-between text-[var(--color-ink-muted)]">
              <span>Tax</span>
              <span>{formatCurrency(pricing.tax)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-[var(--color-line)] pt-2 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(pricing.total)}</span>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                const blob = new Blob(
                  [
                    `Receipt ${state.receiptId}\n${pricing.plan}\nTotal: ${formatCurrency(pricing.total)}\n`,
                  ],
                  { type: 'text/plain' },
                )
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${state.receiptId}.txt`
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white"
            >
              <Download className="size-4" />
              Download receipt
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-line)] px-3 py-2 text-sm"
            >
              <RotateCcw className="size-4" />
              Run again
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative space-y-5">
      <header className="pr-0 md:pr-52">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          App 03
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
          Secure SaaS checkout
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--color-ink-muted)]">
          Simulated Stripe Elements — billing toggle, card formatting, loading /
          success / random decline states. No real charges.
        </p>
      </header>

      <div className="pointer-events-none absolute right-0 top-0 z-10 hidden md:block">
        <TechBadge
          title="Technical details"
          items={[
            'Client state machine: idle → loading → success|error',
            'Card number / expiry formatters (no Stripe.js)',
            'Annual vs monthly receipt recomputation',
            '~35% random decline to demo error UI',
            'Webhook-ready shape: receiptId + totals',
          ]}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <CreditCard className="size-4 text-sky-500" />
            Payment method
          </div>

          <AnimatePresence>
            {state.phase === 'error' ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-300"
                role="alert"
              >
                {state.errorMessage}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <label className="block text-xs">
            <span className="text-[var(--color-ink-muted)]">Name on card</span>
            <input
              value={state.name}
              onChange={(e) => patch({ name: e.target.value })}
              autoComplete="cc-name"
              className="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-transparent px-3 py-2.5 text-sm outline-none focus:border-sky-500"
              placeholder="Alex Rivera"
            />
          </label>

          <label className="mt-3 block text-xs">
            <span className="text-[var(--color-ink-muted)]">Card number</span>
            <input
              value={state.cardNumber}
              onChange={(e) =>
                patch({ cardNumber: formatCardNumber(e.target.value) })
              }
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              className="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-transparent px-3 py-2.5 font-mono text-sm tracking-wider outline-none focus:border-sky-500"
            />
          </label>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block text-xs">
              <span className="text-[var(--color-ink-muted)]">Expiry</span>
              <input
                value={state.expiry}
                onChange={(e) =>
                  patch({ expiry: formatExpiry(e.target.value) })
                }
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                className="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-transparent px-3 py-2.5 font-mono text-sm outline-none focus:border-sky-500"
              />
            </label>
            <label className="block text-xs">
              <span className="text-[var(--color-ink-muted)]">CVC</span>
              <input
                value={state.cvc}
                onChange={(e) =>
                  patch({
                    cvc: e.target.value.replace(/\D/g, '').slice(0, 4),
                  })
                }
                inputMode="numeric"
                autoComplete="cc-csc"
                type="password"
                placeholder="•••"
                className="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-transparent px-3 py-2.5 font-mono text-sm outline-none focus:border-sky-500"
              />
            </label>
          </div>

          <button
            type="button"
            disabled={!formValid || state.phase === 'loading'}
            onClick={() => void submit()}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-zinc-700"
          >
            {state.phase === 'loading' ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>Pay {formatCurrency(pricing.total)}</>
            )}
          </button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[var(--color-ink-muted)]">
            <ShieldCheck className="size-3.5" />
            Demo only — no data leaves this browser
          </p>
        </div>

        <aside className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-4 sm:p-5">
          <div className="flex rounded-lg border border-[var(--color-line)] p-1">
            {(['monthly', 'annual'] as const).map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setCycle(cycle)}
                className={cn(
                  'flex-1 rounded-md py-2 text-xs font-semibold capitalize transition',
                  state.cycle === cycle
                    ? 'bg-sky-600 text-white'
                    : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]',
                )}
              >
                {cycle}
              </button>
            ))}
          </div>

          <h3 className="mt-5 text-sm font-semibold tracking-tight">Order summary</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between gap-3">
              <span>
                {pricing.plan}
                <span className="mt-0.5 block text-[11px] text-[var(--color-ink-muted)]">
                  {pricing.label}
                </span>
              </span>
              <span className="tabular-nums">{formatCurrency(pricing.unit)}</span>
            </li>
            <li className="flex justify-between text-[var(--color-ink-muted)]">
              <span>Estimated tax</span>
              <span className="tabular-nums">{formatCurrency(pricing.tax)}</span>
            </li>
            <li className="flex justify-between border-t border-[var(--color-line)] pt-2 text-base font-semibold">
              <span>Due today</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={pricing.total}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="tabular-nums"
                >
                  {formatCurrency(pricing.total)}
                </motion.span>
              </AnimatePresence>
            </li>
          </ul>
        </aside>
      </div>

      <div className="md:hidden">
        <TechBadge
          title="Technical details"
          items={[
            'Simulated payment state machine',
            'No real Stripe keys — UI-only Elements mimic',
          ]}
        />
      </div>
    </div>
  )
}
