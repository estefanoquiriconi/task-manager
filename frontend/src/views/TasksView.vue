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
  <div class="mx-auto max-w-7xl px-4 py-8">
    <header class="mb-8 flex items-end justify-between">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Tareas</h1>
        <p v-if="store.total > 0" class="mt-1.5 text-sm font-medium text-slate-500">
          {{ store.total }} tarea{{ store.total !== 1 ? 's' : '' }} en total
        </p>
      </div>
      <RouterLink
        :to="{ name: 'task-create' }"
        class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2"
      >
        <svg
          class="h-4.5 w-4.5"
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
