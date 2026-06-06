import { useState } from 'react'
import AddStudentModal from './../modals/AddStudentModal'
import ImportCSVModal from './../modals/ImportCSVModal'
import BulkNotifyModal from './../modals/BulkNotifyModal'
import '../../styles/panels.css'

const INITIAL_STUDENTS = [
  { id:'1', name:'Jane Brown', cohort:'MSc-2024-Fall', status:'active'},
  { id:'2', name:'Ryan Smith', cohort:'MSc-2024-Spring', status:'at_risk'},
  { id:'3', name:'Sofia Mendes', cohort:'MSc-2024-Spring', status:'active'},
  { id:'4', name:'Alice Scott', cohort:'MSc-2024-Spring', status:'active'},
  { id:'5', name:'Tim Johnson', cohort:'MSc-2023-Fall', status:'inactive'},
]

const STATUS_LABEL: Record<string, string> = {
  active: '● Active',
  at_risk: '⚠️ At risk',
  inactive: '● Inactive',
}

export default function StudentsPanel() {
  const [students, setStudents] = useState(INITIAL_STUDENTS)
  const [addOpen, setAddOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [notifyOpen, setNotifyOpen] = useState(false)

  const handleAddStudent = (data: {
    firstName: string; lastName: string; email: string;
    studentId: string; cohort: string; programme: string;
  }) => {
    setStudents(prev => [...prev, {
      id: Date.now().toString(),
      name: `${data.firstName} ${data.lastName}`,
      cohort: data.cohort,
      status: 'active',
    }])
  }

  return (
    <>
      <div className="panel-card">
        <div className="panel-header">
          <p className="panel-title">🎓 Students</p>
          <button
            className="btn btn-success"
            onClick={() => setAddOpen(true)}
          >
            + Add Student
          </button>
        </div>

        <table className="panel-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Cohort</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td style={{ color: '#2563eb' }}>{s.cohort}</td>
                <td className={`status-${s.status}`}>
                  {STATUS_LABEL[s.status]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="panel-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setImportOpen(true)}
          >
            📥 Import CSV
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => setNotifyOpen(true)}
          >
            📣 Bulk Notify
          </button>
        </div>
      </div>

      <AddStudentModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAddStudent}
      />

      <ImportCSVModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
      />

      <BulkNotifyModal
        open={notifyOpen}
        onClose={() => setNotifyOpen(false)}
        studentCount={students.length}
      />
    </>
  )
}