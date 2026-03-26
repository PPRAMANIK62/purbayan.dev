import { useRef } from "react"
import { useTerminalStore } from "@/stores/terminal-store"

export interface TerminalSounds {
  playKeystroke: () => void
  playEnter: () => void
  playError: () => void
  playSuccess: () => void
  playBoot: () => void
  playGameFood: () => void
  playGameOver: () => void
}

let sharedCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (sharedCtx === null) {
    sharedCtx = new AudioContext()
  }
  // Resume if suspended (browsers suspend until user gesture)
  if (sharedCtx.state === "suspended") {
    sharedCtx.resume()
  }
  return sharedCtx
}

const MASTER_GAIN = 0.18

// ---------------------------------------------------------------------------
// Sound synthesis helpers
// ---------------------------------------------------------------------------

function playNoiseBurst(durationMs: number, filterFreq: number): void {
  const ctx = getAudioContext()
  const duration = durationMs / 1000
  const sampleRate = ctx.sampleRate
  const bufferSize = Math.floor(sampleRate * duration)

  const buffer = ctx.createBuffer(1, bufferSize, sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = "bandpass"
  filter.frequency.value = filterFreq
  filter.Q.value = 1.0

  const gain = ctx.createGain()
  const now = ctx.currentTime
  gain.gain.setValueAtTime(MASTER_GAIN, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  source.start(now)
  source.stop(now + duration)
}

function playTone(
  startFreq: number,
  endFreq: number,
  durationMs: number,
  waveType: OscillatorType = "sine",
): void {
  const ctx = getAudioContext()
  const duration = durationMs / 1000
  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  osc.type = waveType
  osc.frequency.setValueAtTime(startFreq, now)
  if (startFreq !== endFreq) {
    osc.frequency.linearRampToValueAtTime(endFreq, now + duration)
  }

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(MASTER_GAIN, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + duration)
}

// ---------------------------------------------------------------------------
// Individual sound functions (check soundEnabled internally)
// ---------------------------------------------------------------------------

function isSoundEnabled(): boolean {
  return useTerminalStore.getState().soundEnabled
}

function keystroke(): void {
  if (!isSoundEnabled()) return
  playNoiseBurst(20, 2000)
}

function enter(): void {
  if (!isSoundEnabled()) return
  playNoiseBurst(30, 800)
}

function error(): void {
  if (!isSoundEnabled()) return
  playTone(200, 200, 100)
}

function success(): void {
  if (!isSoundEnabled()) return
  playTone(400, 800, 300)
}

function boot(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  const duration = 0.5
  const now = ctx.currentTime

  // Low hum
  const osc = ctx.createOscillator()
  osc.type = "sine"
  osc.frequency.value = 60

  const oscGain = ctx.createGain()
  oscGain.gain.setValueAtTime(0.001, now)
  oscGain.gain.linearRampToValueAtTime(MASTER_GAIN * 0.6, now + duration * 0.4)
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

  osc.connect(oscGain)
  oscGain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + duration)

  // Noise layer
  const sampleRate = ctx.sampleRate
  const bufferSize = Math.floor(sampleRate * duration)
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = "lowpass"
  filter.frequency.value = 200

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.001, now)
  noiseGain.gain.linearRampToValueAtTime(MASTER_GAIN * 0.3, now + duration * 0.3)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

  source.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(ctx.destination)

  source.start(now)
  source.stop(now + duration)
}

function gameFood(): void {
  if (!isSoundEnabled()) return
  playTone(600, 600, 40)
}

function gameOverSound(): void {
  if (!isSoundEnabled()) return
  playTone(400, 100, 200)
}

// ---------------------------------------------------------------------------
// Hook — returns stable references via useRef
// ---------------------------------------------------------------------------

export function useTerminalSounds(): TerminalSounds {
  const soundsRef = useRef<TerminalSounds | null>(null)

  if (soundsRef.current === null) {
    soundsRef.current = {
      playKeystroke: keystroke,
      playEnter: enter,
      playError: error,
      playSuccess: success,
      playBoot: boot,
      playGameFood: gameFood,
      playGameOver: gameOverSound,
    }
  }

  return soundsRef.current
}
