"use client";
import React, { useState } from "react";
import { Sparkles, Send, Loader2, Bot } from "lucide-react";

export default function AIAssistant() {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
      { role: 'assistant', content: "Hello! I am your Placify AI Assistant. I can help you with ATS matching, job creation strategies, candidate verification, and platform workflows. How can I assist you today?" }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim()) return;
      
      const userMsg = inputText.trim();
      setInputText("");
      setMessages((prev: any) => [...prev, { role: 'user', content: userMsg }]);
      setLoading(true);
      
      try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://placify-backend-dzj7.onrender.com";
          const res = await fetch(`${API_URL}/api/ai/company-assistant`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: userMsg })
          });
          
          if (!res.ok) throw new Error("Failed to connect to AI Engine");
          const json = await res.json();
          
          setMessages((prev: any) => [...prev, { role: 'assistant', content: json.reply }]);
      } catch (err: any) {
          setMessages((prev: any) => [...prev, { role: 'assistant', content: "Sorry, I am currently experiencing technical difficulties connecting to the Groq inference engine." }]);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="max-w-[1000px] mx-auto p-4 sm:p-8 h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Sparkles className="text-blue-600" size={32}/> Placify Intelligence
        </h1>
        <p className="text-gray-500 mt-1">Powered by Llama 3.3 70B Versatile. Trained strictly on Placify Hiring Workflows.</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden relative">
          
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
              {messages.map((m, idx) => (
                  <div key={idx} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-zinc-900 text-white' : 'bg-blue-600 text-white'}`}>
                          {m.role === 'user' ? 'U' : <Bot size={20}/>}
                      </div>
                      <div className={`max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${m.role === 'user' ? 'bg-white border border-gray-100 shadow-sm' : 'bg-blue-50 text-blue-900 border border-blue-100'}`}>
                          {m.content}
                      </div>
                  </div>
              ))}
              {loading && (
                  <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                          <Bot size={20}/>
                      </div>
                      <div className="max-w-[75%] rounded-2xl p-4 bg-blue-50 border border-blue-100 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600"/> <span className="text-sm font-semibold text-blue-800">Thinking...</span>
                      </div>
                  </div>
              )}
          </div>
          
          {/* Input Block */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2 relative">
                  <input type="text" value={inputText} onChange={(e: any) => setInputText(e.target.value)} disabled={loading} placeholder="Ask about ATS scoring, billing, or job creation..." className="flex-1 rounded-xl border-gray-200 py-3.5 px-4 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50" />
                  <button type="submit" disabled={!inputText.trim() || loading} className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                      <Send size={18}/>
                  </button>
              </div>
              <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">Placify AI can make mistakes. Verify important hiring details.</p>
          </form>
      </div>
    </div>
  );
}
