# -*- coding: utf-8 -*-
import os

os.makedirs(r"app\register", exist_ok=True)

register_code = """'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, UserCircle, ArrowRight } from 'lucide-react';

export default function RegisterSplitter() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[100px] opacity-60" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 max-w-2xl w-full"
      >
        <Link href="/" className="inline-block mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0052CC] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-[#0052CC]">Placify.</span>
          </div>
        </Link>

        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
          Join Placify Today
        </h1>
        <p className="text-lg text-zinc-500 mb-12">
          Are you looking to hire top talent, or are you looking for your next big opportunity?
        </p>

        <div className="grid md:grid-cols-2 gap-6 text-left">
          {/* Candidate Card */}
          <Link href="/candidate/register">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200 hover:border-[#0052CC] hover:shadow-md transition-all cursor-pointer h-full flex flex-col group"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-[#0052CC] group-hover:bg-[#0052CC] group-hover:text-white transition-colors">
                <UserCircle size={28} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">I'm a Candidate</h2>
              <p className="text-zinc-500 mb-8 flex-grow">
                Create your AI-powered profile, generate your passport, and let top companies find you.
              </p>
              <div className="flex items-center text-[#0052CC] font-semibold text-sm">
                Apply for Jobs <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>

          {/* Company Card */}
          <Link href="/company/register">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer h-full flex flex-col group"
            >
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Building2 size={28} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">I'm a Company</h2>
              <p className="text-zinc-500 mb-8 flex-grow">
                Post jobs, use our pgvector ATS engine to instantly source verified talent, and manage interviews.
              </p>
              <div className="flex items-center text-emerald-600 font-semibold text-sm">
                Hire Talent <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>
        </div>
        
        <div className="mt-12 text-zinc-500 text-sm">
          Already have an account? <Link href="/login" className="text-[#0052CC] font-semibold hover:underline">Log in</Link>
        </div>
      </motion.div>
    </div>
  );
}
"""

with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(register_code)

print("Unified Registration Splitter created!")
