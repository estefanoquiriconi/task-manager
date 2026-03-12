<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { useNotification } from '@/composables/useNotification'
import * as taskService from '@/services/taskService'
import TaskForm from '@/components/tasks/TaskForm.vue'
import type { Task, CreateTaskPayload } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useTaskStore()
const { notify } = useNotification()

const isEdit = computed(() => route.name === 'task-edit')
const taskId = computed(() => (isEdit.value ? Number(route.params.id) : null))

const task = ref<Task | null>(null)
const loadingTask = ref(false)
const submitting = ref(false)

async function handleSubmit(payload: CreateTaskPayload) {
  submitting.value = true
  try {
    if (isEdit.value && taskId.value) {
      await store.updateTask(taskId.value, payload)
      notify('Tarea actualizada correctamente', 'success')
    } else {
      await store.createTask(payload)
      notify('Tarea creada correctamente', 'success')
    }
    router.push({ name: 'tasks' })
  } catch {
    notify('Error al guardar la tarea. Revisa los datos e intenta de nuevo.', 'error')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (isEdit.value && taskId.value) {
    loadingTask.value = true
    try {
      task.value = await taskService.getTask(taskId.value)
    } catch {
      notify('No se pudo cargar la tarea', 'error')
      router.push({ name: 'tasks' })
    } finally {
      loadingTask.value = false
    }
  }
})
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-8">
    <div class="mb-8">
      <button
        class="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-all hover:text-indigo-600 hover:-translate-x-1"
        @click="router.push({ name: 'tasks' })"
      >
        <svg
          class="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Volver a tareas
      </button>
      <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
        {{ isEdit ? 'Editar tarea' : 'Nueva tarea' }}
      </h1>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loadingTask" class="space-y-6">
      <div
        class="animate-pulse rounded-2xl border border-slate-100 bg-white/50 backdrop-blur-sm p-6 sm:p-8 shadow-sm"
      >
        <div class="mb-6 h-4 w-28 rounded-md bg-slate-200/60" />
        <div class="space-y-6">
          <div>
            <div class="mb-1.5 h-3.5 w-16 rounded-md bg-slate-200/60" />
            <div class="h-11 rounded-xl bg-slate-100/60" />
          </div>
          <div>
            <div class="mb-1.5 h-3.5 w-24 rounded-md bg-slate-200/60" />
            <div class="h-24 rounded-xl bg-slate-100/60" />
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <div class="mb-1.5 h-3.5 w-14 rounded-md bg-slate-200/60" />
              <div class="h-11 rounded-xl bg-slate-100/60" />
            </div>
            <div>
              <div class="mb-1.5 h-3.5 w-20 rounded-md bg-slate-200/60" />
              <div class="h-11 rounded-xl bg-slate-100/60" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <TaskForm
      v-else-if="!isEdit || task"
      :initial-data="task ?? undefined"
      :submitting="submitting"
      @submit="handleSubmit"
    />
  </div>
</template>
