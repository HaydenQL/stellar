import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { defaultSettings } from '@/lib/defaultSettings'
import { isLikelyGame } from '@/lib/gameDetection'
import { translate } from '@/lib/i18n'
import { playClipSound } from '@/lib/playClipSound'

const StellarContext = createContext(null)
const LS_KEY = 'stellar_settings'

/** Read settings from localStorage (web) or fall back to defaults */
function loadSavedSettings() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      return { ...defaultSettings, ...saved }
    }
  } catch { /* ignore */ }
  return { ...defaultSettings }
}

/** Persist settings to localStorage (web fallback for when Electron IPC isn't available) */
function persistSettings(s) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s))
  } catch { /* quota exceeded, etc. */ }
}

export function StellarProvider({ children }) {
  const [settings, setSettingsState] = useState(loadSavedSettings)
  const [hydrated, setHydrated] = useState(false)
  const [currentGame, setCurrentGame] = useState({
    label: '',
    title: '',
    owner: '',
    exePath: '',
  })

  const gameReady = useMemo(
    () => isLikelyGame(currentGame.owner, currentGame.title),
    [currentGame.owner, currentGame.title],
  )

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme
  }, [settings.theme])

  useEffect(() => {
    const hex = settings.accentColor || '#7c5dfa'
    document.documentElement.style.setProperty('--accent', hex)
    // Generate a lighter version for accent-2
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const lighter = `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)})`
    document.documentElement.style.setProperty('--accent-2', lighter)
  }, [settings.accentColor])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const s = await window.stellar?.getSettings?.()
        if (!cancelled && s && typeof s === 'object') {
          setSettingsState((prev) => {
            const merged = { ...prev, ...s }
            persistSettings(merged)
            return merged
          })
        }
      } catch {
        /* no electron in plain browser */
      }
      if (!cancelled) setHydrated(true)
    })()
    const unsubscribe =
      window.stellar?.onForegroundApp?.((payload) => {
        setCurrentGame({
          label: payload?.label || '',
          title: payload?.title || '',
          owner: payload?.owner || '',
          exePath: payload?.exePath || '',
        })
      }) ?? (() => {})
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  const updateSettings = useCallback(async (patch) => {
    if (!patch || typeof patch !== 'object') return
    setSettingsState((prev) => {
      const next = { ...prev, ...patch }
      persistSettings(next)
      return next
    })
    try {
      const next = await window.stellar?.setSettings?.(patch)
      if (next && typeof next === 'object') {
        setSettingsState((prev) => {
          const merged = { ...prev, ...next }
          persistSettings(merged)
          return merged
        })
      }
    } catch {
      /* IPC unavailable */
    }
  }, [])

  const t = useCallback(
    (key) => translate(settings.language, key),
    [settings.language],
  )

  const simulateClip = useCallback(async () => {
    try {
      await window.stellar?.setPresenceMeta?.({ clipping: true })
    } catch {
      /* optional */
    }
    await playClipSound(settings)
    window.setTimeout(() => {
      void window.stellar?.setPresenceMeta?.({ clipping: false })
    }, 1000)
  }, [settings])

  useEffect(() => {
    const off =
      window.stellar?.onGlobalHotkey?.((payload) => {
        if (payload?.action === 'saveClip') {
          void simulateClip()
        }
      }) ?? (() => {})
    return off
  }, [simulateClip])

  useEffect(() => {
    const off =
      window.stellar?.onSettingsPatch?.((patch) => {
        if (patch && typeof patch === 'object') {
          setSettingsState((prev) => {
            const next = { ...prev, ...patch }
            persistSettings(next)
            return next
          })
        }
      }) ?? (() => {})
    return off
  }, [])

  const saveHotkey = useCallback(
    async (combo) => {
      const hotkeys = {
        ...(settings.hotkeys || defaultSettings.hotkeys),
        saveClip: combo,
      }
      await updateSettings({ hotkeys, hotkeyClip: combo })
    },
    [settings.hotkeys, updateSettings],
  )

  const value = useMemo(
    () => ({
      settings,
      hydrated,
      updateSettings,
      t,
      currentGame,
      gameReady,
      simulateClip,
      saveHotkey,
    }),
    [settings, hydrated, updateSettings, t, currentGame, gameReady, simulateClip, saveHotkey],
  )

  return (
    <StellarContext.Provider value={value}>{children}</StellarContext.Provider>
  )
}

/** @see hooks pattern — provider lives in this file for cohesion */
// eslint-disable-next-line react-refresh/only-export-components -- useStellar is the app hook API
export function useStellar() {
  const ctx = useContext(StellarContext)
  if (!ctx) {
    throw new Error('useStellar must be used within StellarProvider')
  }
  return ctx
}
