import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as taskService from '@/services/taskService'
import type { Task, PaginatedResponse } from '@/types'

vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))
vi.mock('@/router', () => ({ default: { push: vi.fn() } }))

import api from '@/services/api'

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'desc',
  status: 'pendiente',
  due_date: '2026-03-15',
  priority: { id: 1, name: 'ALTA' },
  tags: [{ id: 1, name: 'bug' }],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

const mockPaginated: PaginatedResponse<Task> = {
  data: [mockTask],
  links: { first: null, last: null, prev: null, next: null },
  meta: { current_page: 1, last_page: 1, per_page: 10, total: 1 },
}

describe('taskService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTasks', () => {
    it('calls GET /tasks with cleaned params', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockPaginated })

      const result = await taskService.getTasks({ status: 'pendiente', priority_id: undefined }, 2)

      expect(api.get).toHaveBeenCalledWith('/tasks', { params: { status: 'pendiente', page: 2 } })
      expect(result).toEqual(mockPaginated)
    })

    it('strips empty string and null values from params', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockPaginated })

      await taskService.getTasks({ status: '' as never, date_from: undefined }, Number.NaN)

      expect(api.get).toHaveBeenCalledWith('/tasks', { params: {} })
    })

    it('works with no arguments', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockPaginated })

      await taskService.getTasks()

      expect(api.get).toHaveBeenCalledWith('/tasks', { params: { page: 1 } })
    })
  })

  describe('getTask', () => {
    it('calls GET /tasks/:id and unwraps data', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { data: mockTask } })

      const result = await taskService.getTask(1)

      expect(api.get).toHaveBeenCalledWith('/tasks/1')
      expect(result).toEqual(mockTask)
    })
  })

  describe('createTask', () => {
    it('posts payload and unwraps data', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { data: mockTask } })
      const payload = { title: 'New', status: 'pendiente' as const, priority_id: 1 }

      const result = await taskService.createTask(payload)

      expect(api.post).toHaveBeenCalledWith('/tasks', payload)
      expect(result).toEqual(mockTask)
    })
  })

  describe('updateTask', () => {
    it('puts payload and unwraps data', async () => {
      const updated = { ...mockTask, title: 'Updated' }
      vi.mocked(api.put).mockResolvedValue({ data: { data: updated } })

      const result = await taskService.updateTask(1, { title: 'Updated' })

      expect(api.put).toHaveBeenCalledWith('/tasks/1', { title: 'Updated' })
      expect(result).toEqual(updated)
    })
  })

  describe('deleteTask', () => {
    it('calls DELETE /tasks/:id', async () => {
      vi.mocked(api.delete).mockResolvedValue({})

      await taskService.deleteTask(1)

      expect(api.delete).toHaveBeenCalledWith('/tasks/1')
    })
  })

  describe('getPriorities', () => {
    it('calls GET /priorities and returns data', async () => {
      const priorities = [
        { id: 1, name: 'ALTA' },
        { id: 2, name: 'MEDIA' },
      ]
      vi.mocked(api.get).mockResolvedValue({ data: priorities })

      const result = await taskService.getPriorities()

      expect(api.get).toHaveBeenCalledWith('/priorities')
      expect(result).toEqual(priorities)
    })
  })

  describe('getTags', () => {
    it('calls GET /tags and returns data', async () => {
      const tags = [
        { id: 1, name: 'bug' },
        { id: 2, name: 'feature' },
      ]
      vi.mocked(api.get).mockResolvedValue({ data: tags })

      const result = await taskService.getTags()

      expect(api.get).toHaveBeenCalledWith('/tags')
      expect(result).toEqual(tags)
    })
  })
})
