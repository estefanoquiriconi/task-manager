<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Task, TaskStatus } from '@/types'
import { TASK_STATUS_OPTIONS } from '@/types'
import BaseBadge from '@/components/base/BaseBadge.vue'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
  'status-change': [id: number, status: TaskStatus]
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

const defaultStatus = { label: 'Pendiente', color: 'amber' as const }
const statusInfo = computed(() => statusConfig[props.task.status] ?? defaultStatus)
const priorityInfo = computed(
  () => priorityConfig[props.task.priority.name] ?? { color: 'gray' as const },
)

function onStatusChange(event: Event) {
  emit('status-change', props.task.id, (event.target as HTMLSelectElement).value as TaskStatus)
}
</script>

<template>
  <div
    class="group flex flex-col rounded-2xl bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:ring-slate-200 relative overflow-hidden"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-4 mt-1">
      <h3
        class="truncate text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-700 transition-colors"
      >
        {{ task.title }}
      </h3>
      <div class="flex-shrink-0">
        <BaseBadge :color="priorityInfo.color" size="sm">
          {{ task.priority.name }}
        </BaseBadge>
      </div>
    </div>

    <!-- Description -->
    <p
      v-if="task.description"
      class="mt-2.5 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-slate-500"
    >
      {{ task.description }}
    </p>
    <div v-else class="mt-2.5 min-h-[2.5rem]"></div>

    <!-- Tags -->
    <div v-if="task.tags.length" class="mt-4 flex flex-wrap gap-1.5">
      <BaseBadge
        v-for="tag in task.tags"
        :key="tag.id"
        color="gray"
        size="sm"
        class="bg-slate-100/80 text-slate-600"
      >
        {{ tag.name }}
      </BaseBadge>
    </div>
    <div v-else class="mt-4 min-h-[24px]"></div>

    <!-- Spacer to push footer down -->
    <div class="flex-grow"></div>

    <!-- Footer: due date + actions -->
    <div
      class="mt-6 flex flex-wrap items-center justify-between border-t border-slate-100/80 pt-4 gap-3"
    >
      <div class="flex items-center gap-3">
        <!-- Interactive Status Badge/Select -->
        <div class="relative group/status rounded-lg">
          <select
            :value="task.status"
            name="status"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            @change="onStatusChange"
            title="Cambiar estado"
            aria-label="Cambiar estado de la tarea"
          >
            <option v-for="opt in TASK_STATUS_OPTIONS" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <div
            class="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all duration-200 shadow-sm"
            :class="{
              'bg-amber-50 text-amber-700 border-amber-200 group-hover/status:border-amber-300 group-hover/status:bg-amber-100':
                task.status === 'pendiente',
              'bg-blue-50 text-blue-700 border-blue-200 group-hover/status:border-blue-300 group-hover/status:bg-blue-100':
                task.status === 'en_progreso',
              'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover/status:border-emerald-300 group-hover/status:bg-emerald-100':
                task.status === 'completada',
            }"
          >
            <!-- Status Dot -->
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="{
                'bg-amber-500': task.status === 'pendiente',
                'bg-blue-500': task.status === 'en_progreso',
                'bg-emerald-500': task.status === 'completada',
              }"
            ></span>
            {{ statusInfo.label }}
            <svg
              class="h-3.5 w-3.5 opacity-60 ml-0.5 group-hover/status:opacity-100 transition-opacity"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <span
          v-if="task.due_date"
          class="flex items-center gap-1.5 text-xs font-semibold text-slate-500"
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

      <div
        class="flex items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100 sm:opacity-100"
      >
        <RouterLink
          :to="{ name: 'task-edit', params: { id: task.id } }"
          class="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          title="Editar"
          aria-label="Editar tarea"
        >
          <svg
            class="h-4.5 w-4.5"
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
          class="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/40"
          title="Eliminar"
          aria-label="Eliminar tarea"
          @click="emit('delete', task.id)"
        >
          <svg
            class="h-4.5 w-4.5"
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
