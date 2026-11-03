import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { useAuth } from '../../context/AuthContext'

const LINKS = [
  { to: '/', label: 'Dashboard', permission: 'dashboard', end: true, icon: 'M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10' },
  { to: '/grn', label: 'GRN Form', permission: 'grn', icon: 'M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v14l-3-2-2 2-2-2-2 2-2-2-3 2V6a2 2 0 012-2z' },
  { to: '/qc', label: 'QC Form', permission: 'qc', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
]

export default function Sidebar({ open, onClose }) {
  const { can, logout } = useAuth()
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-slate-900/40 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-slate-200 bg-white p-4 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 border-b border-slate-200 px-2 pb-6 pt-2">
          <img src={logo} alt="OmnyX CRM" className="h-auto w-40 object-contain drop-shadow-[0_2px_3px_rgba(15,23,42,0.9)]" />
        </div>
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Menu</p>
        <nav className="space-y-1">
          {LINKS.filter((l) => can(l.permission)).map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d={l.icon} />
              </svg>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="mt-auto flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l3-3m-3 3l3 3M9 6V5a2 2 0 012-2h7a2 2 0 012 2v14a2 2 0 01-2 2h-7a2 2 0 01-2-2v-1" />
          </svg>
          Logout
        </button>
      </aside>
    </>
  )
}
