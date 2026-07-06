export const COHORT_STATUSES = [
  'NOT_STARTED',
  'ONGOING',
  'COMPLETED',
  'GRADUATED',
  'ARCHIVED',
] as const

export type CohortStatus = (typeof COHORT_STATUSES)[number]

export const COHORT_SEASONS = ['SPRING', 'FALL'] as const
export type CohortSeason = (typeof COHORT_SEASONS)[number]

export const COURSE_STATUSES = ['ACTIVE', 'ARCHIVED'] as const
export type CourseStatus = (typeof COURSE_STATUSES)[number]

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
  cohortIds: number[]
  cohortNames: string[]
  semesterCount: number
}

export interface CohortResponse {
  id: number
  name: string
  season: CohortSeason
  academicYear: number
  universityId: number | null
  universityName: string | null
  status: CohortStatus
  programmeIds: number[]
  programmeNames: string[]
  studentCount: number
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
  name?: string
  season: CohortSeason
  academicYear: number
  status?: CohortStatus
  programmeIds?: number[]
}

export interface CreateLecturerRequest {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  programmeIds: number[]
  status?: LecturerStatus
}

export interface CreateStudentRequest {
  firstName: string
  lastName: string
  /** Only required when creating — platform email is auto-generated server-side. */
  personalEmail?: string
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
}

export interface AtRiskStudent {
  studentId: number
  studentName: string
  studentRef: string
  cohortName: string | null
  courseName?: string | null
  avgScorePct: number | null
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


// ── Semesters & Courses (new hierarchy) ────────────────────────────────────────
export interface SemesterResponse {
  id: number
  name: string
  orderIndex: number
  programmeId: number
  programmeName: string
  courseCount: number
}

export interface CreateSemesterRequest {
  name: string
  orderIndex?: number
  programmeId: number
}

export interface CourseResponse {
  id: number
  name: string
  code: string | null
  description: string | null
  status: CourseStatus
  semesterId: number
  semesterName: string
  programmeId: number
  programmeName: string
  lecturerId: number | null
  lecturerName: string | null
  studentCount: number
  assignmentCount: number
}

export interface CreateCourseRequest {
  name: string
  code?: string
  description?: string
  semesterId: number
  lecturerId?: number | null
}
