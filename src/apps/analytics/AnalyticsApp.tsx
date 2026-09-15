import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw, Search } from 'lucide-react'
import { TechBadge } from '../../components/ui/TechBadge'
import { formatCurrency, formatDate, formatPercent } from '../../lib/format'
import { cn } from '../../lib/cn'
import type { Region, TxStatus } from './mockData'
import { RevenueChart } from './RevenueChart'
import { useAnalytics } from './useAnalytics'

const REGIONS: Region[] = ['North America', 'EMEA', 'APAC']
const STATUSES: TxStatus[] = ['completed', 'pending', 'failed']

export function AnalyticsApp() {
  const {
    allCount,
    filters,
    filtered,
    kpis,
    series,
    update,
    toggleRegion,
    toggleStatus,
    reset,
    sample,
  } = useAnalytics()

  return (
    <div className="relative space-y-5">
      <header className="pr-0 md:pr-52">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          App 01
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
          Enterprise analytics
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--color-ink-muted)]">
          {allCount} mock B2B SaaS transactions — multi-select filters, fuzzy client
          search, live KPIs, and an SVG revenue trend.
        </p>
      </header>

      <div className="pointer-events-none absolute right-0 top-0 z-10 hidden md:block">
        <TechBadge
          title="Technical details"
          items={[
            'Client-side state in useAnalytics hook',
            'Deterministic seeded mock of 500 rows',
            'Fuzzy subsequence search on clientName',
            'Pure SVG chart — no chart library',
            'Aggregations recompute from filtered set',
          ]}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Total filtered revenue', value: formatCurrency(kpis.revenue) },
          { label: 'Avg transaction', value: formatCurrency(kpis.avg) },
          { label: 'Success rate', value: formatPercent(kpis.successRate) },
        ].map((kpi) => (
          <motion.div
            key={kpi.label}
            layout
            className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-4"
          >
            <p className="text-xs text-[var(--color-ink-muted)]">{kpi.label}</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={kpi.value}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1 text-2xl font-semibold tracking-tight"
              >
                {kpi.value}
              </motion.p>
            </AnimatePresence>
            <p className="mt-1 text-[11px] text-[var(--color-ink-muted)]">
              {kpis.count} of {allCount} rows
            </p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold tracking-tight">Filters</h3>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[var(--color-ink-muted)] hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <RotateCcw className="size-3" />
            Reset
          </button>
        </div>

        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
              Region
            </p>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRegion(r)}
                  className={cn(
                    'rounded-lg border px-2.5 py-1.5 text-xs transition',
                    filters.regions.includes(r)
                      ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300'
                      : 'border-[var(--color-line)] text-[var(--color-ink-muted)] hover:border-slate-300 dark:hover:border-zinc-600',
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStatus(s)}
                  className={cn(
                    'rounded-lg border px-2.5 py-1.5 text-xs capitalize transition',
                    filters.statuses.includes(s)
                      ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300'
                      : 'border-[var(--color-line)] text-[var(--color-ink-muted)] hover:border-slate-300 dark:hover:border-zinc-600',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="block text-xs">
            <span className="text-[var(--color-ink-muted)]">From</span>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => update('dateFrom', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-transparent px-2.5 py-2 text-sm outline-none focus:border-sky-500"
            />
          </label>
          <label className="block text-xs">
            <span className="text-[var(--color-ink-muted)]">To</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => update('dateTo', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-transparent px-2.5 py-2 text-sm outline-none focus:border-sky-500"
            />
          </label>
          <label className="block text-xs sm:col-span-1">
            <span className="text-[var(--color-ink-muted)]">Client search</span>
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--color-ink-muted)]" />
              <input
                type="search"
                placeholder="Fuzzy match…"
                value={filters.clientQuery}
                onChange={(e) => update('clientQuery', e.target.value)}
                className="w-full rounded-lg border border-[var(--color-line)] bg-transparent py-2 pl-8 pr-2.5 text-sm outline-none focus:border-sky-500"
              />
            </div>
          </label>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold tracking-tight">
          Revenue trend (filtered)
        </h3>
        <RevenueChart series={series} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-elevated)]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--color-line)] text-[11px] uppercase tracking-wide text-[var(--color-ink-muted)]">
            <tr>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Client</th>
              <th className="px-3 py-2 font-medium">Region</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {sample.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-[var(--color-line)]/70 last:border-0"
              >
                <td className="whitespace-nowrap px-3 py-2 text-[var(--color-ink-muted)]">
                  {formatDate(tx.date)}
                </td>
                <td className="px-3 py-2 font-medium">{tx.clientName}</td>
                <td className="px-3 py-2 text-[var(--color-ink-muted)]">{tx.region}</td>
                <td className="px-3 py-2 capitalize">{tx.status}</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatCurrency(tx.revenue)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-[var(--color-ink-muted)]"
                >
                  No rows match the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <p className="border-t border-[var(--color-line)] px-3 py-2 text-[11px] text-[var(--color-ink-muted)]">
          Showing latest {Math.min(12, filtered.length)} of {filtered.length} filtered
          rows
        </p>
      </div>

      <div className="md:hidden">
        <TechBadge
          title="Technical details"
          items={[
            'Client-side state in useAnalytics hook',
            'Deterministic seeded mock of 500 rows',
            'Fuzzy subsequence search on clientName',
            'Pure SVG chart — no chart library',
          ]}
        />
      </div>
    </div>
  )
}
