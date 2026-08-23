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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="8.4" />
      <path d="M7.7 13.9c1.3-3 3.6-4.1 5.9-3.4 1.7.6 2.6 1.9 2.4 3.4-.2 1.5-1.4 2.5-2.9 2.5-1.6 0-2.8-1.1-2.8-2.7 0-1.4 1.2-2.4 2.6-2.4" />
      <path d="M8.2 17.1c2.5-.9 5.2-.7 7.6.5" />
    </svg>
  )
}
