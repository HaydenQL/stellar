/**
 * Clip Store — dual-mode: localStorage for offline + Supabase for cloud.
 * When Supabase is configured and user is logged in, all operations sync to cloud.
 * Falls back to localStorage when offline or not configured.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'

const LOCAL_KEY = 'stellar_clips'

// ─── Local helpers ───────────────────────────────────────────

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeLocal(clips) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(clips))
}

// ─── Cloud functions ─────────────────────────────────────────

/** Fetch current user's clips from Supabase */
export async function fetchMyClips(userId) {
  if (!isSupabaseConfigured() || !userId) return readLocal()
  try {
    const { data, error } = await supabase
      .from('clips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []).map(mapDbClip)
  } catch (e) {
    console.warn('[clipStore] fetchMyClips fallback to local:', e.message)
    return readLocal()
  }
}

/** Fetch all public clips from all users */
export async function fetchPublicClips() {
  if (!isSupabaseConfigured()) return readLocal().filter((c) => c.visibility === 'public')
  try {
    const { data, error } = await supabase
      .from('clips')
      .select('*')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) throw error
    return (data || []).map(mapDbClip)
  } catch (e) {
    console.warn('[clipStore] fetchPublicClips fallback:', e.message)
    return readLocal().filter((c) => c.visibility === 'public')
  }
}

/** Upload a clip file to Supabase Storage and return the public URL */
export async function uploadClipFile(file, userId) {
  if (!isSupabaseConfigured() || !userId) return null
  const ext = file.name.split('.').pop() || 'mp4'
  const path = `${userId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage.from('clips').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  const { data: urlData } = supabase.storage.from('clips').getPublicUrl(path)
  return urlData?.publicUrl || null
}

/** Add a clip — saves to Supabase if configured, also saves locally */
export async function addClip(clip, userId) {
  const id = clip.id || `clip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const entry = {
    id,
    title: clip.title || 'Untitled Clip',
    game: clip.game || 'Unknown',
    duration: clip.duration || '0:00',
    size: clip.size || '0 MB',
    visibility: clip.visibility || 'public',
    createdAt: clip.createdAt || Date.now(),
    author: clip.author || 'You',
    authorTag: clip.authorTag || '',
    fileUrl: clip.fileUrl || '',
    thumbnailUrl: clip.thumbnailUrl || '',
    gradient: clip.gradient || randomGradient(),
    likes: clip.likes || 0,
    views: clip.views || 0,
    shareId: clip.shareId || '',
  }

  // Save locally
  const local = readLocal()
  local.unshift(entry)
  writeLocal(local)

  // Save to cloud
  if (isSupabaseConfigured() && userId) {
    try {
      const { data, error } = await supabase
        .from('clips')
        .insert({
          title: entry.title,
          game: entry.game,
          duration: entry.duration,
          size: entry.size,
          visibility: entry.visibility,
          file_url: entry.fileUrl,
          thumbnail_url: entry.thumbnailUrl,
          gradient: entry.gradient,
          user_id: userId,
          author_name: entry.author,
          author_tag: entry.authorTag,
        })
        .select()
        .single()
      if (!error && data) {
        // Update local with cloud ID and share_id
        entry.id = data.id
        entry.shareId = data.share_id
        entry.createdAt = new Date(data.created_at).getTime()
        local[0] = entry
        writeLocal(local)
        return entry
      }
    } catch (e) {
      console.warn('[clipStore] cloud insert failed:', e.message)
    }
  }

  return entry
}

/** Update a clip's fields */
export async function updateClip(id, patch, userId) {
  // Update local
  const local = readLocal().map((c) => (c.id === id ? { ...c, ...patch } : c))
  writeLocal(local)

  // Update cloud
  if (isSupabaseConfigured() && userId) {
    try {
      const dbPatch = {}
      if (patch.visibility !== undefined) dbPatch.visibility = patch.visibility
      if (patch.title !== undefined) dbPatch.title = patch.title
      if (patch.game !== undefined) dbPatch.game = patch.game
      if (patch.likes !== undefined) dbPatch.likes = patch.likes
      if (Object.keys(dbPatch).length > 0) {
        await supabase.from('clips').update(dbPatch).eq('id', id).eq('user_id', userId)
      }
    } catch (e) {
      console.warn('[clipStore] cloud update failed:', e.message)
    }
  }
}

/** Delete a clip from local + cloud + storage */
export async function removeClip(id, userId) {
  const local = readLocal()
  const clip = local.find((c) => c.id === id)
  writeLocal(local.filter((c) => c.id !== id))

  if (isSupabaseConfigured() && userId) {
    try {
      // Delete from DB
      await supabase.from('clips').delete().eq('id', id).eq('user_id', userId)

      // Delete from storage if file exists
      if (clip?.fileUrl) {
        const urlParts = clip.fileUrl.split('/clips/')
        if (urlParts[1]) {
          await supabase.storage.from('clips').remove([urlParts[1]])
        }
      }
    } catch (e) {
      console.warn('[clipStore] cloud delete failed:', e.message)
    }
  }
}

/** Increment likes on a public clip */
export async function likeClip(clipId) {
  if (!isSupabaseConfigured()) return
  try {
    const { data } = await supabase.from('clips').select('likes').eq('id', clipId).single()
    if (data) {
      await supabase
        .from('clips')
        .update({ likes: (data.likes || 0) + 1 })
        .eq('id', clipId)
    }
  } catch (e) {
    console.warn('[clipStore] like failed:', e.message)
  }
}

/** Get share URL for a clip */
export function getShareUrl(shareId) {
  if (!shareId) return ''
  const base = window.location.origin + window.location.pathname
  return `${base}#/share/${shareId}`
}

// ─── Local-only helpers (for offline / stats) ─────────────────

export function getLocalClips() {
  return readLocal()
}

export function getClipCount() {
  return readLocal().length
}

export function getTotalDurationSeconds() {
  return readLocal().reduce((acc, c) => {
    const parts = (c.duration || '0:00').split(':').map(Number)
    return acc + (parts.length === 2 ? parts[0] * 60 + parts[1] : 0)
  }, 0)
}

export function formatDuration(totalSeconds) {
  if (totalSeconds < 60) return `${totalSeconds}s`
  const m = Math.floor(totalSeconds / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m`
}

export function randomGradient() {
  const hue1 = Math.floor(Math.random() * 360)
  const hue2 = (hue1 + 40 + Math.floor(Math.random() * 80)) % 360
  return `linear-gradient(145deg, hsl(${hue1}, 40%, 18%), hsl(${hue2}, 35%, 14%))`
}

export function timeAgo(ts) {
  if (!ts) return ''
  const now = Date.now()
  const time = typeof ts === 'string' ? new Date(ts).getTime() : ts
  const diff = now - time
  const s = Math.floor(diff / 1000)
  if (s < 60) return 'Just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hr ago`
  const d = Math.floor(h / 24)
  if (d === 1) return 'Yesterday'
  return `${d} days ago`
}

// ─── Map DB row → client format ─────────────────────────────

function mapDbClip(row) {
  return {
    id: row.id,
    title: row.title,
    game: row.game,
    duration: row.duration,
    size: row.size,
    visibility: row.visibility,
    createdAt: new Date(row.created_at).getTime(),
    author: row.author_name || row.author_tag || 'Unknown',
    authorTag: row.author_tag || '',
    fileUrl: row.file_url || '',
    thumbnailUrl: row.thumbnail_url || '',
    gradient: row.gradient || '',
    likes: row.likes || 0,
    views: row.views || 0,
    shareId: row.share_id || '',
    userId: row.user_id,
  }
}
