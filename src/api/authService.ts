import apiClient from './apiClient'

export interface RegisterRequest {
  firstName: string
  surname: string
  dateOfBirth: string
  email: string
  password: string
  role?: string
}

export interface AuthResponse {
  token: string
}

export const loginUser = (email: string, password: string) =>
  apiClient.post<AuthResponse>('/auth/login', { email, password })

export const registerUser = (payload: RegisterRequest) =>
  apiClient.post<AuthResponse>('/auth/register', payload)
