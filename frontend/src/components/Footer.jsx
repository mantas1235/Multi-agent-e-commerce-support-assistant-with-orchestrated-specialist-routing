const quickLinks = [
  ['Produktai', '#features'],
  ['Pristatymas', '#delivery'],
  ['Grąžinimai', '#returns'],
  ['Paskyra', '#account'],
  ['Pokalbis', '#chat'],
]

const faqTopics = [
  'Pristatymo terminai',
  'Grąžinimo procedūra',
  'Garantija ir servisas',
  'Paskyros nustatymai',
  'Mokėjimo metodai',
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">LT</span>
              </div>
              <span className="text-white font-bold text-lg">LITIT</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Pažangus AI sprendimas klientų aptarnavimui. Atsakome greitai, tiksliai ir visą parą, remdamiesi oficialiais dokumentais.
            </p>
            <div className="flex items-center gap-1.5 mt-4">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs text-green-400">Visada veikianti</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigacija</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Dažniausi klausimai</h4>
            <ul className="space-y-2.5">
              {faqTopics.map((topic) => (
                <li key={topic} className="text-sm">
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
          <p>© {year} LITIT. Visos teisės saugomos.</p>
          <p className="text-slate-500">Valdoma dirbtinio intelekto technologijos</p>
        </div>
      </div>
    </footer>
  )
}
