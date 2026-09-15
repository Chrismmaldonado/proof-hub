import { formatCurrency } from '../../lib/format'

interface Point {
  month: string
  revenue: number
}

export function RevenueChart({ series }: { series: Point[] }) {
  const width = 640
  const height = 220
  const pad = { t: 16, r: 12, b: 32, l: 48 }

  if (series.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-[var(--color-line)] text-sm text-[var(--color-ink-muted)]">
        No revenue in current filter
      </div>
    )
  }

  const max = Math.max(...series.map((p) => p.revenue), 1)
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b

  const coords = series.map((p, i) => {
    const x =
      pad.l + (series.length === 1 ? innerW / 2 : (i / (series.length - 1)) * innerW)
    const y = pad.t + innerH - (p.revenue / max) * innerH
    return { ...p, x, y }
  })

  const line = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' ')
  const area = `${line} L ${coords[coords.length - 1].x} ${pad.t + innerH} L ${coords[0].x} ${pad.t + innerH} Z`

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-3">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[320px]"
        role="img"
        aria-label="Revenue trend chart"
      >
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = pad.t + innerH * (1 - t)
          return (
            <g key={t}>
              <line
                x1={pad.l}
                x2={width - pad.r}
                y1={y}
                y2={y}
                stroke="currentColor"
                className="text-slate-200 dark:text-zinc-800"
                strokeWidth="1"
              />
              <text
                x={pad.l - 8}
                y={y + 3}
                textAnchor="end"
                className="fill-slate-400 dark:fill-zinc-500"
                fontSize="10"
              >
                {formatCurrency(max * t, true)}
              </text>
            </g>
          )
        })}
        <path d={area} fill="url(#revFill)" />
        <path
          d={line}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {coords.map((c) => (
          <circle key={c.month} cx={c.x} cy={c.y} r="3.5" fill="#0284c7" />
        ))}
        {coords
          .filter((_, i) => i % Math.ceil(coords.length / 6) === 0 || i === coords.length - 1)
          .map((c) => (
            <text
              key={`lbl-${c.month}`}
              x={c.x}
              y={height - 10}
              textAnchor="middle"
              className="fill-slate-400 dark:fill-zinc-500"
              fontSize="10"
            >
              {c.month.slice(2)}
            </text>
          ))}
      </svg>
    </div>
  )
}
