const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  dialog,
  nativeTheme,
  globalShortcut,
} = require('electron')
const path = require('path')
const Store = require('electron-store')

const defaults = require('./settings-defaults.cjs')
const store = new Store({ name: 'stellar', defaults })
const discordConfig = require('./discord-config.cjs')
const { normalizeAccelerator } = require('./hotkey-util.cjs')

const isDev = !app.isPackaged

/** @type {BrowserWindow | null} */
let mainWindow = null
/** @type {BrowserWindow | null} */
let overlayWindow = null
/** @type {import('discord-rpc').Client | null} */
let rpcClient = null

let currentGameLabel = ''
let isClipping = false

const registeredAccelerators = new Set()

function resolveDiscordClientId() {
  const fromFile = String(discordConfig.clientId || '').trim()
  if (fromFile) return fromFile
  return String(store.get('discordClientId') || '').trim()
}

function applyLoginItem() {
  try {
    app.setLoginItemSettings({
      openAtLogin: !!store.get('startWithWindows'),
      path: process.execPath,
      args: isDev ? [path.resolve(process.argv[1])] : undefined,
    })
  } catch (_) {}
}

function buildDiscordActivity() {
  const s = store.store
  if (!s.discordRichPresence || !resolveDiscordClientId()) return null

  let details = 'In Stellar'
  if (s.discordShowClipping && isClipping) details = 'Clipping with Stellar'

  let state
  if (s.discordShowGame && currentGameLabel) {
    state = currentGameLabel
  }

  return {
    details,
    state,
    startTimestamp: Date.now(),
  }
}

async function destroyRpc() {
  if (!rpcClient) return
  try {
    await rpcClient.clearActivity()
  } catch (_) {}
  try {
    await rpcClient.destroy()
  } catch (_) {}
  rpcClient = null
}

async function pushDiscordActivity() {
  if (!rpcClient) return
  const act = buildDiscordActivity()
  if (!act) {
    try {
      await rpcClient.clearActivity()
    } catch (_) {}
    return
  }
  try {
    await rpcClient.setActivity(act)
  } catch (_) {}
}

async function refreshDiscordRpc() {
  await destroyRpc()
  const s = store.store
  const clientId = resolveDiscordClientId()
  if (!s.discordRichPresence || !clientId) return

  try {
    const DiscordRPC = require('discord-rpc')
    rpcClient = new DiscordRPC.Client({ transport: 'ipc' })
    rpcClient.on('ready', () => {
      pushDiscordActivity()
    })
    await rpcClient.login({ clientId })
  } catch (_) {
    rpcClient = null
  }
}

function sendToMainWindow(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload)
  }
}

function unregisterStellarShortcuts() {
  for (const acc of registeredAccelerators) {
    try {
      globalShortcut.unregister(acc)
    } catch (_) {}
  }
  registeredAccelerators.clear()
}

function registerStellarShortcuts() {
  unregisterStellarShortcuts()
  const h = store.get('hotkeys') || {}
  const clipRaw = h.saveClip || store.get('hotkeyClip') || 'F9'
  const clip = normalizeAccelerator(clipRaw) || 'F9'

  const bindings = [
    [clip, () => sendToMainWindow('stellar:global-hotkey', { action: 'saveClip' })],
    [
      normalizeAccelerator(h.toggleRecord || ''),
      () => sendToMainWindow('stellar:global-hotkey', { action: 'toggleRecord' }),
    ],
    [
      normalizeAccelerator(h.screenshot || ''),
      () => sendToMainWindow('stellar:global-hotkey', { action: 'screenshot' }),
    ],
    [
      normalizeAccelerator(h.toggleOverlay || ''),
      () => {
        const next = !store.get('overlayEnabled')
        store.set('overlayEnabled', next)
        syncOverlayWindow()
        sendToMainWindow('stellar:settings-patch', { overlayEnabled: next })
      },
    ],
    [
      normalizeAccelerator(h.bookmark || ''),
      () => sendToMainWindow('stellar:global-hotkey', { action: 'bookmark' }),
    ],
  ]

  for (const [accelerator, fn] of bindings) {
    if (!accelerator) continue
    try {
      if (globalShortcut.register(accelerator, fn)) {
        registeredAccelerators.add(accelerator)
      }
    } catch (_) {}
  }
}

function pollIntervalMs() {
  const low = !!store.get('lowPowerMode')
  if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isFocused()) {
    return low ? 45000 : 20000
  }
  return low ? 20000 : 8000
}

let gamePollTimer = null
function scheduleGamePoll() {
  if (gamePollTimer) clearInterval(gamePollTimer)
  gamePollTimer = setInterval(() => {
    void tickForegroundApp()
  }, pollIntervalMs())
}

async function tickForegroundApp() {
  if (!mainWindow || mainWindow.isDestroyed()) return
  let title = ''
  let owner = ''
  let exePath = ''
  try {
    const activeWin = require('active-win')
    const w = await activeWin()
    title = w?.title || ''
    owner = w?.owner?.name || ''
    exePath = w?.owner?.path || ''
  } catch (_) {
    return
  }

  const label = owner || title || ''
  mainWindow.webContents.send('stellar:foreground-app', {
    title,
    owner,
    label,
    exePath,
  })
  if (label !== currentGameLabel) {
    currentGameLabel = label
    await pushDiscordActivity()
  }
}

