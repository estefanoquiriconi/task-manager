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
    red: 'bg-red-50 text-red-700 ring-red-600/10 border border-red-100',
    yellow: 'bg-yellow-50 text-yellow-700 ring-yellow-600/10 border border-yellow-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10 border border-emerald-100',
    blue: 'bg-sky-50 text-sky-700 ring-sky-600/10 border border-sky-100',
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/10 border border-indigo-100',
    gray: 'bg-slate-50 text-slate-700 ring-slate-600/10 border border-slate-100',
    amber: 'bg-amber-50 text-amber-800 ring-amber-600/10 border border-amber-100',
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
