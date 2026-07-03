
import type { GradeStatus } from '../types'

export type SubmissionType = 'FILE' | 'TEXT' | 'BOTH'
export type SubmissionLifecycle = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface SubmissionResponse {
  id: number
  title: string
  description: string
  instructions: string | null
  additionalNotes: string | null
  submissionType: SubmissionType
  status: SubmissionLifecycle
  cohortId: number
  cohortName: string
  lecturerId: number | null
  dueDate: string
  dueTime: string | null
  maxPoints: number
  allowedFileTypes: string
  maxAttempts: number
  lateAllowed: boolean
  minWordCount: number | null
  maxWordCount: number | null
  maxFileSizeBytes: number | null
  namingPattern: string | null
  requiredHeadings: string | null
  templateFileName: string | null
  hasTemplate: boolean
  hasTemplateFile: boolean
  lastNotifiedAt: string | null
  createdAt: string
}

export interface SubmissionRulesRequest {
  allowedFileTypes: string
  maxAttempts: number
  lateAllowed: boolean
  minWordCount?: number | null
  maxWordCount?: number | null
  maxFileSizeBytes?: number | null
  namingPattern?: string | null
  requiredHeadings?: string | null
}

export interface CreateSubmissionRequest {
  title: string
  description: string
  instructions?: string
  additionalNotes?: string | null
  submissionType?: SubmissionType
  status?: SubmissionLifecycle
  cohortId?: number
  cohortIds?: number[]
  lecturerId?: number
  dueDate: string
  dueTime?: string | null
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
  studentEmail: string | null
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

export interface CriterionScore {
  label: string
  score: number
  feedback: string
  confidence: string
  requiresReview: boolean
}

export interface ScoringReport {
  overallScore: number
  level: string
  wordCount: number
  embeddingsComputed: boolean
  requiresHumanReview: boolean
  criteria: CriterionScore[]
}
