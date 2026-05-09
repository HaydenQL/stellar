import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'
import { IconStarLogo, IconPlay, IconClock, IconGamepad } from '@/components/ui/Icons.jsx'

export default function SharePage() {
  const { shareId } = useParams()
  const navigate = useNavigate()
  const [clip, setClip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError('Supabase not configured')
      setLoading(false)
      return
    }
    if (!shareId) {
      setError('No clip ID provided')
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        const { data, error: err } = await supabase
          .from('clips')
          .select('*')
          .eq('share_id', shareId)
          .eq('visibility', 'public')
          .single()

        if (err || !data) {
          setError('Clip not found or is private.')
          setLoading(false)
          return
        }

        setClip(data)
        setLoading(false)

        // Increment views
        await supabase
          .from('clips')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', data.id)
      } catch {
        setError('Failed to load clip.')
        setLoading(false)
      }
    })()
  }, [shareId])

  if (loading) {
    return (
      <div className="share-page">
        <div className="share-card">
          <div className="login-brand">
            <IconStarLogo />
            <div>
              <div className="login-brand-name">Stellar</div>
              <div className="login-brand-sub">Loading clip…</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !clip) {
    return (
      <div className="share-page">
        <div className="share-card">
          <div className="login-brand">
            <IconStarLogo />
            <div>
              <div className="login-brand-name">Stellar</div>
              <div className="login-brand-sub">Clip Engine</div>
            </div>
          </div>
          <h1 className="login-title">Clip Not Found</h1>
          <p className="login-lead">{error || 'This clip doesn\'t exist or has been made private.'}</p>
          <button
            type="button"
            className="stellar-btn stellar-btn--primary login-submit"
            onClick={() => navigate('/')}
          >
            Open Stellar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="share-page">
      <div className="share-card">
        <div className="login-brand">
          <IconStarLogo />
          <div>
            <div className="login-brand-name">Stellar</div>
            <div className="login-brand-sub">Shared Clip</div>
          </div>
        </div>

        {/* Clip preview */}
        <div
          className="share-preview"
          style={{ background: clip.gradient || 'linear-gradient(135deg, rgba(124,93,250,0.35), rgba(75,157,255,0.25))' }}
        >
          {clip.file_url ? (
            <video
              src={clip.file_url}
              controls
              className="share-video"
              poster={clip.thumbnail_url || undefined}
            />
          ) : (
            <div className="share-preview-placeholder">
              <IconPlay width={48} height={48} style={{ opacity: 0.5 }} />
            </div>
          )}
        </div>

        <h1 className="share-title">{clip.title}</h1>
        <div className="share-meta">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <IconGamepad width={14} height={14} /> {clip.game}
          </span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <IconClock width={14} height={14} /> {clip.duration}
          </span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{clip.author_name || clip.author_tag || 'Unknown'}</span>
        </div>
        <div className="share-stats">
          <span>{clip.views || 0} views</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{clip.likes || 0} likes</span>
        </div>

        <div className="share-actions">
          {clip.file_url && (
            <a
              href={clip.file_url}
              download
              className="stellar-btn stellar-btn--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Clip
            </a>
          )}
          <button
            type="button"
            className="stellar-btn stellar-btn--ghost"
            onClick={() => navigate('/')}
          >
            Open Stellar
          </button>
        </div>
      </div>
    </div>
  )
}
