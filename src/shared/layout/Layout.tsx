import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header  from './Header'
import '../styles/layout.css'

interface Props {
  children:   ReactNode
  title?:     string
  subtitle?:  string
}

export default function Layout({
  children,
  title    = 'Epita University Admin',
  subtitle = 'Tenant: EPITA · Active Cycle 3 · Live ●',
}: Props) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-body">
        <Header title={title} subtitle={subtitle} />
        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  )
}