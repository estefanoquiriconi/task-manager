<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    color?: 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'gray' | 'amber'
    size?: 'sm' | 'md'
  }>(),
  { color: 'gray', size: 'sm' },
)

const classes = computed(() => {
  const colors: Record<string, string> = {
    red: 'bg-red-100 text-red-800 border border-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    green: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    blue: 'bg-sky-100 text-sky-800 border border-sky-200',
    indigo: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200',
    amber: 'bg-amber-100 text-amber-800 border border-amber-200',
  }
  const sizes = { sm: 'px-2.5 py-0.5 text-[0.7rem]', md: 'px-3 py-1 text-xs' }
  return [
    'inline-flex items-center rounded-full font-semibold tracking-wide shadow-sm',
    colors[props.color],
    sizes[props.size],
  ]
})
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
