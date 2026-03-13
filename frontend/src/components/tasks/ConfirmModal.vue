<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'

defineProps<{
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const dialogRef = ref<HTMLElement | null>(null)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('cancel')
    return
  }

  if (e.key === 'Tab') {
    trapFocus(e)
  }
}

function trapFocus(e: KeyboardEvent) {
  if (!dialogRef.value) return
  const focusable = dialogRef.value.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

onMounted(async () => {
  document.addEventListener('keydown', onKeydown)
  await nextTick()
  dialogRef.value?.focus()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="fixed inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity"
        aria-hidden="true"
        @click="emit('cancel')"
      />
      <div
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'modal-title'"
        :aria-describedby="'modal-description'"
        tabindex="-1"
        class="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all focus:outline-none"
      >
        <h3 id="modal-title" class="text-lg font-semibold tracking-tight text-slate-900">{{ title }}</h3>
        <p id="modal-description" class="mt-2 text-sm text-slate-500">{{ message }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <BaseButton variant="secondary" @click="emit('cancel')"> Cancelar </BaseButton>
          <BaseButton variant="danger" :loading="loading" @click="emit('confirm')">
            {{ confirmLabel ?? 'Eliminar' }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
