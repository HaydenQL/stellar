import { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

const TabsCtx = createContext(null)

export function Tabs({ defaultValue, value, onValueChange, children, className, ...props }) {
  const [internal, setInternal] = useState(defaultValue || '')
  const current = value ?? internal
  const change = onValueChange ?? setInternal
  return (
    <TabsCtx.Provider value={{ value: current, onChange: change }}>
      <div className={cn('stellar-tabs', className)} {...props}>
        {children}
      </div>
    </TabsCtx.Provider>
  )
}

export function TabsList({ children, className, ...props }) {
  return (
    <div className={cn('stellar-tabs-list', className)} role="tablist" {...props}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className, ...props }) {
  const ctx = useContext(TabsCtx)
  const isActive = ctx.value === value
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={cn('stellar-tab-trigger', isActive && 'stellar-tab-trigger--active', className)}
      onClick={() => ctx.onChange(value)}
      {...props}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className, ...props }) {
  const ctx = useContext(TabsCtx)
  if (ctx.value !== value) return null
  return (
    <div role="tabpanel" className={cn('stellar-tab-content', className)} {...props}>
      {children}
    </div>
  )
}
