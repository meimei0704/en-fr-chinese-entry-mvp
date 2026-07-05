interface SpeakChineseOptions {
  text: string
  audioSrc?: string
}

export function speakChinese({ text }: SpeakChineseOptions) {
  if (
    typeof window === 'undefined' ||
    typeof SpeechSynthesisUtterance === 'undefined' ||
    !('speechSynthesis' in window)
  ) {
    return false
  }

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.9

  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)

  return true
}
