export interface SubmissionRules {
  allowedFileTypes: string
  maxAttempts: number
  lateAllowed: boolean
}

export interface Submission {
  id: number
  title: string
  description: string
  instructions?: string
  cohortId: number
  cohortName: string
  dueDate: string
  maxPoints: number
  rules: SubmissionRules
  templateFileName?: string
  hasTemplate?: boolean
  lastNotifiedAt?: string
  createdAt: string
}

export interface CreateSubmissionData {
  title: string
  description: string
  instructions?: string
  cohortId: number
  cohortName: string
  dueDate: string
  maxPoints: number
  rules: SubmissionRules
  templateFileName?: string
}

export interface StudentSubmission {
  studentId: number
  fileName: string
  submittedAt: string
  attemptNumber: number
  late: boolean
  uploadId: number | null
  overallScore: number | null
  scoreLevel: string | null
}

export type GradeStatus = 'DRAFT' | 'RELEASED'

export interface StudentGrade {
  submissionId: number
  studentId: number
  grade: number
  feedback: string
  status: GradeStatus
  gradedAt: string
}
