'use client'

import { Bot, X, Send } from 'lucide-react'
import { useState } from 'react'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm CloudBasket AI. How can I help you today?" }
  ])
  const [input, setInput] = useState('')
  
  const quickReplies = [
    'How does price comparison work?',
    'Tell me about affiliate program',
    'What is POD?',
    "Show me today's deals"
  ]
  
  const handleSend = () => {
    if (!input.trim()) return
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: input }])
    
    // Simulate bot response (replace with actual API call later)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Thanks for your question! This feature is coming soon. Meanwhile, feel free to explore our site or contact us via WhatsApp.' 
      }])
    }, 1000)
    
    setInput('')
  }
  
  const handleQuickReply = (reply: string) => {
    setInput(reply)
  }
  
  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 bg-[#039BE5] hover:bg-[#0288D1] text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Open AI Assistant"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-40 right-6 z-50 w-96 bg-white rounded-lg shadow-2xl flex flex-col" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-[#039BE5] text-white p-4 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot size={24} />
              <div>
                <h3 className="font-bold">CloudBasket AI</h3>
                <p className="text-xs opacity-90">Always here to help</p>
              </div>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user' 
                    ? 'bg-[#039BE5] text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">Quick questions:</p>
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickReply(reply)}
                    className="w-full text-left text-sm border border-[#039BE5]/30 hover:bg-sky-50 rounded-lg p-2 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#039BE5]"
              />
              <button
                onClick={handleSend}
                className="bg-[#039BE5] hover:bg-[#0288D1] text-white rounded-lg px-4 py-2 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
