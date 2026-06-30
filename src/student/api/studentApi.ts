import apiClient from '../../api/apiClient'

export interface StudentProfile {
  id: number
  firstName: string
  lastName: string
  email: string
  studentRef: string
  programmeId: number
  programmeName: string
  status: string
  cohortId: number | null
  cohortName: string | null
  universityName: string | null
}

export const getMyProfile = () =>
  apiClient.get<StudentProfile>('/students/me').then(r => r.data)

export interface AssignmentItem {
  id: number
  title: string
  description: string | null
  dueDate: string
  maxPoints: number
  allowedFileTypes: string | null
  lateAllowed: boolean
  lecturerId: number | null
}

export const getAssignmentsForCohort = (cohortId: number) =>
  apiClient.get<AssignmentItem[]>(`/submissions?cohortId=${cohortId}`).then(r => r.data)

export interface GradeItem {
  submissionId: number
  submissionTitle: string
  maxPoints: number
  grade: number
  feedback: string | null
  gradedAt: string
}

export const getMyGrades = () =>
  apiClient.get<GradeItem[]>('/grades/me').then(r => r.data)

export interface NotificationItem {
  id: number
  submissionId: number | null
  submissionTitle: string | null
  type: string
  message: string
  read: boolean
  createdAt: string
}

export const getMyNotifications = () =>
  apiClient.get<NotificationItem[]>('/notifications/me').then(r => r.data)

export const getUnreadCount = () =>
  apiClient.get<number>('/notifications/me/unread-count').then(r => r.data)

export const markNotificationRead = (id: number) =>
  apiClient.patch<NotificationItem>(`/notifications/${id}/read`).then(r => r.data)

export const markAllNotificationsRead = () =>
  apiClient.patch('/notifications/me/read-all')

export interface CohortInfo {
  cohortId: number
  cohortName: string
  programmeName: string
  programmeCode: string
  status: string
  universityName: string | null
  lecturerNames: string[]
}

export const getMyCohort = () =>
  apiClient.get<CohortInfo>('/students/me/cohort').then(r => r.data)
