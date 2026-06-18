import apiClient from './apiClient'

export interface PlatformAdmin {
  id: number
  firstName: string
  surname: string
  email: string
  active: boolean
  createdAt?: string
}

export interface CreatePlatformAdminRequest {
  firstName: string
  surname: string
  email: string
}

export const listPlatformAdmins = () =>
  apiClient.get<PlatformAdmin[]>('/super-admin/platform-admins')

export const createPlatformAdmin = (data: CreatePlatformAdminRequest) =>
  apiClient.post<PlatformAdmin>('/super-admin/platform-admins', data)

export const deactivatePlatformAdmin = (id: number) =>
  apiClient.patch<PlatformAdmin>(`/super-admin/platform-admins/${id}/deactivate`)

export const reactivatePlatformAdmin = (id: number) =>
  apiClient.patch<PlatformAdmin>(`/super-admin/platform-admins/${id}/reactivate`)
