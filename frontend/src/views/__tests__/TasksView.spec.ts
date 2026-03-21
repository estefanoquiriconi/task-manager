import { defineComponent } from 'vue'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import TasksView from '@/views/TasksView.vue'
import * as taskService from '@/services/taskService'
import type { PaginatedResponse, Task } from '@/types'

vi.mock('@/services/taskService')

const TaskFiltersStub = defineComponent({
  name: 'TaskFilters',
  props: {
    appliedFilters: { type: Object, required: true },
    hasActiveFilters: { type: Boolean, required: true },
  },
  emits: ['apply', 'clear'],
  template: `
    <div>
      <pre data-test="applied-filters">{{ JSON.stringify(appliedFilters) }}</pre>
      <span data-test="filters-active">{{ hasActiveFilters }}</span>
      <button data-test="apply-filters" @click="$emit('apply', { status: 'completada', priority_id: 2 })">
        Apply
      </button>
      <button data-test="clear-filters" @click="$emit('clear')">Clear</button>
    </div>
  `,
})

const TaskListStub = defineComponent({
  name: 'TaskList',
  props: {
    hasActiveFilters: { type: Boolean, required: true },
  },
  emits: ['change-page', 'clear-filters'],
  template: `
    <div>
      <span data-test="list-active">{{ hasActiveFilters }}</span>
      <button data-test="page-4" @click="$emit('change-page', 4)">Page 4</button>
      <button data-test="clear-from-list" @click="$emit('clear-filters')">Clear from list</button>
    </div>
  `,
})

const RouterLinkStub = {
  template: '<a><slot /></a>',
  props: ['to'],
}

const mockTask: Task = {
  id: 1,
  title: 'Task from API',
  description: 'Task description',
  status: 'pendiente',
  due_date: '2026-03-15',
  priority: { id: 1, name: 'ALTA' },
  tags: [],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

function createResponse(page: number): PaginatedResponse<Task> {
  return {
    data: [mockTask],
    links: { first: null, last: null, prev: null, next: null },
    meta: {
      current_page: page,
      last_page: 6,
      per_page: 10,
      total: 20,
    },
  }
}

async function settle() {
  await flushPromises()
  await new Promise((resolve) => setTimeout(resolve, 0))
  await flushPromises()
}

async function mountTasksView(initialUrl: string) {
  const pinia = createPinia()
  setActivePinia(pinia)

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'tasks', component: TasksView },
      { path: '/tasks/create', name: 'task-create', component: { template: '<div />' } },
    ],
  })

  await router.push(initialUrl)
  await router.isReady()

  const wrapper = mount(TasksView, {
    global: {
      plugins: [pinia, router],
      stubs: {
        RouterLink: RouterLinkStub,
        TaskFilters: TaskFiltersStub,
        TaskList: TaskListStub,
      },
    },
  })

  await settle()

  return { wrapper, router }
}

describe('TasksView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('hydrates applied filters from the URL and fetches the matching page', async () => {
    vi.mocked(taskService.getTasks).mockResolvedValue(createResponse(3))

    const { wrapper } = await mountTasksView('/?status=pendiente&priority_id=2&page=3')

    expect(taskService.getTasks).toHaveBeenCalledTimes(1)
    expect(taskService.getTasks).toHaveBeenCalledWith({ status: 'pendiente', priority_id: 2 }, 3)
    expect(wrapper.get('[data-test="applied-filters"]').text()).toContain('"status":"pendiente"')
    expect(wrapper.get('[data-test="applied-filters"]').text()).toContain('"priority_id":2')
    expect(wrapper.get('[data-test="filters-active"]').text()).toBe('true')
  })

  it('normalizes invalid task query params while preserving unrelated params', async () => {
    vi.mocked(taskService.getTasks).mockResolvedValue(createResponse(1))

    const { wrapper, router } = await mountTasksView(
      '/?status=archived&priority_id=abc&page=foo&keep=yes',
    )

    expect(taskService.getTasks).toHaveBeenCalledTimes(1)
    expect(taskService.getTasks).toHaveBeenCalledWith({}, 1)
    expect(router.currentRoute.value.fullPath).toBe('/?keep=yes')
    expect(wrapper.get('[data-test="applied-filters"]').text()).toBe('{}')
    expect(wrapper.get('[data-test="filters-active"]').text()).toBe('false')
  })

  it('pushes filter and page changes into the URL and keeps back-forward in sync', async () => {
    vi.mocked(taskService.getTasks).mockImplementation(async (_filters = {}, page = 1) =>
      createResponse(page),
    )

    const { wrapper, router } = await mountTasksView('/?status=pendiente')

    vi.clearAllMocks()

    await wrapper.get('[data-test="apply-filters"]').trigger('click')
    await settle()

    expect(router.currentRoute.value.fullPath).toBe('/?status=completada&priority_id=2')
    expect(taskService.getTasks).toHaveBeenLastCalledWith(
      { status: 'completada', priority_id: 2 },
      1,
    )
    expect(wrapper.get('[data-test="applied-filters"]').text()).toContain('"status":"completada"')

    await wrapper.get('[data-test="page-4"]').trigger('click')
    await settle()

    expect(router.currentRoute.value.fullPath).toBe('/?status=completada&priority_id=2&page=4')
    expect(taskService.getTasks).toHaveBeenLastCalledWith(
      { status: 'completada', priority_id: 2 },
      4,
    )

    router.back()
    await settle()

    expect(router.currentRoute.value.fullPath).toBe('/?status=completada&priority_id=2')
    expect(taskService.getTasks).toHaveBeenLastCalledWith(
      { status: 'completada', priority_id: 2 },
      1,
    )
    expect(wrapper.get('[data-test="applied-filters"]').text()).toContain('"status":"completada"')

    await wrapper.get('[data-test="clear-from-list"]').trigger('click')
    await settle()

    expect(router.currentRoute.value.fullPath).toBe('/')
    expect(taskService.getTasks).toHaveBeenLastCalledWith({}, 1)
    expect(wrapper.get('[data-test="filters-active"]').text()).toBe('false')
  })

  it('replaces the URL when the backend corrects the requested page without refetching twice', async () => {
    vi.mocked(taskService.getTasks).mockImplementation(async (_filters = {}, page = 1) =>
      createResponse(page === 99 ? 4 : page),
    )

    const { router } = await mountTasksView('/?status=pendiente&page=99')

    expect(taskService.getTasks).toHaveBeenCalledTimes(1)
    expect(taskService.getTasks).toHaveBeenCalledWith({ status: 'pendiente' }, 99)
    expect(router.currentRoute.value.fullPath).toBe('/?status=pendiente&page=4')
  })
})
