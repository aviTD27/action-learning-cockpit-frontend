import { type ReactNode, useEffect, useState } from 'react'
import Layout from '../../shared/layout/Layout'
import { getStudentNav } from '../nav'
import { getAnnouncementUnreadCount } from '../../api/announcementsApi'
import { getGradeReleaseUnreadCount } from '../api/studentApi'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
}

export default function StudentLayout({ title, subtitle, children }: Props) {
  const [announcementUnread, setAnnouncementUnread] = useState(0)
  const [gradeUnread, setGradeUnread] = useState(0)

  useEffect(() => {
    getAnnouncementUnreadCount().then(setAnnouncementUnread).catch(() => {})
    getGradeReleaseUnreadCount().then(setGradeUnread).catch(() => {})
  }, [])

  return (
    <Layout navItems={getStudentNav(announcementUnread, gradeUnread)} title={title} subtitle={subtitle}>
      {children}
    </Layout>
  )
}
