import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, LoginPayload, RegisterPayload } from '@/types'
import * as authService from '@/services/authService'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  async function login(payload: LoginPayload) {
    loading.value = true
    try {
      const response = await authService.login(payload)
      user.value = response.user
      await router.push({ name: 'tasks' })
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterPayload) {
    loading.value = true
    try {
      const response = await authService.register(payload)
      user.value = response.user
      await router.push({ name: 'tasks' })
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      user.value = null
      await router.push({ name: 'login' })
    }
  }

  async function initAuth() {
    try {
      user.value = await authService.getUser()
    } catch {
      user.value = null
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    initAuth,
  }
})
