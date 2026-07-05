interface PracticeChecklistProps {
  items: Array<{
    label: string
    complete: boolean
  }>
  ariaLabel: string
}

export function PracticeChecklist({ items, ariaLabel }: PracticeChecklistProps) {
  return (
    <ul
      aria-label={ariaLabel}
      style={{
        listStyle: 'none',
        padding: 0,
        margin: '1rem 0 0',
        display: 'grid',
        gap: '0.5rem',
      }}
    >
      {items.map((item) => (
        <li
          key={item.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '999px',
            background: item.complete ? '#dcfce7' : '#e2e8f0',
          }}
        >
          <span aria-hidden="true">{item.complete ? '✓' : '○'}</span>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
