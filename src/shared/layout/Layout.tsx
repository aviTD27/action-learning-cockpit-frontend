import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import '../styles/layout.css'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-main">
        {children}
      </main>
    </div>
  )
}