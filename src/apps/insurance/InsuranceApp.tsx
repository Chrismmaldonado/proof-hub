import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { TechBadge } from '../../components/ui/TechBadge'
import { formatCurrency } from '../../lib/format'
import { cn } from '../../lib/cn'
import { type Industry, useInsuranceCalc } from './useInsuranceCalc'

const INDUSTRIES: Industry[] = [
  'Professional Services',
  'Retail',
  'Construction',
  'Healthcare',
  'Technology',
  'Hospitality',
]

const DEDUCTIBLES = [500, 1000, 2500, 5000, 10000]

export function InsuranceApp() {
  const {
    state,
    premium,
    step1Valid,
    step2Valid,
    step3Valid,
    patch,
    goNext,
    goBack,
  } = useInsuranceCalc()

  const canNext =
    state.step === 1 ? step1Valid : state.step === 2 ? step2Valid : false

  return (
    <div className="relative space-y-5">
      <header className="pr-0 md:pr-52">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          App 02
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
          Commercial insurance calculator
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--color-ink-muted)]">
          Three-step wizard with live premium math, validation gates, and tooltips —
          pure client-side formula, no pricing API.
        </p>
      </header>

      <div className="pointer-events-none absolute right-0 top-0 z-10 hidden md:block">
        <TechBadge
          title="Technical details"
          items={[
            'Wizard state machine in useInsuranceCalc',
            'sqrt(revenue) + headcount + coverage factors',
            'Industry multipliers + location risk toggle',
            'Deductible discount curve (floored at 0.72×)',
            'Next disabled until step validators pass',
          ]}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-4 sm:p-5">
          <ol className="mb-5 flex gap-2">
            {[1, 2, 3].map((n) => (
              <li
                key={n}
                className={cn(
                  'flex-1 rounded-full py-1.5 text-center text-[11px] font-semibold',
                  state.step === n
                    ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300'
                    : state.step > n
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500',
                )}
              >
                Step {n}
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait">
            {state.step === 1 ? (
              <motion.div
                key="s1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold">Business profile</h3>
                <label className="block text-xs">
                  <span className="text-[var(--color-ink-muted)]">Industry</span>
                  <select
                    value={state.industry}
                    onChange={(e) =>
                      patch(
                        { industry: e.target.value as Industry | '' },
                        `Industry → ${e.target.value || '(none)'}`,
                      )
                    }
                    className="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-transparent px-2.5 py-2.5 text-sm outline-none focus:border-sky-500"
                  >
                    <option value="">Select industry…</option>
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                  {!state.industry ? (
                    <span className="mt-1 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                      <Info className="size-3" />
                      Industry is required
                    </span>
                  ) : null}
                </label>
                <label className="block text-xs">
                  <div className="flex justify-between text-[var(--color-ink-muted)]">
                    <span>Annual revenue</span>
                    <span className="font-medium text-[var(--color-ink)]">
                      {formatCurrency(state.annualRevenue, true)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5_000_000}
                    step={25_000}
                    value={state.annualRevenue}
                    onChange={(e) =>
                      patch(
                        { annualRevenue: Number(e.target.value) },
                        `Revenue → ${e.target.value}`,
                      )
                    }
                    className="mt-2 w-full accent-sky-500"
                  />
                  {state.annualRevenue <= 0 ? (
                    <span className="mt-1 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                      <Info className="size-3" />
                      Revenue must be greater than 0
                    </span>
                  ) : null}
                </label>
              </motion.div>
            ) : null}

            {state.step === 2 ? (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold">Risk variables</h3>
                <label className="block text-xs">
                  <div className="flex justify-between text-[var(--color-ink-muted)]">
                    <span>Employees</span>
                    <span className="font-medium text-[var(--color-ink)]">
                      {state.employees}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={250}
                    step={1}
                    value={state.employees}
                    onChange={(e) =>
                      patch(
                        { employees: Number(e.target.value) },
                        `Employees → ${e.target.value}`,
                      )
                    }
                    className="mt-2 w-full accent-sky-500"
                  />
                  {state.employees < 1 ? (
                    <span className="mt-1 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                      <Info className="size-3" />
                      At least 1 employee required
                    </span>
                  ) : null}
                </label>
                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[var(--color-line)] px-3 py-3 text-sm">
                  <span>
                    High-risk location
                    <span className="mt-0.5 block text-[11px] text-[var(--color-ink-muted)]">
                      Flood / coastal / wildfire zones (+28%)
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={state.highRiskLocation}
                    onChange={(e) =>
                      patch(
                        { highRiskLocation: e.target.checked },
                        `High-risk location → ${e.target.checked}`,
                      )
                    }
                    className="size-4 accent-sky-500"
                  />
                </label>
                <label className="block text-xs">
                  <div className="flex justify-between text-[var(--color-ink-muted)]">
                    <span>Coverage limit</span>
                    <span className="font-medium text-[var(--color-ink)]">
                      {formatCurrency(state.coverageLimit, true)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={250_000}
                    max={5_000_000}
                    step={50_000}
                    value={state.coverageLimit}
                    onChange={(e) =>
                      patch(
                        { coverageLimit: Number(e.target.value) },
                        `Coverage → ${e.target.value}`,
                      )
                    }
                    className="mt-2 w-full accent-sky-500"
                  />
                </label>
              </motion.div>
            ) : null}

            {state.step === 3 ? (
              <motion.div
                key="s3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold">Deductible selection</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {DEDUCTIBLES.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() =>
                        patch({ deductible: d }, `Deductible → ${d}`)
                      }
                      className={cn(
                        'rounded-lg border px-3 py-3 text-left text-sm transition',
                        state.deductible === d
                          ? 'border-sky-500 bg-sky-500/10'
                          : 'border-[var(--color-line)] hover:border-slate-300 dark:hover:border-zinc-600',
                      )}
                    >
                      <span className="font-semibold">{formatCurrency(d)}</span>
                      <span className="mt-0.5 block text-[11px] text-[var(--color-ink-muted)]">
                        Higher deductible lowers premium
                      </span>
                    </button>
                  ))}
                </div>
                {!step3Valid ? (
                  <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                    <Info className="size-3" />
                    Select a deductible of at least $500
                  </span>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={goBack}
              disabled={state.step === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-line)] px-3 py-2 text-sm disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
              Back
            </button>
            {state.step < 3 ? (
              <span className="group relative">
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canNext}
                  className="inline-flex items-center gap-1 rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-zinc-700"
                >
                  Next
                  <ChevronRight className="size-4" />
                </button>
                {!canNext ? (
                  <span className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-48 rounded-md bg-zinc-900 px-2 py-1.5 text-[11px] text-white group-hover:block dark:bg-zinc-100 dark:text-zinc-900">
                    {state.step === 1
                      ? 'Select industry and set revenue above 0'
                      : 'Set employees ≥ 1 and coverage ≥ $250k'}
                  </span>
                ) : null}
              </span>
            ) : (
              <span className="text-xs text-[var(--color-ink-muted)]">
                Demo complete — premium updates live
              </span>
            )}
          </div>
        </div>

        <aside className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-5 lg:sticky lg:top-4 lg:self-start">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
            Estimated monthly premium
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={premium}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="mt-2 text-4xl font-semibold tracking-tight tabular-nums"
            >
              {formatCurrency(premium)}
            </motion.p>
          </AnimatePresence>
          <p className="mt-2 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
            Illustrative quote engine for portfolio demos — not a real insurance
            offer.
          </p>
        </aside>
      </div>

      <div className="md:hidden">
        <TechBadge
          title="Technical details"
          items={[
            'Wizard state machine in useInsuranceCalc',
            'Client-side premium formula with validation gates',
          ]}
        />
      </div>
    </div>
  )
}
