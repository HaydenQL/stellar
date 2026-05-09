import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStellar } from '@/contexts/SettingsContext.jsx'
import { useAuth } from '@/contexts/AuthContext'
import { fetchPublicClips, likeClip, getShareUrl, timeAgo } from '@/lib/clipStore'
import {
  IconCompass,
  IconHeart,
  IconPlay,
  IconSearch,
  IconShare,
  IconTrending,
  IconUsers,
  IconGlobe,
  IconGamepad,
} from '@/components/ui/Icons.jsx'

function DiscoverClipCard({ clip }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(clip.likes || 0)

  const toggleLike = async () => {
    const next = !liked
    setLiked(next)
    setLikeCount((c) => (next ? c + 1 : c - 1))
    if (next) {
      await likeClip(clip.id)
    }
  }

  const share = async () => {
    const url = getShareUrl(clip.shareId || clip.id)
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* silent */
    }
  }

  return (
    <div className="discover-card">
      <div
        className="discover-thumb"
        style={{ background: clip.gradient || 'linear-gradient(135deg, rgba(124,93,250,0.35), rgba(75,157,255,0.25))' }}
      >
        {clip.fileUrl ? (
          <video src={clip.fileUrl} className="clip-card-video-preview" muted preload="metadata" />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconPlay width={28} height={28} style={{ opacity: 0.6 }} />
          </div>
        )}
        <span className="clip-card-dur">{clip.duration}</span>
      </div>
      <div className="discover-body">
        <div className="discover-title">{clip.title}</div>
        <div className="discover-meta">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <IconGamepad width={12} height={12} /> {clip.game}
          </span>
          <span style={{ opacity: 0.5 }}> · </span>
          {clip.author || 'Unknown'}
          <span style={{ opacity: 0.5 }}> · </span>
          {timeAgo(clip.createdAt)}
        </div>
        <div className="discover-card-actions">
          <button
            type="button"
            className="stellar-btn stellar-btn--ghost stellar-btn--sm"
            onClick={toggleLike}
            style={liked ? { color: '#f87171' } : undefined}
          >
            <IconHeart width={14} height={14} /> {likeCount}
          </button>
          <button
            type="button"
            className="stellar-btn stellar-btn--ghost stellar-btn--sm"
            onClick={share}
          >
            <IconShare width={14} height={14} /> Share
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Discover() {
  const navigate = useNavigate()
  const { settings } = useStellar()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [gameFilter, setGameFilter] = useState('All')
  const [tab, setTab] = useState('trending')
  const [clips, setClips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const data = await fetchPublicClips()
      setClips(data)
      setLoading(false)
    })()
  }, [])

  const friendTags = new Set((settings.friends || []).map((f) => f.tag))

  const games = ['All', ...new Set(clips.map((c) => c.game).filter(Boolean))]

  const filter = (list) =>
    list.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        (c.author || '').toLowerCase().includes(search.toLowerCase())
      const matchGame = gameFilter === 'All' || c.game === gameFilter
      return matchSearch && matchGame
    })

  const trending = filter([...clips].sort((a, b) => (b.views || 0) - (a.views || 0)))
  const popular = filter([...clips].sort((a, b) => (b.likes || 0) - (a.likes || 0)))
  const friendClips = filter(clips.filter((c) => c.authorTag && friendTags.has(c.authorTag)))

  const activeClips = tab === 'trending' ? trending : tab === 'friends' ? friendClips : popular

  return (
    <div className="stellar-page">
      <h1 className="stellar-page-title">Discover</h1>
      <p className="stellar-page-lead">
        {settings.onlineModeEnabled
          ? 'Public clips from the community. Upload and share your best moments.'
          : 'Online mode is off. Turn it on in Settings → Online & Social.'}
      </p>

      <div className="clip-lib-toolbar">
        <div className="clip-lib-search">
          <IconSearch width={18} height={18} style={{ opacity: 0.5 }} />
          <input
            placeholder="Search clips or players…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search clips"
          />
        </div>
        <div className="discover-pills">
          {games.map((g) => (
            <button
              key={g}
              type="button"
              className={`discover-pill${gameFilter === g ? ' discover-pill--active' : ''}`}
              onClick={() => setGameFilter(g)}
            >
              {g === 'All' ? 'All Games' : g}
            </button>
          ))}
        </div>
      </div>

      <div className="discover-tabs">
        <button type="button" className={`discover-tab${tab === 'trending' ? ' discover-tab--active' : ''}`} onClick={() => setTab('trending')}>
          <IconTrending width={16} height={16} /> Trending
        </button>
        <button type="button" className={`discover-tab${tab === 'friends' ? ' discover-tab--active' : ''}`} onClick={() => setTab('friends')}>
          <IconUsers width={16} height={16} /> Friends
        </button>
        <button type="button" className={`discover-tab${tab === 'popular' ? ' discover-tab--active' : ''}`} onClick={() => setTab('popular')}>
          <IconGlobe width={16} height={16} /> Popular
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading community clips…
        </div>
      ) : activeClips.length > 0 ? (
        <div className="discover-grid">
          {activeClips.map((c) => (
            <DiscoverClipCard key={c.id} clip={c} />
          ))}
        </div>
      ) : (
        <div className="stellar-setting-block" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <IconCompass width={48} height={48} style={{ opacity: 0.2, marginBottom: 16 }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>
            {tab === 'friends' ? 'No friend clips yet' : 'No public clips yet'}
          </h2>
          <p className="stellar-page-lead" style={{ margin: '0 auto 20px', textAlign: 'center' }}>
            {tab === 'friends'
              ? "When your friends share clips, they'll appear here."
              : 'Upload a clip and set it to Public to see it here.'}
          </p>
          <button type="button" className="stellar-btn stellar-btn--primary" onClick={() => navigate('/clips')}>
            Go to My Clips
          </button>
        </div>
      )}
    </div>
  )
}