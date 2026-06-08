"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserCircle, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterSelection() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 z-10"
      >
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-6 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Building2 className="text-white" size={24} />
          </div>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">PLACIFY</span>
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Join Placify</h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">Choose how you want to use Placify to unlock the future of AI-driven, verified hiring.</p>
      </motion.div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
        
        {/* Candidate Option */}
        <motion.button 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => router.push('/candidate/register')}
          className="group text-left bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/50 rounded-3xl p-8 hover:border-blue-400 hover:shadow-blue-900/10 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 flex-1">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <UserCircle size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-3">I'm a Candidate</h2>
            <p className="text-slate-600 mb-8 text-lg">Create your verified profile, get matched to top jobs automatically by AI, and showcase your skills to premium employers.</p>
            
            <ul className="space-y-3 mb-8">
              {['AI Resume Parsing & Scoring', 'Automated Job Matching', 'Verified Trust Passport', 'Direct Interview Invites'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" /> {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mt-auto pt-6 border-t border-slate-100 flex items-center justify-between text-blue-600 font-bold group-hover:text-blue-700">
            <span>Register as Candidate</span>
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </div>
        </motion.button>

        {/* Company Option */}
        <motion.button 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => router.push('/company/register')}
          className="group text-left bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/50 rounded-3xl p-8 hover:border-indigo-400 hover:shadow-indigo-900/10 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 flex-1">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <Building2 size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-3">I'm a Company</h2>
            <p className="text-slate-600 mb-8 text-lg">Create your hiring workspace, use AI pgvector models to source verified talent instantly, and manage your pipeline.</p>
            
            <ul className="space-y-3 mb-8">
              {['AI pgvector Sourcing Engine', 'Real-time Kanban Pipelines', 'Fraud & Trust Verification', 'Unlimited Job Workspaces'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" /> {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mt-auto pt-6 border-t border-slate-100 flex items-center justify-between text-indigo-600 font-bold group-hover:text-indigo-700">
            <span>Register as Company</span>
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </div>
        </motion.button>

      </div>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12 text-slate-500 font-medium z-10">
        Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Sign In here</Link>
      </motion.div>
      
    </div>
  );
}