function destroyOverlay() {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.close()
  }
  overlayWindow = null
}

function createOverlayWindow() {
  if (overlayWindow && !overlayWindow.isDestroyed()) return
  overlayWindow = new BrowserWindow({
    width: 300,
    height: 76,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    show: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  overlayWindow.setMenuBarVisibility(false)
  if (isDev) {
    overlayWindow.loadURL('http://127.0.0.1:5173/#/overlay')
  } else {
    overlayWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      hash: '/overlay',
    })
  }
  overlayWindow.once('ready-to-show', () => {
    if (overlayWindow && !overlayWindow.isDestroyed()) overlayWindow.showInactive()
  })
  overlayWindow.on('closed', () => {
    overlayWindow = null
  })
}

function syncOverlayWindow() {
  const on = !!store.get('overlayEnabled')
  if (on) createOverlayWindow()
  else destroyOverlay()
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: '#0b0e14',
    show: false,
    title: 'Stellar',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.once('ready-to-show', () => {
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.show()
  })

  mainWindow.on('focus', () => scheduleGamePoll())
  mainWindow.on('blur', () => scheduleGamePoll())
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (isDev) {
    mainWindow.loadURL('http://127.0.0.1:5173/#/')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      hash: '/',
    })
  }
}

ipcMain.handle('stellar:get-app-version', () => app.getVersion())

ipcMain.handle('stellar:get-settings', () => ({ ...store.store }))

ipcMain.handle('stellar:set-settings', async (_, patch) => {
  if (!patch || typeof patch !== 'object') return { ...store.store }
  for (const key of Object.keys(patch)) {
    store.set(key, patch[key])
  }
  if (patch.hotkeys && typeof patch.hotkeys === 'object') {
    const sc = patch.hotkeys.saveClip
    if (sc) store.set('hotkeyClip', sc)
  }
  applyLoginItem()
  syncOverlayWindow()
  registerStellarShortcuts()
  await refreshDiscordRpc()
  await pushDiscordActivity()
  if (patch.theme) {
    try {
      nativeTheme.themeSource = 'dark'
    } catch {
      /* optional */
    }
  }
  return { ...store.store }
})

ipcMain.handle('stellar:get-file-icon', async (_, filePath) => {
  if (!filePath || typeof filePath !== 'string') return null
  try {
    const img = await app.getFileIcon(filePath, { size: 'large' })
    if (img.isEmpty()) return null
    return img.toDataURL()
  } catch (_) {
    return null
  }
})

ipcMain.handle('stellar:get-running-games', async () => {
  try {
    const si = require('systeminformation')
    const data = await si.processes()
    const list = data.list || []
    const seen = new Set()
    const out = []
    for (const p of list) {
      let exePath = (p.path || '').trim()
      if (!exePath && typeof p.command === 'string') {
        const m = p.command.match(/("[^"]+\.exe"|[^\s]+\.exe)/i)
        if (m) exePath = m[1].replace(/^"|"$/g, '')
      }
      if (!exePath || !/\.exe$/i.test(exePath)) continue
      if (/\\windows\\|\\microsoft\\windows\\|\\system32\\|\\syswow64\\/i.test(exePath))
        continue
      const key = exePath.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      out.push({
        name: p.name || path.basename(exePath, '.exe'),
        pid: p.pid,
        exePath,
      })
      if (out.length >= 56) break
    }
    out.sort((a, b) => String(a.name).localeCompare(String(b.name)))
    return out
  } catch (_) {
    return []
  }
})

ipcMain.handle('stellar:select-sound-file', async () => {
  const win = BrowserWindow.getFocusedWindow() || mainWindow
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    title: 'Clip notification sound',
    properties: ['openFile'],
    filters: [{ name: 'Audio', extensions: ['wav', 'mp3', 'ogg', 'flac', 'm4a'] }],
  })
  if (canceled || !filePaths[0]) return null
  return filePaths[0]
})

ipcMain.handle('stellar:select-folder', async () => {
  const win = BrowserWindow.getFocusedWindow() || mainWindow
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    title: 'Clips folder',
    properties: ['openDirectory'],
  })
  if (canceled || !filePaths[0]) return null
  return filePaths[0]
})

ipcMain.handle('stellar:select-image-file', async () => {
  const win = BrowserWindow.getFocusedWindow() || mainWindow
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    title: 'Choose image',
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'] }],
  })
  if (canceled || !filePaths[0]) return null
  return filePaths[0]
})

ipcMain.handle('stellar:open-external', async (_, url) => {
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return
  await shell.openExternal(url)
})

ipcMain.handle('stellar:set-presence-meta', async (_, meta) => {
  if (meta && typeof meta.clipping === 'boolean') {
    isClipping = meta.clipping
  }
  await pushDiscordActivity()
})

ipcMain.handle('stellar:overlay-set-ignore-mouse', async (_, ignore) => {
  if (!overlayWindow || overlayWindow.isDestroyed()) return
  const on = !!ignore
  overlayWindow.setIgnoreMouseEvents(on, on ? { forward: true } : undefined)
})

app.whenReady().then(() => {
  applyLoginItem()
  createMainWindow()
  scheduleGamePoll()
  void tickForegroundApp()
  registerStellarShortcuts()
  void refreshDiscordRpc()
  syncOverlayWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  unregisterStellarShortcuts()
})

app.on('before-quit', async () => {
  await destroyRpc()
})
