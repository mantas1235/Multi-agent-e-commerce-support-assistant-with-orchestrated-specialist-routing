import { useState, useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../context/AuthContext'

const SUGGESTED = [
  'Kokios produkto techninės specifikacijos?',
  'Kiek kainuoja pristatymas?',
  'Kaip grąžinti prekę?',
  'Koks mano užsakymo statusas?',
]

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-3">
      <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
        AI
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-tl-none px-3 py-2">
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

function Message({ message }) {
  const isUser = message.role === 'user'
  const time = message.timestamp.toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit' })

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[80%]">
          <div className="bg-blue-600 text-white px-3 py-2 rounded-2xl rounded-tr-none shadow-sm">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <p className="text-[10px] text-gray-400 text-right mt-0.5 pr-1">{time}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2 mb-3">
      <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-sm mt-0.5">
        AI
      </div>
      <div className="max-w-[80%]">
        <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-2xl rounded-tl-none shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5 pl-1">{time}</p>
      </div>
    </div>
  )
}

export default function FloatingChat({ isOpen, onToggle, trigger }) {
  const { messages, isLoading, error, sendMessage, clearChat, messagesEndRef } = useChat()
  const { user } = useAuth()
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const sentTriggerRef = useRef(null)

  useEffect(() => {
    if (trigger && trigger !== sentTriggerRef.current && trigger.text) {
      sentTriggerRef.current = trigger
      sendMessage(trigger.text)
    }
  }, [trigger])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    sendMessage(trimmed)
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat popup */}
      {isOpen && (
        <div className="w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
             style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner">
                AI
              </div>
              <div>
                <p className="text-white font-semibold text-sm">LITIT Asistentė</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span className="text-blue-100 text-xs">Veikia</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                title="Išvalyti pokalbį"
                className="text-white/60 hover:text-white transition-colors p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={onToggle}
                className="text-white/60 hover:text-white transition-colors p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-hide">
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            {error && (
              <div className="flex justify-center mb-3">
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-xs">
                  {error}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex-shrink-0">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => { sendMessage(q); inputRef.current?.focus() }}
                  disabled={isLoading}
                  className="flex-shrink-0 text-[11px] bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 px-2.5 py-1 rounded-full transition-colors disabled:opacity-50 font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex-shrink-0">
            <div className="flex gap-2 items-center">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 focus-within:bg-white transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Įveskite klausimą..."
                  disabled={isLoading}
                  maxLength={500}
                  className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-sm outline-none disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center active:scale-95"
        aria-label={isOpen ? 'Uždaryti pokalbį' : 'Atidaryti pokalbį'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        )}
      </button>
    </div>
  )
}
