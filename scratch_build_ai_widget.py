# -*- coding: utf-8 -*-
import os

dir_path = r"components\candidate"
os.makedirs(dir_path, exist_ok=True)

content = """'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, User, Sparkles, Loader2, Minimize2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

export default function AIAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<any>(null);
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
        content: `Hi there! I'm Placify AI. I see your Trust Score is currently ${cand?.trust_score || 0}. I can help you improve your profile, optimize your resume for ATS, or answer any verification questions. How can I help today?`
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
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          candidateContext: context || {}
        })
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        throw new Error('No reply from Groq');
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to my servers right now. Please try again in a moment." }]);
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
                <p className="text-xs text-blue-100 flex items-center gap-1"><Sparkles size={12}/> Powered by Groq</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><Minimize2 size={18}/></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.length === 0 && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <Bot size={48} className="text-blue-200 mb-4" />
                <p className="text-gray-500 font-medium text-sm">Loading AI connection...</p>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                {m.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Bot size={16}/></div>}
                <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-gray-900 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Bot size={16}/></div>
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..." 
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
"""

with open(os.path.join(dir_path, "AIAssistant.tsx"), "w", encoding="utf-8") as f:
    f.write(content)
print("AI Assistant UI Widget created!")
