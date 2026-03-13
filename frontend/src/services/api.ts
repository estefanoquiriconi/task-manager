import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  },
)

export function extractValidationErrors(error: unknown): Record<string, string> | null {
  if (axios.isAxiosError(error) && error.response?.status === 422) {
    const serverErrors = error.response.data?.errors
    if (serverErrors) {
      const mapped: Record<string, string> = {}
      for (const [key, messages] of Object.entries(serverErrors)) {
        mapped[key] = (messages as string[])[0] ?? ''
      }
      return mapped
    }
  }
  return null
}

export default api
