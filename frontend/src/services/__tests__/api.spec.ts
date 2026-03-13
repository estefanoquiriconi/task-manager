import { describe, it, expect, vi } from 'vitest'
import { AxiosError, type AxiosResponse } from 'axios'
import { extractValidationErrors } from '@/services/api'

vi.mock('@/router', () => ({ default: { push: vi.fn() } }))

function createAxiosError(status: number, data: Record<string, unknown>): AxiosError {
  const error = new AxiosError('Request failed')
  error.response = {
    status,
    data,
    statusText: '',
    headers: {},
    config: {} as AxiosResponse['config'],
  } as AxiosResponse
  error.isAxiosError = true
  return error
}

describe('extractValidationErrors', () => {
  it('extracts first message of each field from 422', () => {
    const error = createAxiosError(422, {
      errors: {
        email: ['Email is required', 'Email must be valid'],
        name: ['Name is required'],
      },
    })

    const result = extractValidationErrors(error)

    expect(result).toEqual({
      email: 'Email is required',
      name: 'Name is required',
    })
  })

  it('returns null for non-422 errors', () => {
    const error = createAxiosError(500, { message: 'Server error' })
    expect(extractValidationErrors(error)).toBeNull()
  })

  it('returns null for non-Axios errors', () => {
    expect(extractValidationErrors(new Error('generic'))).toBeNull()
  })

  it('returns null for 422 without errors field', () => {
    const error = createAxiosError(422, { message: 'Validation failed' })
    expect(extractValidationErrors(error)).toBeNull()
  })
})
