'use client';

import React, { useState, useEffect } from 'react';
import { Search, Book, HelpCircle, ShieldCheck, Zap, Briefcase, ChevronRight, FileText, Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function HelpCenterPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  
  const [faqs, setFaqs] = useState<any[]>([]);
  const [kbArticles, setKbArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fData } = await supabase.from('faqs').select('*');
        const { data: kData } = await supabase.from('knowledge_base').select('*');
        setFaqs(fData || []);
        setKbArticles(kData || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { name: "Verification Process", icon: <ShieldCheck size={24} className="text-green-500"/>, count: kbArticles.filter(a => a.category === 'Verification').length || 1 },
    { name: "ATS Optimization", icon: <Zap size={24} className="text-amber-500"/>, count: kbArticles.filter(a => a.category === 'ATS Matching').length || 1 },
    { name: "Managing Applications", icon: <Briefcase size={24} className="text-blue-500"/>, count: kbArticles.filter(a => a.category === 'Applications').length || 1 },
    { name: "Candidate Passport", icon: <FileText size={24} className="text-indigo-500"/>, count: kbArticles.filter(a => a.category === 'Passport').length || 1 }
  ];


  const filteredFaqs = searchQuery ? faqs.filter(f => f.question?.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer?.toLowerCase().includes(searchQuery.toLowerCase())) : faqs;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-12">
      
      {/* Hero Search */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-10 text-center text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h1 className="text-4xl font-extrabold mb-2">How can we help you?</h1>
          <p className="text-blue-200 text-lg">Search our knowledge base for instant answers.</p>
          <div className="relative mt-8">
            <Search size={24} className="absolute left-4 top-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for articles, guides, or FAQs..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl text-gray-900 text-lg outline-none focus:ring-4 focus:ring-blue-500/50 transition-shadow shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Categories Grid */}
        <div className="lg:col-span-2 space-y-8">
          
          {searchQuery ? (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Search size={20}/> Search Results</h2>
              {filteredFaqs.length === 0 ? (
                <p className="text-gray-500 bg-gray-50 p-6 rounded-2xl border border-gray-100">No results found for &quot;{searchQuery}&quot;. Try a different keyword.</p>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((faq, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 block">{faq.category}</span>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by Category</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat, i) => (
                    <div key={i} className="bg-white border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all rounded-2xl p-6 cursor-pointer group">
                      <div className="flex items-start justify-between">
                        <div className="bg-gray-50 group-hover:bg-blue-50 p-3 rounded-xl transition-colors">{cat.icon}</div>
                        <span className="text-xs font-medium text-gray-400">{cat.count} articles</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mt-4 text-lg">{cat.name}</h3>
                      <p className="text-blue-600 text-sm font-medium mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">View Articles <ChevronRight size={16}/></p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-3"><HelpCircle size={20} className="text-blue-500 shrink-0 mt-0.5"/> {faq.question}</h3>
                      <p className="text-gray-600 ml-8">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-blue-50 to-white rounded-3xl border border-blue-100 p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot size={32}/>
            </div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">Placify AI Assistant</h3>
            <p className="text-gray-600 text-sm mb-6">Get instant, personalized answers to your specific profile questions.</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md">
              Chat with AI
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-sm">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Still need help?</h3>
            <p className="text-gray-600 text-sm mb-6">Our human expert team is available to assist you with complex issues.</p>
            <button onClick={() => router.push('/candidate/support')} className="w-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 font-bold py-3 px-4 rounded-xl transition-colors shadow-sm">
              Create Support Ticket
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
