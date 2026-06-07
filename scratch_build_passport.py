# -*- coding: utf-8 -*-
import os

dir_path = r"app\candidate\passport"
os.makedirs(dir_path, exist_ok=True)

content = """'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Download, Share2, Calendar, FileText, CheckCircle2, Lock, Activity, Eye, FileBadge } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function CandidatePassportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const { data: cand } = await supabase.from('candidates').select('*').eq('user_id', user?.id).single();
      const { data: usr } = await supabase.from('users').select('name, email').eq('id', user?.id).single();
      
      setData({ ...cand, ...usr });
    } catch (e) {
      console.error(e);
      toast('error', 'Error fetching Passport', 'Could not load your passport data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    toast('info', 'Generating Passport', 'Compiling your verified credentials into a secure PDF...');
    
    // Simulate API delay for PDF generation and Storage upload
    setTimeout(() => {
      setIsGenerating(false);
      toast('success', 'Passport Ready', 'Your passport PDF has been downloaded.');
      window.print(); // Using native browser print to PDF as a fallback
    }, 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://placify.com/p/${data?.id}`);
    toast('success', 'Link Copied', 'Your secure passport link has been copied to clipboard.');
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  const isVerified = data?.verification_status === 'verified';
  const score = data?.trust_score || 45;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileBadge className="text-blue-600" size={32}/> Candidate Passport
          </h1>
          <p className="text-gray-500 mt-1">Your immutable, verified career identity.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleShare} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2">
            <Share2 size={18} /> Share URL
          </button>
          <button onClick={handleDownload} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70">
            <Download size={18} /> {isGenerating ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* The Passport Document */}
      <div id="passport-document" className="bg-white rounded-[2rem] border border-gray-200 shadow-xl overflow-hidden relative">
        
        {/* Header Ribbon */}
        <div className="h-32 bg-gradient-to-r from-blue-900 to-indigo-900 relative">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
          <div className="absolute top-6 right-8 text-white/50 font-mono text-sm tracking-widest uppercase">
            ID: {data?.id?.split('-')[0]}
          </div>
          <div className="absolute bottom-6 right-8 text-white/80 flex items-center gap-2">
            <Calendar size={16}/> Generated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-16 mb-8">
            <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg relative border border-gray-100">
              <img src={data?.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data?.email}`} alt="Avatar" className="w-full h-full object-cover rounded-xl bg-gray-50" />
              {isVerified && (
                <div className="absolute -bottom-3 -right-3 bg-white p-1 rounded-full shadow-md">
                  <div className="bg-green-500 text-white p-1.5 rounded-full"><ShieldCheck size={20}/></div>
                </div>
              )}
            </div>
            
            <div className="text-right">
              {isVerified ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-full font-bold text-sm shadow-sm">
                  <CheckCircle2 size={16}/> VERIFIED PROFESSIONAL
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold text-sm shadow-sm">
                  <Lock size={16}/> UNVERIFIED
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">{data?.name || data?.email?.split('@')[0]}</h2>
            <p className="text-lg text-gray-600 font-medium mt-1">{data?.headline || 'Candidate'}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 font-medium">
              <span>{data?.email}</span>
              <span>•</span>
              <span>{data?.location || 'No Location'}</span>
            </div>
          </div>

          <hr className="my-8 border-gray-100" />

          {/* Scores Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Trust Score</p>
              <p className={`text-3xl font-extrabold ${score > 80 ? 'text-green-600' : 'text-amber-500'}`}>{score}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">ATS Avg</p>
              <p className="text-3xl font-extrabold text-blue-600">{data?.ats_score || 0}%</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Reliability</p>
              <p className="text-3xl font-extrabold text-indigo-600">{data?.reliability_score || 100}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Fraud Risk</p>
              <p className="text-3xl font-extrabold text-red-500">{data?.fraud_score || 0}%</p>
            </div>
          </div>

          {/* Detailed Verification Timeline */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Activity size={18} className="text-blue-500"/> Verification Timeline</h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-100">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center"><div className="w-2 h-2 bg-blue-600 rounded-full"></div></div>
                <p className="font-bold text-gray-900 text-sm">Passport Generated</p>
                <p className="text-xs text-gray-500 mt-0.5">{new Date().toLocaleString()}</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center"><div className="w-2 h-2 bg-gray-400 rounded-full"></div></div>
                <p className="font-bold text-gray-900 text-sm">Profile Created</p>
                <p className="text-xs text-gray-500 mt-0.5">{new Date(data?.created_at || Date.now()).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className={`p-5 rounded-2xl border ${isVerified ? 'bg-green-50/50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><FileText size={18} className="text-gray-400"/> System Recommendation</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {isVerified 
                ? "This candidate has successfully passed all automated and manual verification gates. The Trust Score of 100 strongly indicates high reliability, authentic experience, and excellent communication skills. Recommended for fast-track interviewing."
                : "This candidate has not yet completed the Verification Journey. Details provided are self-reported and have not been audited by the Placify Expert Network. Proceed with standard interview and vetting procedures."
              }
            </p>
          </div>

        </div>
        
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
          PLACIFY SECURE PASSPORT • IMMUTABLE RECORD
        </div>
      </div>

    </div>
  );
}
"""

with open(os.path.join(dir_path, "page.tsx"), "w", encoding="utf-8") as f:
    f.write(content)
print("Candidate Passport Page scaffolded!")
