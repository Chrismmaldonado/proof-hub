import { useId, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type RangeSliderProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> & {
  className?: string
}

export function RangeSlider({
  min = 0,
  max = 100,
  value,
  className,
  ...rest
}: RangeSliderProps) {
  const id = useId()
  const lo = Number(min)
  const hi = Number(max)
  const val = Number(value ?? lo)
  const pct = hi === lo ? 0 : Math.min(100, Math.max(0, ((val - lo) / (hi - lo)) * 100))

  return (
    <div className={cn('relative pt-1 pb-0.5', className)}>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        style={{ ['--range-fill' as string]: `${pct}%` }}
        className="proof-range"
        {...rest}
      />
    </div>
  )
}
