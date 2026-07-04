import apiClient from '../../api/apiClient'
import type {
  AtRiskStudent,
  CohortBenchmark,
  CohortResponse,
  CreateCohortRequest,
  CreateCourseRequest,
  CreateSemesterRequest,
  CourseResponse,
  SemesterResponse,
  CreateLecturerRequest,
  CreateProgrammeRequest,
  CreateStudentRequest,
  CreateTimetableRequest,
  CreateUniversityRequest,
  GradeDistribution,
  GradingBacklog,
  LecturerResponse,
  LecturerWorkload,
  ProgrammeResponse,
  StudentResponse,
  TenantSummary,
  TimetableEntry,
  TrendPoint,
  UniversityResponse,
} from './types'

const api = apiClient

// Universities
export const getUniversities = () => api.get<UniversityResponse[]>('/universities')
export const getUniversity = (id: number) => api.get<UniversityResponse>(`/universities/${id}`)
export const createUniversity = (data: CreateUniversityRequest) => api.post<UniversityResponse>('/universities', data)

// Programmes
export const getProgrammes = (universityId?: number) => api.get<ProgrammeResponse[]>('/programmes', { params: { universityId } })
export const getArchivedProgrammes = (universityId?: number) => api.get<ProgrammeResponse[]>('/programmes/archived', { params: { universityId } })
export const getProgramme = (id: number) => api.get<ProgrammeResponse>(`/programmes/${id}`)
export const createProgramme = (data: CreateProgrammeRequest) => api.post<ProgrammeResponse>('/programmes', data)
export const updateProgramme = (id: number, data: CreateProgrammeRequest) => api.put<ProgrammeResponse>(`/programmes/${id}`, data)
export const archiveProgramme = (id: number) => api.delete<void>(`/programmes/${id}`)
export const unarchiveProgramme = (id: number) => api.post<ProgrammeResponse>(`/programmes/${id}/unarchive`)

// Cohorts
export const getCohorts = (universityId?: number) => api.get<CohortResponse[]>('/cohorts', { params: { universityId } })
export const createCohort = (data: CreateCohortRequest) => api.post<CohortResponse>('/cohorts', data)
export const updateCohort = (id: number, data: CreateCohortRequest) => api.put<CohortResponse>(`/cohorts/${id}`, data)

// Semesters
export const getSemesters = (params?: { programmeId?: number; universityId?: number }) => api.get<SemesterResponse[]>('/semesters', { params })
export const createSemester = (data: CreateSemesterRequest) => api.post<SemesterResponse>('/semesters', data)
export const updateSemester = (id: number, data: CreateSemesterRequest) => api.put<SemesterResponse>(`/semesters/${id}`, data)
export const deleteSemester = (id: number) => api.delete<void>(`/semesters/${id}`)

// Courses
export const getCourses = (params?: { semesterId?: number; programmeId?: number; lecturerId?: number; universityId?: number }) => api.get<CourseResponse[]>('/courses', { params })
export const getCourse = (id: number) => api.get<CourseResponse>(`/courses/${id}`)
export const createCourse = (data: CreateCourseRequest) => api.post<CourseResponse>('/courses', data)
export const updateCourse = (id: number, data: CreateCourseRequest) => api.put<CourseResponse>(`/courses/${id}`, data)
export const archiveCourse = (id: number) => api.patch<CourseResponse>(`/courses/${id}/archive`)
export const unarchiveCourse = (id: number) => api.patch<CourseResponse>(`/courses/${id}/unarchive`)
export const deleteCourse = (id: number) => api.delete<void>(`/courses/${id}`)

// Lecturers
export const getLecturers = (universityId?: number) => api.get<LecturerResponse[]>('/lecturers', { params: { universityId } })
export const createLecturer = (data: CreateLecturerRequest) => api.post<LecturerResponse>('/lecturers', data)
export const updateLecturer = (id: number, data: CreateLecturerRequest) => api.put<LecturerResponse>(`/lecturers/${id}`, data)

// Students
export const getStudents = (universityId?: number) => api.get<StudentResponse[]>('/students', { params: { universityId } })
export const getStudentsByCohort = (cohortId: number) => api.get<StudentResponse[]>(`/students/cohort/${cohortId}`)
export const getStudentsByProgramme = (programmeId: number) => api.get<StudentResponse[]>('/students').then(r => ({ ...r, data: r.data.filter(s => s.programmeId === programmeId) }))
export const createStudent = (data: CreateStudentRequest) => api.post<StudentResponse>('/students', data)
export const updateStudent = (id: number, data: CreateStudentRequest) => api.put<StudentResponse>(`/students/${id}`, data)

// Analytics
export const getTenantSummary     = (universityId?: number) => api.get<TenantSummary>('/analytics/tenant/summary', { params: { universityId } })
export const getTenantTrends      = (universityId?: number) => api.get<TrendPoint[]>('/analytics/tenant/trends', { params: { universityId } })
export const getGradeDistribution = (universityId?: number) => api.get<GradeDistribution[]>('/analytics/tenant/grade-distribution', { params: { universityId } })
export const getCohortBenchmark   = (universityId?: number) => api.get<CohortBenchmark[]>('/analytics/tenant/cohort-benchmark', { params: { universityId } })
export const getGradingBacklog    = (universityId?: number) => api.get<GradingBacklog>('/analytics/tenant/grading-backlog', { params: { universityId } })
export const getAtRiskStudents    = (universityId?: number) => api.get<AtRiskStudent[]>('/analytics/tenant/at-risk', { params: { universityId } })
export const getLecturerWorkload  = (universityId?: number) => api.get<LecturerWorkload[]>('/analytics/tenant/lecturer-workload', { params: { universityId } })

// Timetable
export const getTimetable          = ()                                    => api.get<TimetableEntry[]>('/timetable')
export const createTimetableEntry  = (data: CreateTimetableRequest)        => api.post<TimetableEntry>('/timetable', data)
export const updateTimetableEntry  = (id: number, data: CreateTimetableRequest) => api.put<TimetableEntry>(`/timetable/${id}`, data)
export const deleteTimetableEntry  = (id: number)                          => api.delete<void>(`/timetable/${id}`)
