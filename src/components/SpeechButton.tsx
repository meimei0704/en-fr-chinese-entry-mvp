import { speakChinese } from '../lib/speech'

interface SpeechButtonProps {
  label: string
  text: string
  audioSrc?: string
}

export function SpeechButton({ label, text, audioSrc }: SpeechButtonProps) {
  return (
    <button
      type="button"
      className="chip-button speech-button"
      onClick={() => {
        speakChinese({ text, audioSrc })
      }}
    >
      {label}
    </button>
  )
}
