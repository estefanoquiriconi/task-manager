export interface User {
  id: number
  name: string
  email: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface Priority {
  id: number
  name: string
}

export interface Tag {
  id: number
  name: string
}

export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada'

export const TASK_STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_progreso', label: 'En Progreso' },
  { value: 'completada', label: 'Completada' },
]

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  due_date: string | null
  priority: Priority
  tags: Tag[]
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface TaskFilters {
  status?: TaskStatus
  priority_id?: number
  date_from?: string
  date_to?: string
  tag_id?: number
  page?: number
}

export interface CreateTaskPayload {
  title: string
  description?: string | null
  status: TaskStatus
  due_date?: string | null
  priority_id: number
  tags?: number[]
}

export interface UpdateTaskPayload {
  title?: string
  description?: string | null
  status?: TaskStatus
  due_date?: string | null
  priority_id?: number
  tags?: number[]
}
