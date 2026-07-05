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
  instructions: string | null
  additionalNotes: string | null
  submissionType: 'FILE' | 'TEXT' | 'BOTH'
  dueDate: string
  dueTime: string | null
  maxPoints: number
  allowedFileTypes: string | null
  lateAllowed: boolean
  lecturerId: number | null
  minWordCount: number | null
  maxWordCount: number | null
  maxFileSizeBytes: number | null
  namingPattern: string | null
  requiredHeadings: string | null
  templateFileName: string | null
  hasTemplate: boolean
  hasTemplateFile: boolean
}

// Assignments for the student's programme (across all its courses).
// Falls back to university-wide published assignments when the student has no programme.
export const getAssignmentsForProgramme = (programmeId: number | null) =>
  apiClient.get<AssignmentItem[]>(
    programmeId != null ? `/submissions?programmeId=${programmeId}` : '/submissions'
  ).then(r => r.data)

export const downloadAssignmentTemplate = (submissionId: number) =>
  apiClient.get<Blob>(`/submissions/${submissionId}/template`, { responseType: 'blob' })

export interface CheckResult {
  label: string
  passed: boolean
  skipped: boolean
  message: string
  detail: string | null
}

export interface ComplianceReport {
  uploadId: number | null
  fileName: string
  fileSizeBytes: number
  overallPass: boolean
  fileType: CheckResult
  naming: CheckResult
  wordCount: CheckResult
  headings: CheckResult
}

export const turnInDocument = (uploadId: number): Promise<void> =>
  apiClient.patch(`/submissions/uploads/${uploadId}/turn-in`).then(() => {})

export interface MyUploadStatus {
  uploadId: number
  turnedIn: boolean
  fileName: string | null
  turnedInAt: string | null
  compliancePassed: boolean
  late: boolean
}

export const getMyUploadStatus = (submissionId: number): Promise<MyUploadStatus | null> =>
  apiClient.get<MyUploadStatus>(`/submissions/${submissionId}/my-upload`)
    .then(r => r.status === 204 ? null : r.data)
    .catch(() => null)

export const uploadDocument = (submissionId: number, file: File): Promise<ComplianceReport> => {
  const form = new FormData()
  form.append('file', file)
  return apiClient.post<ComplianceReport>(
    `/submissions/${submissionId}/upload`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  ).then(r => r.data)
}

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

export const getGradeReleaseUnreadCount = (): Promise<number> =>
  getMyNotifications()
    .then(items => items.filter(n => !n.read && n.type === 'GRADE_RELEASED').length)

export const markGradeNotificationsRead = (): Promise<void> =>
  getMyNotifications().then(items => {
    const unread = items.filter(n => !n.read && n.type === 'GRADE_RELEASED')
    return Promise.all(unread.map(n => markNotificationRead(n.id))).then(() => {})
  })

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
