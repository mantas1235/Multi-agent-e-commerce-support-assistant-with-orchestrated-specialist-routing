import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('litit_token')
    const email = sessionStorage.getItem('litit_email')
    if (token && email) setUser({ token, email })
    setLoading(false)
  }, [])

  const login = (token, email) => {
    sessionStorage.setItem('litit_token', token)
    sessionStorage.setItem('litit_email', email)
    setUser({ token, email })
  }

  const logout = () => {
    sessionStorage.removeItem('litit_token')
    sessionStorage.removeItem('litit_email')
    setUser(null)
  }

  if (loading) return null

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
