'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, Minimize2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

export default function AIAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<any>(null);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && isOpen && !context) {
      loadContext();
    }
  }, [user, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const loadContext = async () => {
    try {
      const { data: cand } = await supabase.from('candidates').select('*').eq('user_id', user?.id).single();
      setContext(cand);
      
      // Initial greeting
      setMessages([{
        role: 'assistant', 
        content: `Hi there! I'm Placify AI, your platform expert. I see your Trust Score is ${cand?.trust_score || 0}. I can help you understand ATS matching, verification steps, or navigate the dashboard. How can I assist you today?`
      }]);
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }, { role: 'assistant', content: '' }]);
    setLoading(true);

    try {
      const pageContext = window.location.pathname;
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.filter(m => m.content).map(m => ({ role: m.role, content: m.content })).concat({ role: 'user', content: userMessage }),
          candidateContext: context || {}, 
          userId: user?.id,
          language,
          pageContext,
          role: 'Candidate',
          conversationId
        })
      });

      if (!res.ok) { const errData = await res.json().catch(()=>({})); throw new Error(errData.error || 'API Error'); }

      const returnedConvId = res.headers.get('X-Conversation-Id');
      if (returnedConvId && !conversationId) {
        setConversationId(returnedConvId);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No stream found');
      
      const decoder = new TextDecoder('utf-8');
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        
        setMessages(prev => {
          const newMsgs = [...prev];
          const lastIndex = newMsgs.length - 1;
          newMsgs[lastIndex].content += chunk;
          return newMsgs;
        });
      }
      
    } catch (error) {
      console.error('Stream error:', error);
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].content = `I'm having trouble connecting to my servers right now. Please [Create a Support Ticket](/candidate/support) if this persists. \n\nTechnical Error: ${error instanceof Error ? error.message : String(error)}`;
        return newMsgs;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all group flex items-center gap-3"
        >
          <Bot size={28} className="group-hover:animate-pulse" />
          <span className="font-bold pr-2 hidden md:block">Placify AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"><Bot size={24}/></div>
              <div>
                <h3 className="font-bold">Placify AI Assistant</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1"><Sparkles size={12}/> Business Expert</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLanguage(language === 'English' ? 'Hindi' : 'English')} 
                className="text-xs font-bold bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md transition-colors"
              >
                {language === 'English' ? 'EN' : 'हिंदी'}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><Minimize2 size={18}/></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((m, i) => {
              if (!m.content && m.role === 'assistant') {
                return (
                  <div key={i} className="flex justify-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Bot size={16}/></div>
                    <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                  {m.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Bot size={16}/></div>}
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-gray-900 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                    {m.content}
                    {/* Support Injection */}
                    {m.role === 'assistant' && (m.content.includes('Support Ticket') || m.content.includes('Contact the Placify Team')) && (
                      <a href="/candidate/support" className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 font-medium px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors text-xs no-underline">
                        <Sparkles size={14} /> Create Support Ticket
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={language === 'English' ? "Ask me anything about Placify..." : "Placify के बारे में कुछ भी पूछें..."} 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white p-2 rounded-xl transition-colors shadow-sm"
              >
                <Send size={20} className="translate-x-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
