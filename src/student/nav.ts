import { BookOpen, CalendarDays, Home, Megaphone, Star, UserRound, Users } from 'lucide-react'
import type { NavItem } from '../shared/layout/Sidebar'

export function getStudentNav(announcementUnread = 0, gradeUnread = 0): NavItem[] {
  return [
    { label: 'Dashboard',   icon: Home,      path: '/student',            end: true },
    { label: 'Assignments', icon: BookOpen,  path: '/student/assignments' },
    {
      label: 'Grades',
      icon:  Star,
      path:  '/student/grades',
      badge: gradeUnread > 0 ? gradeUnread : undefined,
    },
    {
      label: 'Announcements',
      icon:  Megaphone,
      path:  '/student/announcements',
      badge: announcementUnread > 0 ? announcementUnread : undefined,
    },
    { label: 'Timetable', icon: CalendarDays, path: '/student/timetable' },
    { label: 'My Cohort', icon: Users,        path: '/student/cohort' },
    { label: 'Profile',   icon: UserRound,    path: '/student/profile' },
  ]
}

export const STUDENT_NAV = getStudentNav()
