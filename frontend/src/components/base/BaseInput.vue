<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    error?: string
    multiline?: boolean
  }>(),
  { multiline: false },
)

defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ default: '' })

const attrs = useAttrs()

const inputClasses = computed(() => [
  'block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
  props.error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
    : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20',
])
</script>

<template>
  <div>
    <label class="mb-1.5 block text-sm font-medium text-slate-700">{{ label }}</label>
    <textarea
      v-if="multiline"
      v-model="model"
      v-bind="attrs"
      rows="3"
      :class="inputClasses"
    />
    <input
      v-else
      v-model="model"
      v-bind="attrs"
      :class="inputClasses"
    />
    <p v-if="error" class="mt-1.5 text-sm text-red-500">{{ error }}</p>
  </div>
</template>
