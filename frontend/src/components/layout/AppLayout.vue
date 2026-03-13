<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>

<template>
  <div
    class="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900"
  >
    <nav class="sticky top-0 z-30 border-b border-white/20 bg-white/60 backdrop-blur-xl shadow-sm">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <RouterLink
          :to="{ name: 'tasks' }"
          class="group flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 transition-transform group-hover:scale-105"
          >
            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              ></path>
            </svg>
          </div>
          <span
            class="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors"
            >Gestión de Tareas</span
          >
        </RouterLink>

        <div v-if="authStore.isAuthenticated" class="flex items-center gap-4">
          <span class="hidden text-sm font-medium text-slate-600 sm:inline">
            {{ authStore.user?.name }}
          </span>
          <button
            class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
            aria-label="Cerrar sesión"
            @click="authStore.logout()"
          >
            <svg
              class="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            Salir
          </button>
        </div>
      </div>
    </nav>

    <main class="relative">
      <slot />
    </main>
  </div>
</template>
