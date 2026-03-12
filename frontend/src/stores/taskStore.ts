import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {
  Task,
  Priority,
  Tag,
  TaskFilters,
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

  // Actions
  async function fetchTasks() {
    loading.value = true
    try {
      const response = await taskService.getTasks({ ...filters.value, page: currentPage.value })
      tasks.value = response.data
      currentPage.value = response.meta.current_page
      lastPage.value = response.meta.last_page
      total.value = response.meta.total
    } finally {
      loading.value = false
    }
  }

  async function createTask(payload: CreateTaskPayload) {
    await taskService.createTask(payload)
    await fetchTasks()
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
    await fetchTasks()
  }

  async function fetchPriorities() {
    priorities.value = await taskService.getPriorities()
  }

  async function fetchTags() {
    tags.value = await taskService.getTags()
  }

  function setFilters(newFilters: TaskFilters) {
    filters.value = newFilters
    currentPage.value = 1
  }

  function setPage(page: number) {
    currentPage.value = page
  }

  function resetFilters() {
    filters.value = {}
    currentPage.value = 1
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
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchPriorities,
    fetchTags,
    setFilters,
    setPage,
    resetFilters,
  }
})
