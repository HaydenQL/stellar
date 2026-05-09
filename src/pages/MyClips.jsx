import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useStellar } from '@/contexts/SettingsContext.jsx'
import { useAuth } from '@/contexts/AuthContext'
import {
  fetchMyClips,
  addClip,
  removeClip,
  updateClip,
  uploadClipFile,
  getShareUrl,
  timeAgo,
  randomGradient,
} from '@/lib/clipStore'
import {
  IconFilm,
  IconGamepad,
  IconGrid,
  IconListMenu,
  IconLock,
  IconPlay,
  IconSearch,
  IconGlobe,
  IconShare,
  IconUpload,
} from '@/components/ui/Icons.jsx'

/** Rich clip detail modal — video + info panel */
function ClipDetailModal({ clip, onClose, onShare, onToggleVis, onDelete }) {
  if (!clip) return null

  const handleDownload = async () => {
    if (!clip.fileUrl) return
    try {
      const res = await fetch(clip.fileUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${clip.title || 'clip'}.mp4`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      window.open(clip.fileUrl, '_blank')
    }
  }

  const handleCopyLink = async () => {
    const url = getShareUrl(clip.shareId || clip.id)
    try { await navigator.clipboard.writeText(url) } catch { /* */ }
  }

  return (
    <div className="clip-detail-overlay" onClick={onClose}>
      <div className="clip-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Video side */}
        <div className="clip-detail-video-wrap">
          {clip.fileUrl ? (
            <video src={clip.fileUrl} controls autoPlay className="clip-detail-video" />
          ) : (
            <div className="clip-detail-video-placeholder" style={{ background: clip.gradient || 'var(--elevated)' }}>
              <IconPlay width={48} height={48} style={{ opacity: 0.4 }} />
            </div>
          )}
        </div>

        {/* Details panel */}
        <div className="clip-detail-panel">
          <div className="clip-detail-panel-head">
            <h2 className="clip-detail-title">{clip.title}</h2>
            <button type="button" className="clip-detail-close" onClick={onClose}>✕</button>
          </div>

          <div className="clip-detail-meta">
            <span><IconGamepad width={14} height={14} /> {clip.game}</span>
            <span>·</span>
            <span>{clip.duration}</span>
            <span>·</span>
            <span>{clip.size}</span>
          </div>

          <div className="clip-detail-meta" style={{ marginTop: 4 }}>
            <span style={{ opacity: 0.5 }}>{timeAgo(clip.createdAt)}</span>
          </div>

          <div className="clip-detail-divider" />

          {/* Visibility */}
          <div className="clip-detail-row">
            <span style={{ fontSize: 13, fontWeight: 600 }}>Visibility</span>
            <button
              type="button"
              className={`stellar-btn stellar-btn--sm ${clip.visibility === 'public' ? 'stellar-btn--primary' : 'stellar-btn--ghost'}`}
              onClick={() => onToggleVis?.(clip.id, clip.visibility)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              {clip.visibility === 'public' ? <><IconGlobe width={12} height={12} /> Public</> : <><IconLock width={12} height={12} /> Private</>}
            </button>
          </div>

          <div className="clip-detail-divider" />

          {/* Actions */}
          <div className="clip-detail-actions">
            <button type="button" className="stellar-btn stellar-btn--ghost" onClick={() => onShare?.(clip)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconShare width={14} height={14} /> Copy Link
            </button>
            {clip.fileUrl && (
              <button type="button" className="stellar-btn stellar-btn--ghost" onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <IconUpload width={14} height={14} style={{ transform: 'rotate(180deg)' }} /> Download
              </button>
            )}
            <button type="button" className="stellar-btn stellar-btn--ghost" style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => { onDelete?.(clip.id); onClose() }}>
              ✕ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MyClips() {
  const { t, settings } = useStellar()
  const { user } = useAuth()
  const fileRef = useRef(null)
  const [toast, setToast] = useState('')
  const [q, setQ] = useState('')
  const [view, setView] = useState('grid')
  const [gameFilter, setGameFilter] = useState('All Games')
  const [clips, setClips] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedClip, setSelectedClip] = useState(null)

  // Load clips
  const loadClips = useCallback(async () => {
    setLoading(true)
    const data = await fetchMyClips(user?.id)
    setClips(data)
    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    loadClips()
  }, [loadClips])

  const filtered = useMemo(() => {
    return clips.filter((c) => {
      const matchQ =
        !q ||
        c.title.toLowerCase().includes(q.toLowerCase()) ||
        c.game.toLowerCase().includes(q.toLowerCase())
      const matchG = gameFilter === 'All Games' || c.game === gameFilter
      return matchQ && matchG
    })
  }, [clips, q, gameFilter])

  const publicCount = clips.filter((c) => c.visibility === 'public').length
  const privateCount = clips.length - publicCount
  const games = ['All Games', ...new Set(clips.map((c) => c.game).filter(Boolean))]

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const shareClip = useCallback(async (clip) => {
    const url = getShareUrl(clip.shareId || clip.id)
    try {
      await navigator.clipboard.writeText(url)
      showToast('Share link copied!')
    } catch {
      showToast(url)
    }
  }, [])

  const toggleVisibility = useCallback(
    async (id, current) => {
      const next = current === 'public' ? 'private' : 'public'
      await updateClip(id, { visibility: next }, user?.id)
      setClips((prev) => prev.map((c) => (c.id === id ? { ...c, visibility: next } : c)))
    },
    [user?.id],
  )

  const deleteClip = useCallback(
    async (id) => {
      if (!window.confirm('Delete this clip?')) return
      await removeClip(id, user?.id)
      setClips((prev) => prev.filter((c) => c.id !== id))
    },
    [user?.id],
  )

  // Upload a real video file
  const handleFileUpload = useCallback(
    async (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      setUploading(true)
      showToast('Uploading clip…')

      try {
        // Upload to Supabase Storage
        let fileUrl = ''
        if (user?.id) {
          fileUrl = await uploadClipFile(file, user.id)
        }

        // Get file size
        const sizeMb = (file.size / (1024 * 1024)).toFixed(0)

        // Prompt for title
        const title = window.prompt('Clip title:', file.name.replace(/\.[^.]+$/, '')) || file.name

        // Prompt for game
        const game = window.prompt('Game name:', 'Unknown') || 'Unknown'

        const clip = await addClip(
          {
            title,
            game,
            duration: '0:00',
            size: `${sizeMb} MB`,
            visibility: settings.clipPrivacy || 'public',
            author: settings.profileTag || user?.email?.split('@')[0] || 'You',
            authorTag: settings.profileTag || '',
            fileUrl: fileUrl || '',
            gradient: randomGradient(),
          },
          user?.id,
        )

        setClips((prev) => [clip, ...prev])
        showToast(fileUrl ? 'Clip uploaded to cloud!' : 'Clip saved locally')
      } catch (err) {
        showToast('Upload failed: ' + err.message)
      } finally {
        setUploading(false)
        if (fileRef.current) fileRef.current.value = ''
      }
    },
    [user?.id, settings.clipPrivacy, settings.profileTag, user?.email],
  )

  // Quick create demo clip (no file)
  const createDemoClip = useCallback(async () => {
    const games = ['Valorant', 'Counter-Strike 2', 'Apex Legends', 'Rocket League', 'Fortnite']
    const titles = ['Ace play', 'Clutch moment', 'Team wipe', 'Insane shot', 'Perfect timing']
    const clip = await addClip(
      {
        title: titles[Math.floor(Math.random() * titles.length)],
        game: games[Math.floor(Math.random() * games.length)],
        duration: `0:${String(10 + Math.floor(Math.random() * 50)).padStart(2, '0')}`,
        size: `${40 + Math.floor(Math.random() * 100)} MB`,
        visibility: settings.clipPrivacy || 'public',
        author: settings.profileTag || user?.email?.split('@')[0] || 'You',
        authorTag: settings.profileTag || '',
        gradient: randomGradient(),
      },
      user?.id,
    )
    setClips((prev) => [clip, ...prev])
  }, [settings.clipPrivacy, settings.profileTag, user?.id, user?.email])

  return (
    <div className="stellar-page">
      <h1 className="stellar-page-title">Clip Library</h1>
      <p className="stellar-page-lead">
        {clips.length} clips · {publicCount} public · {privateCount} private
      </p>

      {toast && (
        <p style={{ color: 'var(--accent-2)', marginBottom: 12 }}>{toast}</p>
      )}

      <div className="clip-lib-toolbar">
        <div className="clip-lib-search">
          <IconSearch width={18} height={18} style={{ opacity: 0.5 }} />
          <input
            placeholder="Search clips…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search clips"
          />
        </div>
        <select
          className="stellar-select"
          value={gameFilter}
          onChange={(e) => setGameFilter(e.target.value)}
        >
          {games.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <div className="clip-lib-view-toggle">
          <button type="button" className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} aria-label="Grid view">
            <IconGrid width={18} height={18} />
          </button>
          <button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-label="List view">
            <IconListMenu width={18} height={18} />
          </button>
        </div>
        <button
          type="button"
          className="stellar-btn stellar-btn--primary stellar-btn--sm"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <IconUpload width={14} height={14} />
          {uploading ? 'Uploading…' : 'Upload Clip'}
        </button>
        <button
          type="button"
          className="stellar-btn stellar-btn--ghost stellar-btn--sm"
          onClick={createDemoClip}
          title="Create a demo clip entry for testing"
        >
          + Demo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </div>

      {loading ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading clips…
        </div>
      ) : view === 'grid' ? (
        <div className="clip-card-grid">
          {filtered.map((c) => (
            <article key={c.id} className="clip-card">
              <div
                className="clip-card-thumb"
                style={{
                  background: c.gradient || 'var(--elevated)',
                  cursor: c.fileUrl ? 'pointer' : 'default',
                }}
                onClick={() => setSelectedClip(c)}
                title={c.fileUrl ? 'Click to preview fullscreen' : ''}
              >
                {c.fileUrl && (
                  <video src={c.fileUrl} className="clip-card-video-preview" muted preload="metadata" />
                )}
                {c.fileUrl && (
                  <div className="discover-thumb-play-overlay" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.15s' }}>
                    <IconPlay width={32} height={32} />
                  </div>
                )}
                <button
                  type="button"
                  className={`clip-card-badge clip-card-badge--${c.visibility === 'public' ? 'public' : 'private'}`}
                  onClick={(e) => { e.stopPropagation(); toggleVisibility(c.id, c.visibility) }}
                  title={`Click to make ${c.visibility === 'public' ? 'private' : 'public'}`}
                  style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  {c.visibility === 'public' ? (
                    <><IconGlobe width={12} height={12} /> Public</>
                  ) : (
                    <><IconLock width={12} height={12} /> Private</>
                  )}
                </button>
                <span className="clip-card-dur">{c.duration}</span>
              </div>
              <div className="clip-card-body">
                <div className="clip-card-title">{c.title}</div>
                <div className="clip-card-meta">
                  <IconGamepad width={14} height={14} />
                  {c.game}
                  <span style={{ opacity: 0.5 }}>·</span>
                  {c.size}
                  <span style={{ opacity: 0.5 }}>·</span>
                  {timeAgo(c.createdAt)}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <button
                    type="button"
                    className="stellar-btn stellar-btn--ghost"
                    style={{ padding: '6px 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    onClick={() => shareClip(c)}
                  >
                    <IconShare width={12} height={12} /> Share
                  </button>
                  {c.fileUrl && (
                    <a
                      href={c.fileUrl}
                      download
                      className="stellar-btn stellar-btn--ghost"
                      style={{ padding: '6px 12px', fontSize: 12, textDecoration: 'none' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  )}
                  <button
                    type="button"
                    className="stellar-btn stellar-btn--ghost"
                    style={{ padding: '6px 12px', fontSize: 12, color: '#f87171' }}
                    onClick={() => deleteClip(c.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="stellar-panel">
          {filtered.map((c) => (
            <div key={c.id} className="stellar-clip-row">
              <button type="button" className="stellar-clip-play" aria-label="Play">
                <IconFilm width={16} height={16} />
              </button>
              <div className="stellar-clip-meta">
                <div className="stellar-clip-title">{c.title}</div>
                <div className="stellar-clip-sub">{c.game} · {c.duration} · {c.size}</div>
              </div>
              <button
                type="button"
                className="stellar-btn stellar-btn--ghost"
                style={{ padding: '6px 10px', fontSize: 12 }}
                onClick={() => toggleVisibility(c.id, c.visibility)}
              >
                {c.visibility === 'public' ? <IconGlobe width={14} height={14} /> : <IconLock width={14} height={14} />}
              </button>
              <button
                type="button"
                className="stellar-btn stellar-btn--ghost"
                style={{ padding: '6px 10px', fontSize: 12 }}
                onClick={() => shareClip(c)}
              >
                <IconShare width={14} height={14} />
              </button>
              <button
                type="button"
                className="stellar-btn stellar-btn--ghost"
                style={{ padding: '6px 10px', fontSize: 12, color: '#f87171' }}
                onClick={() => deleteClip(c.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <ClipDetailModal
        clip={selectedClip}
        onClose={() => setSelectedClip(null)}
        onShare={shareClip}
        onToggleVis={toggleVisibility}
        onDelete={deleteClip}
      />
    </div>
  )
}
