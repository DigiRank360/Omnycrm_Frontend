import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-bold">404 – Page not found</h1>
      <Link to="/" className="btn-primary">Go home</Link>
    </div>
  )
}
