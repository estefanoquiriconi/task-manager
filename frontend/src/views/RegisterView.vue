<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useNotification } from '@/composables/useNotification'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import type { RegisterPayload } from '@/types'
import { extractValidationErrors } from '@/services/api'

const authStore = useAuthStore()
const { notify } = useNotification()

const form = ref<RegisterPayload>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errors = ref<Record<string, string>>({})

function validate(): boolean {
  const e: Record<string, string> = {}
  if (!form.value.name) e.name = 'El nombre es obligatorio'
  if (!form.value.email) e.email = 'El correo es obligatorio'
  if (!form.value.password) {
    e.password = 'La contraseña es obligatoria'
  } else if (form.value.password.length < 8) {
    e.password = 'La contraseña debe tener al menos 8 caracteres'
  }
  if (form.value.password && form.value.password !== form.value.password_confirmation) {
    e.password_confirmation = 'Las contraseñas no coinciden'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  try {
    await authStore.register(form.value)
  } catch (error) {
    const serverErrors = extractValidationErrors(error)
    if (serverErrors) {
      errors.value = serverErrors
    } else {
      notify('Error al crear la cuenta', 'error')
    }
  }
}
</script>

<template>
  <div class="flex min-h-screen bg-white">
    <!-- Left side: Image & Branding -->
    <div class="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-zinc-900 relative">
      <img
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
        alt="Team collaboration"
        class="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-overlay"
      />
      <div class="relative z-10 p-12 text-white">
        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              ></path>
            </svg>
          </div>
          <span class="text-xl font-bold tracking-tight">Gestión de Tareas</span>
        </div>
      </div>
      <div class="relative z-10 p-12">
        <h2 class="mb-6 text-4xl font-bold tracking-tight text-white">
          Comienza a organizar<br />tus tareas hoy.
        </h2>
        <p class="max-w-md text-lg text-zinc-300">
          Crea tu cuenta para gestionar tareas, asignar prioridades y dar seguimiento a tus
          proyectos.
        </p>
      </div>
    </div>

    <!-- Right side: Form -->
    <div
      class="flex w-full items-center justify-center overflow-y-auto px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16"
    >
      <div class="w-full max-w-md py-8 lg:py-0">
        <!-- Mobile Logo -->
        <div class="mb-10 flex items-center gap-2 lg:hidden">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              ></path>
            </svg>
          </div>
          <span class="text-xl font-bold tracking-tight text-slate-900">Gestión de Tareas</span>
        </div>

        <div class="mb-8">
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">Crear cuenta</h1>
          <p class="mt-2 text-base text-slate-500">
            Completa los datos para registrarte en la plataforma.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-5">
            <BaseInput
              v-model="form.name"
              name="name"
              label="Nombre completo"
              :error="errors.name"
              placeholder="Ej. Juan Pérez"
              autocomplete="name"
            />
            <BaseInput
              v-model="form.email"
              name="email"
              label="Correo electrónico"
              type="email"
              :error="errors.email"
              placeholder="tu@gmail.com"
              autocomplete="email"
            />
            <BaseInput
              v-model="form.password"
              name="password"
              label="Contraseña"
              type="password"
              :error="errors.password"
              placeholder="Mínimo 8 caracteres"
              autocomplete="new-password"
            />
            <BaseInput
              v-model="form.password_confirmation"
              name="password_confirmation"
              label="Confirmar contraseña"
              type="password"
              :error="errors.password_confirmation"
              placeholder="Vuelve a escribir tu contraseña"
              autocomplete="new-password"
            />
          </div>

          <BaseButton
            type="submit"
            class="w-full py-2.5 text-base"
            :loading="authStore.loading"
            :disabled="authStore.loading"
          >
            Crear cuenta
          </BaseButton>

          <p class="mt-8 text-center text-sm text-slate-600">
            ¿Ya tienes una cuenta?
            <RouterLink
              :to="{ name: 'login' }"
              class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
            >
              Inicia sesión aquí
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
