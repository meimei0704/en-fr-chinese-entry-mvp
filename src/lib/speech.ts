interface SpeakChineseOptions {
  text: string
  audioSrc?: string
  fallbackAudioSrc?: string
  onEnd?: () => void
}

let activeAudio: HTMLAudioElement | null = null
let activePlayback: { id: number; onEnd?: () => void } | null = null
let playbackId = 0

const preloadAudioElements: HTMLAudioElement[] = []
const preloadedAudioSrcs = new Set<string>()

const RETRY_DELAYS_MS = [200, 500, 1000]
const MAX_RETRIES = RETRY_DELAYS_MS.length

function firePlaybackEnd() {
  if (!activePlayback) {
    return
  }

  const { onEnd } = activePlayback
  activePlayback = null
  onEnd?.()
}

function stopActiveAudio() {
  firePlaybackEnd()

  if (!activeAudio) {
    return
  }

  activeAudio.pause()
  activeAudio.currentTime = 0
  activeAudio.removeAttribute('src')
  activeAudio.load()
  activeAudio = null
}

function playWithRetry(
  audio: HTMLAudioElement,
  audioSrc: string,
  id: number,
  attempt: number,
  onGiveUp: () => void,
) {
  if (id !== playbackId) {
    return
  }

  try {
    if (audio.getAttribute('src') !== audioSrc) {
      audio.src = audioSrc
      audio.load()
    }
  } catch {
    // ignore source assignment errors; retry still attempts play()
  }

  audio.play()?.catch(() => {
    if (id !== playbackId) {
      return
    }

    if (attempt < MAX_RETRIES) {
      window.setTimeout(
        () => playWithRetry(audio, audioSrc, id, attempt + 1, onGiveUp),
        RETRY_DELAYS_MS[attempt],
      )
      return
    }

    onGiveUp()
  })
}

function playAudioSrc(audioSrc: string, fallbackAudioSrc?: string, onEnd?: () => void) {
  if (typeof Audio === 'undefined') {
    return false
  }

  stopActiveAudio()

  const id = ++playbackId
  const audio = new Audio()
  audio.preload = 'auto'
  activeAudio = audio
  activePlayback = { id, onEnd }

  audio.addEventListener('ended', () => {
    if (id !== playbackId) {
      return
    }

    firePlaybackEnd()
  })

  playWithRetry(audio, audioSrc, id, 0, () => {
    if (id !== playbackId) {
      return
    }

    activeAudio = null
    firePlaybackEnd()

    if (fallbackAudioSrc && fallbackAudioSrc !== audioSrc) {
      playAudioSrc(fallbackAudioSrc, undefined, onEnd)
    }
  })

  return true
}

export function preloadAudioSources(srcs: string[]) {
  if (typeof Audio === 'undefined') {
    return
  }

  for (const src of srcs) {
    if (preloadedAudioSrcs.has(src)) {
      continue
    }
    preloadedAudioSrcs.add(src)

    const audio = new Audio()
    audio.preload = 'auto'
    audio.src = src
    audio.load()
    preloadAudioElements.push(audio)
  }
}

export function speakChinese({ audioSrc, fallbackAudioSrc, onEnd }: SpeakChineseOptions) {
  if (audioSrc) {
    return playAudioSrc(audioSrc, fallbackAudioSrc, onEnd)
  }

  return false
}
