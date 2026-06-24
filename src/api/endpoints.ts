const BASE_URL = 'http://localhost:8000'

export const ENDPOINTS = {
  AUTH: {
    LOGIN:    `${BASE_URL}/api/auth/login`,
    REGISTER: `${BASE_URL}/api/auth/register`,
  },
  STUDENTS: {
    GET_ALL:       `${BASE_URL}/api/students`,
    GET_BY_COHORT: (cohortId: number) => `${BASE_URL}/api/students/cohort/${cohortId}`,
    CREATE:        `${BASE_URL}/api/students`,
    UPDATE:        (id: number) => `${BASE_URL}/api/students/${id}`,
    DEACTIVATE:    (id: number) => `${BASE_URL}/api/students/${id}/deactivate`,
  },
  COHORTS: {
    GET_ALL: `${BASE_URL}/api/cohorts`,
    CREATE:  `${BASE_URL}/api/cohorts`,
    UPDATE:  (id: number) => `${BASE_URL}/api/cohorts/${id}`,
  },
  PROGRAMMES: {
    GET_ALL: `${BASE_URL}/api/programmes`,
    CREATE:  `${BASE_URL}/api/programmes`,
    UPDATE:  (id: number) => `${BASE_URL}/api/programmes/${id}`,
  },
  LECTURERS: {
    GET_ALL: `${BASE_URL}/api/lecturers`,
    CREATE:  `${BASE_URL}/api/lecturers`,
    UPDATE:  (id: number) => `${BASE_URL}/api/lecturers/${id}`,
  },
  UNIVERSITIES: {
    GET_ALL:   `${BASE_URL}/api/universities`,
    GET_BY_ID: (id: number) => `${BASE_URL}/api/universities/${id}`,
    CREATE:    `${BASE_URL}/api/universities`,
  },
  SUBMISSIONS: {
    GET_ALL:    `${BASE_URL}/api/submissions`,
    GET_BY_ID:  (id: number) => `${BASE_URL}/api/submissions/${id}`,
    CREATE:     `${BASE_URL}/api/submissions`,
    UPDATE:     (id: number) => `${BASE_URL}/api/submissions/${id}`,
    DELETE:     (id: number) => `${BASE_URL}/api/submissions/${id}`,
    NOTIFY:     (id: number) => `${BASE_URL}/api/submissions/${id}/notify`,
    GRADES:     (id: number) => `${BASE_URL}/api/submissions/${id}/grades`,
    GRADE:      (submissionId: number, studentId: number) =>
                  `${BASE_URL}/api/submissions/${submissionId}/grades/${studentId}`,
    RELEASE:    (id: number) => `${BASE_URL}/api/submissions/${id}/grades/release`,
    STUDENT_SUBMISSIONS: (id: number) =>
                  `${BASE_URL}/api/submissions/${id}/student-submissions`,
  },
}
