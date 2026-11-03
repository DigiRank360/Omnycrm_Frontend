import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ROLE_LABELS } from '../../config/roles'
import { useAuth } from '../../context/AuthContext'

const TZ = 'Asia/Kolkata'

const TITLES = {
  '/': { title: 'Dashboard', sub: 'Overview of goods receiving & QC' },
  '/grn': { title: 'GRN Form', sub: 'Goods Received Note' },
  '/qc': { title: 'QC Form', sub: 'Laptop quality inspection' },
}

const dateFmt = new Intl.DateTimeFormat('en-IN', {
  timeZone: TZ, weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
})
const timeFmt = new Intl.DateTimeFormat('en-IN', {
  timeZone: TZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
})

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

const Icon = ({ d, className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
)

const ICONS = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  clock: 'M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z',
  bell: 'M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0',
  search: 'M21 21l-4.3-4.3M17 11a6 6 0 11-12 0 6 6 0 0112 0z',
  chevron: 'M19 9l-7 7-7-7',
  logout: 'M15 12H3m0 0l3-3m-3 3l3 3M9 6V5a2 2 0 012-2h7a2 2 0 012 2v14a2 2 0 01-2 2h-7a2 2 0 01-2-2v-1',
}

function ProfileMenu() {
  const { user, logout } = useAuth()
  const initial = (user.name || '?').charAt(0).toUpperCase()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100 sm:pr-3"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-500 text-sm font-bold text-white">{initial}</span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-sm font-semibold text-slate-900">{user.name}</span>
          <span className="block text-[11px] text-slate-500">{ROLE_LABELS[user.role]}</span>
        </span>
        <Icon d={ICONS.chevron} className="hidden h-4 w-4 text-slate-400 sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="text-sm font-semibold text-slate-900">{user.name}</div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>
          <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
            <Icon d={ICONS.logout} className="h-4 w-4" /> Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default function Header({ onMenu }) {
  const now = useNow()
  const { pathname } = useLocation()
  const page = TITLES[pathname] || TITLES['/']

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenu}
            aria-label="Open menu"
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Icon d={ICONS.menu} />
          </button>
          <div className="min-w-0">
            <nav className="hidden items-center gap-1 text-[11px] text-slate-400 sm:flex">
              <Link to="/" className="hover:text-brand-600">Home</Link>
              <span>/</span>
              <span className="text-slate-500">{page.title}</span>
            </nav>
            <h1 className="truncate text-base font-semibold leading-tight text-slate-900 sm:text-lg">{page.title}</h1>
          </div>
        </div>

        <div className="relative hidden max-w-xs flex-1 xl:block">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Icon d={ICONS.search} className="h-4 w-4" />
          </span>
          <input
            type="search"
            placeholder="Search GRN, vendor, serial..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 sm:px-3">
            <span className="hidden text-brand-600 sm:block"><Icon d={ICONS.clock} className="h-4 w-4" /></span>
            <div className="leading-tight">
              <div className="text-xs font-semibold tabular-nums text-slate-900 sm:text-sm">{timeFmt.format(now)}</div>
              <div className="hidden text-[11px] text-slate-500 md:block">{dateFmt.format(now)} · IST</div>
            </div>
          </div>

          <button aria-label="Notifications" className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <Icon d={ICONS.bell} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}
