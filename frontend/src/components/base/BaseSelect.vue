<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const props = defineProps<{
  label: string
  error?: string
  options: { value: string | number; label: string }[]
  placeholder?: string
}>()

defineOptions({ inheritAttrs: false })

const model = defineModel<string | number | undefined>()

const attrs = useAttrs()

const selectClasses = computed(() => [
  'block w-full cursor-pointer rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
  props.error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
    : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20',
])
</script>

<template>
  <div>
    <label class="mb-1.5 block text-sm font-medium text-slate-700">{{ label }}</label>
    <select
      v-model="model"
      v-bind="attrs"
      :class="selectClasses"
    >
      <option v-if="placeholder" :value="undefined" class="text-slate-500">
        {{ placeholder }}
      </option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <p v-if="error" class="mt-1.5 text-sm text-red-500">{{ error }}</p>
  </div>
</template>
