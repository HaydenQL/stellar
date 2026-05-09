import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useStellar } from '@/contexts/SettingsContext.jsx'
import { HotkeyPickerModal } from '@/components/ui/HotkeyPickerModal.jsx'
import {
  IconAudio,
  IconBolt,
  IconChevron,
  IconCloud,
  IconCompass,
  IconFilm,
  IconGear,
  IconHome,
  IconKeyboard,
  IconMonitor,
  IconStarLogo,
} from '@/components/ui/Icons.jsx'

const primaryBase = [
  { to: '/', icon: IconHome, labelKey: 'nav.dashboard', end: true },
  { to: '/clips', icon: IconFilm, labelKey: 'nav.clips' },
]

const discoverItem = { to: '/discover', icon: IconCompass, labelKey: 'nav.discover' }

const recording = [
  { to: '/capture', icon: IconMonitor, labelKey: 'nav.capture' },
  { to: '/hotkeys', icon: IconKeyboard, labelKey: 'nav.hotkeys' },
  { to: '/audio', icon: IconAudio, labelKey: 'nav.audio' },
]

const system = [
  { to: '/performance', icon: IconBolt, labelKey: 'nav.performance' },
  { to: '/settings', icon: IconGear, labelKey: 'nav.settings' },
]

export function Sidebar() {
  const { t, settings, simulateClip, saveHotkey, gameReady, currentGame } = useStellar()
  const navigate = useNavigate()
  const [version, setVersion] = useState('')
  const [hotkeyOpen, setHotkeyOpen] = useState(false)

  useEffect(() => {
    window.stellar?.getAppVersion?.().then(setVersion).catch(() => {})
  }, [])

  const planLabel =
    settings.plan === 'free' ? t('plan.free') : String(settings.plan)

  const clipKey = settings.hotkeys?.saveClip || settings.hotkeyClip || 'F9'

  const statusTitle = gameReady ? t('status.ready') : 'Waiting for game…'
  const statusSub = gameReady
    ? (currentGame.owner || currentGame.title || 'Focused app').slice(0, 42)
    : 'Click to choose an app to clip'

  const initial = (settings.profileTag || 'Y').trim().charAt(0).toUpperCase()

  return (
    <aside className="stellar-sidebar">
      <div className="stellar-brand">
        <IconStarLogo />
        <div className="stellar-brand-text">
          <div className="stellar-brand-title-row">
            <span className="stellar-brand-name">Stellar</span>
            <button
              type="button"
              className="stellar-cloud-btn"
              title="Cloud & sync"
              onClick={() => navigate('/settings')}
            >
              <IconCloud width={16} height={16} />
            </button>
          </div>
          <span className="stellar-brand-sub">{t('brand.sub')}</span>
        </div>
      </div>

      <div className="stellar-nav-scroll">
        {[...primaryBase, ...(settings.onlineModeEnabled !== false ? [discoverItem] : [])].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `stellar-nav-item${isActive ? ' stellar-nav-item--active' : ''}`
            }
          >
            <item.icon width={18} height={18} />
            <span>{t(item.labelKey)}</span>
            <span className="stellar-nav-dot" />
          </NavLink>
        ))}

        <div className="stellar-nav-group-label">RECORDING</div>
        {recording.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `stellar-nav-item${isActive ? ' stellar-nav-item--active' : ''}`
            }
          >
            <item.icon width={18} height={18} />
            <span>{t(item.labelKey)}</span>
            <span className="stellar-nav-dot" />
          </NavLink>
        ))}

        <div className="stellar-nav-group-label">SYSTEM</div>
        {system.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `stellar-nav-item${isActive ? ' stellar-nav-item--active' : ''}`
            }
          >
            <item.icon width={18} height={18} />
            <span>{t(item.labelKey)}</span>
            <span className="stellar-nav-dot" />
          </NavLink>
        ))}
      </div>

      <div className="stellar-sidebar-bottom">
        <div
          className={`stellar-clip-status${gameReady ? '' : ' stellar-clip-status--idle'}`}
        >
          <button
            type="button"
            className="stellar-clip-status-main"
            onClick={() => {
              if (gameReady) {
                void simulateClip()
              } else {
                navigate('/capture')
              }
            }}
            title={gameReady ? 'Save a clip now (same as your hotkey)' : 'Choose an app to clip'}
          >
            <span className="stellar-clip-status-led" />
            <div className="stellar-clip-status-copy">
              <span className="stellar-clip-status-title">{statusTitle}</span>
              <span className="stellar-clip-status-sub">{statusSub}</span>
            </div>
          </button>
          <div className="stellar-clip-status-kbd-wrap">
            <button
              type="button"
              className="stellar-clip-status-kbd"
              title="Change clip hotkey"
              onClick={(e) => {
                e.stopPropagation()
                setHotkeyOpen(true)
              }}
            >
              {clipKey}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="stellar-profile"
          onClick={() => navigate('/profile')}
        >
          <div className="stellar-avatar" aria-hidden>
            {settings.profileAvatar ? (
              <img src={settings.profileAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : initial}
          </div>
          <div className="stellar-profile-text">
            <div className="stellar-profile-tag">{settings.profileTag}</div>
            <div className="stellar-profile-plan">{planLabel}</div>
          </div>
          <IconChevron className="stellar-profile-chevron" width={16} height={16} />
        </button>

        {version ? (
          <div className="stellar-profile-plan" style={{ padding: '0 10px' }}>
            v{version}
          </div>
        ) : null}
      </div>

      <HotkeyPickerModal
        open={hotkeyOpen}
        title="Clip hotkey"
        initialValue={clipKey}
        onClose={() => setHotkeyOpen(false)}
        onSave={(combo) => void saveHotkey(combo)}
      />
    </aside>
  )
}
