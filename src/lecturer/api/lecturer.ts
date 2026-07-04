import apiClient from '../../api/apiClient'
import type {
  CreateSubmissionRequest,
  GradeRequest,
  GradeResponse,
  LecturerOverview,
  ScoringReport,
  StudentSubmissionResponse,
  SubmissionResponse,
} from './types'

const api = apiClient

//  Submissions 

export const getSubmissions = (params?: { courseId?: number; lecturerId?: number }) =>
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

export const publishSubmission = (id: number) =>
  api.patch<SubmissionResponse>(`/submissions/${id}/publish`)

export const archiveSubmission = (id: number) =>
  api.patch<SubmissionResponse>(`/submissions/${id}/archive`)

export const unarchiveSubmission = (id: number) =>
  api.patch<SubmissionResponse>(`/submissions/${id}/unarchive`)

export const reopenSubmission = (id: number, studentId: number) =>
  api.patch<SubmissionResponse>(`/submissions/${id}/reopen/${studentId}`)

// Template file (row 68)
export const uploadTemplate = (id: number, file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return api.post<void>(`/submissions/${id}/template`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const downloadTemplate = (id: number) =>
  api.get<Blob>(`/submissions/${id}/template`, { responseType: 'blob' })

// Lecturer downloads (rows 75/76)
export const downloadUpload = (uploadId: number) =>
  api.get<Blob>(`/submissions/uploads/${uploadId}/download`, { responseType: 'blob' })

export const downloadSubmissionsZip = (id: number) =>
  api.get<Blob>(`/submissions/${id}/download-zip`, { responseType: 'blob' })

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

// Lecturer dashboard overview
export const getLecturerOverview = () =>
  api.get<LecturerOverview>('/analytics/lecturer/overview')

export const getSubmissionScore = (uploadId: number) =>
  api.get<ScoringReport>(`/submissions/uploads/${uploadId}/score`)

