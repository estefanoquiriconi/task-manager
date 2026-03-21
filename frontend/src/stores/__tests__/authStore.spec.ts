import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import type { AuthResponse } from '@/types'

vi.mock('@/router', () => ({ default: { push: vi.fn() } }))
vi.mock('@/services/authService')

import router from '@/router'
import * as authService from '@/services/authService'

const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' }
const mockResponse: AuthResponse = { user: mockUser }

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('has correct initial state', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.isAuthenticated).toBe(false)
  })

  it('login saves user and navigates to tasks', async () => {
    vi.mocked(authService.login).mockResolvedValue(mockResponse)
    const store = useAuthStore()

    await store.login({ email: 'test@example.com', password: 'password' })

    expect(authService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' })
    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
    expect(router.push).toHaveBeenCalledWith({ name: 'tasks' })
  })

  it('login manages loading state', async () => {
    let resolveLogin: (value: AuthResponse) => void
    vi.mocked(authService.login).mockReturnValue(new Promise((r) => { resolveLogin = r }))
    const store = useAuthStore()

    const loginPromise = store.login({ email: 'a@b.com', password: '123' })
    expect(store.loading).toBe(true)

    resolveLogin!(mockResponse)
    await loginPromise
    expect(store.loading).toBe(false)
  })

  it('login sets loading false on error', async () => {
    vi.mocked(authService.login).mockRejectedValue(new Error('fail'))
    const store = useAuthStore()

    await expect(store.login({ email: 'a@b.com', password: '123' })).rejects.toThrow('fail')
    expect(store.loading).toBe(false)
  })

  it('register saves user and navigates to tasks', async () => {
    vi.mocked(authService.register).mockResolvedValue(mockResponse)
    const store = useAuthStore()
    const payload = { name: 'Test', email: 'test@example.com', password: 'pass', password_confirmation: 'pass' }

    await store.register(payload)

    expect(authService.register).toHaveBeenCalledWith(payload)
    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
    expect(router.push).toHaveBeenCalledWith({ name: 'tasks' })
  })

  it('logout clears user and navigates to login', async () => {
    vi.mocked(authService.logout).mockResolvedValue()
    vi.mocked(authService.login).mockResolvedValue(mockResponse)
    const store = useAuthStore()

    await store.login({ email: 'a@b.com', password: '123' })
    await store.logout()

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(router.push).toHaveBeenCalledWith({ name: 'login' })
  })

  it('logout clears user even if API fails', async () => {
    vi.mocked(authService.logout).mockRejectedValue(new Error('network'))
    vi.mocked(authService.login).mockResolvedValue(mockResponse)
    const store = useAuthStore()

    await store.login({ email: 'a@b.com', password: '123' })
    await store.logout().catch(() => {})

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('initAuth fetches user from API', async () => {
    vi.mocked(authService.getUser).mockResolvedValue(mockUser)
    const store = useAuthStore()

    await store.initAuth()

    expect(authService.getUser).toHaveBeenCalled()
    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('initAuth sets user to null on API error', async () => {
    vi.mocked(authService.getUser).mockRejectedValue(new Error('401'))
    const store = useAuthStore()

    await store.initAuth()

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
