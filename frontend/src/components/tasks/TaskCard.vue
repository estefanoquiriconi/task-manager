<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Task } from '@/types'
import BaseBadge from '@/components/base/BaseBadge.vue'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
  'status-change': [id: number, status: string]
  delete: [id: number]
}>()

const priorityConfig: Record<string, { color: 'red' | 'yellow' | 'gray' }> = {
  ALTA: { color: 'red' },
  MEDIA: { color: 'yellow' },
  BAJA: { color: 'gray' },
}

const statusConfig: Record<string, { label: string; color: 'amber' | 'blue' | 'green' }> = {
  pendiente: { label: 'Pendiente', color: 'amber' },
  en_progreso: { label: 'En Progreso', color: 'blue' },
  completada: { label: 'Completada', color: 'green' },
}

const isOverdue = computed(() => {
  if (!props.task.due_date || props.task.status === 'completada') return false
  return new Date(props.task.due_date) < new Date()
})

const defaultStatus = { label: 'Pendiente', color: 'amber' as const }
const statusInfo = computed(() => statusConfig[props.task.status] ?? defaultStatus)
const priorityInfo = computed(
  () => priorityConfig[props.task.priority.name] ?? { color: 'gray' as const },
)

function onStatusChange(event: Event) {
  emit('status-change', props.task.id, (event.target as HTMLSelectElement).value)
}
</script>

<template>
  <div
    class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-3">
      <h3 class="truncate text-base font-semibold tracking-tight text-slate-900">
        {{ task.title }}
      </h3>
      <BaseBadge :color="priorityInfo.color" size="sm">
        {{ task.priority.name }}
      </BaseBadge>
    </div>

    <!-- Description -->
    <p v-if="task.description" class="mt-2.5 line-clamp-2 text-sm leading-relaxed text-slate-500">
      {{ task.description }}
    </p>

    <!-- Tags -->
    <div v-if="task.tags.length" class="mt-3 flex flex-wrap gap-1.5">
      <BaseBadge v-for="tag in task.tags" :key="tag.id" color="gray" size="sm">
        {{ tag.name }}
      </BaseBadge>
    </div>

    <!-- Meta row: due date + status badge -->
    <div class="mt-4 flex flex-wrap items-center gap-3">
      <BaseBadge :color="statusInfo.color">
        {{ statusInfo.label }}
      </BaseBadge>

      <span
        v-if="task.due_date"
        class="flex items-center gap-1 text-xs"
        :class="isOverdue ? 'font-medium text-red-600' : 'text-gray-400'"
      >
        <svg
          class="h-3.5 w-3.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
        {{ task.due_date.slice(0, 10) }}
      </span>
    </div>

    <!-- Divider + Actions -->
    <div class="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
      <select
        :value="task.status"
        class="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        @change="onStatusChange"
      >
        <option value="pendiente">Pendiente</option>
        <option value="en_progreso">En Progreso</option>
        <option value="completada">Completada</option>
      </select>

      <div
        class="ml-auto flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100 sm:opacity-100"
      >
        <RouterLink
          :to="{ name: 'task-edit', params: { id: task.id } }"
          class="rounded-lg p-2 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          title="Editar"
        >
          <svg
            class="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </RouterLink>
        <button
          class="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/40"
          title="Eliminar"
          @click="emit('delete', task.id)"
        >
          <svg
            class="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
