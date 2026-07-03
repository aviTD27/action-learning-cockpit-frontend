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

export const PROGRAMME_STATUSES = ['ACTIVE', 'ARCHIVED'] as const

export type ProgrammeStatus = (typeof PROGRAMME_STATUSES)[number]

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
  status: ProgrammeStatus
}

export interface CohortResponse {
  id: number
  name: string
  programmeId: number
  programmeName: string
  status: CohortStatus
  lecturerIds: number[]
  lecturerNames: string[]
}

export interface LecturerResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  lecturerRef: string
  phone?: string | null
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
  cohortName: string | null
  universityName: string | null
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
  lecturerIds?: number[]
}

export interface CreateLecturerRequest {
  firstName: string
  lastName: string
  email?: string
  lecturerRef: string
  phone?: string
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

//   Analytics (tenant-scoped)                          ─
export interface TenantSummary {
  totalStudents: number
  activeStudents: number
  totalLecturers: number
  activeLecturers: number
  totalProgrammes: number
  totalCohorts: number
  activeCohorts: number
  totalSubmissions: number
  releasedGrades: number
  gradedThisMonth: number
  avgScorePct: number
}

export interface TrendPoint {
  month: string
  submissions: number
  avgScore: number
}

export interface GradeDistribution {
  band: string
  count: number
}

// ── Timetable ─────────────────────────────────────────────────────────────────
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

export interface TimetableEntry {
  id: number
  title: string
  room: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  color: string
  cohortId: number
  cohortName: string
  lecturerId: number | null
  lecturerName: string | null
  universityId: number
  universityName: string
}

export interface CreateTimetableRequest {
  title: string
  room: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  color?: string
  cohortId: number
  lecturerId?: number | null
}

export interface CohortBenchmark {
  cohortId: number
  cohortName: string
  programmeName: string | null
  students: number
  submissions: number
  releasedGrades: number
  avgScorePct: number
  rank: number
}

export interface GradingBacklog {
  awaitingGrades: number
  turnedIn: number
  released: number
}

export interface AtRiskStudent {
  studentId: number
  studentName: string
  studentRef: string
  cohortName: string | null
  programmeName: string | null
  avgScorePct: number | null
  gradedCount: number
  missedSubmissions: number
  reason: string
}

export interface LecturerWorkload {
  lecturerId: number
  lecturerName: string
  assignments: number
  cohorts: number
  gradingBacklog: number
}
