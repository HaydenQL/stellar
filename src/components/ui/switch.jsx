import { cn } from '@/lib/utils'

export function Switch({ checked = false, onCheckedChange, className, ...props }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn('stellar-toggle', checked && 'stellar-toggle--on', className)}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    />
  )
}
