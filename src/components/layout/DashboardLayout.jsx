import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-col lg:pl-60">
        <Header onMenu={() => setOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
        <footer className="px-6 py-4 text-center text-xs text-slate-400">
          © 2026 OmnyX CRM
        </footer>
      </div>
    </div>
  )
}
