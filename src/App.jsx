import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'
import GrnForm from './pages/grn/GrnForm'
import QcForm from './pages/qc/QcForm'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route element={<ProtectedRoute permission="dashboard" />}>
                <Route index element={<Dashboard />} />
              </Route>
              <Route element={<ProtectedRoute permission="grn" />}>
                <Route path="grn" element={<GrnForm />} />
              </Route>
              <Route element={<ProtectedRoute permission="qc" />}>
                <Route path="qc" element={<QcForm />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
