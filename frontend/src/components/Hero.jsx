const stats = [
  { value: '4', label: 'Specialistai' },
  { value: '24/7', label: 'Prieiga' },
  { value: '<2s', label: 'Atsakymo laikas' },
]

export default function Hero({ onChatClick }) {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-slate-900">
      {/* Gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-700 rounded-full opacity-20 blur-3xl"
          aria-hidden="true"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-300 px-4 py-2 rounded-full text-sm mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI Asistentė veikia
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            LITIT Dirbtinio
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Intelekto Asistentė
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-xl">
            Greitai ir tiksliai atsakome į klausimus apie produktus, pristatymą, grąžinimus ir jūsų paskyrą — visą parą, 7 dienas per savaitę.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button
              onClick={onChatClick}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Pradėti pokalbį
            </button>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white/50 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              Sužinoti daugiau
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-10 pt-4 border-t border-white/10">
            {stats.map((s, i) => (
              <div key={s.label}>
                {i > 0 && (
                  <div className="absolute h-8 w-px bg-white/15" style={{ marginLeft: '-20px', marginTop: '-16px' }} />
                )}
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
