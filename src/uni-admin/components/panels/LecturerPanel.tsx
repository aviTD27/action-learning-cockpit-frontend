import { useState } from 'react'
import AddLecturerModal from './../modals/AddLecturerModal'
import '../../styles/panels.css'

const INITIAL_LECTURERS = [
  { id:'1', name:'Dr. Tim', cohorts:'MSc-2024-Fall, MSc-2024-Spring', role:'Lecturer'},
  { id:'2', name:'Dr. Jane', cohorts:'MSc-2024-Spring', role:'Lecturer'},
  { id:'3', name:'Dr. John', cohorts:'MSc-2024-Fall', role:'Senior Lec.'},
  { id:'4', name:'Dr. Alice', cohorts:'MSc-2024-Fall', role:'Lecturer'},
  { id:'5', name:'Dr. Rob',  cohorts:'MSc-2023-Fall', role:'Prog. Coord.'},
]

export default function LecturersPanel() {
  const [lecturers, setLecturers] = useState(INITIAL_LECTURERS)
  const [addOpen, setAddOpen] = useState(false)

  const handleAddLecturer = (data: {
    firstName: string; lastName: string; email: string;
    staffId: string; role: string; cohorts: string[];
  }) => {
    setLecturers(prev => [...prev, {
      id: Date.now().toString(),
      name: `${data.firstName} ${data.lastName}`,
      cohorts: data.cohorts.join(', '),
      role: data.role,
    }])
  }

  return (
    <>
      <div className="panel-card">
        <div className="panel-header">
          <p className="panel-title">👩‍🏫 Lecturers</p>
          <button
            className="btn btn-success"
            onClick={() => setAddOpen(true)}
          >
            + Add Lecturer
          </button>
        </div>

        <table className="panel-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Cohort(s)</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {lecturers.map(l => (
              <tr key={l.id}>
                <td>{l.name}</td>
                <td style={{ color: '#2563eb' }}>{l.cohorts}</td>
                <td style={{ color: '#6b7280' }}>{l.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="panel-footer">
          <p style={{ fontSize: '11px', color: '#9ca3af' }}>
            {lecturers.length} lecturers total
          </p>
        </div>
      </div>

      <AddLecturerModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAddLecturer}
      />
    </>
  )
}