import { useRef, useState } from 'react'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Chatbot from './components/Chatbot'
import Footer from './components/Footer'

export default function App() {
  const chatSectionRef = useRef(null)
  const [chatTrigger, setChatTrigger] = useState(null)

  const scrollToChat = () => {
    chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleQuestionClick = (question) => {
    setChatTrigger({ text: question, id: Date.now() })
    scrollToChat()
  }

  return (
    <div className="min-h-screen">
      <Header onChatClick={scrollToChat} />
      <Hero onChatClick={scrollToChat} />
      <Features onQuestionClick={handleQuestionClick} />
      <div ref={chatSectionRef}>
        <Chatbot trigger={chatTrigger} />
      </div>
      <Footer />
    </div>
  )
}
