import { describe, it, expect } from 'vitest'
import { buildTaskListQuery, parseTaskListQuery } from '@/utils/taskListQuery'

describe('taskListQuery', () => {
  describe('parseTaskListQuery', () => {
    it('parses a valid query into applied filters and page', () => {
      const state = parseTaskListQuery({
        status: 'pendiente',
        priority_id: '2',
        tag_id: '7',
        date_from: '2026-03-01',
        date_to: '2026-03-31',
        page: '3',
      })

      expect(state).toEqual({
        filters: {
          status: 'pendiente',
          priority_id: 2,
          tag_id: 7,
          date_from: '2026-03-01',
          date_to: '2026-03-31',
        },
        page: 3,
      })
    })

    it('normalizes invalid query values', () => {
      const state = parseTaskListQuery({
        status: 'archived',
        priority_id: 'abc',
        tag_id: '0',
        date_from: '03/01/2026',
        date_to: '',
        page: 'foo',
      })

      expect(state).toEqual({
        filters: {
          status: undefined,
          priority_id: undefined,
          tag_id: undefined,
          date_from: undefined,
          date_to: undefined,
        },
        page: 1,
      })
    })
  })

  describe('buildTaskListQuery', () => {
    it('serializes only valid applied values and omits page 1', () => {
      const query = buildTaskListQuery({
        filters: {
          status: 'en_progreso',
          priority_id: 4,
          tag_id: 9,
          date_from: '2026-03-10',
          date_to: '2026-03-20',
        },
        page: 1,
      })

      expect(query).toEqual({
        status: 'en_progreso',
        priority_id: '4',
        tag_id: '9',
        date_from: '2026-03-10',
        date_to: '2026-03-20',
      })
    })

    it('includes page when navigating beyond the first page', () => {
      const query = buildTaskListQuery({
        filters: {
          status: 'completada',
        },
        page: 5,
      })

      expect(query).toEqual({
        status: 'completada',
        page: '5',
      })
    })
  })
})
