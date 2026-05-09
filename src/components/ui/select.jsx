import { createContext, useContext, useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const SelectCtx = createContext(null)

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false)
  return (
    <SelectCtx.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="stellar-select-root" style={{ position: 'relative', display: 'inline-block' }}>
        {children}
      </div>
    </SelectCtx.Provider>
  )
}

export function SelectTrigger({ className, children, ...props }) {
  const ctx = useContext(SelectCtx)
  return (
    <button
      type="button"
      className={cn('stellar-select-trigger', className)}
      onClick={() => ctx.setOpen((o) => !o)}
      {...props}
    >
      {children}
      <span className="stellar-select-chevron" aria-hidden>▾</span>
    </button>
  )
}

export function SelectValue({ placeholder }) {
  const ctx = useContext(SelectCtx)
  return <span>{ctx.value || placeholder || ''}</span>
}

export function SelectContent({ children, className }) {
  const ctx = useContext(SelectCtx)
  const ref = useRef(null)

  useEffect(() => {
    if (!ctx.open) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        ctx.setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [ctx.open, ctx])

  if (!ctx.open) return null
  return (
    <div ref={ref} className={cn('stellar-select-content', className)}>
      {children}
    </div>
  )
}

export function SelectItem({ value, children, className }) {
  const ctx = useContext(SelectCtx)
  const isActive = ctx.value === value
  return (
    <button
      type="button"
      className={cn('stellar-select-item', isActive && 'stellar-select-item--active', className)}
      onClick={() => {
        ctx.onValueChange?.(value)
        ctx.setOpen(false)
      }}
    >
      {children}
    </button>
  )
}
