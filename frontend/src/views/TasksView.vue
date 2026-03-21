<script setup lang="ts">
import { watch } from 'vue'
import {
  RouterLink,
  useRoute,
  useRouter,
  type LocationQuery,
  type LocationQueryRaw,
} from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import TaskFilters from '@/components/tasks/TaskFilters.vue'
import TaskList from '@/components/tasks/TaskList.vue'
import type { TaskFilters as TaskFiltersShape, TaskListQueryState } from '@/types'
import { TASK_LIST_QUERY_KEYS, buildTaskListQuery, parseTaskListQuery } from '@/utils/taskListQuery'

const store = useTaskStore()
const route = useRoute()
const router = useRouter()

const managedQueryKeys = new Set<string>(TASK_LIST_QUERY_KEYS)

function buildRouteQuery(state: TaskListQueryState): LocationQueryRaw {
  const nextQuery: LocationQueryRaw = {}

  for (const [key, value] of Object.entries(route.query)) {
    if (!managedQueryKeys.has(key)) {
      nextQuery[key] = value
    }
  }

  return {
    ...nextQuery,
    ...buildTaskListQuery(state),
  }
}

function resolveFullPath(query: LocationQueryRaw) {
  return router.resolve({ path: route.path, query, hash: route.hash }).fullPath
}

function navigateWithState(state: TaskListQueryState, mode: 'push' | 'replace' = 'push') {
  const query = buildRouteQuery(state)
  return mode === 'push' ? router.push({ query }) : router.replace({ query })
}

function applyFilters(filters: TaskFiltersShape) {
  return navigateWithState({ filters, page: 1 })
}

function clearFilters() {
  return navigateWithState({ filters: {}, page: 1 })
}

function changePage(page: number) {
  return navigateWithState({
    filters: store.filters,
    page: Math.max(1, page),
  })
}

store.setListQueryState(parseTaskListQuery(route.query))

let activeRequestId = 0
let skipNextFetchForPath: string | null = null

watch(
  () => route.query,
  async (query: LocationQuery) => {
    const parsedState = parseTaskListQuery(query)
    const normalizedQuery = buildRouteQuery(parsedState)
    const normalizedFullPath = resolveFullPath(normalizedQuery)

    if (normalizedFullPath !== route.fullPath) {
      await navigateWithState(parsedState, 'replace')
      return
    }

    store.setListQueryState(parsedState)

    if (skipNextFetchForPath === route.fullPath) {
      skipNextFetchForPath = null
      return
    }

    const requestId = ++activeRequestId
    await store.fetchTasks()

    if (requestId !== activeRequestId) {
      return
    }

    const correctedState: TaskListQueryState = {
      filters: store.filters,
      page: store.currentPage,
    }
    const correctedQuery = buildRouteQuery(correctedState)
    const correctedFullPath = resolveFullPath(correctedQuery)

    if (correctedFullPath !== route.fullPath) {
      skipNextFetchForPath = correctedFullPath
      await navigateWithState(correctedState, 'replace')
    }
  },
  { immediate: true },
)
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

    <TaskFilters
      class="mb-6"
      :applied-filters="store.filters"
      :has-active-filters="store.hasActiveFilters"
      @apply="applyFilters"
      @clear="clearFilters"
    />
    <TaskList
      :has-active-filters="store.hasActiveFilters"
      @change-page="changePage"
      @clear-filters="clearFilters"
    />
  </div>
</template>
