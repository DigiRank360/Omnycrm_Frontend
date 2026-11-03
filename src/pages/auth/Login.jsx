import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { ROLES, ROLE_LABELS } from '../../config/roles'
import { useAuth } from '../../context/AuthContext'

const TABS = [
  { role: ROLES.ADMIN, label: 'Admin', hint: 'Full access: GRN, QC and dashboard' },
  { role: ROLES.QC, label: 'QC Department', hint: 'Quality inspections and dashboard' },
]

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [role, setRole] = useState(ROLES.ADMIN)
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ ...form, role })
      navigate(location.state?.from?.pathname || '/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-brand-700 to-brand-600 p-12 text-white lg:flex">
        <img src={logo} alt="OmnyX" className="w-56 object-contain" />
        <div>
          <h2 className="text-3xl font-bold leading-snug">Goods Receiving &amp;<br />Quality Control</h2>
          <p className="mt-3 max-w-sm text-sm text-blue-100">
            Create GRNs, track every item and run quality inspections from one place.
          </p>
        </div>
        <p className="text-xs text-blue-200">© 2026 OmnyX CRM</p>
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -top-20 right-20 h-48 w-48 rounded-full bg-white/5" />
      </div>

      <div className="flex flex-1 flex-col bg-white">
        <div className="bg-gradient-to-r from-slate-900 to-brand-700 px-6 py-5 lg:hidden">
          <img src={logo} alt="OmnyX" className="h-10 object-contain" />
        </div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <form onSubmit={submit} className="w-full max-w-sm">
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to continue to your workspace.</p>

            <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
              {TABS.map((t) => (
                <button
                  key={t.role}
                  type="button"
                  onClick={() => { setRole(t.role); setError('') }}
                  className={`rounded-md py-2 text-sm font-semibold transition ${
                    role === t.role ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">{TABS.find((t) => t.role === role).hint}</p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-600">Email</span>
                <input
                  className="input" type="email" required autoComplete="username"
                  placeholder={role === ROLES.ADMIN ? 'admin@company.com' : 'qc@company.com'}
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-600">Password</span>
                <div className="relative">
                  <input
                    className="input pr-16" type={show ? 'text' : 'password'} required autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button" onClick={() => setShow(!show)}
                    className="absolute inset-y-0 right-3 text-xs font-semibold text-slate-500 hover:text-brand-600"
                  >
                    {show ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button disabled={loading} className="btn-primary mt-6 w-full py-2.5">
              {loading ? 'Signing in...' : `Sign in as ${ROLE_LABELS[role]}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
