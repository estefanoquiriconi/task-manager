<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import TaskFilters from '@/components/tasks/TaskFilters.vue'
import TaskList from '@/components/tasks/TaskList.vue'

const store = useTaskStore()

onMounted(() => {
  store.fetchTasks()
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 lg:py-12">
    <header class="mb-10 flex items-end justify-between">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight text-slate-900">Mis Tareas</h1>
        <p v-if="store.total > 0" class="mt-2 text-base font-medium text-slate-500">
          Tienes {{ store.total }} tarea{{ store.total !== 1 ? 's' : '' }} en total
        </p>
      </div>
      <RouterLink
        :to="{ name: 'task-create' }"
        class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2"
      >
        <svg
          class="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Nueva tarea
      </RouterLink>
    </header>

    <TaskFilters class="mb-6" />
    <TaskList />
  </div>
</template>
