import { cn } from '@/lib/utils'

export function Progress({ value = 0, className, ...props }) {
  return (
    <div className={cn('stellar-progress', className)} {...props}>
      <div
        className="stellar-progress-bar"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}
