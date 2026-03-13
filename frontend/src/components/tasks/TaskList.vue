<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { TaskStatus } from '@/types'
import { useTaskStore } from '@/stores/taskStore'
import { useNotification } from '@/composables/useNotification'
import TaskCard from './TaskCard.vue'
import ConfirmModal from './ConfirmModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const store = useTaskStore()
const { notify } = useNotification()

const deleteTarget = ref<{ id: number; title: string } | null>(null)
const deleting = ref(false)

async function onStatusChange(id: number, status: TaskStatus) {
  try {
    await store.updateTask(id, { status })
    notify('Estado actualizado', 'success')
  } catch {
    notify('Error al actualizar el estado', 'error')
  }
}

function requestDelete(id: number) {
  const task = store.tasks.find((t) => t.id === id)
  deleteTarget.value = task ? { id: task.id, title: task.title } : null
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await store.deleteTask(deleteTarget.value.id)
    notify('Tarea eliminada', 'success')
    deleteTarget.value = null
  } catch {
    notify('Error al eliminar la tarea', 'error')
  } finally {
    deleting.value = false
  }
}

function clearAndFetch() {
  store.resetFilters()
  store.fetchTasks()
}

function prevPage() {
  store.setPage(store.currentPage - 1)
  store.fetchTasks()
}

function nextPage() {
  store.setPage(store.currentPage + 1)
  store.fetchTasks()
}
</script>

<template>
  <!-- Loading skeleton -->
  <div v-if="store.loading" class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="i in 6"
      :key="i"
      class="animate-pulse flex flex-col rounded-2xl border border-slate-100 bg-white/50 backdrop-blur-sm p-6 shadow-sm"
    >
      <div class="flex justify-between items-start mb-4">
        <div class="h-6 w-3/5 rounded-md bg-slate-200/60" />
        <div class="h-5 w-16 rounded-full bg-slate-200/60" />
      </div>
      <div class="space-y-2.5 mb-6 flex-1">
        <div class="h-3 w-full rounded bg-slate-100/60" />
        <div class="h-3 w-4/5 rounded bg-slate-100/60" />
      </div>
      <div class="flex gap-2">
        <div class="h-6 w-20 rounded-full bg-slate-100/60" />
        <div class="h-6 w-24 rounded-full bg-slate-100/60" />
      </div>
      <div class="mt-5 border-t border-slate-100 pt-4 flex justify-between items-center">
        <div class="h-8 w-28 rounded-xl bg-slate-100/60" />
        <div class="flex gap-2">
          <div class="h-8 w-8 rounded-lg bg-slate-100/60" />
          <div class="h-8 w-8 rounded-lg bg-slate-100/60" />
        </div>
      </div>
    </div>
  </div>

  <!-- Empty state -->
  <div
    v-else-if="store.tasks.length === 0"
    class="flex flex-col items-center py-20 text-center animate-in fade-in duration-500"
  >
    <div
      class="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 border border-slate-100 shadow-sm mb-6"
    >
      <svg
        class="h-10 w-10 text-slate-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
        />
      </svg>
    </div>

    <template v-if="store.hasActiveFilters">
      <p class="text-base font-semibold text-slate-900">No hay coincidencias</p>
      <p class="mt-2 text-sm text-slate-500 max-w-sm">
        No encontramos tareas que coincidan con los filtros que aplicaste. Mueve los filtros o
        límpialos para ver tus tareas.
      </p>
      <BaseButton
        variant="secondary"
        class="mt-6"
        @click="clearAndFetch"
      >
        Limpiar filtros
      </BaseButton>
    </template>
    <template v-else>
      <p class="text-base font-semibold text-slate-900">Cero tareas a la vista</p>
      <p class="mt-2 text-sm text-slate-500 max-w-sm">
        Aquí verás tu lista de tareas. Crea una para organizar tu día.
      </p>
      <RouterLink
        :to="{ name: 'task-create' }"
        class="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30"
      >
        <svg
          class="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Crear mi primera tarea
      </RouterLink>
    </template>
  </div>

  <!-- Task grid -->
  <template v-else>
    <TransitionGroup
      name="task-list"
      tag="div"
      class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
    >
      <TaskCard
        v-for="task in store.tasks"
        :key="task.id"
        :task="task"
        @status-change="onStatusChange"
        @delete="requestDelete"
      />
    </TransitionGroup>

    <!-- Pagination -->
    <div
      v-if="store.lastPage > 1"
      class="mt-10 flex items-center justify-between px-2"
    >
      <p class="text-sm font-medium text-slate-500">
        {{ store.total }} tarea{{ store.total !== 1 ? 's' : '' }} en total
      </p>
      <div class="flex items-center gap-2.5">
        <BaseButton
          variant="secondary"
          size="sm"
          :disabled="store.currentPage <= 1"
          @click="prevPage"
        >
          <svg
            class="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Anterior
        </BaseButton>
        <span class="px-3 text-sm font-semibold tracking-wide text-slate-700">
          {{ store.currentPage }} <span class="text-slate-400 font-normal">/</span>
          {{ store.lastPage }}
        </span>
        <BaseButton
          variant="secondary"
          size="sm"
          :disabled="store.currentPage >= store.lastPage"
          @click="nextPage"
        >
          Siguiente
          <svg
            class="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </BaseButton>
      </div>
    </div>
  </template>

  <!-- Delete confirmation modal -->
  <ConfirmModal
    v-if="deleteTarget"
    title="Eliminar tarea"
    :message="`¿Estás seguro de que deseas eliminar &quot;${deleteTarget.title}&quot;? Esta acción no se puede deshacer.`"
    confirm-label="Eliminar"
    :loading="deleting"
    @confirm="confirmDelete"
    @cancel="deleteTarget = null"
  />
</template>

<style scoped>
.task-list-move,
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
.task-list-leave-active {
  position: absolute;
}
</style>
