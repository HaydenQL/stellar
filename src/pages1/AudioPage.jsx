import { useStellar } from '@/contexts/SettingsContext.jsx'
import { HelpTip } from '@/components/ui/HelpTip.jsx'
import {
  IconAudio,
  IconBrowser,
  IconHeadphones,
  IconMic,
  IconMonitor,
  IconMusic,
} from '@/components/ui/Icons.jsx'

const ICONS = {
  game: IconMonitor,
  mic: IconMic,
  discord: IconHeadphones,
  music: IconMusic,
  system: IconAudio,
  browser: IconBrowser,
}

export default function AudioPage() {
  const { t, settings, updateSettings } = useStellar()

  const sources = settings.audioSources || []
  const active = sources.filter((s) => s.enabled).length

  const patchSource = (id, partial) => {
    const next = sources.map((s) => (s.id === id ? { ...s, ...partial } : s))
    void updateSettings({ audioSources: next })
  }

  return (
    <div className="stellar-page">
      <h1 className="stellar-page-title">{t('audio.title')}</h1>
      <p className="stellar-page-lead">
        Control which audio sources are recorded and optionally export them as separate
        tracks for editing.
      </p>

      <div className="stellar-setting-block" style={{ marginBottom: 18 }}>
        <div className="stellar-field" style={{ border: 'none', padding: 0 }}>
          <div>
            <div className="stellar-field-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconAudio width={18} height={18} />
              Multi-track audio
              <HelpTip text="When on, Stellar can write separate audio files per source so you can mix them in DaVinci, Premiere, etc." />
            </div>
            <div className="stellar-field-help">
              Export separate files for cleaner edits. Uses a little more disk space.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 8,
                background: 'rgba(124,93,250,0.2)',
                color: '#c4b5ff',
              }}
            >
              {settings.audioTrackCount ?? 3} tracks
            </span>
            <button
              type="button"
              className={`stellar-toggle${settings.audioMultiTrack ? ' stellar-toggle--on' : ''}`}
              onClick={() => void updateSettings({ audioMultiTrack: !settings.audioMultiTrack })}
              aria-pressed={settings.audioMultiTrack}
            />
          </div>
        </div>
      </div>

      <div className="stellar-setting-block">
        <div className="stellar-setting-head" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconHeadphones width={18} height={18} />
          Audio sources
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
            {active} of {sources.length} active
          </span>
        </div>
        {sources.map((s) => {
          const Ic = ICONS[s.id] || IconAudio
          return (
            <div key={s.id} className="audio-source-row">
              <Ic width={20} height={20} style={{ opacity: 0.85 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {s.name}
                  <HelpTip text={`Turn ${s.name} on or off for recordings. Slider is a preview of relative volume in the mix.`} />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  {s.separateFile ? (
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>
                      Separate file
                    </span>
                  ) : null}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: 'rgba(255,255,255,0.06)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {s.mix === 'mixed' ? 'Mixed' : 'Split'}
                  </span>
                </div>
              </div>
              <input
                type="range"
                className="audio-vol"
                min={0}
                max={100}
                disabled={!s.enabled}
                value={s.volume}
                onChange={(e) => patchSource(s.id, { volume: Number(e.target.value) })}
              />
              <button
                type="button"
                className={`stellar-toggle${s.enabled ? ' stellar-toggle--on' : ''}`}
                onClick={() => patchSource(s.id, { enabled: !s.enabled })}
                aria-pressed={s.enabled}
              />
            </div>
          )
        })}
      </div>

      <p className="stellar-page-lead" style={{ marginTop: 18, fontSize: 13 }}>
        <strong>Note:</strong> Splitting tracks has minimal performance impact. File size grows
        slightly per extra track.
      </p>
    </div>
  )
}
