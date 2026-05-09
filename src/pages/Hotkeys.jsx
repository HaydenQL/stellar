import { useState } from 'react'
import { useStellar } from '@/contexts/SettingsContext.jsx'
import { HelpTip } from '@/components/ui/HelpTip.jsx'
import { HotkeyPickerModal } from '@/components/ui/HotkeyPickerModal.jsx'
import { IconKeyboard } from '@/components/ui/Icons.jsx'

const defaultBindings = [
  { id: 'saveClip', action: 'Save Clip', description: 'Save the last replay buffer as a clip' },
  { id: 'toggleRecord', action: 'Start/Stop Recording', description: 'Toggle continuous recording' },
  { id: 'screenshot', action: 'Screenshot', description: 'Take a screenshot of the current frame' },
  { id: 'toggleOverlay', action: 'Toggle Overlay', description: 'Show or hide the Stellar overlay' },
  { id: 'bookmark', action: 'Bookmark Moment', description: 'Mark a timestamp in the recording' },
]

export default function Hotkeys() {
  const { settings, updateSettings } = useStellar()
  const [editingId, setEditingId] = useState(null)

  const hotkeys = settings.hotkeys || {
    saveClip: 'F9',
    toggleRecord: 'Ctrl+F9',
    screenshot: 'F10',
    toggleOverlay: 'Ctrl+Shift+O',
    bookmark: 'F8',
  }

  const getKeys = (id) => (hotkeys[id] || '').split('+')

  const handleSave = (id, combo) => {
    const next = { ...hotkeys, [id]: combo }
    void updateSettings({ hotkeys: next })
    setEditingId(null)
  }

  const resetAll = () => {
    void updateSettings({
      hotkeys: {
        saveClip: 'F9',
        toggleRecord: 'Ctrl+F9',
        screenshot: 'F10',
        toggleOverlay: 'Ctrl+Shift+O',
        bookmark: 'F8',
      },
    })
  }

  return (
    <div className="stellar-page">
      <h1 className="stellar-page-title">Hotkeys</h1>
      <p className="stellar-page-lead">
        Customize your keybindings. Click on a binding to change it — supports single keys and combos.
      </p>

      <div className="stellar-setting-block">
        <div className="stellar-setting-block-head">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <IconKeyboard width={16} height={16} /> KEYBINDINGS
          </span>
          <button
            type="button"
            className="stellar-btn stellar-btn--ghost stellar-btn--sm"
            onClick={resetAll}
            style={{ fontSize: 12 }}
          >
            ↺ Reset All
          </button>
        </div>

        {defaultBindings.map((b) => (
          <div key={b.id} className="stellar-settings-row">
            <div className="stellar-settings-row-body">
              <div className="stellar-settings-row-label">{b.action}</div>
              <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>
                {b.description}
              </div>
            </div>
            <button
              type="button"
              className="stellar-hotkey-btn"
              onClick={() => setEditingId(b.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {getKeys(b.id).map((key, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {i > 0 && <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>+</span>}
                  <kbd>{key}</kbd>
                </span>
              ))}
            </button>
          </div>
        ))}
      </div>

      <div
        className="stellar-setting-block"
        style={{ padding: '14px 18px', borderRadius: 12 }}
      >
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          <strong style={{ color: 'var(--text)' }}>Tip:</strong> You can use single keys like F9 or key combos like Ctrl + Shift + F9.
          Click on any binding above to reassign it.
        </p>
      </div>

      <HotkeyPickerModal
        open={editingId !== null}
        title={`Change ${defaultBindings.find((b) => b.id === editingId)?.action || 'hotkey'}`}
        initialValue={editingId ? (hotkeys[editingId] || '') : ''}
        onClose={() => setEditingId(null)}
        onSave={(combo) => editingId && handleSave(editingId, combo)}
      />
    </div>
  )
}