import { useEffect } from 'react'
import { useStellar } from '@/contexts/SettingsContext.jsx'

export default function OverlayHud() {
  const { t, settings } = useStellar()

  useEffect(() => {
    void window.stellar?.overlaySetIgnoreMouse?.(true)
    return () => {
      void window.stellar?.overlaySetIgnoreMouse?.(false)
    }
  }, [])

  return (
    <div className="stellar-overlay-hud">
      <div
        className="stellar-overlay-card"
        onMouseEnter={() => void window.stellar?.overlaySetIgnoreMouse?.(false)}
        onMouseLeave={() => void window.stellar?.overlaySetIgnoreMouse?.(true)}
        role="status"
      >
        <div className="stellar-status-led" />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{t('overlay.hud')}</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            {t('overlay.ready')} ·{' '}
            {settings.hotkeys?.saveClip || settings.hotkeyClip || 'F9'}
          </div>
        </div>
      </div>
    </div>
  )
}
