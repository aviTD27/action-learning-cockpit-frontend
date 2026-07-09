import { type ReactNode, useEffect, useState } from 'react'
import Layout from '../../shared/layout/Layout'
import { getLecturerNav } from '../nav'
import { getAnnouncementUnreadCount } from '../../api/announcementsApi'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
}

export default function LecturerLayout({ title, subtitle, children }: Props) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    getAnnouncementUnreadCount()
      .then(setUnreadCount)
      .catch(() => {})
  }, [])

  return (
    <Layout navItems={getLecturerNav(unreadCount)} title={title} subtitle={subtitle}>
      {children}
    </Layout>
  )
}
