import type { StudentResponse } from '../../uni-admin/api/types'
import { classifyGrade } from '../grading'
import type { Submission, StudentGrade, StudentSubmission } from '../types'

type Cell = string | number

function csvEscape(value: Cell): string {
  const s = String(value ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function toCsv(rows: Cell[][]): string {
  return '﻿' + rows.map(r => r.map(csvEscape).join(',')).join('\r\n')
}

interface BuildArgs {
  submission: Submission
  students: StudentResponse[]
  gradeFor: (studentId: number) => StudentGrade | undefined
  submissionFor?: (studentId: number) => StudentSubmission | undefined
  tracked: boolean
}

export function buildGradeCsv({ submission, students, gradeFor, submissionFor, tracked }: BuildArgs): string {
  const headers: Cell[] = ['Ref', 'Name', 'Email']
  if (tracked) headers.push('Submitted', 'Submitted At')
  headers.push('Grade', 'Max Points', 'Percent', 'Classification', 'Grade Status', 'Feedback')

  const rows: Cell[][] = students.map(s => {
    const g = gradeFor(s.id)
    const cols: Cell[] = [s.studentRef, `${s.firstName} ${s.lastName}`, s.email]

    if (tracked) {
      const sub = submissionFor?.(s.id)
      cols.push(
        sub ? (sub.late ? 'Late' : 'Yes') : 'No',
        sub ? new Date(sub.submittedAt).toLocaleString() : '',
      )
    }

    if (g) {
      const c = classifyGrade(g.grade, submission.maxPoints)
      cols.push(g.grade, submission.maxPoints, `${c.percent}%`, c.label, g.status, g.feedback ?? '')
    } else {
      cols.push('', submission.maxPoints, '', '', 'Not graded', '')
    }
    return cols
  })

  return toCsv([headers, ...rows])
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function gradeCsvFilename(title: string): string {
  const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'submission'
  return `${slug}-grades.csv`
}
