import axios from 'axios'
import type {
  CohortResponse,
  CreateCohortRequest,
  CreateLecturerRequest,
  CreateProgrammeRequest,
  CreateStudentRequest,
  CreateUniversityRequest,
  LecturerResponse,
  ProgrammeResponse,
  StudentResponse,
  UniversityResponse,
} from './types'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

// Universities
export const getUniversities = () => api.get<UniversityResponse[]>('/universities')
export const getUniversity = (id: number) => api.get<UniversityResponse>(`/universities/${id}`)
export const createUniversity = (data: CreateUniversityRequest) => api.post<UniversityResponse>('/universities', data)

// Programmes
export const getProgrammes = (universityId?: number) => api.get<ProgrammeResponse[]>('/programmes', { params: { universityId } })
export const getProgramme = (id: number) => api.get<ProgrammeResponse>(`/programmes/${id}`)
export const createProgramme = (data: CreateProgrammeRequest) => api.post<ProgrammeResponse>('/programmes', data)
export const updateProgramme = (id: number, data: CreateProgrammeRequest) => api.put<ProgrammeResponse>(`/programmes/${id}`, data)

// Cohorts
export const getCohorts = (universityId?: number) => api.get<CohortResponse[]>('/cohorts', { params: { universityId } })
export const createCohort = (data: CreateCohortRequest) => api.post<CohortResponse>('/cohorts', data)
export const updateCohort = (id: number, data: CreateCohortRequest) => api.put<CohortResponse>(`/cohorts/${id}`, data)

// Lecturers
export const getLecturers = (universityId?: number) => api.get<LecturerResponse[]>('/lecturers', { params: { universityId } })
export const createLecturer = (data: CreateLecturerRequest) => api.post<LecturerResponse>('/lecturers', data)
export const updateLecturer = (id: number, data: CreateLecturerRequest) => api.put<LecturerResponse>(`/lecturers/${id}`, data)

// Students
export const getStudents = (universityId?: number) => api.get<StudentResponse[]>('/students', { params: { universityId } })
export const getStudentsByCohort = (cohortId: number) => api.get<StudentResponse[]>(`/students/cohort/${cohortId}`)
export const createStudent = (data: CreateStudentRequest) => api.post<StudentResponse>('/students', data)
export const updateStudent = (id: number, data: CreateStudentRequest) => api.put<StudentResponse>(`/students/${id}`, data)
