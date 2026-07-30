interface SpeakChineseOptions {
  text: string
  audioSrc?: string
  fallbackAudioSrc?: string
}

let activeAudio: HTMLAudioElement | null = null

function canUseBrowserTts() {
  return (
    typeof window !== 'undefined' &&
    typeof SpeechSynthesisUtterance !== 'undefined' &&
    'speechSynthesis' in window
  )
}

function stopActiveAudio() {
  if (!activeAudio) {
    return
  }

  activeAudio.pause()
  activeAudio.currentTime = 0
  activeAudio = null
}

function speakWithBrowserTts(text: string) {
  if (
    !canUseBrowserTts()
  ) {
    return false
  }

  stopActiveAudio()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.9

  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)

  return true
}

function playAudioSrc(audioSrc: string, text: string, fallbackAudioSrc?: string) {
  if (typeof Audio === 'undefined') {
    return speakWithBrowserTts(text)
  }

  stopActiveAudio()

  if (canUseBrowserTts()) {
    window.speechSynthesis.cancel()
  }

  const audio = new Audio(audioSrc)
  activeAudio = audio
  let didFallback = false

  function clearIfCurrent() {
    if (activeAudio === audio) {
      activeAudio = null
    }
  }

  function fallbackFromAudio() {
    if (didFallback) {
      return
    }

    didFallback = true
    clearIfCurrent()

    if (fallbackAudioSrc && fallbackAudioSrc !== audioSrc) {
      playAudioSrc(fallbackAudioSrc, text)
      return
    }

    speakWithBrowserTts(text)
  }

  audio.addEventListener('ended', clearIfCurrent, { once: true })
  audio.addEventListener('error', fallbackFromAudio, { once: true })

  const playResult = audio.play()
  playResult?.catch(fallbackFromAudio)

  return true
}

export function speakChinese({ text, audioSrc, fallbackAudioSrc }: SpeakChineseOptions) {
  if (audioSrc) {
    return playAudioSrc(audioSrc, text, fallbackAudioSrc)
  }

  return speakWithBrowserTts(text)
}
