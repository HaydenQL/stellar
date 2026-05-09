import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStellar } from '@/contexts/SettingsContext.jsx'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabaseClient'
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
  const [editingBio, setEditingBio] = useState(false)
  const [editTag, setEditTag] = useState('')
  const [editBio, setEditBio] = useState('')
  const [friendSearch, setFriendSearch] = useState('')
  const [friendSearchResult, setFriendSearchResult] = useState(null)
  const [friendSearching, setFriendSearching] = useState(false)
  const [friendMsg, setFriendMsg] = useState('')
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
    // Only show the name part for editing — the #XXXX is read-only
    const namePart = (settings.profileTag || '').replace(/#\d*$/, '').trim()
    setEditTag(namePart || 'Player')
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

  const startEditingBio = () => {
    setEditBio(settings.profileBio || '')
    setEditingBio(true)
  }

  const saveBio = () => {
    void updateSettings({ profileBio: editBio })
    setEditingBio(false)
  }

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

  const searchFriend = useCallback(async () => {
    const tag = friendSearch.trim()
    if (!tag || !tag.includes('#')) {
      setFriendMsg('Enter a full tag like Player#1234')
      return
    }
    // Prevent adding yourself
    if (tag === settings.profileTag) {
      setFriendMsg("You can't add yourself!")
      setFriendSearchResult(null)
      return
    }
    // Check if already a friend
    if ((settings.friends || []).some((f) => f.tag === tag)) {
      setFriendMsg('Already in your friends list')
      setFriendSearchResult(null)
      return
    }

    setFriendSearching(true)
    setFriendMsg('')
    setFriendSearchResult(null)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, tag, bio, avatar_url')
        .eq('tag', tag)
        .single()
      if (error || !data) {
        setFriendMsg('No user found with that tag')
      } else {
        setFriendSearchResult(data)
      }
    } catch {
      setFriendMsg('Search failed — check your connection')
    }
    setFriendSearching(false)
  }, [friendSearch, settings.profileTag, settings.friends])

  const confirmAddFriend = useCallback(() => {
    if (!friendSearchResult) return
    const next = [
      ...(settings.friends || []),
      {
        id: friendSearchResult.id,
        name: (friendSearchResult.tag || '').split('#')[0],
        tag: friendSearchResult.tag,
        status: 'online',
        activity: 'Online',
        section: 'online',
      },
    ]
    void updateSettings({ friends: next })
    setFriendSearch('')
    setFriendSearchResult(null)
    setFriendMsg('Friend added!')
    setTimeout(() => setFriendMsg(''), 3000)
  }, [friendSearchResult, settings.friends, updateSettings])

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
        </div>

        {/* Name & Bio — sits below avatar in the card body */}
        <div style={{ padding: '8px 0 4px' }}>
          {editing ? (
            <div className="profile-edit-form">
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                <input
                  className="stellar-input"
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                  placeholder="Your display name"
                  style={{ fontSize: 18, fontWeight: 700, flex: 1 }}
                />
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  #{getTagNumber(settings.profileTag)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <button type="button" className="stellar-btn stellar-btn--primary stellar-btn--sm" onClick={saveEditing}>
                  Save
                </button>
                <button type="button" className="stellar-btn stellar-btn--ghost stellar-btn--sm" onClick={cancelEditing}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 className="stellar-page-title" style={{ margin: 0 }}>
                {settings.profileTag}
              </h1>
              <button
                type="button"
                className="profile-edit-pencil"
                title="Edit display name"
                onClick={startEditing}
              >
                <IconPencil />
              </button>
            </div>
          )}

          {editingBio ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <input
                className="stellar-input"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Your bio…"
                style={{ fontSize: 14, flex: 1 }}
              />
              <button type="button" className="stellar-btn stellar-btn--primary stellar-btn--sm" onClick={saveBio}>
                Save
              </button>
              <button type="button" className="stellar-btn stellar-btn--ghost stellar-btn--sm" onClick={() => setEditingBio(false)}>
                ✕
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <p className="stellar-page-lead" style={{ margin: 0 }}>
                {settings.profileBio || 'Just here to clip the impossible.'}
              </p>
              <button
                type="button"
                className="profile-edit-pencil"
                title="Edit bio"
                onClick={startEditingBio}
                style={{ width: 22, height: 22 }}
              >
                <IconPencil />
              </button>
            </div>
          )}
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
          <p className="stellar-page-lead">
            Search for a user by their full tag (e.g. <strong style={{ color: 'var(--text)' }}>Player#1234</strong>)
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              className="stellar-input"
              placeholder="Name#0000"
              value={friendSearch}
              onChange={(e) => setFriendSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchFriend()}
              style={{ flex: 1, minWidth: 0 }}
            />
            <button
              type="button"
              className="stellar-btn stellar-btn--primary"
              onClick={searchFriend}
              disabled={friendSearching}
            >
              {friendSearching ? 'Searching…' : 'Search'}
            </button>
          </div>
          {friendMsg && (
            <p style={{ fontSize: 13, color: friendMsg.includes('added') ? '#4ade80' : 'var(--text-muted)', margin: '0 0 10px' }}>
              {friendMsg}
            </p>
          )}
          {friendSearchResult && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(145deg, var(--accent), #c026d3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>
                {(friendSearchResult.tag || '?')[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{friendSearchResult.tag}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {friendSearchResult.bio || 'No bio'}
                </div>
              </div>
              <button
                type="button"
                className="stellar-btn stellar-btn--primary stellar-btn--sm"
                onClick={confirmAddFriend}
              >
                Add Friend
              </button>
            </div>
          )}
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
