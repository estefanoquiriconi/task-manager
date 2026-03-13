import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import type { AuthResponse } from '@/types'

vi.mock('@/router', () => ({ default: { push: vi.fn() } }))
vi.mock('@/services/authService')

import router from '@/router'
import * as authService from '@/services/authService'

const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' }
const mockResponse: AuthResponse = { user: mockUser, token: 'fake-token-123' }

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('has correct initial state', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.isAuthenticated).toBe(false)
  })

  it('reads token from localStorage', () => {
    localStorage.setItem('auth_token', 'stored-token')
    const store = useAuthStore()
    expect(store.token).toBe('stored-token')
    expect(store.isAuthenticated).toBe(true)
  })

  it('login saves user/token and navigates to tasks', async () => {
    vi.mocked(authService.login).mockResolvedValue(mockResponse)
    const store = useAuthStore()

    await store.login({ email: 'test@example.com', password: 'password' })

    expect(authService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' })
    expect(store.user).toEqual(mockUser)
    expect(store.token).toBe('fake-token-123')
    expect(localStorage.getItem('auth_token')).toBe('fake-token-123')
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

  it('register saves user/token and navigates to tasks', async () => {
    vi.mocked(authService.register).mockResolvedValue(mockResponse)
    const store = useAuthStore()
    const payload = { name: 'Test', email: 'test@example.com', password: 'pass', password_confirmation: 'pass' }

    await store.register(payload)

    expect(authService.register).toHaveBeenCalledWith(payload)
    expect(store.user).toEqual(mockUser)
    expect(store.token).toBe('fake-token-123')
    expect(router.push).toHaveBeenCalledWith({ name: 'tasks' })
  })

  it('logout clears auth and navigates to login', async () => {
    vi.mocked(authService.logout).mockResolvedValue()
    vi.mocked(authService.login).mockResolvedValue(mockResponse)
    const store = useAuthStore()

    await store.login({ email: 'a@b.com', password: '123' })
    await store.logout()

    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(localStorage.getItem('auth_token')).toBeNull()
    expect(router.push).toHaveBeenCalledWith({ name: 'login' })
  })

  it('logout clears auth even if API fails', async () => {
    vi.mocked(authService.logout).mockRejectedValue(new Error('network'))
    vi.mocked(authService.login).mockResolvedValue(mockResponse)
    const store = useAuthStore()

    await store.login({ email: 'a@b.com', password: '123' })
    await store.logout().catch(() => {})

    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
  })

  it('initAuth restores user from localStorage', () => {
    localStorage.setItem('auth_token', 'tok')
    localStorage.setItem('auth_user', JSON.stringify(mockUser))
    const store = useAuthStore()

    store.initAuth()

    expect(store.user).toEqual(mockUser)
  })

  it('initAuth handles corrupted JSON', () => {
    localStorage.setItem('auth_token', 'tok')
    localStorage.setItem('auth_user', '{invalid json')
    const store = useAuthStore()

    store.initAuth()

    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(localStorage.getItem('auth_token')).toBeNull()
  })

  it('initAuth clears auth when no token', () => {
    localStorage.setItem('auth_user', JSON.stringify(mockUser))
    const store = useAuthStore()

    store.initAuth()

    expect(store.user).toBeNull()
  })
})
