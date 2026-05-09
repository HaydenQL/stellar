function toFileUrl(absPath) {
  if (!absPath || typeof absPath !== 'string') return ''
  const normalized = absPath.replace(/\\/g, '/')
  const prefix = normalized.startsWith('/') ? 'file://' : 'file:///'
  return prefix + encodeURI(normalized)
}

/** Short UI beep when no custom file is set */
function playSyntheticBeep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 880
    g.gain.value = 0.06
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    setTimeout(() => {
      o.stop()
      ctx.close()
    }, 120)
  } catch {
    /* AudioContext blocked */
  }
}

export async function playClipSound(settings) {
  if (!settings?.clipSoundEnabled) return
  const path = settings.clipSoundPath
  if (path) {
    const url = toFileUrl(path)
    const audio = new Audio(url)
    audio.volume = 0.85
    try {
      await audio.play()
    } catch {
      playSyntheticBeep()
    }
  } else {
    playSyntheticBeep()
  }
}
