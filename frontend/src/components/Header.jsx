import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Produktai', href: '#features' },
  { label: 'Pristatymas', href: '#delivery' },
  { label: 'Grąžinimai', href: '#returns' },
  { label: 'Paskyra', href: '#account' },
]

export default function Header({ onChatClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm tracking-wide">LT</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ABIBAS</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop auth area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-500 max-w-[160px] truncate">{user.email}</span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg"
                >
                  Atsijungti
                </button>
              </>
            ) : (
              <button
                onClick={onChatClick}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Prisijungti
              </button>
            )}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Atidaryti meniu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-2 py-2 text-gray-600 hover:text-blue-600 text-sm font-medium rounded-lg transition-colors">
                {link.label}
              </a>
            ))}
            {user ? (
              <div className="pt-2 border-t border-gray-100">
                <p className="px-2 py-1 text-xs text-gray-400">{user.email}</p>
                <button onClick={() => { logout(); setMenuOpen(false) }}
                  className="w-full mt-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium">
                  Atsijungti
                </button>
              </div>
            ) : (
              <button onClick={() => { onChatClick(); setMenuOpen(false) }}
                className="w-full mt-2 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold">
                Prisijungti
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
