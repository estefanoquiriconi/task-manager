import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTaskStore } from '@/stores/taskStore'
import type { Task, TaskFilters, TaskListQueryState, PaginatedResponse } from '@/types'

vi.mock('@/services/taskService')

import * as taskService from '@/services/taskService'

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'A task',
  status: 'pendiente',
  due_date: '2026-03-15',
  priority: { id: 1, name: 'ALTA' },
  tags: [{ id: 1, name: 'bug' }],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

const mockPaginatedResponse: PaginatedResponse<Task> = {
  data: [mockTask],
  links: { first: null, last: null, prev: null, next: null },
  meta: { current_page: 1, last_page: 2, per_page: 10, total: 15 },
}

describe('taskStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('has correct initial state', () => {
    const store = useTaskStore()
    expect(store.tasks).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.currentPage).toBe(1)
    expect(store.filters).toEqual({})
  })

  describe('hasActiveFilters', () => {
    it('returns false for empty filters', () => {
      const store = useTaskStore()
      expect(store.hasActiveFilters).toBe(false)
    })

    it('returns false for undefined/empty string values', () => {
      const store = useTaskStore()
      store.filters = { status: undefined, date_from: '' } as TaskFilters & { date_from: string }
      expect(store.hasActiveFilters).toBe(false)
    })

    it('returns true when a filter has a value', () => {
      const store = useTaskStore()
      store.filters = { status: 'pendiente' }
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when priority_id is set', () => {
      const store = useTaskStore()
      store.filters = { priority_id: 2 }
      expect(store.hasActiveFilters).toBe(true)
    })
  })

  it('fetchTasks calls getTasks and updates state', async () => {
    vi.mocked(taskService.getTasks).mockResolvedValue(mockPaginatedResponse)
    const store = useTaskStore()
    store.filters = { status: 'pendiente' }

    await store.fetchTasks()

    expect(taskService.getTasks).toHaveBeenCalledWith({ status: 'pendiente' }, 1)
    expect(store.tasks).toEqual([mockTask])
    expect(store.lastPage).toBe(2)
    expect(store.total).toBe(15)
    expect(store.loading).toBe(false)
  })

  it('createTask prepends the created task and increments total', async () => {
    vi.mocked(taskService.createTask).mockResolvedValue(mockTask)
    const store = useTaskStore()
    const payload = { title: 'New', status: 'pendiente' as const, priority_id: 1 }

    await store.createTask(payload)

    expect(taskService.createTask).toHaveBeenCalledWith(payload)
    expect(store.tasks[0]).toEqual(mockTask)
    expect(store.total).toBe(1)
  })

  it('updateTask replaces task in array without refetch', async () => {
    const updatedTask = { ...mockTask, title: 'Updated' }
    vi.mocked(taskService.updateTask).mockResolvedValue(updatedTask)
    const store = useTaskStore()
    store.tasks = [mockTask]

    await store.updateTask(1, { title: 'Updated' })

    expect(taskService.updateTask).toHaveBeenCalledWith(1, { title: 'Updated' })
    expect(store.tasks[0]?.title).toBe('Updated')
    expect(taskService.getTasks).not.toHaveBeenCalled()
  })

  it('deleteTask removes the task locally and decrements total', async () => {
    vi.mocked(taskService.deleteTask).mockResolvedValue()
    const store = useTaskStore()
    store.tasks = [mockTask]
    store.total = 1

    await store.deleteTask(1)

    expect(taskService.deleteTask).toHaveBeenCalledWith(1)
    expect(store.tasks).toEqual([])
    expect(store.total).toBe(0)
  })

  it('setListQueryState hydrates filters and current page', () => {
    const store = useTaskStore()
    const state: TaskListQueryState = {
      filters: {
        status: 'en_progreso',
        priority_id: 3,
        tag_id: 2,
        date_from: '2026-03-01',
        date_to: '2026-03-10',
      },
      page: 4,
    }

    store.setListQueryState(state)

    expect(store.filters).toEqual(state.filters)
    expect(store.currentPage).toBe(4)
  })

  it('setFilters updates filters and resets page', async () => {
    vi.mocked(taskService.getTasks).mockResolvedValue(mockPaginatedResponse)
    const store = useTaskStore()
    store.currentPage = 3

    await store.setFilters({ status: 'completada' })

    expect(store.filters).toEqual({ status: 'completada' })
    expect(store.currentPage).toBe(1)
  })

  it('resetFilters clears filters and resets page', async () => {
    vi.mocked(taskService.getTasks).mockResolvedValue(mockPaginatedResponse)
    const store = useTaskStore()
    store.filters = { status: 'pendiente' }
    store.currentPage = 5

    await store.resetFilters()

    expect(store.filters).toEqual({})
    expect(store.currentPage).toBe(1)
  })
})
