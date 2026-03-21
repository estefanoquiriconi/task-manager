import type { LocationQuery, LocationQueryRaw, LocationQueryValue } from 'vue-router'
import {
  TASK_STATUS_OPTIONS,
  type TaskFilters,
  type TaskListQueryState,
  type TaskStatus,
} from '@/types'

export const TASK_LIST_QUERY_KEYS = [
  'status',
  'priority_id',
  'tag_id',
  'date_from',
  'date_to',
  'page',
] as const

const VALID_TASK_STATUSES = new Set<TaskStatus>(TASK_STATUS_OPTIONS.map(({ value }) => value))
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function getSingleQueryValue(
  value: LocationQueryValue | LocationQueryValue[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return getSingleQueryValue(value[0])
  }

  return typeof value === 'string' ? value : undefined
}

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (!value || !/^\d+$/.test(value)) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined
}

function parseDate(value: string | undefined): string | undefined {
  if (!value || !DATE_PATTERN.test(value)) {
    return undefined
  }

  return value
}

export function parseTaskListQuery(query: LocationQuery): TaskListQueryState {
  const status = getSingleQueryValue(query.status)
  const filters: TaskFilters = {
    status:
      status && VALID_TASK_STATUSES.has(status as TaskStatus) ? (status as TaskStatus) : undefined,
    priority_id: parsePositiveInteger(getSingleQueryValue(query.priority_id)),
    tag_id: parsePositiveInteger(getSingleQueryValue(query.tag_id)),
    date_from: parseDate(getSingleQueryValue(query.date_from)),
    date_to: parseDate(getSingleQueryValue(query.date_to)),
  }

  return {
    filters,
    page: parsePositiveInteger(getSingleQueryValue(query.page)) ?? 1,
  }
}

export function buildTaskListQuery(state: TaskListQueryState): LocationQueryRaw {
  const query: LocationQueryRaw = {}

  if (state.filters.status) query.status = state.filters.status
  if (state.filters.priority_id) query.priority_id = String(state.filters.priority_id)
  if (state.filters.tag_id) query.tag_id = String(state.filters.tag_id)
  if (state.filters.date_from) query.date_from = state.filters.date_from
  if (state.filters.date_to) query.date_to = state.filters.date_to
  if (state.page > 1) query.page = String(state.page)

  return query
}
