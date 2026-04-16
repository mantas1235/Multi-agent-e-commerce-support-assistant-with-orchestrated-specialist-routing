import { useState, useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'

const SUGGESTED = [
  'Kokios produkto techninės specifikacijos?',
  'Kiek kainuoja pristatymas?',
  'Kaip grąžinti prekę?',
  'Koks mano užsakymo statusas?',
]

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        AI
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
        <div className="flex gap-1 items-center h-5">
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  )
}

function Message({ message }) {
  const isUser = message.role === 'user'
  const time = message.timestamp.toLocaleTimeString('lt-LT', {
    hour: '2-digit',
    minute: '2-digit',
  })

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[78%]">
          <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-none shadow-sm">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <p className="text-xs text-gray-400 text-right mt-1 pr-1">{time}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
        AI
      </div>
      <div className="max-w-[78%]">
        <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-xs text-gray-400 mt-1 pl-1">{time}</p>
      </div>
    </div>
  )
}

export default function Chatbot({ trigger }) {
  const { messages, isLoading, error, sendMessage, clearChat, messagesEndRef } = useChat()
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const sentTriggerRef = useRef(null)

  // Fire a message when the parent passes a new trigger
  useEffect(() => {
    if (trigger && trigger !== sentTriggerRef.current && trigger.text) {
      sentTriggerRef.current = trigger
      sendMessage(trigger.text)
    }
  }, [trigger])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    sendMessage(trimmed)
    setInput('')
    inputRef.current?.focus()
  }

  const handleSuggested = (q) => {
    sendMessage(q)
    inputRef.current?.focus()
  }

  return (
    <section id="chat" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Paklauskite AI asistentės
          </h2>
          <p className="text-lg text-gray-500">
            Užduokite klausimą ir gaukite atsakymą iš mūsų žinių bazės
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header bar */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner">
                AI
              </div>
              <div>
                <p className="text-white font-semibold text-sm">LITIT Asistentė</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-blue-100 text-xs">Veikia</span>
                </div>
              </div>
            </div>
            <button
              onClick={clearChat}
              title="Išvalyti pokalbį"
              className="text-white/60 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Išvalyti
            </button>
          </div>

          {/* Messages */}
          <div
            className="h-96 overflow-y-auto p-6 bg-gray-50"
            data-testid="messages-area"
          >
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            {error && (
              <div className="flex justify-center mb-4">
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm">
                  {error}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          <div className="px-6 py-3 bg-white border-t border-gray-100">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggested(q)}
                  disabled={isLoading}
                  className="flex-shrink-0 text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-3 items-center">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 focus-within:bg-white transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Įveskite savo klausimą..."
                  disabled={isLoading}
                  maxLength={500}
                  className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-sm outline-none disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-11 h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0 shadow-sm"
                aria-label="Siųsti"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
