let audioCtx: AudioContext | null = null

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function playClick() {
  const ctx = ensureAudio()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'square'
  osc.frequency.value = 900
  gain.gain.value = 0.06
  osc.start()
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
  osc.stop(ctx.currentTime + 0.08)
}

export function playStatusChange() {
  const ctx = ensureAudio()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.value = 600
  gain.gain.value = 0.08
  osc.start()
  osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.15)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
  osc.stop(ctx.currentTime + 0.2)
}

export function playCompleted() {
  const ctx = ensureAudio()
  const delays = [0, 0.12, 0.24]
  const freqs = [800, 1000, 1300]
  delays.forEach((delay, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = freqs[i]
    gain.gain.value = 0
    gain.gain.setValueAtTime(0, ctx.currentTime + delay)
    gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + delay + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2)
    osc.start(ctx.currentTime + delay)
    osc.stop(ctx.currentTime + delay + 0.2)
  })
}

export function playTabClick() {
  const ctx = ensureAudio()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'triangle'
  osc.frequency.value = 1200
  gain.gain.value = 0.05
  osc.start()
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
  osc.stop(ctx.currentTime + 0.05)
}
