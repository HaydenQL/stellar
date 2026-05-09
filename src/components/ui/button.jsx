import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  default: 'stellar-btn stellar-btn--primary',
  outline: 'stellar-btn stellar-btn--outline',
  ghost: 'stellar-btn stellar-btn--ghost',
  secondary: 'stellar-btn stellar-btn--ghost',
  destructive: 'stellar-btn stellar-btn--destructive',
  link: 'stellar-btn stellar-btn--link',
}

const sizes = {
  default: '',
  sm: 'stellar-btn--sm',
  lg: 'stellar-btn--lg',
  icon: 'stellar-btn--icon',
}

export const Button = forwardRef(function Button(
  { className, variant = 'default', size = 'default', children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(variants[variant] || variants.default, sizes[size] || '', className)}
      {...props}
    >
      {children}
    </button>
  )
})
