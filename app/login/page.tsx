"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('name@company.com');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FC] bg-grid-pattern-light relative overflow-hidden flex flex-col justify-center items-center py-12 px-4 select-none">
      
      {/* Dynamic Blur Orbs matching Image 2 */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[30%] left-[20%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[90px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[460px] bg-white border border-zinc-200/80 rounded-2xl p-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)] z-10"
      >
        {/* Header Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded bg-[#0052CC] flex items-center justify-center shadow-md">
              {/* Minimalist logo geometry */}
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-sans font-black tracking-wider text-xl text-[#001D6E] uppercase">PLACIFY</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">HIRING INTELLIGENCE</span>
        </div>

        {/* Headlines */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-sans text-zinc-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-zinc-450 font-medium mt-1">Sign in to your Hiring OS workspace</p>
        </div>

        {/* Social Auth */}
        <button
          type="button"
          onClick={() => { if (typeof window !== 'undefined') window.location.href = '/dashboard'; }}
          className="w-full flex items-center justify-center gap-2.5 bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 py-3.5 rounded-xl text-xs font-bold text-zinc-700 transition-all duration-300"
        >
          {/* Minimalist Google Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200/80"></div>
          </div>
          <span className="relative bg-white px-4 text-[9px] uppercase font-bold text-zinc-400 tracking-wider">OR CONTINUE WITH EMAIL</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-white border border-zinc-200 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-zinc-800 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Password</label>
              <span className="text-[10px] text-[#0052CC] hover:underline cursor-pointer font-bold">Forgot?</span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-zinc-200 focus:border-blue-500 rounded-xl pl-4 pr-10 py-3 text-xs text-zinc-800 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2 py-1 text-left">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-200 text-[#0052CC] focus:ring-[#0052CC] cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs font-semibold text-zinc-550 select-none cursor-pointer">
              Remember me for 30 days
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0052CC] hover:bg-[#0040A3] text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-xs text-zinc-500 font-semibold text-center mt-6">
          Don't have an account? <span onClick={() => { if (typeof window !== 'undefined') window.location.href = '/login'; }} className="text-[#0052CC] hover:underline cursor-pointer font-bold">Join the Talent Pool</span>
        </p>

      </motion.div>

      {/* Footer */}
      <footer className="text-[10px] text-zinc-400 font-bold tracking-wider uppercase flex gap-4 mt-10 z-10">
        <span className="hover:text-zinc-600 cursor-pointer">Privacy Policy</span>
        <span>•</span>
        <span className="hover:text-zinc-600 cursor-pointer">Terms of Service</span>
        <span>•</span>
        <span className="hover:text-zinc-600 cursor-pointer">Support</span>
      </footer>

    </div>
  );
}
