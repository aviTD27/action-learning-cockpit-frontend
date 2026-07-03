import { useCallback, useEffect, useState } from 'react'
import {
  createSubmission,
  deleteSubmission,
  getSubmissions,
  notifySubmission,
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
    cohortId: r.cohortId,
    cohortName: r.cohortName,
    dueDate: r.dueDate,
    maxPoints: r.maxPoints,
    rules: {
      allowedFileTypes: r.allowedFileTypes ?? '',
      maxAttempts: r.maxAttempts,
      lateAllowed: r.lateAllowed,
    },
    templateFileName: r.templateFileName ?? undefined,
    hasTemplate: r.hasTemplate,
    lastNotifiedAt: r.lastNotifiedAt ?? undefined,
    createdAt: r.createdAt,
  }
}

function toRequest(data: CreateSubmissionData): CreateSubmissionRequest {
  return {
    title: data.title,
    description: data.description,
    instructions: data.instructions,
    cohortId: data.cohortId,
    dueDate: data.dueDate,
    maxPoints: data.maxPoints,
    rules: {
      allowedFileTypes: data.rules.allowedFileTypes,
      maxAttempts: data.rules.maxAttempts,
      lateAllowed: data.rules.lateAllowed,
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

  const create = useCallback(async (data: CreateSubmissionData, templateFile?: File | null) => {
    setError(null)
    try {
      const res = await createSubmission(toRequest(data))
      if (templateFile) await uploadTemplate(res.data.id, templateFile)
      await reload()
    } catch (err) {
      setError(messageFrom(err, 'Could not create submission'))
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

  return { submissions, loading, error, reload, create, update, remove, notify }
}
