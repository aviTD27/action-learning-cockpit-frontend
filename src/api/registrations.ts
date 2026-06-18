import axios from 'axios'
import apiClient from './apiClient'

const publicApi = axios.create({
  baseURL: 'http://localhost:8080/api',
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

/** Public landing page access request. */
export const submitRegistration = (data: RegistrationRequest) =>
  publicApi.post<RegistrationResponse>('/registrations', data)

/** Authenticated Super-Admin review queue. */
export const listRegistrations = (status?: 'PENDING' | 'APPROVED' | 'DECLINED') =>
  apiClient.get<RegistrationResponse[]>('/registrations', { params: { status } })

export const approveRegistration = (id: number) =>
  apiClient.patch<RegistrationResponse>(`/registrations/${id}/approve`)

export const declineRegistration = (id: number, reason: string) =>
  apiClient.patch<RegistrationResponse>(`/registrations/${id}/decline`, { reason })
