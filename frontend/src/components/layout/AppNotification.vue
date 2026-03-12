<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'

const { notifications, remove } = useNotification()

const typeClasses: Record<string, string> = {
  success: 'border-l-emerald-500',
  error: 'border-l-red-500',
  info: 'border-l-blue-500',
}

const iconClasses: Record<string, string> = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-blue-500',
}

const typeIcons: Record<string, string> = {
  success: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  error: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
  info: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed right-5 top-20 z-50 flex w-96 flex-col gap-3">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
      >
        <div
          v-for="n in notifications"
          :key="n.id"
          class="flex items-start gap-3 rounded-xl bg-white p-4 shadow-xl shadow-slate-900/10"
          :class="typeClasses[n.type]"
        >
          <svg
            class="mt-0.5 h-5 w-5 shrink-0"
            :class="iconClasses[n.type]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" :d="typeIcons[n.type]" />
          </svg>
          <p class="flex-1 text-sm font-medium text-slate-700">{{ n.message }}</p>
          <button class="shrink-0 text-slate-400 transition-colors hover:text-slate-600" @click="remove(n.id)">
            <svg
              class="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
