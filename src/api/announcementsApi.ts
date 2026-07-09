import apiClient from './apiClient'

export type AnnouncementAudience =
  | 'ALL_COHORT_STUDENTS'
  | 'SPECIFIC_STUDENTS'
  | 'ALL_UNIVERSITY_STUDENTS'
  | 'ALL_UNIVERSITY_LECTURERS'
  | 'SPECIFIC_LECTURERS'

export interface AnnouncementInboxItem {
  recipientId: number
  announcementId: number
  subject: string
  message: string
  senderName: string
  senderRole: string
  audience: AnnouncementAudience
  sentAt: string
  read: boolean
}

export interface CreateAnnouncementRequest {
  subject: string
  message: string
  audience: AnnouncementAudience
  cohortId?: number | null
  studentIds?: number[] | null
  lecturerIds?: number[] | null
}

export const sendAnnouncement = (data: CreateAnnouncementRequest) =>
  apiClient.post<void>('/announcements', data)

export const getMyAnnouncements = () =>
  apiClient.get<AnnouncementInboxItem[]>('/announcements/me').then(r => r.data)

export const getAnnouncementUnreadCount = () =>
  apiClient.get<number>('/announcements/me/unread-count').then(r => r.data)

export const markStudentAnnouncementRead = (recipientId: number) =>
  apiClient.patch(`/announcements/student-recipients/${recipientId}/read`)

export const markLecturerAnnouncementRead = (recipientId: number) =>
  apiClient.patch(`/announcements/lecturer-recipients/${recipientId}/read`)

export const markAllAnnouncementsRead = () =>
  apiClient.patch('/announcements/me/read-all')

export interface SentAnnouncement {
  id: number
  subject: string
  message: string
  audience: AnnouncementAudience
  cohortName?: string | null
  recipientCount: number
  sentAt: string
}

export const getMySentAnnouncements = () =>
  apiClient.get<SentAnnouncement[]>('/announcements/sent').then(r => r.data)
