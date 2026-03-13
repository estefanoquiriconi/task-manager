import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import TaskCard from '@/components/tasks/TaskCard.vue'
import type { Task } from '@/types'

function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: 'Default Task',
    description: 'Task description',
    status: 'pendiente',
    due_date: '2026-03-15T00:00:00Z',
    priority: { id: 1, name: 'ALTA' },
    tags: [{ id: 1, name: 'bug' }, { id: 2, name: 'frontend' }],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

const stubs = {
  RouterLink: { template: '<a><slot /></a>', props: ['to'] },
  BaseBadge: { template: '<span><slot /></span>', props: ['color', 'size'] },
}

describe('TaskCard', () => {
  it('renders the task title', () => {
    const wrapper = shallowMount(TaskCard, {
      props: { task: createTask({ title: 'My Task' }) },
      global: { stubs },
    })
    expect(wrapper.find('h3').text()).toBe('My Task')
  })

  it('renders description when present', () => {
    const wrapper = shallowMount(TaskCard, {
      props: { task: createTask({ description: 'Some description' }) },
      global: { stubs },
    })
    expect(wrapper.find('p').text()).toBe('Some description')
  })

  it('hides description when null', () => {
    const wrapper = shallowMount(TaskCard, {
      props: { task: createTask({ description: null }) },
      global: { stubs },
    })
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('renders priority name', () => {
    const wrapper = shallowMount(TaskCard, {
      props: { task: createTask({ priority: { id: 2, name: 'MEDIA' } }) },
      global: { stubs },
    })
    expect(wrapper.text()).toContain('MEDIA')
  })

  it('renders all tags', () => {
    const tags = [{ id: 1, name: 'bug' }, { id: 2, name: 'urgent' }]
    const wrapper = shallowMount(TaskCard, {
      props: { task: createTask({ tags }) },
      global: { stubs },
    })
    expect(wrapper.text()).toContain('bug')
    expect(wrapper.text()).toContain('urgent')
  })

  it('renders due date', () => {
    const wrapper = shallowMount(TaskCard, {
      props: { task: createTask({ due_date: '2026-03-15T00:00:00Z' }) },
      global: { stubs },
    })
    expect(wrapper.text()).toContain('2026-03-15')
  })

  it('emits status-change when select changes', async () => {
    const wrapper = shallowMount(TaskCard, {
      props: { task: createTask({ id: 5 }) },
      global: { stubs },
    })
    const select = wrapper.find('select')
    await select.setValue('completada')

    expect(wrapper.emitted('status-change')).toBeTruthy()
    expect(wrapper.emitted('status-change')![0]).toEqual([5, 'completada'])
  })

  it('emits delete when delete button is clicked', async () => {
    const wrapper = shallowMount(TaskCard, {
      props: { task: createTask({ id: 7 }) },
      global: { stubs },
    })
    const deleteBtn = wrapper.find('button[aria-label="Eliminar tarea"]')
    await deleteBtn.trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')![0]).toEqual([7])
  })

  it('has correct edit link', () => {
    const wrapper = shallowMount(TaskCard, {
      props: { task: createTask({ id: 3 }) },
      global: { stubs },
    })
    const link = wrapper.findComponent(stubs.RouterLink)
    expect(link.props('to')).toEqual({ name: 'task-edit', params: { id: 3 } })
  })
})
