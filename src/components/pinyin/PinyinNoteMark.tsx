interface PinyinNoteMarkProps {
  className?: string
}

export function PinyinNoteMark({ className }: PinyinNoteMarkProps) {
  return (
    <svg
      className={className ? `pinyin-note-mark ${className}` : 'pinyin-note-mark'}
      data-testid="pinyin-note-mark"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12h16" />
      <path d="M12 4v16" />
      <path d="M6.34 6.34 17.66 17.66" />
      <path d="M17.66 6.34 6.34 17.66" />
    </svg>
  )
}
