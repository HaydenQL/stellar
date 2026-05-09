import { useCallback, useEffect, useState } from 'react'
import { useStellar } from '@/contexts/SettingsContext.jsx'
import { HelpTip } from '@/components/ui/HelpTip.jsx'
import {
  IconGamepad,
  IconMonitor,
  IconSearch,
  IconVideoCam,
} from '@/components/ui/Icons.jsx'

export default function CaptureSource() {
  const { t, settings, updateSettings } = useStellar()
  const [apps, setApps] = useState([])
  const [icons, setIcons] = useState({})
  const [q, setQ] = useState('')

  const load = useCallback(async () => {
    const list = (await window.stellar?.getRunningGames?.()) || []
    setApps(Array.isArray(list) ? list : [])
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load()
    }, 0)
    return () => window.clearTimeout(id)
  }, [load])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      for (const row of apps) {
        if (cancelled || !row.exePath) continue
        const dataUrl = await window.stellar?.getFileIcon?.(row.exePath)
        if (cancelled || !dataUrl) continue
        setIcons((prev) => (prev[row.exePath] ? prev : { ...prev, [row.exePath]: dataUrl }))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [apps])

  const filtered = apps.filter((a) => {
    const s = `${a.name} ${a.exePath}`.toLowerCase()
    return !q || s.includes(q.toLowerCase())
  })

  const gameMode = settings.captureMode !== 'screen'

  return (
    <div className="stellar-page">
      <h1 className="stellar-page-title">{t('capture.title')}</h1>
      <p className="stellar-page-lead">
        Choose what Stellar records — a specific game or your entire screen.
      </p>

      <div className="capture-mode-row">
        <button
          type="button"
          className={`capture-mode-btn${gameMode ? ' capture-mode-btn--on' : ''}`}
          onClick={() => void updateSettings({ captureMode: 'game' })}
        >
          <IconGamepad width={20} height={20} /> Game capture
        </button>
        <button
          type="button"
          className={`capture-mode-btn${!gameMode ? ' capture-mode-btn--on' : ''}`}
          onClick={() => void updateSettings({ captureMode: 'screen' })}
        >
          <IconMonitor width={20} height={20} /> Screen capture
        </button>
      </div>

      <div className="stellar-setting-block" style={{ marginBottom: 18 }}>
        <div className="stellar-setting-head" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconSearch width={16} height={16} />
          Detected applications
          <HelpTip text="List is built from running programs on your PC. Icons come from each .exe file automatically on Windows." />
        </div>
        <div className="clip-lib-search" style={{ marginBottom: 12 }}>
          <IconSearch width={18} height={18} style={{ opacity: 0.5 }} />
          <input
            placeholder="Search running applications…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="stellar-panel" style={{ maxHeight: 280, overflow: 'auto' }}>
          {filtered.length === 0 ? (
            <div className="stellar-clip-row">
              <span className="stellar-clip-sub">
                No apps found yet. Open a game, then press refresh — or grant permissions if prompted.
              </span>
              <button type="button" className="stellar-link" onClick={() => void load()}>
                Refresh
              </button>
            </div>
          ) : (
            filtered.map((row) => (
              <div key={row.exePath} className="stellar-clip-row">
                {icons[row.exePath] ? (
                  <img
                    src={icons[row.exePath]}
                    alt=""
                    className="app-row-icon"
                    width={36}
                    height={36}
                  />
                ) : (
                  <div className="app-row-icon" />
                )}
                <div className="stellar-clip-meta">
                  <div className="stellar-clip-title">{row.name}</div>
                  <div className="stellar-clip-sub" style={{ fontSize: 11 }}>
                    {row.exePath}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="stellar-setting-block">
        <div className="stellar-setting-head" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconVideoCam width={18} height={18} />
          Recording settings
          <HelpTip text="These options are saved now so your encoder can use them later. They do not record by themselves yet." />
        </div>
        <div className="stellar-field" style={{ borderTop: 'none', paddingTop: 0 }}>
          <div className="stellar-field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Resolution
            <HelpTip text="Output height of the saved clip. Higher uses more GPU and disk." />
          </div>
          <select
            className="stellar-select"
            value={settings.recordingResolution || '1080p'}
            onChange={(e) => void updateSettings({ recordingResolution: e.target.value })}
          >
            <option value="720p">720p (HD)</option>
            <option value="1080p">1080p (FHD)</option>
            <option value="1440p">1440p (QHD)</option>
          </select>
        </div>
        <div className="stellar-field">
          <div className="stellar-field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Frame rate
            <HelpTip text="Frames per second for the clip file. 60 is smooth; 30 uses less space." />
          </div>
          <select
            className="stellar-select"
            value={String(settings.recordingFps || 60)}
            onChange={(e) => void updateSettings({ recordingFps: Number(e.target.value) })}
          >
            <option value={30}>30 FPS</option>
            <option value={60}>60 FPS</option>
            <option value={120}>120 FPS</option>
          </select>
        </div>
        <div className="stellar-field">
          <div className="stellar-field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Format
            <HelpTip text="MP4 with H.264 plays everywhere. Other codecs can be added later." />
          </div>
          <select
            className="stellar-select"
            value={settings.recordingFormat || 'mp4'}
            onChange={(e) => void updateSettings({ recordingFormat: e.target.value })}
          >
            <option value="mp4">MP4 (H.264)</option>
            <option value="mkv">MKV</option>
          </select>
        </div>
        <div className="stellar-field">
          <div className="stellar-field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Bitrate (Mbps)
            <HelpTip text="Higher bitrate means sharper video and larger files." />
          </div>
          <input
            className="stellar-input"
            type="range"
            min={5}
            max={50}
            value={settings.bitrateMbps ?? 15}
            onChange={(e) => void updateSettings({ bitrateMbps: Number(e.target.value) })}
          />
          <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{settings.bitrateMbps ?? 15}</span>
        </div>
        <div className="stellar-field">
          <div className="stellar-field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Clip length
            <HelpTip text="How many seconds Stellar keeps in the rolling buffer before you hit save." />
          </div>
          <select
            className="stellar-select"
            value={String(settings.bufferSeconds)}
            onChange={(e) => void updateSettings({ bufferSeconds: Number(e.target.value) })}
          >
            {[15, 30, 60, 90, 120, 180].map((n) => (
              <option key={n} value={n}>
                {n} seconds
              </option>
            ))}
          </select>
        </div>
        <div className="stellar-field">
          <div>
            <div className="stellar-field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              Auto-record on launch
              <HelpTip text="When implemented, Stellar starts buffering as soon as you open the app." />
            </div>
          </div>
          <button
            type="button"
            className={`stellar-toggle${settings.autoRecordOnLaunch ? ' stellar-toggle--on' : ''}`}
            onClick={() => void updateSettings({ autoRecordOnLaunch: !settings.autoRecordOnLaunch })}
            aria-pressed={settings.autoRecordOnLaunch}
          />
        </div>
      </div>
    </div>
  )
}
