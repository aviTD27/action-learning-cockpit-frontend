import { type ReactNode, useEffect, useState } from 'react'
import Layout from '../../shared/layout/Layout'
import { getStudentNav } from '../nav'
import { getUnreadCount } from '../api/studentApi'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
}

export default function StudentLayout({ title, subtitle, children }: Props) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    getUnreadCount()
      .then(setUnreadCount)
      .catch(() => {})
  }, [])

  return (
    <Layout navItems={getStudentNav(unreadCount)} title={title} subtitle={subtitle}>
      {children}
    </Layout>
  )
}
