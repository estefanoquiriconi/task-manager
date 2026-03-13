import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, LoginPayload, RegisterPayload } from '@/types'
import * as authService from '@/services/authService'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  function setAuth(authUser: User, authToken: string) {
    user.value = authUser
    token.value = authToken
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('auth_user', JSON.stringify(authUser))
  }

  function clearAuth() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  async function login(payload: LoginPayload) {
    loading.value = true
    try {
      const response = await authService.login(payload)
      setAuth(response.user, response.token)
      await router.push({ name: 'tasks' })
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterPayload) {
    loading.value = true
    try {
      const response = await authService.register(payload)
      setAuth(response.user, response.token)
      await router.push({ name: 'tasks' })
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      clearAuth()
      await router.push({ name: 'login' })
    }
  }

  function initAuth() {
    const storedUser = localStorage.getItem('auth_user')
    if (token.value && storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        clearAuth()
      }
    } else {
      clearAuth()
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    initAuth,
  }
})
