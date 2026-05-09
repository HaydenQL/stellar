import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStellar } from '@/contexts/SettingsContext.jsx'
import { useAuth } from '@/contexts/AuthContext'
import {
  IconCamera,
  IconClock,
  IconScissors,
  IconStar,
  IconTrophy,
} from '@/components/ui/Icons.jsx'
import { getClipCount, getTotalDurationSeconds, formatDuration } from '@/lib/clipStore'

/** Pencil icon */
function IconPencil(props) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  )
}

/** Resize an image file to a max dimension and return base64 data URL */
function resizeImage(file, maxSize = 256) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width
        let h = img.height
        if (w > h) { h = (h / w) * maxSize; w = maxSize }
        else { w = (w / h) * maxSize; h = maxSize }
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/webp', 0.85))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export default function ProfilePage() {
  const { settings, updateSettings } = useStellar()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState('friends')
  const [editing, setEditing] = useState(false)
  const [editTag, setEditTag] = useState('')
  const [editBio, setEditBio] = useState('')
  const avatarRef = useRef(null)
  const bannerRef = useRef(null)

  const initial = (settings.profileTag || 'Y').trim().charAt(0).toUpperCase()
  const clipCount = getClipCount()
  const totalDur = formatDuration(getTotalDurationSeconds())

  const onlineFriends = (settings.friends || []).filter(
    (f) => f.section !== 'offline' && f.status !== 'offline',
  )
  const offlineFriends = (settings.friends || []).filter(
    (f) => f.section === 'offline' || f.status === 'offline',
  )

  const startEditing = () => {
    setEditTag(settings.profileTag || '')
    setEditBio(settings.profileBio || '')
    setEditing(true)
  }

  // Extract the #XXXX number from a tag string
  const getTagNumber = (tag) => {
    const m = (tag || '').match(/#(\d+)$/)
    return m ? m[1] : String(Math.floor(1000 + Math.random() * 9000))
  }

  const saveEditing = () => {
    // Enforce the tag format: Name#XXXX — the number part can't be removed
    let name = editTag.replace(/#\d*$/, '').trim()
    if (!name) name = 'Player'
    const number = getTagNumber(settings.profileTag)
    const finalTag = `${name}#${number}`
    void updateSettings({ profileTag: finalTag, profileBio: editBio })
    setEditing(false)
  }

  const cancelEditing = () => setEditing(false)

  const pickAvatar = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await resizeImage(file, 256)
    void updateSettings({ profileAvatar: dataUrl })
  }

  const pickBanner = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await resizeImage(file, 1200)
    void updateSettings({ profileBanner: dataUrl })
  }

  const addFriend = useCallback(() => {
    const name = window.prompt('Friend display name')
    if (!name) return
    const tag = window.prompt('Tag (e.g. Name#0000)', `${name}#0000`)
    const next = [
      ...(settings.friends || []),
      {
        id: String(Date.now()),
        name,
        tag: tag || `${name}#0000`,
        status: 'online',
        activity: 'Online',
        section: 'online',
      },
    ]
    void updateSettings({ friends: next })
  }, [settings.friends, updateSettings])

  return (
    <div className="stellar-page">
      {/* ── Header Card ── */}
      <div className="profile-header-card">
        <div
          className="profile-banner"
          style={settings.profileBanner ? {
            backgroundImage: `url(${settings.profileBanner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : undefined}
        >
          <button
            type="button"
            className="profile-banner-cam"
            title="Change banner"
            onClick={() => bannerRef.current?.click()}
          >
            <IconCamera width={18} height={18} />
          </button>
          <input
            ref={bannerRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={pickBanner}
          />
        </div>

        <div className="profile-avatar-wrap">
          <button
            type="button"
            className="profile-avatar-lg-btn"
            title="Change profile picture"
            onClick={() => avatarRef.current?.click()}
          >
            {settings.profileAvatar ? (
              <img src={settings.profileAvatar} alt="Avatar" className="profile-avatar-img" />
            ) : (
              <span className="profile-avatar-letter">{initial}</span>
            )}
            <span className="profile-avatar-overlay">
              <IconCamera width={20} height={20} />
            </span>
          </button>
          <input
            ref={avatarRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={pickAvatar}
          />

          <div style={{ flex: 1, paddingBottom: 4 }}>
            {editing ? (
              <div className="profile-edit-form">
                <input
                  className="stellar-input"
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                  placeholder="YourTag#0001"
                  style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}
                />
                <input
                  className="stellar-input"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Your bio…"
                  style={{ fontSize: 14 }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button type="button" className="stellar-btn stellar-btn--primary stellar-btn--sm" onClick={saveEditing}>
                    Save
                  </button>
                  <button type="button" className="stellar-btn stellar-btn--ghost stellar-btn--sm" onClick={cancelEditing}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h1 className="stellar-page-title" style={{ margin: '4px 0 6px' }}>
                    {settings.profileTag}
                  </h1>
                  <button
                    type="button"
                    className="profile-edit-pencil"
                    title="Edit profile"
                    onClick={startEditing}
                  >
                    <IconPencil />
                  </button>
                </div>
                <p className="stellar-page-lead" style={{ margin: 0 }}>
                  {settings.profileBio || 'Just here to clip the impossible.'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="profile-stat-grid">
        <div className="profile-stat-box">
          <div className="profile-stat-label">
            <IconScissors width={14} height={14} /> Clips saved
          </div>
          <div className="profile-stat-val">{clipCount}</div>
        </div>
        <div className="profile-stat-box">
          <div className="profile-stat-label">
            <IconTrophy width={14} height={14} /> Total views
          </div>
          <div className="profile-stat-val">—</div>
        </div>
        <div className="profile-stat-box">
          <div className="profile-stat-label">
            <IconStar width={14} height={14} /> Likes
          </div>
          <div className="profile-stat-val">—</div>
        </div>
        <div className="profile-stat-box">
          <div className="profile-stat-label">
            <IconClock width={14} height={14} /> Footage
          </div>
          <div className="profile-stat-val">{totalDur}</div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="profile-tabs">
        <button
          type="button"
          className={`profile-tab-btn${tab === 'friends' ? ' profile-tab-btn--active' : ''}`}
          onClick={() => setTab('friends')}
        >
          Friends ({onlineFriends.length})
        </button>
        <button
          type="button"
          className={`profile-tab-btn${tab === 'requests' ? ' profile-tab-btn--active' : ''}`}
          onClick={() => setTab('requests')}
        >
          Requests ({settings.friendRequestCount ?? 1})
        </button>
        <button
          type="button"
          className={`profile-tab-btn${tab === 'add' ? ' profile-tab-btn--active' : ''}`}
          onClick={() => setTab('add')}
        >
          Add Friend
        </button>
        <button
          type="button"
          className={`profile-tab-btn${tab === 'prefs' ? ' profile-tab-btn--active' : ''}`}
          onClick={() => setTab('prefs')}
        >
          Preferences
        </button>
      </div>

      {tab === 'friends' && (
        <div className="stellar-panel">
          <div className="profile-section-label">ONLINE — {onlineFriends.length}</div>
          {onlineFriends.map((f) => (
            <div key={f.id} className="stellar-friend-row">
              <span
                className={`stellar-friend-dot ${
                  f.status === 'clipping'
                    ? 'stellar-friend-dot--clipping'
                    : 'stellar-friend-dot--online'
                }`}
              />
              <div className="stellar-clip-meta">
                <div className="stellar-clip-title">{f.name}</div>
                <div className="stellar-clip-sub">{f.activity || f.tag}</div>
              </div>
            </div>
          ))}
          <div className="profile-section-label">OFFLINE</div>
          {offlineFriends.map((f) => (
            <div key={f.id} className="stellar-friend-row">
              <span className="stellar-friend-dot stellar-friend-dot--offline" />
              <div className="stellar-clip-meta">
                <div className="stellar-clip-title">{f.name}</div>
                <div className="stellar-clip-sub">{f.activity || 'Offline'}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'requests' && (
        <div className="stellar-setting-block">
          <p className="stellar-page-lead">
            Friend requests will appear here when someone adds your tag.
            Share your tag <strong style={{ color: 'var(--text)' }}>{settings.profileTag}</strong> with friends so they can find you.
          </p>
          {(settings.friendRequestCount || 0) === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-faint)' }}>
              No pending requests
            </div>
          )}
        </div>
      )}

      {tab === 'add' && (
        <div className="stellar-setting-block">
          <p className="stellar-page-lead">Add someone by tag. They are stored on this PC.</p>
          <button type="button" className="stellar-btn stellar-btn--primary" onClick={addFriend}>
            Add friend
          </button>
        </div>
      )}

      {tab === 'prefs' && (
        <div className="stellar-setting-block">
          {user?.email && (
            <p className="stellar-page-lead" style={{ marginBottom: 12 }}>
              Signed in as <strong style={{ color: 'var(--text)' }}>{user.email}</strong>
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="stellar-btn stellar-btn--ghost"
              onClick={() => navigate('/settings')}
            >
              Open Settings
            </button>
            <button
              type="button"
              className="stellar-btn stellar-btn--ghost"
              onClick={() => navigate('/clips')}
            >
              My clips
            </button>
            <button
              type="button"
              className="stellar-btn stellar-btn--ghost"
              style={{ color: '#f87171' }}
              onClick={() => void signOut()}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
