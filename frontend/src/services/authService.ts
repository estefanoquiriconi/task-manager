import axios from 'axios'
import api from './api'
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

async function getCsrfCookie(): Promise<void> {
  await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true })
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  await getCsrfCookie()
  const { data } = await api.post<AuthResponse>('/login', payload)
  return data
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  await getCsrfCookie()
  const { data } = await api.post<AuthResponse>('/register', payload)
  return data
}

export async function logout(): Promise<void> {
  await api.post('/logout')
}

export async function getUser(): Promise<User> {
  const { data } = await api.get<User>('/user')
  return data
}
