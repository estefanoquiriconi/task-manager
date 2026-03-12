<script setup lang="ts">
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
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="fixed inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity"
        @click="emit('cancel')"
      />
      <div
        class="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all"
      >
        <h3 class="text-lg font-semibold tracking-tight text-slate-900">{{ title }}</h3>
        <p class="mt-2 text-sm text-slate-500">{{ message }}</p>
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
