import { useMemo, useState } from 'react'
import { Layers, Pencil, Plus, Trash2, Archive, RotateCcw } from 'lucide-react'
import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV } from '../nav'
import { useUniAdminSidebarUser } from '../hooks/useUniAdminSidebarUser'
import { useProgrammes } from '../hooks/useProgrammes'
import { useLecturers } from '../hooks/useLecturers'
import { useSemesters } from '../hooks/useSemesters'
import { useCourses } from '../hooks/useCourses'
import {
  createSemester, updateSemester, deleteSemester,
  createCourse, updateCourse, archiveCourse, unarchiveCourse, deleteCourse,
} from '../api/uniAdmin'
import type {
  CourseResponse, CreateCourseRequest, CreateSemesterRequest, SemesterResponse,
} from '../api/types'
import SemesterModal from '../components/modals/SemesterModal'
import CourseModal from '../components/modals/CourseModal'
import StatusBadge from '../components/shared/StatusBadge'
import '../styles/uniAdmin.css'

export default function CoursesPage() {
  const sidebarUser = useUniAdminSidebarUser()
  const { programmes } = useProgrammes()
  const { lecturers } = useLecturers()

  const activeProgrammes = useMemo(() => programmes.filter(p => p.status === 'ACTIVE'), [programmes])
  const [programmeId, setProgrammeId] = useState<number | ''>('')

  // Default to the first programme once loaded.
  const effectiveProgrammeId = programmeId !== '' ? programmeId
    : (activeProgrammes[0]?.id ?? undefined)

  const { semesters, reload: reloadSemesters } = useSemesters(effectiveProgrammeId)
  const { courses, reload: reloadCourses } = useCourses(
    effectiveProgrammeId ? { programmeId: effectiveProgrammeId } : undefined,
  )

  const [semModalOpen, setSemModalOpen] = useState(false)
  const [semEdit, setSemEdit] = useState<SemesterResponse | null>(null)
  const [courseModalOpen, setCourseModalOpen] = useState(false)
  const [courseEdit, setCourseEdit] = useState<CourseResponse | null>(null)
  const [courseSemesterId, setCourseSemesterId] = useState<number | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const coursesBySemester = useMemo(() => {
    const map = new Map<number, CourseResponse[]>()
    for (const c of courses) {
      const list = map.get(c.semesterId) ?? []
      list.push(c)
      map.set(c.semesterId, list)
    }
    return map
  }, [courses])

  const sortedSemesters = useMemo(
    () => [...semesters].sort((a, b) => a.orderIndex - b.orderIndex),
    [semesters],
  )

  const openAddSemester = () => { setSemEdit(null); setSemModalOpen(true) }
  const openEditSemester = (s: SemesterResponse) => { setSemEdit(s); setSemModalOpen(true) }
  const openAddCourse = (semesterId: number) => { setCourseEdit(null); setCourseSemesterId(semesterId); setCourseModalOpen(true) }
  const openEditCourse = (c: CourseResponse) => { setCourseEdit(c); setCourseSemesterId(c.semesterId); setCourseModalOpen(true) }

  const saveSemester = async (data: CreateSemesterRequest) => {
    if (semEdit) await updateSemester(semEdit.id, data)
    else await createSemester(data)
    reloadSemesters()
  }

  const saveCourse = async (data: CreateCourseRequest) => {
    if (courseEdit) await updateCourse(courseEdit.id, data)
    else await createCourse(data)
    reloadCourses()
  }

  const removeSemester = async (s: SemesterResponse) => {
    setNotice(null)
    try {
      await deleteSemester(s.id)
      reloadSemesters()
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } }
      setNotice(e?.response?.data?.message ?? 'Could not delete this semester.')
    }
  }

  const removeCourse = async (c: CourseResponse) => {
    setNotice(null)
    try {
      await deleteCourse(c.id)
      reloadCourses()
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } }
      setNotice(e?.response?.data?.message ?? 'Could not delete this course.')
    }
  }

  const toggleCourseArchive = async (c: CourseResponse) => {
    if (c.status === 'ARCHIVED') await unarchiveCourse(c.id)
    else await archiveCourse(c.id)
    reloadCourses()
  }

  return (
    <Layout navItems={UNI_ADMIN_NAV} user={sidebarUser} title="Courses" subtitle="Structure programmes into semesters and courses">
      <div className="ua-page">
        <div className="ua-card">
          <div className="ua-card-header">
            <p className="ua-card-title"><Layers size={14} /> Curriculum</p>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                className="ua-modal-input"
                style={{ width: 260 }}
                value={effectiveProgrammeId ?? ''}
                onChange={e => setProgrammeId(e.target.value === '' ? '' : Number(e.target.value))}
              >
                {activeProgrammes.length === 0 && <option value="">No programmes yet</option>}
                {activeProgrammes.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button className="ua-btn ua-btn-success" onClick={openAddSemester} disabled={!effectiveProgrammeId}>
                <Plus size={12} /> Add Semester
              </button>
            </div>
          </div>

          {notice && <p className="ua-modal-error" style={{ margin: '0.5rem 1rem' }}>{notice}</p>}

          <div className="ua-panel-body">
            {!effectiveProgrammeId ? (
              <p className="ua-table-empty">Create a programme first, then structure its semesters and courses here.</p>
            ) : sortedSemesters.length === 0 ? (
              <p className="ua-table-empty">No semesters yet for this programme. Add the first one.</p>
            ) : (
              sortedSemesters.map(sem => {
                const list = coursesBySemester.get(sem.id) ?? []
                return (
                  <div key={sem.id} className="ua-semester-block" style={{ marginBottom: '1.25rem' }}>
                    <div className="ua-card-header" style={{ paddingLeft: 0, paddingRight: 0 }}>
                      <p className="ua-card-title" style={{ fontSize: '0.95rem' }}>
                        {sem.name}
                        <span className="ua-count">{list.length} course{list.length === 1 ? '' : 's'}</span>
                      </p>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="ua-btn ua-btn-secondary ua-btn-xs" onClick={() => openAddCourse(sem.id)}>
                          <Plus size={11} /> Add Course
                        </button>
                        <button className="ua-icon-btn" title="Edit semester" onClick={() => openEditSemester(sem)}>
                          <Pencil size={13} />
                        </button>
                        <button className="ua-icon-btn" title="Delete semester" onClick={() => removeSemester(sem)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="ua-table-wrap">
                      {list.length === 0 ? (
                        <p className="ua-table-empty">No courses in this semester yet.</p>
                      ) : (
                        <table className="ua-table">
                          <thead>
                            <tr>
                              <th>Course</th>
                              <th>Code</th>
                              <th>Lecturer</th>
                              <th>Students</th>
                              <th>Assignments</th>
                              <th>Status</th>
                              <th className="col-actions">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {list.map(c => (
                              <tr key={c.id}>
                                <td className="col-name">{c.name}</td>
                                <td className="col-muted">{c.code ?? '—'}</td>
                                <td className="col-muted">{c.lecturerName ?? <span style={{ color: '#9ca3af' }}>Unassigned</span>}</td>
                                <td className="col-muted">{c.studentCount}</td>
                                <td className="col-muted">{c.assignmentCount}</td>
                                <td><StatusBadge status={c.status} /></td>
                                <td className="col-actions">
                                  <button className="ua-icon-btn" title="Edit course" onClick={() => openEditCourse(c)}>
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    className="ua-icon-btn"
                                    title={c.status === 'ARCHIVED' ? 'Restore course' : 'Archive course'}
                                    onClick={() => toggleCourseArchive(c)}
                                  >
                                    {c.status === 'ARCHIVED' ? <RotateCcw size={13} /> : <Archive size={13} />}
                                  </button>
                                  <button className="ua-icon-btn" title="Delete course" onClick={() => removeCourse(c)}>
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {effectiveProgrammeId && (
        <SemesterModal
          open={semModalOpen}
          programmeId={effectiveProgrammeId}
          existing={semEdit}
          onClose={() => setSemModalOpen(false)}
          onSave={saveSemester}
        />
      )}

      {effectiveProgrammeId && courseSemesterId && (
        <CourseModal
          open={courseModalOpen}
          semesterId={courseSemesterId}
          lecturers={lecturers}
          existing={courseEdit}
          onClose={() => setCourseModalOpen(false)}
          onSave={saveCourse}
        />
      )}
    </Layout>
  )
}
