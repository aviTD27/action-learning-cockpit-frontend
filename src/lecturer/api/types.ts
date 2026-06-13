
import type { GradeStatus } from '../types'

export interface SubmissionResponse {
  id: number
  title: string
  description: string
  cohortId: number
  cohortName: string
  lecturerId: number | null
  dueDate: string 
  maxPoints: number
  allowedFileTypes: string
  maxAttempts: number
  lateAllowed: boolean
  templateFileName: string | null
  lastNotifiedAt: string | null 
  createdAt: string 
}

export interface SubmissionRulesRequest {
  allowedFileTypes: string
  maxAttempts: number
  lateAllowed: boolean
}

export interface CreateSubmissionRequest {
  title: string
  description: string
  cohortId: number
  lecturerId?: number
  dueDate: string
  maxPoints: number
  rules: SubmissionRulesRequest
  templateFileName?: string
}

export interface GradeResponse {
  studentId: number
  studentName: string
  studentRef: string
  grade: number
  feedback: string
  status: GradeStatus
  gradedAt: string
}

export interface GradeRequest {
  grade: number
  feedback: string
}

export interface StudentSubmissionResponse {
  studentId: number
  studentName: string
  studentRef: string
  fileName: string
  submittedAt: string
  attemptNumber: number
  late: boolean
}
