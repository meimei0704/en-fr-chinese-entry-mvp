interface PinyinNoteMarkProps {
  className?: string
}

export function PinyinNoteMark({ className }: PinyinNoteMarkProps) {
  return (
    <svg
      className={className}
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
      <path d="M9.15 5.3 14.85 18.7" />
      <path d="M14.85 5.3 9.15 18.7" />
    </svg>
  )
}
