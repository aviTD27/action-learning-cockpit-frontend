import axios from 'axios'
import apiClient from './apiClient'

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

export interface RegistrationRequest {
  orgName: string
  country: string
  websiteUrl: string
  domain: string
  adminFirstName: string
  adminLastName: string
  adminContactEmail: string
  adminPhone?: string
  description?: string
}

export interface RegistrationResponse extends RegistrationRequest {
  id: number
  status: 'PENDING' | 'APPROVED' | 'DECLINED'
  declineReason?: string
  submittedAt: string
  reviewedAt?: string
}

export const submitRegistration = (data: RegistrationRequest) =>
  publicApi.post<RegistrationResponse>('/registrations', data)

export const listRegistrations = (status?: 'PENDING' | 'APPROVED' | 'DECLINED') =>
  apiClient.get<RegistrationResponse[]>('/registrations', { params: { status } })

export const approveRegistration = (id: number) =>
  apiClient.patch<RegistrationResponse>(`/registrations/${id}/approve`)

export const declineRegistration = (id: number, reason: string) =>
  apiClient.patch<RegistrationResponse>(`/registrations/${id}/decline`, { reason })
