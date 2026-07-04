import apiClient from './apiClient'

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE'

export interface AttendanceSession {
  id: number
  cohortId: number
  cohortName: string
  lecturerId: number
  lecturerName: string
  sessionDate: string
  topic: string | null
  createdAt: string
  totalStudents: number
  markedStudents: number
}

export interface SessionStudentResponse {
  studentId: number
  firstName: string
  lastName: string
  studentRef: string
  recordId: number | null
  status: AttendanceStatus | null
  minutesLate: number | null
}

export interface AttendanceRecordResponse {
  recordId: number
  sessionId: number
  sessionDate: string
  topic: string | null
  cohortName: string
  studentId: number
  studentName: string
  studentRef: string
  status: AttendanceStatus
  minutesLate: number | null
  markedAt: string
}

export interface CohortAttendanceStat {
  cohortId: number
  cohortName: string
  programmeName: string
  totalSessions: number
  present: number
  late: number
  absent: number
  attendanceRate: number
  qualifiedForExam: boolean
}

export interface StudentAttendanceStats {
  studentId: number
  studentName: string
  studentRef: string
  cohorts: CohortAttendanceStat[]
}

export interface CreateSessionRequest {
  cohortId: number
  sessionDate: string
  topic?: string
}

export interface MarkAttendanceEntry {
  studentId: number
  status: AttendanceStatus
  minutesLate?: number
}

// Lecturer
export const createSession = (data: CreateSessionRequest) =>
  apiClient.post<AttendanceSession>('/attendance/sessions', data).then(r => r.data)

export const getLecturerSessions = (cohortId?: number) =>
  apiClient.get<AttendanceSession[]>('/attendance/sessions', {
    params: cohortId != null ? { cohortId } : undefined,
  }).then(r => r.data)

export const getSessionStudents = (sessionId: number) =>
  apiClient.get<SessionStudentResponse[]>(`/attendance/sessions/${sessionId}/students`).then(r => r.data)

export const markAttendance = (sessionId: number, entries: MarkAttendanceEntry[]) =>
  apiClient.post<void>(`/attendance/sessions/${sessionId}/mark`, entries).then(() => {})

// Student
export const getMyAttendance = () =>
  apiClient.get<AttendanceRecordResponse[]>('/attendance/me').then(r => r.data)

export const getMyAttendanceStats = () =>
  apiClient.get<StudentAttendanceStats>('/attendance/me/stats').then(r => r.data)

// Admin
export const getCohortAttendanceStats = (cohortId: number) =>
  apiClient.get<StudentAttendanceStats[]>(`/attendance/cohorts/${cohortId}/stats`).then(r => r.data)

export const getStudentAttendanceStats = (studentId: number) =>
  apiClient.get<StudentAttendanceStats>(`/attendance/students/${studentId}/stats`).then(r => r.data)
