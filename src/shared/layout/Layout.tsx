import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import type { NavItem, SidebarUser } from './Sidebar'
import Header from './Header'
import '../styles/layout.css'

interface Props {
  children: ReactNode
  title?: string
  subtitle?: string
  navItems?: NavItem[]
  user?: SidebarUser
}

export default function Layout({
  children,
  title = 'Epita University Admin',
  subtitle = 'Tenant: EPITA · Active Cycle 3 · Live ●',
  navItems,
  user,
}: Props) {
  return (
    <div className="layout">
      <Sidebar items={navItems} user={user} />
      <div className="layout-body">
        <Header title={title} subtitle={subtitle} />
        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  )
}
