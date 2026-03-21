import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AuthResponse, User } from '@/types'

vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))
vi.mock('@/router', () => ({ default: { push: vi.fn() } }))
vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({}),
  },
}))

import api from '@/services/api'
import axios from 'axios'
import * as authService from '@/services/authService'

const mockUser: User = { id: 1, name: 'Test', email: 'test@example.com' }
const mockAuthResponse: AuthResponse = { user: mockUser }

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('fetches CSRF cookie then posts credentials', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: mockAuthResponse })

      const result = await authService.login({ email: 'test@example.com', password: 'secret' })

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/sanctum/csrf-cookie'),
        expect.objectContaining({ withCredentials: true }),
      )
      expect(api.post).toHaveBeenCalledWith('/login', { email: 'test@example.com', password: 'secret' })
      expect(result).toEqual(mockAuthResponse)
    })

    it('propagates API errors', async () => {
      vi.mocked(api.post).mockRejectedValue(new Error('401'))

      await expect(authService.login({ email: 'a@b.com', password: 'x' })).rejects.toThrow('401')
    })
  })

  describe('register', () => {
    it('fetches CSRF cookie then posts payload', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: mockAuthResponse })
      const payload = { name: 'Test', email: 'test@example.com', password: 'secret', password_confirmation: 'secret' }

      const result = await authService.register(payload)

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/sanctum/csrf-cookie'),
        expect.objectContaining({ withCredentials: true }),
      )
      expect(api.post).toHaveBeenCalledWith('/register', payload)
      expect(result).toEqual(mockAuthResponse)
    })
  })

  describe('logout', () => {
    it('posts to /logout', async () => {
      vi.mocked(api.post).mockResolvedValue({})

      await authService.logout()

      expect(api.post).toHaveBeenCalledWith('/logout')
    })
  })

  describe('getUser', () => {
    it('gets current user', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUser })

      const result = await authService.getUser()

      expect(api.get).toHaveBeenCalledWith('/user')
      expect(result).toEqual(mockUser)
    })
  })
})
