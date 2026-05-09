export {}

type ForegroundPayload = {
  title?: string
  owner?: string
  label?: string
  exePath?: string
}

type GlobalHotkeyPayload = {
  action?: string
}

type RunningApp = {
  name?: string
  pid?: number
  exePath?: string
}

declare global {
  interface Window {
    stellar?: {
      getAppVersion: () => Promise<string>
      getSettings: () => Promise<Record<string, unknown>>
      setSettings: (patch: Record<string, unknown>) => Promise<Record<string, unknown>>
      selectSoundFile: () => Promise<string | null>
      selectFolder: () => Promise<string | null>
      getFileIcon: (filePath: string) => Promise<string | null>
      getRunningGames: () => Promise<RunningApp[]>
      openExternal: (url: string) => Promise<void>
      setPresenceMeta: (meta: { clipping?: boolean }) => Promise<void>
      overlaySetIgnoreMouse: (ignore: boolean) => Promise<void>
      onForegroundApp: (cb: (payload: ForegroundPayload) => void) => () => void
      onGlobalHotkey: (cb: (payload: GlobalHotkeyPayload) => void) => () => void
      onSettingsPatch: (cb: (patch: Record<string, unknown>) => void) => () => void
    }
  }
}
