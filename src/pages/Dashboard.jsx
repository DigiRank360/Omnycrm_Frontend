import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const STATS = [
  { label: 'Total GRNs', value: '248', change: '+12%', up: true, icon: 'M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v14l-3-2-2 2-2-2-2 2-2-2-3 2V6a2 2 0 012-2z', tone: 'bg-blue-50 text-blue-600' },
  { label: 'Pending QC', value: '36', change: '+4', up: false, icon: 'M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z', tone: 'bg-amber-50 text-amber-600' },
  { label: 'QC Passed', value: '189', change: '+9%', up: true, icon: 'M5 13l4 4L19 7', tone: 'bg-emerald-50 text-emerald-600' },
  { label: 'QC Rejected', value: '23', change: '-3%', up: true, icon: 'M6 18L18 6M6 6l12 12', tone: 'bg-red-50 text-red-600' },
]

const MONTHLY = [
  { m: 'Jun', v: 28 }, { m: 'Jul', v: 41 }, { m: 'Aug', v: 35 },
  { m: 'Sep', v: 52 }, { m: 'Oct', v: 47 }, { m: 'Nov', v: 63 },
]

const RECENT = [
  { id: 'GRN-2026-00234', vendor: 'Dell India Pvt Ltd', items: 12, date: '02 Nov 2026', status: 'Pending' },
  { id: 'GRN-2026-00233', vendor: 'HP Distribution', items: 8, date: '01 Nov 2026', status: 'Passed' },
  { id: 'GRN-2026-00232', vendor: 'Lenovo Supply Co.', items: 20, date: '31 Oct 2026', status: 'Passed' },
  { id: 'GRN-2026-00231', vendor: 'Acer Traders', items: 5, date: '30 Oct 2026', status: 'Rejected' },
  { id: 'GRN-2026-00230', vendor: 'Asus Wholesale', items: 15, date: '29 Oct 2026', status: 'In QC' },
]

const BADGE = {
  Pending: 'bg-amber-50 text-amber-700',
  'In QC': 'bg-blue-50 text-blue-700',
  Passed: 'bg-emerald-50 text-emerald-700',
  Rejected: 'bg-red-50 text-red-700',
}

const ACTIVITY = [
  { text: 'GRN-2026-00234 created', time: '10 min ago', dot: 'bg-blue-500' },
  { text: 'QC passed for BATCH-2026-00233', time: '1 hr ago', dot: 'bg-emerald-500' },
  { text: 'QC rejected for BATCH-2026-00231', time: '3 hrs ago', dot: 'bg-red-500' },
  { text: 'GRN-2026-00232 created', time: 'Yesterday', dot: 'bg-blue-500' },
]

const Icon = ({ d, className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
)

function Donut({ passed, pending, rejected }) {
  const total = passed + pending + rejected
  const r = 52
  const c = 2 * Math.PI * r
  const segments = [
    { value: passed, color: '#10b981' },
    { value: pending, color: '#f59e0b' },
    { value: rejected, color: '#ef4444' },
  ].map((s, i, arr) => ({
    ...s,
    len: (s.value / total) * c,
    offset: arr.slice(0, i).reduce((sum, x) => sum + (x.value / total) * c, 0),
  }))
  return (
    <svg viewBox="0 0 140 140" className="h-40 w-40">
      {segments.map((s) => (
        <circle key={s.color} cx="70" cy="70" r={r} fill="none" stroke={s.color} strokeWidth="16"
          strokeDasharray={`${s.len} ${c - s.len}`} strokeDashoffset={-s.offset} transform="rotate(-90 70 70)" />
      ))}
      <text x="70" y="70" textAnchor="middle" className="fill-slate-900 text-2xl font-bold">{Math.round((passed / total) * 100)}%</text>
      <text x="70" y="88" textAnchor="middle" className="fill-slate-400 text-[10px]">Pass rate</text>
    </svg>
  )
}

export default function Dashboard() {
  const { user, can } = useAuth()
  const max = Math.max(...MONTHLY.map((d) => d.v))

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-br from-slate-900 via-brand-700 to-brand-600 p-6 text-white sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-blue-200">Welcome back, {user.name}</p>
          <h1 className="mt-1 text-2xl font-bold">Goods Receiving &amp; Quality Control</h1>
          <p className="mt-1 text-sm text-blue-100">Monday, 02 Nov 2026</p>
        </div>
        <div className="flex gap-3">
          {can('grn') && (
            <Link to="/grn" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-blue-50">+ New GRN</Link>
          )}
          <Link to="/qc" className={can('grn') ? 'rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold hover:bg-white/10' : 'rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-blue-50'}>Start QC</Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{s.label}</span>
              <span className={`rounded-lg p-2 ${s.tone}`}><Icon d={s.icon} /></span>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900">{s.value}</span>
              <span className={`mb-1 text-xs font-semibold ${s.up ? 'text-emerald-600' : 'text-amber-600'}`}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="font-semibold text-slate-900">GRN Received</h2>
          <p className="text-xs text-slate-400">Last 6 months</p>
          <div className="mt-6 flex h-48 items-end gap-4">
            {MONTHLY.map((d) => (
              <div key={d.m} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-medium text-slate-500">{d.v}</span>
                <div className="w-full rounded-t-md bg-gradient-to-t from-brand-700 to-brand-500" style={{ height: `${(d.v / max) * 80}%` }} />
                <span className="text-xs text-slate-400">{d.m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">QC Overview</h2>
          <p className="text-xs text-slate-400">All inspections</p>
          <div className="mt-4 flex justify-center"><Donut passed={189} pending={36} rejected={23} /></div>
          <div className="mt-4 flex justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-emerald-500" />Passed</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-amber-500" />Pending</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-red-500" />Rejected</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-2">
          <div className="flex items-center justify-between p-5 pb-3">
            <h2 className="font-semibold text-slate-900">Recent GRNs</h2>
            {can('grn') && <Link to="/grn" className="text-xs font-semibold text-brand-600 hover:underline">Create new →</Link>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  {['GRN No.', 'Vendor', 'Items', 'Date', 'Status'].map((h) => (
                    <th key={h} className="px-5 py-2 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-900">{r.id}</td>
                    <td className="px-5 py-3 text-slate-600">{r.vendor}</td>
                    <td className="px-5 py-3 text-slate-600">{r.items}</td>
                    <td className="px-5 py-3 text-slate-500">{r.date}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE[r.status]}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">Recent Activity</h2>
          <ul className="mt-4 space-y-4">
            {ACTIVITY.map((a) => (
              <li key={a.text} className="flex gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.dot}`} />
                <div>
                  <p className="text-sm text-slate-700">{a.text}</p>
                  <p className="text-xs text-slate-400">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
