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
