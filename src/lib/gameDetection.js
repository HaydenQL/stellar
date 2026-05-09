/** Processes that usually mean "not in a game" for the status bar */
const NON_GAME_OWNERS = new Set(
  [
    'explorer',
    'application frame host',
    'windows shell experience host',
    'systemsettings',
    'textinputhost',
    'shellexperiencehost',
    'searchhost',
    'startmenuexperiencehost',
    'lockapp',
    'taskmgr',
    'snippingtool',
    'discord',
    'spotify',
    'slack',
    'code',
    'cursor',
    'devenv',
    'chrome',
    'msedge',
    'firefox',
    'brave',
    'opera',
    'notepad',
    'notepad++',
    'windowsterminal',
    'terminal',
    'powershell',
    'cmd',
    'electron',
    'stellar',
  ].map((s) => s.toLowerCase()),
)

export function isLikelyGame(ownerName, title) {
  const o = (ownerName || '').toLowerCase().replace(/\.exe$/, '')
  const t = (title || '').toLowerCase()
  if (!o && !t) return false
  if (o && NON_GAME_OWNERS.has(o)) return false
  if (
    t.includes('microsoft') &&
    (t.includes('edge') || t.includes('store') || t.includes('settings'))
  )
    return false
  if (t.includes(' - visual studio')) return false
  if (t.includes('cursor')) return false
  return !!(o || t)
}
