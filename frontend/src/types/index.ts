export interface Priority {
  id: number
  name: string
}

export interface Tag {
  id: number
  name: string
}

export interface Task {
  id: number
  title: string
  description: string | null
  status: 'pendiente' | 'en_progreso' | 'completada'
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
  status?: 'pendiente' | 'en_progreso' | 'completada'
  priority_id?: number
  date_from?: string
  date_to?: string
  tag_id?: number
  page?: number
}

export interface CreateTaskPayload {
  title: string
  description?: string | null
  status: 'pendiente' | 'en_progreso' | 'completada'
  due_date?: string | null
  priority_id: number
  tags?: number[]
}

export interface UpdateTaskPayload {
  title?: string
  description?: string | null
  status?: 'pendiente' | 'en_progreso' | 'completada'
  due_date?: string | null
  priority_id?: number
  tags?: number[]
}
