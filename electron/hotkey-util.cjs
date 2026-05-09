/** Normalize user-facing hotkey strings to Electron accelerator format */
function normalizeAccelerator(raw) {
  if (!raw || typeof raw !== 'string') return ''
  const parts = raw
    .split(/\+/)
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts.length === 0) return ''
  const mapped = parts.map((p) => {
    const low = p.toLowerCase()
    if (low === 'ctrl' || low === 'control') return 'Ctrl'
    if (low === 'shift') return 'Shift'
    if (low === 'alt') return 'Alt'
    if (low === 'cmd' || low === 'command' || low === 'meta' || low === 'win')
      return 'CommandOrControl'
    if (/^f\d{1,2}$/i.test(p)) return p.toUpperCase()
    if (p.length === 1) return p.toUpperCase()
    return p
  })
  return mapped.join('+')
}

module.exports = { normalizeAccelerator }
