import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar.jsx'

export function AppShell() {
  return (
    <div className="stellar-app">
      <Sidebar />
      <main className="stellar-main">
        <Outlet />
      </main>
    </div>
  )
}
