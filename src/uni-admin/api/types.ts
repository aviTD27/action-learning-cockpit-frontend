export const COHORT_STATUSES = [
  'NOT_STARTED',
  'ONGOING',
  'COMPLETED',
  'GRADUATED',
  'ARCHIVED',
] as const

export type CohortStatus = (typeof COHORT_STATUSES)[number]

export const LECTURER_STATUSES = ['ACTIVE', 'INACTIVE'] as const

export type LecturerStatus = (typeof LECTURER_STATUSES)[number]

export const STUDENT_STATUSES = [
  'ACTIVE',
  'INACTIVE',
  'PAYMENT_PENDING',
  'PROBATION',
  'SUSPENDED',
  'EXPELLED',
  'COMPLETED',
  'GRADUATED',
  'DROPPED_OUT',
] as const

export type StudentStatus = (typeof STUDENT_STATUSES)[number]

export interface UniversityResponse {
  id: number
  name: string
  code: string
  domain: string | null
}

export interface CreateUniversityRequest {
  name: string
  code: string
}

export interface ProgrammeResponse {
  id: number
  name: string
  code: string
  description: string
  universityId: number | null
  universityName: string | null
}

export interface CohortResponse {
  id: number
  name: string
  programmeId: number
  programmeName: string
  status: CohortStatus
}

export interface LecturerResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  lecturerRef: string
  programmeIds: number[]
  programmeNames: string[]
  status: LecturerStatus
}

export interface StudentResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  studentRef: string
  programmeId: number
  programmeName: string
  status: StudentStatus
  cohortId: number
}

export interface CreateProgrammeRequest {
  name: string
  code: string
  description: string
  universityId: number
}

export interface CreateCohortRequest {
  name: string
  programmeId: number
  status?: CohortStatus
}

export interface CreateLecturerRequest {
  firstName: string
  lastName: string
  email: string
  lecturerRef: string
  programmeIds: number[]
  status?: LecturerStatus
}

export interface CreateStudentRequest {
  firstName: string
  lastName: string
  /** Only required when creating — platform email is auto-generated server-side. */
  personalEmail?: string
  studentRef: string
  programmeId: number
  status: StudentStatus
  cohortId: number
}
