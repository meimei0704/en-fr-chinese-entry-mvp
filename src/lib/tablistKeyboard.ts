import type { KeyboardEvent } from 'react'

export function handleTablistKeyDown(
  event: KeyboardEvent<HTMLElement>,
  options: {
    tabCount: number
    selectedIndex: number
    onSelect: (index: number) => void
  },
) {
  const { tabCount, selectedIndex, onSelect } = options
  let nextIndex: number | null = null

  switch (event.key) {
    case 'ArrowRight':
      nextIndex = (selectedIndex + 1) % tabCount
      break
    case 'ArrowLeft':
      nextIndex = (selectedIndex - 1 + tabCount) % tabCount
      break
    case 'Home':
      nextIndex = 0
      break
    case 'End':
      nextIndex = tabCount - 1
      break
  }

  if (nextIndex === null) {
    return
  }

  event.preventDefault()
  onSelect(nextIndex)
}
