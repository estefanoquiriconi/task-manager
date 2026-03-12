import api from './api'
import type {
  Task,
  Priority,
  Tag,
  PaginatedResponse,
  TaskFilters,
  CreateTaskPayload,
  UpdateTaskPayload,
} from '@/types'

export async function getTasks(filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  )
  const { data } = await api.get<PaginatedResponse<Task>>('/tasks', { params })
  return data
}

export async function getTask(id: number): Promise<Task> {
  const { data } = await api.get<{ data: Task }>(`/tasks/${id}`)
  return data.data
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await api.post<{ data: Task }>('/tasks', payload)
  return data.data
}

export async function updateTask(id: number, payload: UpdateTaskPayload): Promise<Task> {
  const { data } = await api.put<{ data: Task }>(`/tasks/${id}`, payload)
  return data.data
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`)
}

export async function getPriorities(): Promise<Priority[]> {
  const { data } = await api.get<Priority[]>('/priorities')
  return data
}

export async function getTags(): Promise<Tag[]> {
  const { data } = await api.get<Tag[]>('/tags')
  return data
}
