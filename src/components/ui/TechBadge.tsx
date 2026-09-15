import { Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

interface TechBadgeProps {
  title: string
  items: string[]
  className?: string
}

export function TechBadge({ title, items, className }: TechBadgeProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'pointer-events-auto max-w-xs rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-elevated)]/95 p-3 shadow-lg backdrop-blur',
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-tight text-[var(--color-ink)]">
        <Info className="size-3.5 text-[var(--color-accent)]" />
        {title}
      </div>
      <ul className="space-y-1 text-[11px] leading-snug text-[var(--color-ink-muted)]">
        {items.map((item) => (
          <li key={item} className="flex gap-1.5">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.aside>
  )
}
