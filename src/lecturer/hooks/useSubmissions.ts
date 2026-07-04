import { useCallback, useEffect, useState } from 'react'
import {
  archiveSubmission,
  createSubmission,
  deleteSubmission,
  getSubmissions,
  notifySubmission,
  publishSubmission,
  reopenSubmission,
  unarchiveSubmission,
  updateSubmission,
  uploadTemplate,
} from '../api/lecturer'
import type { CreateSubmissionRequest, SubmissionResponse } from '../api/types'
import type { CreateSubmissionData, Submission } from '../types'

function toSubmission(r: SubmissionResponse): Submission {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? '',
    instructions: r.instructions ?? undefined,
    additionalNotes: r.additionalNotes ?? undefined,
    submissionType: r.submissionType ?? 'BOTH',
    status: r.status ?? 'PUBLISHED',
    courseId: r.courseId,
    courseName: r.courseName,
    programmeId: r.programmeId,
    programmeName: r.programmeName,
    dueDate: r.dueDate,
    dueTime: r.dueTime ?? undefined,
    maxPoints: r.maxPoints,
    rules: {
      allowedFileTypes: r.allowedFileTypes ?? '',
      maxAttempts: r.maxAttempts,
      lateAllowed: r.lateAllowed,
      minWordCount: r.minWordCount ?? undefined,
      maxWordCount: r.maxWordCount ?? undefined,
      maxFileSizeBytes: r.maxFileSizeBytes ?? undefined,
      namingPattern: r.namingPattern ?? undefined,
      requiredHeadings: r.requiredHeadings ?? undefined,
    },
    templateFileName: r.templateFileName ?? undefined,
    hasTemplate: r.hasTemplate,
    hasTemplateFile: r.hasTemplateFile,
    lastNotifiedAt: r.lastNotifiedAt ?? undefined,
    createdAt: r.createdAt,
  }
}

function toRequest(data: CreateSubmissionData): CreateSubmissionRequest {
  return {
    title: data.title,
    description: data.description,
    instructions: data.instructions,
    additionalNotes: data.additionalNotes,
    submissionType: data.submissionType,
    status: data.status,
    courseId: data.courseId,
    courseIds: data.courseIds,
    dueDate: data.dueDate,
    dueTime: data.dueTime,
    maxPoints: data.maxPoints,
    rules: {
      allowedFileTypes: data.rules.allowedFileTypes,
      maxAttempts: data.rules.maxAttempts,
      lateAllowed: data.rules.lateAllowed,
      minWordCount: data.rules.minWordCount,
      maxWordCount: data.rules.maxWordCount,
      maxFileSizeBytes: data.rules.maxFileSizeBytes,
      namingPattern: data.rules.namingPattern,
      requiredHeadings: data.rules.requiredHeadings,
    },
    templateFileName: data.templateFileName,
  }
}

function messageFrom(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } | string } }
  const data = e?.response?.data
  if (typeof data === 'string' && data) return data
  if (data && typeof data === 'object' && data.message) return data.message
  return fallback
}

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    return getSubmissions()
      .then(res => setSubmissions(res.data.map(toSubmission)))
      .catch(() => setError('Failed to load submissions'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { reload() }, [reload])

  const create = useCallback(async (data: CreateSubmissionData): Promise<number | undefined> => {
    setError(null)
    try {
      const res = await createSubmission(toRequest(data))
      await reload()
      return res.data.id
    } catch (err) {
      setError(messageFrom(err, 'Could not create submission'))
      return undefined
    }
  }, [reload])

  const update = useCallback(async (id: number, data: CreateSubmissionData, templateFile?: File | null) => {
    setError(null)
    try {
      await updateSubmission(id, toRequest(data))
      if (templateFile) await uploadTemplate(id, templateFile)
      await reload()
    } catch (err) {
      setError(messageFrom(err, 'Could not update submission'))
    }
  }, [reload])

  const remove = useCallback(async (id: number) => {
    setError(null)
    try {
      await deleteSubmission(id)
      await reload()
    } catch (err) {
      setError(messageFrom(err, 'Could not delete submission'))
    }
  }, [reload])

  const notify = useCallback(async (id: number) => {
    setError(null)
    try {
      await notifySubmission(id)
      await reload()
    } catch (err) {
      setError(messageFrom(err, 'Could not notify students'))
    }
  }, [reload])

  const publish = useCallback(async (id: number) => {
    setError(null)
    try {
      await publishSubmission(id)
      await reload()
    } catch (err) {
      setError(messageFrom(err, 'Could not publish assignment'))
    }
  }, [reload])

  const archive = useCallback(async (id: number) => {
    setError(null)
    try {
      await archiveSubmission(id)
      await reload()
    } catch (err) {
      setError(messageFrom(err, 'Could not archive assignment'))
    }
  }, [reload])

  const unarchive = useCallback(async (id: number) => {
    setError(null)
    try {
      await unarchiveSubmission(id)
      await reload()
    } catch (err) {
      setError(messageFrom(err, 'Could not unarchive assignment'))
    }
  }, [reload])

  const reopen = useCallback(async (id: number, studentId: number) => {
    setError(null)
    try {
      await reopenSubmission(id, studentId)
      await reload()
    } catch (err) {
      setError(messageFrom(err, 'Could not re-open for this student'))
    }
  }, [reload])

  return { submissions, loading, error, reload, create, update, remove, notify, publish, archive, unarchive, reopen }
}
