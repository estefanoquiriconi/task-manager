<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { TASK_STATUS_OPTIONS, type Task, type CreateTaskPayload } from '@/types'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps<{
  initialData?: Task
  submitting: boolean
  serverErrors?: Record<string, string>
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

function fieldError(field: string): string | undefined {
  return props.serverErrors?.[field] || (touched[field] ? errors[field] : undefined) || undefined
}

const statusOptions = TASK_STATUS_OPTIONS

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
    status: form.status,
    due_date: form.due_date || null,
    priority_id: form.priority_id!,
    tags: form.tags,
  }
  emit('submit', payload)
}

onMounted(() => {
  if (store.priorities.length === 0) store.fetchPriorities()
  if (store.tags.length === 0) store.fetchTags()
})
</script>

<template>
  <form class="space-y-8" @submit.prevent="onSubmit">
    <div
      class="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100/50"
    >
      <div class="space-y-6">
        <BaseInput
          v-model="form.title"
          label="Título de la tarea"
          :error="fieldError('title')"
          @blur="onBlur('title')"
          placeholder="Ej. Revisar diseño de la landing page..."
        />

        <BaseInput
          v-model="form.description"
          label="Descripción detallada"
          multiline
          placeholder="Agrega más detalles sobre lo que hay que hacer..."
        />

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <BaseSelect v-model="form.status" label="Estado actual" :options="statusOptions" />

          <BaseSelect
            v-model.number="form.priority_id"
            label="Nivel de prioridad"
            placeholder="Seleccionar..."
            :options="priorityOptions"
            :error="fieldError('priority_id')"
          />

          <BaseInput
            v-model="form.due_date"
            label="Fecha límite"
            type="date"
            :error="fieldError('due_date')"
          />
        </div>

        <div class="pt-4 border-t border-slate-100/80 mt-6">
          <label class="mb-3 block text-sm font-semibold text-slate-700"
            >Etiquetas relacionadas</label
          >
          <div class="flex flex-wrap gap-2.5">
            <button
              v-for="tag in store.tags"
              :key="tag.id"
              type="button"
              class="rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
              :class="
                form.tags.includes(tag.id)
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
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
                <span>{{ tag.name }}</span>
              </span>
            </button>
          </div>
          <p v-if="store.tags.length === 0" class="mt-2 text-sm text-slate-500 italic">
            Cargando etiquetas disponibles...
          </p>
        </div>
      </div>
    </div>

    <!-- Actions Footer -->
    <div class="flex items-center justify-end gap-3 pt-4">
      <RouterLink
        :to="{ name: 'tasks' }"
        class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-200/50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
      >
        Cancelar
      </RouterLink>
      <BaseButton
        type="submit"
        variant="primary"
        class="px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 font-semibold"
        :loading="submitting"
        :disabled="submitting"
      >
        {{ submitting ? 'Guardando...' : initialData ? 'Guardar cambios' : 'Crear tarea' }}
      </BaseButton>
    </div>
  </form>
</template>
