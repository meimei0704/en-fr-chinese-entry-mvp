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
      className="secondary-link"
      onClick={() => {
        speakChinese({ text, audioSrc })
      }}
      style={{ marginTop: '0.75rem' }}
    >
      {label}
    </button>
  )
}
