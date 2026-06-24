import apiClient from './apiClient'

export interface PlatformAdmin {
  id: number
  firstName: string
  surname: string
  email: string
  role: 'ROLE_UNI_ADMIN' | 'ROLE_PLATFORM_ADMIN'
  blocked: boolean
  deleted: boolean
  dateOfBirth?: string | null
}

export interface CreatePlatformAdminRequest {
  firstName: string
  surname: string
  email: string
}

export const listPlatformAdmins    = () =>
  apiClient.get<PlatformAdmin[]>('/super-admin/platform-admins')

export const createPlatformAdmin   = (data: CreatePlatformAdminRequest) =>
  apiClient.post<PlatformAdmin>('/super-admin/platform-admins', data)

export const blockPlatformAdmin    = (id: number) =>
  apiClient.patch<PlatformAdmin>(`/super-admin/platform-admins/${id}/block`)

export const unblockPlatformAdmin  = (id: number) =>
  apiClient.patch<PlatformAdmin>(`/super-admin/platform-admins/${id}/unblock`)

export const deletePlatformAdmin   = (id: number) =>
  apiClient.delete(`/super-admin/platform-admins/${id}`)
