const features = [
  {
    id: 'features',
    emoji: '📦',
    title: 'Produktų informacija',
    description:
      'Techninės specifikacijos, modelių palyginimas, priežiūros instrukcijos ir rekomenduojama naudojimo tvarka.',
    colorClass: {
      card: 'bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      chip: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    },
    questions: ['Kokios produkto techninės specifikacijos?', 'Kaip tinkamai prižiūrėti?'],
  },
  {
    id: 'delivery',
    emoji: '🚚',
    title: 'Pristatymas',
    description:
      'Siuntimo taisyklės, pristatymo terminai, tarptautinio siuntimo galimybės ir pristatymo kainos.',
    colorClass: {
      card: 'bg-green-50 border-green-100',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      chip: 'bg-green-100 text-green-700 hover:bg-green-200',
    },
    questions: ['Kiek kainuoja pristatymas?', 'Kokios yra tarptautinio siuntimo sąlygos?'],
  },
  {
    id: 'returns',
    emoji: '↩️',
    title: 'Grąžinimai',
    description:
      'Grąžinimo politika, broko kriterijai, grąžinimo procedūros ir terminai.',
    colorClass: {
      card: 'bg-orange-50 border-orange-100',
      iconBg: 'bg-orange-100',
      iconText: 'text-orange-600',
      chip: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    },
    questions: ['Kaip grąžinti prekę?', 'Kokie yra broko kriterijai?'],
  },
  {
    id: 'account',
    emoji: '👤',
    title: 'Paskyros valdymas',
    description:
      'Užsakymų statusai, paskyros instrukcijos ir asmeninių duomenų atnaujinimas.',
    colorClass: {
      card: 'bg-purple-50 border-purple-100',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      chip: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    },
    questions: ['Koks mano užsakymo statusas?', 'Kaip keisti paskyros duomenis?'],
  },
]

export default function Features({ onQuestionClick }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Kuo galime padėti?</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Mūsų AI asistentė specializuojasi keturiose pagrindinėse srityse — atsakome greitai ir
            tiksliai remiantis oficialiais dokumentais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              id={f.id}
              key={f.id}
              className={`border rounded-2xl p-6 hover:shadow-md transition-shadow ${f.colorClass.card}`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${f.colorClass.iconBg} ${f.colorClass.iconText}`}
                aria-hidden="true"
              >
                {f.emoji}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">{f.description}</p>
              <div className="flex flex-col gap-2">
                {f.questions.map((q) => (
                  <button
                    key={q}
                    onClick={() => onQuestionClick(q)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg text-left transition-colors ${f.colorClass.chip}`}
                  >
                    &ldquo;{q}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
