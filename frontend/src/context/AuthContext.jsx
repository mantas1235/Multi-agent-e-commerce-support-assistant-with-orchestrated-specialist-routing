import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('litit_token')
    const email = localStorage.getItem('litit_email')
    if (token && email) setUser({ token, email })
    setLoading(false)
  }, [])

  const login = (token, email) => {
    localStorage.setItem('litit_token', token)
    localStorage.setItem('litit_email', email)
    setUser({ token, email })
  }

  const logout = () => {
    localStorage.removeItem('litit_token')
    localStorage.removeItem('litit_email')
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
