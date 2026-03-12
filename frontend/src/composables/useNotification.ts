import { ref } from 'vue'

export interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const notifications = ref<Notification[]>([])
let nextId = 0

export function useNotification() {
  function notify(message: string, type: Notification['type'] = 'info', duration = 4000) {
    const id = nextId++
    notifications.value.push({ id, message, type })
    setTimeout(() => remove(id), duration)
  }

  function remove(id: number) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return { notifications, notify, remove }
}
