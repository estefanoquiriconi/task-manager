<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900"
  >
    <nav class="sticky top-0 z-30 border-b border-white/20 bg-white/70 backdrop-blur-md shadow-sm">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <RouterLink
          :to="{ name: 'tasks' }"
          class="group flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 ring-1 ring-white/10 transition-transform group-hover:scale-105"
          >
            <svg
              class="h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span class="text-xl font-bold tracking-tight text-slate-900">Gestión de Tareas</span>
        </RouterLink>
      </div>
    </nav>

    <main class="relative">
      <slot />
    </main>
  </div>
</template>
