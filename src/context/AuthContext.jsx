/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { hasPermission } from '../config/roles'
import { api, tokenStore } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (tokenStore.get() ? tokenStore.user() : null))

  // Re-validate the stored session once on load
  useEffect(() => {
    if (!tokenStore.get()) return
    api('/auth/me')
      .then(({ user: fresh }) => setUser(fresh))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const onExpired = () => setUser(null)
    window.addEventListener('auth:expired', onExpired)
    return () => window.removeEventListener('auth:expired', onExpired)
  }, [])

  const login = useCallback(async ({ email, password, role }) => {
    const data = await api('/auth/login', { method: 'POST', body: { email, password, role } })
    tokenStore.set(data.token, data.user)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, login, logout, can: (permission) => hasPermission(user?.role, permission) }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
