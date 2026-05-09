import { cn } from '@/lib/utils'

const variants = {
  default: 'stellar-badge',
  secondary: 'stellar-badge stellar-badge--secondary',
  outline: 'stellar-badge stellar-badge--outline',
  destructive: 'stellar-badge stellar-badge--destructive',
}

export function Badge({ className, variant = 'default', children, ...props }) {
  return (
    <span className={cn(variants[variant] || variants.default, className)} {...props}>
      {children}
    </span>
  )
}
