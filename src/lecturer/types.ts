export type SubmissionType = 'FILE' | 'TEXT' | 'BOTH'
export type SubmissionLifecycle = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface SubmissionRules {
  allowedFileTypes: string
  maxAttempts: number
  lateAllowed: boolean
  minWordCount?: number | null
  maxWordCount?: number | null
  maxFileSizeBytes?: number | null
  namingPattern?: string | null
  requiredHeadings?: string | null
}

export interface Submission {
  id: number
  title: string
  description: string
  instructions?: string
  additionalNotes?: string
  submissionType: SubmissionType
  status: SubmissionLifecycle
  cohortId: number
  cohortName: string
  dueDate: string
  dueTime?: string | null
  maxPoints: number
  rules: SubmissionRules
  templateFileName?: string
  hasTemplate?: boolean
  hasTemplateFile: boolean
  lastNotifiedAt?: string
  createdAt: string
}

export interface CreateSubmissionData {
  title: string
  description: string
  instructions?: string
  additionalNotes?: string
  submissionType: SubmissionType
  status?: SubmissionLifecycle
  cohortId: number
  cohortName: string
  cohortIds?: number[]
  dueDate: string
  dueTime?: string | null
  maxPoints: number
  rules: SubmissionRules
  templateFileName?: string
}

export interface StudentSubmission {
  studentId: number
  status: string
  uploadId: number | null
  fileName: string
  submittedAt: string
  attemptNumber: number
  late: boolean
  overallScore: number | null
  scoreLevel: string | null
  reopened: boolean
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
