import { useState } from 'react'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Footer from './components/Footer'
import FloatingChat from './components/FloatingChat'
import AuthModal from './components/AuthModal'

function AppContent() {
  const { user } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatTrigger, setChatTrigger] = useState(null)
  const [pendingQuestion, setPendingQuestion] = useState(null)

  const openChat = () => {
    if (user) {
      setChatOpen(true)
    } else {
      setAuthModalOpen(true)
    }
  }

  const handleQuestionClick = (question) => {
    if (user) {
      setChatTrigger({ text: question, id: Date.now() })
      setChatOpen(true)
    } else {
      setPendingQuestion(question)
      setAuthModalOpen(true)
    }
  }

  const handleAuthSuccess = () => {
    if (pendingQuestion) {
      setChatTrigger({ text: pendingQuestion, id: Date.now() })
      setChatOpen(true)
      setPendingQuestion(null)
    } else {
      setChatOpen(true)
    }
  }

  return (
    <div className="min-h-screen">
      <Header onChatClick={openChat} />
      <Hero onChatClick={openChat} />
      <Features onQuestionClick={handleQuestionClick} />
      <Footer />

      {user && (
        <FloatingChat
          isOpen={chatOpen}
          onToggle={() => setChatOpen((v) => !v)}
          trigger={chatTrigger}
        />
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => { setAuthModalOpen(false); setPendingQuestion(null) }}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
