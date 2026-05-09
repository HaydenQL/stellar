const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('stellar', {
  getAppVersion: () => ipcRenderer.invoke('stellar:get-app-version'),
  getSettings: () => ipcRenderer.invoke('stellar:get-settings'),
  setSettings: (patch) => ipcRenderer.invoke('stellar:set-settings', patch),
  selectSoundFile: () => ipcRenderer.invoke('stellar:select-sound-file'),
  selectFolder: () => ipcRenderer.invoke('stellar:select-folder'),
  selectImageFile: () => ipcRenderer.invoke('stellar:select-image-file'),
  getFileIcon: (filePath) => ipcRenderer.invoke('stellar:get-file-icon', filePath),
  getRunningGames: () => ipcRenderer.invoke('stellar:get-running-games'),
  openExternal: (url) => ipcRenderer.invoke('stellar:open-external', url),
  setPresenceMeta: (meta) => ipcRenderer.invoke('stellar:set-presence-meta', meta),
  overlaySetIgnoreMouse: (ignore) =>
    ipcRenderer.invoke('stellar:overlay-set-ignore-mouse', ignore),

  onForegroundApp: (callback) => {
    if (typeof callback !== 'function') return () => {}
    const handler = (_event, payload) => callback(payload)
    ipcRenderer.on('stellar:foreground-app', handler)
    return () => ipcRenderer.removeListener('stellar:foreground-app', handler)
  },

  onGlobalHotkey: (callback) => {
    if (typeof callback !== 'function') return () => {}
    const handler = (_event, payload) => callback(payload)
    ipcRenderer.on('stellar:global-hotkey', handler)
    return () => ipcRenderer.removeListener('stellar:global-hotkey', handler)
  },

  onSettingsPatch: (callback) => {
    if (typeof callback !== 'function') return () => {}
    const handler = (_event, payload) => callback(payload)
    ipcRenderer.on('stellar:settings-patch', handler)
    return () => ipcRenderer.removeListener('stellar:settings-patch', handler)
  },
})
