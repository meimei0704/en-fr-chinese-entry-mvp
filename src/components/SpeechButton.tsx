import { speakChinese } from '../lib/speech'

interface SpeechButtonProps {
  label: string
  text: string
  audioSrc?: string
  fallbackAudioSrc?: string
  disabled?: boolean
  isPlaying?: boolean
  onActivate?: () => void
  onPlaybackEnd?: () => void
}

export function SpeechButton({
  label,
  text,
  audioSrc,
  fallbackAudioSrc,
  disabled = false,
  isPlaying = false,
  onActivate,
  onPlaybackEnd,
}: SpeechButtonProps) {
  return (
    <button
      type="button"
      className={`speech-button${isPlaying ? ' speech-button--is-playing' : ''}`}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={() => {
        onActivate?.()
        speakChinese({ text, audioSrc, fallbackAudioSrc, onEnd: onPlaybackEnd })
      }}
    >
      <svg
        aria-hidden="true"
        className="speech-button__icon"
        focusable="false"
        viewBox="0 0 24 24"
      >
        <path d="M4 9.35v5.3h3.35l5.3 4.05V5.3l-5.3 4.05H4Z" fill="currentColor" />
        <path
          d="M15.8 8.65a4.55 4.55 0 0 1 0 6.7"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M18.55 5.9a8.25 8.25 0 0 1 0 12.2"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  )
}
