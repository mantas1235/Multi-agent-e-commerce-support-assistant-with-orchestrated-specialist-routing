import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../api/chat'

const INITIAL_MESSAGE = {
  id: 1,
  role: 'assistant',
  content:
    'Sveiki! Aš esu LITIT AI asistentė. Galiu padėti su klausimais apie produktus, pristatymą, grąžinimus ir jūsų paskyrą. Kuo galiu padėti?',
  timestamp: new Date(),
}

export function useChat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      const answer = await sendChatMessage(text.trim())
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: answer,
          timestamp: new Date(),
        },
      ])
    } catch {
      setError('Atsiprašau, įvyko klaida. Bandykite dar kartą.')
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{ ...INITIAL_MESSAGE, id: Date.now(), timestamp: new Date() }])
    setError(null)
  }

  return { messages, isLoading, error, sendMessage, clearChat, messagesEndRef }
}
