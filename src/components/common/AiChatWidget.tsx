import React, { useState, useRef, useEffect } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { 
  MessageCircle, 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Phone, 
  MapPin, 
  Calendar, 
  Building2, 
  ExternalLink,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AiChatWidget: React.FC = () => {
  const { 
    realtorProfile, 
    chatMessages, 
    sendChatMessage, 
    isAiChatOpen, 
    setIsAiChatOpen,
    setCurrentPage,
    openBookingModal
  } = useRealEstate();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isAiChatOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal);
    setInputVal('');
  };

  const handleQuickAction = (action: string) => {
    if (action === 'view_properties') {
      setCurrentPage('properties');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'schedule_showing') {
      openBookingModal();
    } else if (action === 'home_valuation') {
      sendChatMessage(`I would like to request a confidential home valuation in ${realtorProfile.city}.`);
    } else if (action === 'direct_call') {
      window.location.href = `tel:${realtorProfile.phone}`;
    } else if (action === 'whatsapp_realtor') {
      window.open(
        `https://wa.me/${realtorProfile.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${realtorProfile.agentName}, I am chatting on your website and would like assistance with ${realtorProfile.city} real estate.`)}`,
        '_blank'
      );
    } else if (action === 'compare_properties') {
      setCurrentPage('compare');
    }
  };

  const whatsappUrl = `https://wa.me/${realtorProfile.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello ${realtorProfile.agentName}! I am viewing your luxury listings in ${realtorProfile.city} and would like to connect.`
  )}`;

  return (
    <aside aria-label="Quick Communication Hub" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      
      {/* 1. WhatsApp Button (Positioned Directly ABOVE the AI Chat Launcher) */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative group flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-xl shadow-emerald-900/40 border border-emerald-300/30 transition-transform"
        title={`Chat on WhatsApp with ${realtorProfile.agentName}`}
        id="floating-whatsapp-btn"
      >
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        
        {/* Tooltip on hover */}
        <span className="absolute right-14 whitespace-nowrap bg-slate-900/95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          WhatsApp {realtorProfile.agentName.split(' ')[0]}
        </span>
        
        {/* Ping indicator */}
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-ping" />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
      </motion.a>

      {/* 2. AI Chat Launcher Button */}
      <motion.button
        onClick={() => setIsAiChatOpen(!isAiChatOpen)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-bold shadow-2xl shadow-amber-500/30 border border-amber-300/40 hover:brightness-105 transition-all"
        id="floating-ai-chat-btn"
      >
        <div className="w-7 h-7 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4" />
        </div>
        <span className="text-xs sm:text-sm tracking-wide font-extrabold">
          {isAiChatOpen ? 'Close AI Concierge' : 'AI Real Estate Assistant'}
        </span>
        <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
      </motion.button>

      {/* 3. AI Chat Modal Box */}
      <AnimatePresence>
        {isAiChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[410px] h-[560px] max-h-[82vh] bg-slate-950/98 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white z-50"
            id="ai-chat-window"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={realtorProfile.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80'}
                    alt={realtorProfile.agentName}
                    className="w-10 h-10 rounded-xl object-cover border border-amber-500/40 shadow"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-1.5 leading-tight">
                    <span>{realtorProfile.name}</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h2>
                  <p className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>AI Concierge • {realtorProfile.city}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsAiChatOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Realtor Quick Action Strip */}
            <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
              <span className="truncate">Broker: <strong className="text-white">{realtorProfile.agentName}</strong></span>
              <a 
                href={`tel:${realtorProfile.phone}`}
                className="text-amber-300 hover:underline flex items-center gap-1 shrink-0 font-semibold"
              >
                <Phone className="w-3 h-3" />
                <span>{realtorProfile.phone}</span>
              </a>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none shadow-md shadow-amber-500/10'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>

                  {/* Quick Action Chips */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[90%]">
                      {msg.quickActions.map((qa, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickAction(qa.action)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/40 transition-colors text-[11px] font-medium text-left flex items-center gap-1"
                        >
                          <span>{qa.label}</span>
                          <ArrowRight className="w-2.5 h-2.5 text-amber-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={`Ask about properties in ${realtorProfile.city}...`}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
