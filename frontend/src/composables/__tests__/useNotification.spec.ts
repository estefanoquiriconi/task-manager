import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useNotification } from '@/composables/useNotification'

describe('useNotification', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    const { notifications } = useNotification()
    notifications.value = []
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('notify adds a notification', () => {
    const { notify, notifications } = useNotification()

    notify('Hello', 'success')

    expect(notifications.value).toHaveLength(1)
    expect(notifications.value[0]?.message).toBe('Hello')
    expect(notifications.value[0]?.type).toBe('success')
  })

  it('defaults type to info', () => {
    const { notify, notifications } = useNotification()

    notify('Info message')

    expect(notifications.value[0]?.type).toBe('info')
  })

  it('auto-dismisses after duration', () => {
    const { notify, notifications } = useNotification()

    notify('Temp', 'info', 3000)
    expect(notifications.value).toHaveLength(1)

    vi.advanceTimersByTime(3000)
    expect(notifications.value).toHaveLength(0)
  })

  it('remove eliminates a specific notification', () => {
    const { notify, remove, notifications } = useNotification()

    notify('First', 'info')
    notify('Second', 'error')
    const firstId = notifications.value[0]!.id

    remove(firstId)

    expect(notifications.value).toHaveLength(1)
    expect(notifications.value[0]?.message).toBe('Second')
  })

  it('multiple notifications accumulate', () => {
    const { notify, notifications } = useNotification()

    notify('One')
    notify('Two')
    notify('Three')

    expect(notifications.value).toHaveLength(3)
  })
})
