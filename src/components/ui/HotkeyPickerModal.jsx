import { useCallback, useEffect, useRef, useState } from 'react'

function partsFromEvent(e) {
  const keys = []
  if (e.ctrlKey) keys.push('Ctrl')
  if (e.altKey) keys.push('Alt')
  if (e.shiftKey) keys.push('Shift')
  if (e.metaKey) keys.push('CommandOrControl')
  let k = e.key
  if (k === ' ') k = 'Space'
  if (k.length === 1) k = k.toUpperCase()
  if (/^F\d{1,2}$/i.test(k)) k = k.toUpperCase()
  if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return null
  keys.push(k)
  return keys.join('+')
}

function HotkeyPickerInner({ title, initialValue, onClose, onSave }) {
  const [capture, setCapture] = useState(initialValue || '')
  const ref = useRef(null)

  useEffect(() => {
    const t = window.setTimeout(() => ref.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const onKeyDown = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const combo = partsFromEvent(e)
    if (combo) setCapture(combo.replace(/CommandOrControl/g, 'Ctrl'))
  }, [])

  return (
    <div className="stellar-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="stellar-modal"
        role="dialog"
        aria-labelledby="hk-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="hk-title" className="stellar-modal-title">
          {title}
        </h2>
        <p className="stellar-modal-lead">
          Press your new keys. Esc cancels. Single keys like F9 or combos like Ctrl+Shift+R.
        </p>
        <div
          ref={ref}
          tabIndex={0}
          className="stellar-hotkey-capture"
          onKeyDown={onKeyDown}
        >
          {capture || 'Listening…'}
        </div>
        <div className="stellar-modal-actions">
          <button type="button" className="stellar-btn stellar-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="stellar-btn stellar-btn--primary"
            disabled={!capture}
            onClick={() => {
              onSave(capture)
              onClose()
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export function HotkeyPickerModal({ open, title, initialValue, onClose, onSave }) {
  if (!open) return null
  return (
    <HotkeyPickerInner
      key={initialValue}
      title={title}
      initialValue={initialValue}
      onClose={onClose}
      onSave={onSave}
    />
  )
}
