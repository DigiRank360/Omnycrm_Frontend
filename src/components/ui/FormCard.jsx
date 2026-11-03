export default function FormCard({ title, children }) {
  return (
    <div className="mx-auto w-full max-w-5xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="mb-6 text-lg font-semibold text-slate-900 sm:text-xl">{title}</h1>
      {children}
    </div>
  )
}
