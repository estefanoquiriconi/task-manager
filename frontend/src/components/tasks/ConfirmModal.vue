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
        <h3 id="modal-title" class="text-lg font-semibold tracking-tight text-slate-900">
          {{ title }}
        </h3>
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
