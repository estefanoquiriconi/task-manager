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
    red: 'bg-red-600 text-white',
    yellow: 'bg-yellow-500 text-white',
    green: 'bg-emerald-600 text-white',
    blue: 'bg-sky-600 text-white',
    indigo: 'bg-indigo-600 text-white',
    gray: 'bg-slate-600 text-white',
    amber: 'bg-amber-500 text-white',
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
