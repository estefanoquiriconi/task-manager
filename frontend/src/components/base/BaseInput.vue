<script setup lang="ts">
defineProps<{
  label: string
  error?: string
  type?: string
}>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div>
    <label class="mb-1.5 block text-sm font-medium text-slate-700">{{ label }}</label>
    <input
      v-if="type !== 'textarea'"
      v-model="model"
      :type="type ?? 'text'"
      class="block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
      :class="
        error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
          : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
      "
    />
    <textarea
      v-else
      v-model="model"
      rows="3"
      class="block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
      :class="
        error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
          : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
      "
    />
    <p v-if="error" class="mt-1.5 text-sm text-red-500">{{ error }}</p>
  </div>
</template>
