import { useCallback, useEffect, useState } from 'react'

export default function HotkeyRecorder({ onRecord, onCancel }) {
  const [keys, setKeys] = useState([])

  const handleKeyDown = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const parts = []
    if (e.ctrlKey) parts.push('Ctrl')
    if (e.altKey) parts.push('Alt')
    if (e.shiftKey) parts.push('Shift')
    let k = e.key
    if (['Control', 'Alt', 'Shift', 'Meta'].includes(k)) return
    if (k === 'Escape') { onCancel?.(); return }
    if (k === ' ') k = 'Space'
    if (k.length === 1) k = k.toUpperCase()
    if (/^F\d{1,2}$/i.test(k)) k = k.toUpperCase()
    parts.push(k)
    setKeys(parts)
    onRecord?.(parts)
  }, [onRecord, onCancel])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="flex items-center gap-2">
      <kbd className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-xs font-mono font-medium text-primary animate-pulse min-w-[4rem] text-center">
        {keys.length > 0 ? keys.join(' + ') : 'Press keys…'}
      </kbd>
      <button
        type="button"
        onClick={onCancel}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        Cancel
      </button>
    </div>
  )
}
