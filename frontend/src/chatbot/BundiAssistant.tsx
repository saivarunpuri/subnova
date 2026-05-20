import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Zap } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export const BundiAssistant = () => {
  const { isBundiOpen, toggleBundi } = useUIStore();
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bundi' }[]>([
    { text: "Hi! I'm BUNDI 🤖. How can I help you explore the Subscription Universe?", sender: 'bundi' }
  ]);
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('bundi_reply', (data: { message: string }) => {
      setIsSpeaking(true);
      setMessages((prev) => [...prev, { text: data.message, sender: 'bundi' }]);
      setTimeout(() => setIsSpeaking(false), 2000);
    });
    return () => { socket.off('bundi_reply'); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBundiOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, sender: 'user' }]);
    socket.emit('bundi_message', { message: input });
    setInput('');
  };

  return (
    <>
      <AnimatePresence>
        {isBundiOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed bottom-24 right-8 w-80 md:w-96 h-[500px] flex flex-col overflow-hidden z-50 rounded-3xl border border-white/10"
            style={{
              background: 'rgba(16,23,42,0.85)',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,245,160,0.08), inset 0 0 0 1px rgba(255,255,255,0.05)',
            }}
          >
            {/* Aurora Header */}
            <div
              className="flex items-center justify-between p-4 border-b border-white/8 relative overflow-hidden"
              style={{ background: 'rgba(0,245,160,0.04)' }}
            >
              {/* Subtle aurora glow behind header */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'linear-gradient(90deg, rgba(0,245,160,0.06) 0%, rgba(0,217,245,0.04) 100%)'
              }} />

              <div className="flex items-center gap-3 relative z-10">
                {/* Hologram avatar with aurora pulse */}
                <div className="relative">
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-white/15 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #00F5A0 0%, #00D9F5 50%, #FF6B6B 100%)' }}
                    animate={isSpeaking ? { scale: [1, 1.12, 1], boxShadow: ['0 0 10px rgba(0,245,160,0.4)', '0 0 30px rgba(0,245,160,0.8)', '0 0 10px rgba(0,245,160,0.4)'] } : {}}
                    transition={{ duration: 0.8, repeat: isSpeaking ? Infinity : 0 }}
                  >
                    <Bot className="text-white w-5 h-5 relative z-10" />
                    {/* Hologram scan line */}
                    <motion.div
                      className="absolute inset-0 w-full"
                      style={{ background: 'linear-gradient(0deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)', height: '40%' }}
                      animate={{ y: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>
                  {/* Orbiting particle */}
                  <motion.div
                    className="absolute w-2 h-2 rounded-full"
                    style={{ background: '#00F5A0', top: -2, left: '50%', transformOrigin: '0 20px', boxShadow: '0 0 6px #00F5A0' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>

                <div>
                  <h3 className="font-black text-white text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>BUNDI</h3>
                  <p className="text-[10px] font-bold tracking-wider" style={{ color: '#00D9F5' }}>
                    {isSpeaking ? '● Speaking...' : 'AI Companion'}
                  </p>
                </div>
              </div>

              <button onClick={toggleBundi} className="text-white/40 hover:text-white transition-colors relative z-10 p-1.5 rounded-lg hover:bg-white/10 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar custom-scrollbar-bundi">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'text-white rounded-tr-sm'
                        : 'text-white/85 rounded-tl-sm border border-white/8'
                    }`}
                    style={msg.sender === 'user'
                      ? { background: 'linear-gradient(135deg, #00D9F5, #00F5A0)', color: '#050816' }
                      : { background: 'rgba(255,255,255,0.05)' }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/8" style={{ background: 'rgba(0,245,160,0.03)' }}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask BUNDI anything..."
                  className="w-full border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-white/25 focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    focusBorderColor: '#00D9F5',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,217,245,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  onClick={handleSend}
                  className="absolute right-1.5 w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #00F5A0, #00D9F5)', boxShadow: '0 0 12px rgba(0,245,160,0.4)' }}
                >
                  <Send className="w-3.5 h-3.5 text-[#050816]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle — Aurora hologram orb */}
      <motion.button
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center z-50 cursor-pointer relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #00F5A0 0%, #00D9F5 50%, #FF6B6B 100%)',
          boxShadow: '0 8px 25px rgba(0,245,160,0.35), 0 0 0 1px rgba(255,255,255,0.1)',
        }}
        whileHover={{ scale: 1.12, boxShadow: '0 12px 35px rgba(0,245,160,0.55), 0 0 0 1px rgba(255,255,255,0.15)' }}
        whileTap={{ scale: 0.92 }}
        onClick={toggleBundi}
        animate={isBundiOpen ? {} : { boxShadow: ['0 8px 25px rgba(0,245,160,0.35)', '0 8px 35px rgba(0,217,245,0.55)', '0 8px 25px rgba(0,245,160,0.35)'] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        {/* Hologram scan */}
        <motion.div
          className="absolute inset-0 w-full"
          style={{ background: 'linear-gradient(0deg, transparent, rgba(255,255,255,0.2), transparent)', height: '35%' }}
          animate={{ y: ['-100%', '300%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />
        <Bot className="w-6 h-6 text-[#050816] relative z-10" />
        {/* Aurora orbit ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: 'rgba(255,255,255,0.3)' }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>
    </>
  );
};
