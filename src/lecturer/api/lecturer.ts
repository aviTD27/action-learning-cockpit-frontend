import apiClient from '../../api/apiClient'
import type {
  CreateSubmissionRequest,
  GradeRequest,
  GradeResponse,
  ScoringReport,
  StudentSubmissionResponse,
  SubmissionResponse,
} from './types'

const api = apiClient

//  Submissions 

export const getSubmissions = (params?: { cohortId?: number; lecturerId?: number }) =>
  api.get<SubmissionResponse[]>('/submissions', { params })

export const getSubmission = (id: number) =>
  api.get<SubmissionResponse>(`/submissions/${id}`)

export const createSubmission = (data: CreateSubmissionRequest) =>
  api.post<SubmissionResponse>('/submissions', data)

export const updateSubmission = (id: number, data: CreateSubmissionRequest) =>
  api.put<SubmissionResponse>(`/submissions/${id}`, data)

export const deleteSubmission = (id: number) =>
  api.delete<void>(`/submissions/${id}`)

export const notifySubmission = (id: number) =>
  api.patch<SubmissionResponse>(`/submissions/${id}/notify`)

//  Grades

export const getGrades = (submissionId: number) =>
  api.get<GradeResponse[]>(`/submissions/${submissionId}/grades`)

export const setGrade = (submissionId: number, studentId: number, data: GradeRequest) =>
  api.put<GradeResponse>(`/submissions/${submissionId}/grades/${studentId}`, data)

export const releaseGrades = (submissionId: number) =>
  api.patch<GradeResponse[]>(`/submissions/${submissionId}/grades/release`)

// Student submissions

export const getStudentSubmissions = (submissionId: number) =>
  api.get<StudentSubmissionResponse[]>(`/submissions/${submissionId}/student-submissions`)

export const getSubmissionScore = (uploadId: number) =>
  api.get<ScoringReport>(`/submissions/uploads/${uploadId}/score`)

export const downloadStudentFile = (uploadId: number) =>
  api.get<Blob>(`/submissions/uploads/${uploadId}/download`, { responseType: 'blob' })

export const uploadTemplate = (submissionId: number, file: File) => {
  const form = new FormData()
  form.append('file', file)
  return api.post<SubmissionResponse>(`/submissions/${submissionId}/template`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const downloadTemplate = (submissionId: number) =>
  api.get<Blob>(`/submissions/${submissionId}/template/download`, { responseType: 'blob' })
