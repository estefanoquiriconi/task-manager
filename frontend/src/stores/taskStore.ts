import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {
  Task,
  Priority,
  Tag,
  TaskFilters,
  TaskListQueryState,
  CreateTaskPayload,
  UpdateTaskPayload,
} from '@/types'
import * as taskService from '@/services/taskService'

export const useTaskStore = defineStore('task', () => {
  // State
  const tasks = ref<Task[]>([])
  const priorities = ref<Priority[]>([])
  const tags = ref<Tag[]>([])
  const loading = ref(false)
  const filters = ref<TaskFilters>({})
  const currentPage = ref(1)
  const lastPage = ref(1)
  const total = ref(0)

  // Getters
  const hasActiveFilters = computed(() =>
    Object.values(filters.value).some((v) => v !== undefined && v !== null && v !== ''),
  )

  function setListQueryState(state: TaskListQueryState) {
    filters.value = { ...state.filters }
    currentPage.value = state.page
  }

  // Actions
  async function fetchTasks() {
    loading.value = true
    try {
      const response = await taskService.getTasks(filters.value, currentPage.value)
      tasks.value = response.data
      currentPage.value = response.meta.current_page
      lastPage.value = response.meta.last_page
      total.value = response.meta.total
      return response
    } finally {
      loading.value = false
    }
  }

  async function createTask(payload: CreateTaskPayload) {
    const created = await taskService.createTask(payload)
    tasks.value.unshift(created)
    total.value++
  }

  async function updateTask(id: number, payload: UpdateTaskPayload) {
    const updated = await taskService.updateTask(id, payload)
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      tasks.value[index] = updated
    }
  }

  async function deleteTask(id: number) {
    await taskService.deleteTask(id)
    tasks.value = tasks.value.filter((t) => t.id !== id)
    total.value--
  }

  async function fetchPriorities() {
    priorities.value = await taskService.getPriorities()
  }

  async function fetchTags() {
    tags.value = await taskService.getTags()
  }

  async function setFilters(newFilters: TaskFilters) {
    filters.value = { ...newFilters }
    currentPage.value = 1
    await fetchTasks()
  }

  async function resetFilters() {
    filters.value = {}
    currentPage.value = 1
    await fetchTasks()
  }

  return {
    tasks,
    priorities,
    tags,
    loading,
    filters,
    currentPage,
    lastPage,
    total,
    hasActiveFilters,
    setListQueryState,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchPriorities,
    fetchTags,
    setFilters,
    resetFilters,
  }
})
