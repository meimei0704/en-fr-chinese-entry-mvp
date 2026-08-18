import { describe, expect, it, vi } from 'vitest'

import { handleTablistKeyDown } from './tablistKeyboard'

function dispatch(key: string) {
  const preventDefault = vi.fn()
  const event = { key, preventDefault } as unknown as Parameters<typeof handleTablistKeyDown>[0]
  const onSelect = vi.fn()
  handleTablistKeyDown(event, { tabCount: 4, selectedIndex: 1, onSelect })
  return { preventDefault, onSelect }
}

describe('handleTablistKeyDown', () => {
  it('moves forward with ArrowRight and wraps', () => {
    expect(dispatch('ArrowRight').onSelect).toHaveBeenCalledWith(2)
    const wrapped = dispatch('ArrowRight')
    expect(wrapped.preventDefault).toHaveBeenCalled()
  })

  it('moves backward with ArrowLeft and wraps', () => {
    expect(dispatch('ArrowLeft').onSelect).toHaveBeenCalledWith(0)
  })

  it('jumps to the first and last tab with Home and End', () => {
    expect(dispatch('Home').onSelect).toHaveBeenCalledWith(0)
    expect(dispatch('End').onSelect).toHaveBeenCalledWith(3)
  })

  it('ignores unrelated keys', () => {
    const { preventDefault, onSelect } = dispatch('Tab')
    expect(preventDefault).not.toHaveBeenCalled()
    expect(onSelect).not.toHaveBeenCalled()
  })
})
