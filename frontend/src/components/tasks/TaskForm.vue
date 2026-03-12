<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import type { Task, CreateTaskPayload } from '@/types'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'

const props = defineProps<{
  initialData?: Task
  submitting: boolean
}>()

const emit = defineEmits<{
  submit: [payload: CreateTaskPayload]
}>()

const store = useTaskStore()

const form = reactive({
  title: props.initialData?.title ?? '',
  description: props.initialData?.description ?? '',
  status: props.initialData?.status ?? 'pendiente',
  due_date: props.initialData?.due_date?.slice(0, 10) ?? '',
  priority_id: props.initialData?.priority.id ?? (undefined as number | undefined),
  tags: props.initialData?.tags.map((t) => t.id) ?? ([] as number[]),
})

const errors = reactive<Record<string, string>>({})
const touched = reactive<Record<string, boolean>>({})

const statusOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_progreso', label: 'En Progreso' },
  { value: 'completada', label: 'Completada' },
]

const priorityOptions = computed(() =>
  store.priorities.map((p) => ({ value: p.id, label: p.name })),
)

function validate(): boolean {
  errors.title = ''
  errors.priority_id = ''

  if (!form.title.trim()) errors.title = 'El título es obligatorio'
  else if (form.title.trim().length < 3) errors.title = 'Mínimo 3 caracteres'
  if (form.priority_id == null) errors.priority_id = 'Selecciona una prioridad'

  return !errors.title && !errors.priority_id
}

function onBlur(field: string) {
  touched[field] = true
  validate()
}

function toggleTag(tagId: number) {
  const idx = form.tags.indexOf(tagId)
  if (idx === -1) form.tags.push(tagId)
  else form.tags.splice(idx, 1)
}

function onSubmit() {
  // Mark all as touched
  touched.title = true
  touched.priority_id = true

  if (!validate()) return

  const payload: CreateTaskPayload = {
    title: form.title.trim(),
    description: form.description.trim() || null,
    status: form.status as CreateTaskPayload['status'],
    due_date: form.due_date || null,
    priority_id: form.priority_id!,
    tags: form.tags.length > 0 ? form.tags : undefined,
  }
  emit('submit', payload)
}

onMounted(() => {
  if (store.priorities.length === 0) store.fetchPriorities()
  if (store.tags.length === 0) store.fetchTags()
})
</script>

<template>
  <form class="space-y-6" @submit.prevent="onSubmit">
    <div
      class="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md p-5 sm:p-6 shadow-sm"
    >
      <div class="space-y-5">
        <BaseInput
          v-model="form.title"
          label="Título de la tarea"
          :error="touched.title ? errors.title : undefined"
          @blur="onBlur('title')"
        />

        <BaseInput v-model="form.description" label="Descripción detallada" type="textarea" />

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <BaseSelect v-model="form.status" label="Estado" :options="statusOptions" />

          <BaseSelect
            v-model.number="form.priority_id"
            label="Prioridad"
            placeholder="Seleccionar..."
            :options="priorityOptions"
            :error="touched.priority_id ? errors.priority_id : undefined"
          />

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">Fecha límite</label>
            <input
              v-model="form.due_date"
              type="date"
              class="block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div class="pt-2">
          <label class="mb-2.5 block text-sm font-medium text-slate-700">Etiquetas</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in store.tags"
              :key="tag.id"
              type="button"
              class="rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
              :class="
                form.tags.includes(tag.id)
                  ? 'border-indigo-500 bg-indigo-50/80 text-indigo-700 shadow-sm shadow-indigo-500/10'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              "
              @click="toggleTag(tag.id)"
            >
              <span class="flex items-center gap-2">
                <svg
                  v-if="form.tags.includes(tag.id)"
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{
                  tag.name
                }}</span>
              </span>
            </button>
          </div>
          <p v-if="store.tags.length === 0" class="mt-2 text-sm text-slate-500 italic">
            Cargando etiquetas...
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-end gap-3">
      <RouterLink
        :to="{ name: 'tasks' }"
        class="inline-flex items-center justify-center gap-2 font-medium rounded-lg px-4 py-2 text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300 transition-all duration-200"
      >
        Cancelar
      </RouterLink>
      <BaseButton type="submit" variant="primary" :loading="submitting" :disabled="submitting">
        {{ submitting ? 'Guardando...' : initialData ? 'Guardar cambios' : 'Crear tarea' }}
      </BaseButton>
    </div>
  </form>
</template>
