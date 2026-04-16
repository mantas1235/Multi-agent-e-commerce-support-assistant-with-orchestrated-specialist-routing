import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { loginUser, registerUser } from '../api/auth'

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'register') {
        await registerUser(email, password)
      }
      const data = await loginUser(email, password)
      login(data.token, data.email)
      onClose()
      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'))
    setError(null)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">LT</span>
          </div>
          <span className="text-xl font-bold text-gray-900">LITIT</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {mode === 'login' ? 'Prisijungti' : 'Registruotis'}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {mode === 'login'
            ? 'Įveskite savo prisijungimo duomenis'
            : 'Sukurkite paskyrą ir klauskite AI asistentės'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">El. paštas</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="vardas@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Slaptažodis</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? 'Kraunama...' : mode === 'login' ? 'Prisijungti' : 'Registruotis'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {mode === 'login' ? 'Neturite paskyros?' : 'Jau turite paskyrą?'}{' '}
          <button onClick={switchMode} className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            {mode === 'login' ? 'Registruotis' : 'Prisijungti'}
          </button>
        </p>
      </div>
    </div>
  )
}
