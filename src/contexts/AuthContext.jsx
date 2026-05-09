import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Listen for auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      setLoading(false)
    })

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Ensure profile row exists after sign-up / first login
  const ensureProfile = useCallback(async (u, tag) => {
    if (!u || !isSupabaseConfigured()) return
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', u.id)
        .single()
      if (!data) {
        await supabase.from('profiles').insert({
          id: u.id,
          tag: tag || u.email?.split('@')[0] || 'Player',
          bio: 'Just here to clip the impossible.',
        })
      }
    } catch {
      // Table may not exist yet — that's fine
    }
  }, [])

  const signUp = useCallback(
    async (email, password, displayTag) => {
      setError(null)
      if (!isSupabaseConfigured()) {
        setError('Supabase is not configured. Add your credentials to .env')
        return null
      }
      const { data, error: err } = await supabase.auth.signUp({ email, password })
      if (err) {
        setError(err.message)
        return null
      }
      if (data.user) {
        await ensureProfile(data.user, displayTag)
      }
      return data
    },
    [ensureProfile],
  )

  const signIn = useCallback(async (email, password) => {
    setError(null)
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Add your credentials to .env')
      return null
    }
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (err) {
      setError(err.message)
      return null
    }
    return data
  }, [])

  const signOut = useCallback(async () => {
    setError(null)
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      error,
      signUp,
      signIn,
      signOut,
      clearError,
      isConfigured: isSupabaseConfigured(),
    }),
    [user, session, loading, error, signUp, signIn, signOut, clearError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
