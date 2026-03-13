<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { TASK_STATUS_OPTIONS, type TaskFilters } from '@/types'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const store = useTaskStore()

const localFilters = reactive<TaskFilters>({
  status: undefined,
  priority_id: undefined,
  tag_id: undefined,
  date_from: undefined,
  date_to: undefined,
})

const statusOptions = TASK_STATUS_OPTIONS

function applyFilters() {
  store.setFilters({ ...localFilters })
  store.fetchTasks()
}

function clearFilters() {
  localFilters.status = undefined
  localFilters.priority_id = undefined
  localFilters.tag_id = undefined
  localFilters.date_from = undefined
  localFilters.date_to = undefined
  store.resetFilters()
  store.fetchTasks()
}

onMounted(() => {
  if (store.priorities.length === 0) store.fetchPriorities()
  if (store.tags.length === 0) store.fetchTags()
})
</script>

<template>
  <div class="rounded-2xl bg-white/60 backdrop-blur-md p-4 shadow-sm ring-1 ring-slate-200/50">
    <div class="flex flex-wrap items-end gap-4">
      <div class="w-full sm:w-auto flex-1 min-w-[140px]">
        <BaseSelect
          v-model="localFilters.status"
          label="Estado"
          placeholder="Todos"
          :options="statusOptions"
        />
      </div>

      <div class="w-full sm:w-auto flex-1 min-w-[140px]">
        <BaseSelect
          v-model.number="localFilters.priority_id"
          label="Prioridad"
          placeholder="Todas"
          :options="store.priorities.map((p) => ({ value: p.id, label: p.name }))"
        />
      </div>

      <div class="w-full sm:w-auto flex-1 min-w-[140px]">
        <BaseSelect
          v-model.number="localFilters.tag_id"
          label="Etiqueta"
          placeholder="Todas"
          :options="store.tags.map((t) => ({ value: t.id, label: t.name }))"
        />
      </div>

      <div class="w-full sm:w-auto">
        <label class="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Desde</label>
        <input
          v-model="localFilters.date_from"
          type="date"
          class="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-all hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div class="w-full sm:w-auto">
        <label class="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Hasta</label>
        <input
          v-model="localFilters.date_to"
          type="date"
          class="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-all hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div class="flex w-full sm:w-auto items-center gap-2 pt-1 sm:pt-0">
        <BaseButton variant="primary" size="md" class="w-full sm:w-auto" @click="applyFilters">
          <svg
            class="-ml-0.5 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
            />
          </svg>
          Filtrar
        </BaseButton>

        <BaseButton v-if="store.hasActiveFilters" variant="ghost" size="md" @click="clearFilters">
          Limpiar
        </BaseButton>
      </div>
    </div>
  </div>
</template>
