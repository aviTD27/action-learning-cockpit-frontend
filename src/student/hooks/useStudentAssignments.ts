import { useCallback, useEffect, useState } from 'react'
import {
  getMyProfile,
  getAssignmentsForProgramme,
  getMyUploadStatus,
  type AssignmentItem,
  type MyUploadStatus,
} from '../api/studentApi'

export type AssignmentStatus = 'upcoming' | 'past-due' | 'completed'

export interface Assignment extends AssignmentItem {
  status: AssignmentStatus
  uploadStatus: MyUploadStatus | null
}

export function isDeadlinePassed(dueDate: string): boolean {
  const due = new Date(dueDate)
  due.setHours(23, 59, 59, 999)
  return due < new Date()
}

function computeStatus(dueDate: string, uploadStatus: MyUploadStatus | null): AssignmentStatus {
  // Completed = turned in, regardless of whether it was on time or late.
  if (uploadStatus?.turnedIn) return 'completed'
  return isDeadlinePassed(dueDate) ? 'past-due' : 'upcoming'
}

export function useStudentAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const profile = await getMyProfile()
        const items = await getAssignmentsForProgramme(profile.programmeId)
        const statuses = await Promise.all(items.map(a => getMyUploadStatus(a.id)))
        const mapped: Assignment[] = items
          .map((a, i) => ({
            ...a,
            uploadStatus: statuses[i],
            status: computeStatus(a.dueDate, statuses[i]),
          }))
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        setAssignments(mapped)
      } catch {
        setError('Failed to load assignments.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  /** Call after a successful turn-in so badges/filters update immediately. */
  const markCompleted = useCallback((id: number) => {
    setAssignments(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'completed' as const } : a)),
    )
  }, [])

  return { assignments, loading, error, markCompleted }
}

