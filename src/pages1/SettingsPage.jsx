import { useStellar } from '@/contexts/SettingsContext.jsx'
import { HelpTip } from '@/components/ui/HelpTip.jsx'
import {
  IconCloud,
  IconCompass,
  IconFilm,
  IconGear,
  IconGlobe,
  IconMonitor,
  IconAudio,
} from '@/components/ui/Icons.jsx'

function RowToggle({ label, help, on, onChange }) {
  return (
    <div className="stellar-settings-row">
      <div className="stellar-settings-row-body">
        <div className="stellar-settings-row-label">
          {label}
          {help ? <HelpTip text={help} /> : null}
        </div>
      </div>
      <button
        type="button"
        className={`stellar-toggle${on ? ' stellar-toggle--on' : ''}`}
        onClick={() => onChange(!on)}
        aria-pressed={on}
      />
    </div>
  )
}

export default function SettingsPage() {
  const { t, settings, updateSettings } = useStellar()

  const pickSound = async () => {
    const p = await window.stellar?.selectSoundFile?.()
    if (p) void updateSettings({ clipSoundPath: p })
  }

  const pickFolder = async () => {
    const p = await window.stellar?.selectFolder?.()
    if (p) void updateSettings({ storagePath: p })
  }

  return (
    <div className="stellar-page">
      <h1 className="stellar-page-title">{t('settings.title')}</h1>
      <p className="stellar-page-lead">
        General preferences and application configuration. Hover the{' '}
        <HelpTip text="These hints explain each option in plain language." label="?" /> icons
        anytime.
      </p>

      {settings.cloudSyncEnabled ? (
        <div className="settings-banner">
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconCloud width={20} height={20} />
            Cloud sync active
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'rgba(34,197,94,0.25)',
              color: '#4ade80',
            }}
          >
            Free
          </span>
        </div>
      ) : null}

      <div className="stellar-settings-grid">
        <section className="stellar-setting-block">
          <div className="stellar-setting-head" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconGear width={18} height={18} />
            {t('settings.general')}
          </div>
          <RowToggle
            label="Start minimized"
            help="When on, Stellar starts in the tray or taskbar instead of popping the full window."
            on={!!settings.startMinimized}
            onChange={(v) => void updateSettings({ startMinimized: v })}
          />
          <RowToggle
            label="Start with Windows"
            help="Launches Stellar when you log in so clipping is always ready."
            on={settings.startWithWindows}
            onChange={(v) => void updateSettings({ startWithWindows: v })}
          />
          <div className="stellar-settings-row">
            <div className="settings-row-icon">
              <IconGlobe width={20} height={20} />
            </div>
            <div className="stellar-settings-row-body">
              <div className="stellar-settings-row-label">
                Language
                <HelpTip text="Changes menus and labels. Add more languages in src/lib/i18n.js." />
              </div>
            </div>
            <select
              className="stellar-select"
              value={settings.language}
              onChange={(e) => void updateSettings({ language: e.target.value })}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
          </div>
          <RowToggle
            label="Auto-update"
            help="Checks for new Stellar builds when you open the app (when wired to an update server)."
            on={settings.autoUpdate !== false}
            onChange={(v) => void updateSettings({ autoUpdate: v })}
          />
        </section>

        <section className="stellar-setting-block">
          <div className="stellar-setting-head" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconMonitor width={18} height={18} />
            Appearance
          </div>
          <div className="stellar-settings-row">
            <div className="stellar-settings-row-body">
              <div className="stellar-settings-row-label">
                Theme
                <HelpTip text="Dark themes reduce glare while gaming at night." />
              </div>
            </div>
            <select
              className="stellar-select"
              value={settings.theme}
              onChange={(e) => void updateSettings({ theme: e.target.value })}
            >
              <option value="stellar">Stellar</option>
              <option value="dark">Dark</option>
              <option value="midnight">Midnight</option>
            </select>
          </div>
          <div className="stellar-settings-row">
            <div className="stellar-settings-row-body">
              <div className="stellar-settings-row-label">
                Accent Color
                <HelpTip text="Customize the app's primary color — buttons, highlights, and active states all change." />
              </div>
              <div className="stellar-field-help">Pick a preset or enter any hex color.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {[
                { hex: '#7c5dfa', name: 'Purple' },
                { hex: '#3b82f6', name: 'Blue' },
                { hex: '#ec4899', name: 'Pink' },
                { hex: '#22c55e', name: 'Green' },
                { hex: '#f59e0b', name: 'Amber' },
                { hex: '#ef4444', name: 'Red' },
                { hex: '#06b6d4', name: 'Cyan' },
              ].map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  title={c.name}
                  onClick={() => void updateSettings({ accentColor: c.hex })}
                  className="accent-swatch"
                  style={{
                    background: c.hex,
                    boxShadow: settings.accentColor === c.hex ? `0 0 0 2px var(--card-bg), 0 0 0 4px ${c.hex}` : 'none',
                  }}
                />
              ))}
              <input
                type="color"
                value={settings.accentColor || '#7c5dfa'}
                onChange={(e) => void updateSettings({ accentColor: e.target.value })}
                className="accent-picker-input"
                title="Custom color"
              />
            </div>
          </div>
          <RowToggle
            label="In-game overlay"
            help="Small HUD that stays above your game. You can drag or click-through most of it."
            on={settings.overlayEnabled}
            onChange={(v) => void updateSettings({ overlayEnabled: v })}
          />
        </section>

        <section className="stellar-setting-block">
          <div className="stellar-setting-head" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconAudio width={18} height={18} />
            Notifications
          </div>
          <RowToggle
            label="Desktop notifications"
            help="Windows toast when a clip is saved or when something needs your attention."
            on={settings.desktopNotifications !== false}
            onChange={(v) => void updateSettings({ desktopNotifications: v })}
          />
          <RowToggle
            label="Sound effects"
            help="Plays a short sound when a clip is saved. Pick a custom file below."
            on={settings.clipSoundEnabled}
            onChange={(v) => void updateSettings({ clipSoundEnabled: v })}
          />
          <div className="stellar-settings-row">
            <div className="stellar-settings-row-body">
              <div className="stellar-settings-row-label">
                Clip sound file
                <HelpTip text="Optional WAV/MP3. If empty, Stellar uses a tiny built-in beep." />
              </div>
              <div className="stellar-field-help">{settings.clipSoundPath || 'Not set'}</div>
            </div>
            <button type="button" className="stellar-btn stellar-btn--ghost" onClick={pickSound}>
              Browse…
            </button>
          </div>
        </section>

        <section className="stellar-setting-block">
          <div className="stellar-setting-head" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconFilm width={18} height={18} />
            Storage
          </div>
          <div className="stellar-settings-row">
            <div className="stellar-settings-row-body">
              <div className="stellar-settings-row-label">
                Save location
                <HelpTip text="Folder where new clips are written. Large SSDs are best for high bitrate." />
              </div>
              <div className="stellar-field-help">
                {settings.storagePath || 'Default — Videos/Stellar (when encoder is connected)'}
              </div>
            </div>
            <button type="button" className="stellar-btn stellar-btn--ghost" onClick={pickFolder}>
              Browse…
            </button>
          </div>
        </section>

        <section className="stellar-setting-block">
          <div className="stellar-setting-head" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconCompass width={18} height={18} />
            Online & social
          </div>
          <RowToggle
            label="Online mode"
            help="Turns on Discover, richer profiles, and future cloud features."
            on={settings.onlineModeEnabled}
            onChange={(v) => void updateSettings({ onlineModeEnabled: v })}
          />
          <div className="stellar-settings-row">
            <div className="stellar-settings-row-body">
              <div className="stellar-settings-row-label">
                Default clip privacy
                <HelpTip text="New clips start as public or private before you upload or share."
                />
              </div>
            </div>
            <select
              className="stellar-select"
              value={settings.clipPrivacy || 'public'}
              onChange={(e) => void updateSettings({ clipPrivacy: e.target.value })}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <RowToggle
            label="Show on community feed"
            help="Allows eligible clips to appear in Discover for other players."
            on={!!settings.showOnCommunityFeed}
            onChange={(v) => void updateSettings({ showOnCommunityFeed: v })}
          />
          <RowToggle
            label="Cloud sync"
            help="Reserved for when your Stellar account uploads to the cloud."
            on={settings.cloudSyncEnabled}
            onChange={(v) => void updateSettings({ cloudSyncEnabled: v })}
          />
        </section>

        <section className="stellar-setting-block">
          <div className="stellar-setting-head">Discord</div>
          <RowToggle
            label="Discord Rich Presence"
            help="Shows Stellar on your Discord profile while the Discord app is open. Your build uses electron/discord-config.cjs — add your Discord Application Client ID there once (developers only); no ID is typed inside this UI."
            on={settings.discordRichPresence}
            onChange={(v) => void updateSettings({ discordRichPresence: v })}
          />
          <RowToggle
            label="Show current game"
            help="Puts the active window name in your Discord status line when Stellar detects it."
            on={settings.discordShowGame}
            onChange={(v) => void updateSettings({ discordShowGame: v })}
          />
          <RowToggle
            label="Show clipping state"
            help="Briefly tells friends you are saving a clip."
            on={settings.discordShowClipping}
            onChange={(v) => void updateSettings({ discordShowClipping: v })}
          />
        </section>
      </div>
    </div>
  )
}
