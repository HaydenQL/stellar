import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStellar } from '@/contexts/SettingsContext.jsx'
import { useAuth } from '@/contexts/AuthContext'
import {
  getLocalClips,
  getClipCount,
  getTotalDurationSeconds,
  formatDuration,
  timeAgo,
} from '@/lib/clipStore'
import {
  IconFilm,
  IconHdd,
  IconClock,
  IconBolt,
  IconPlay,
  IconStarLogo,
  IconKeyboard,
  IconGear,
  IconMonitor,
} from '@/components/ui/Icons.jsx'

function StatCard({ icon: Icon, value, label, sublabel }) {
  return (
    <div className="stellar-stat-card">
      <div className="stellar-stat-icon">
        <Icon width={20} height={20} />
      </div>
      <div>
        <div className="stellar-stat-value">{value}</div>
        <div className="stellar-stat-label">{label}</div>
        {sublabel && <div className="stellar-stat-sub">{sublabel}</div>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { simulateClip } = useStellar()
  const { user } = useAuth()

  const clips = useMemo(() => getLocalClips(), [])
  const clipCount = getClipCount()
  const totalDur = formatDuration(getTotalDurationSeconds())
  const publicCount = clips.filter((c) => c.visibility === 'public').length
  const recentClips = clips.slice(0, 5)

  const tagName = (settings.profileTag || '').split('#')[0]
  const greeting = tagName || user?.email?.split('@')[0] || 'Player'

  return (
    <div className="stellar-page">
      {/* Hero */}
      <div className="stellar-hero">
        <div className="stellar-hero-top">
          <span className="stellar-pill stellar-pill--accent">
            <IconStarLogo width={14} height={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            v1.0
          </span>
          <span className="stellar-pill" style={{ borderColor: 'rgba(34,197,94,0.4)', color: '#4ade80' }}>
            ● Online
          </span>
        </div>
        <h1 className="stellar-hero-title">Welcome back, {greeting}</h1>
        <p className="stellar-hero-lead">
          Your lightweight game clipping engine. Capture, organize, and share your best gaming moments.
        </p>
        <div className="stellar-hero-actions">
          <button
            type="button"
            className="stellar-btn stellar-btn--primary"
            onClick={() => void simulateClip()}
          >
            <IconPlay width={16} height={16} /> Start Clipping
          </button>
          <button
            type="button"
            className="stellar-btn stellar-btn--ghost"
            onClick={() => navigate('/clips')}
          >
            View Clips
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stellar-stat-grid">
        <StatCard icon={IconFilm} value={String(clipCount)} label="Total Clips" sublabel={`${publicCount} public`} />
        <StatCard icon={IconHdd} value="—" label="Storage Used" sublabel="Cloud synced" />
        <StatCard icon={IconClock} value={totalDur} label="Total Duration" />
        <StatCard icon={IconBolt} value="< 1%" label="CPU Usage" sublabel="0 FPS drop" />
      </div>

      {/* Recent + Quick Actions */}
      <div className="stellar-split">
        <div className="stellar-panel">
          <div className="stellar-panel-head">
            <span className="stellar-panel-title">Recent Clips</span>
            <button type="button" className="stellar-link" onClick={() => navigate('/clips')}>
              View All
            </button>
          </div>
          {recentClips.length > 0 ? (
            recentClips.map((c) => (
              <div key={c.id} className="stellar-clip-row">
                <button type="button" className="stellar-clip-play" aria-label="Play">
                  <IconPlay width={14} height={14} />
                </button>
                <div className="stellar-clip-meta">
                  <div className="stellar-clip-title">{c.title}</div>
                  <div className="stellar-clip-sub">
                    {c.game} · {c.duration}
                  </div>
                </div>
                <div className="stellar-clip-side">{timeAgo(c.createdAt)}</div>
              </div>
            ))
          ) : (
            <div style={{ padding: '24px 18px', color: 'var(--text-muted)', textAlign: 'center' }}>
              No clips yet. Upload one from My Clips!
            </div>
          )}
        </div>

        <div className="stellar-panel">
          <div className="stellar-panel-head">
            <span className="stellar-panel-title">Quick Actions</span>
          </div>
          <div className="stellar-qa">
            <button type="button" className="stellar-qa-row" onClick={() => navigate('/clips')}>
              <div className="stellar-qa-icon"><IconFilm width={18} height={18} /></div>
              <div className="stellar-qa-text">
                <div className="stellar-qa-title">Upload Clip</div>
                <div className="stellar-qa-desc">Upload a video to the cloud</div>
              </div>
            </button>
            <button type="button" className="stellar-qa-row" onClick={() => navigate('/discover')}>
              <div className="stellar-qa-icon"><IconMonitor width={18} height={18} /></div>
              <div className="stellar-qa-text">
                <div className="stellar-qa-title">Discover</div>
                <div className="stellar-qa-desc">Browse community clips</div>
              </div>
            </button>
            <button type="button" className="stellar-qa-row" onClick={() => navigate('/settings')}>
              <div className="stellar-qa-icon"><IconGear width={18} height={18} /></div>
              <div className="stellar-qa-text">
                <div className="stellar-qa-title">Settings</div>
                <div className="stellar-qa-desc">Adjust capture preferences</div>
              </div>
            </button>
            <button type="button" className="stellar-qa-row" onClick={() => navigate('/hotkeys')}>
              <div className="stellar-qa-icon"><IconKeyboard width={18} height={18} /></div>
              <div className="stellar-qa-text">
                <div className="stellar-qa-title">Hotkeys</div>
                <div className="stellar-qa-desc">Customize key bindings</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}