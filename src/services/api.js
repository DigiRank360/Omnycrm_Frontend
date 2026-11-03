const TOKEN_KEY = 'crm_token'
const USER_KEY = 'crm_user'
const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '')

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  user: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY))
    } catch {
      return null
    }
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}

export async function api(path, { method = 'GET', body } = {}) {
  const token = tokenStore.get()
  let res
  try {
    res = await fetch(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`, {
      method,
      headers: {
        ...(body && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body && JSON.stringify(body),
    })
  } catch {
    throw new Error('Cannot reach the server. Please try again.')
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && token) {
      tokenStore.clear()
      window.dispatchEvent(new Event('auth:expired'))
    }
    throw new Error(data.message || 'Something went wrong')
  }
  return data
}
