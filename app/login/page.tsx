"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, UserCircle, Shield, Loader2, Lock, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'candidate' | 'company' | 'admin'>('candidate');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
      });

      if (error) throw error;
      if (!data.user) throw new Error("No user returned from Supabase");

      // Verify role natively
      let actualRole = 'candidate';
      
      const { data: company } = await supabase.from('companies').select('id').eq('user_id', data.user.id).maybeSingle();
      if (company) {
          actualRole = 'company';
      } else if (data.user.email === 'admin@placify.com' || data.user.user_metadata?.role === 'admin') {
          actualRole = 'admin';
      }

      if (actualRole !== role) {
          toast("info", "Role Redirect", `You logged in with a ${actualRole} account. Redirecting to your dashboard...`);
      } else {
          toast("success", "Login Successful", "Welcome back!");
      }

      localStorage.setItem("userRole", actualRole);

      if (actualRole === 'admin') router.push('/admin/dashboard');
      else if (actualRole === 'company') router.push('/company/dashboard');
      else router.push('/candidate/dashboard');

    } catch (err: any) {
      toast("error", "Login Failed", err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <Building2 className="text-white" size={24} />
          </div>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">PLACIFY</span>
        </Link>
        <h2 className="text-3xl font-bold text-slate-900">Sign in to your account</h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8 z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl px-6 sm:px-10 border border-white/40">
          
          <div className="flex flex-col sm:flex-row bg-slate-100 p-1 rounded-xl mb-8 gap-1 sm:gap-0">
            <button type="button" onClick={() => setRole('candidate')} className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${role === 'candidate' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <UserCircle size={18} /> Candidate
            </button>
            <button type="button" onClick={() => setRole('company')} className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${role === 'company' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Building2 size={18} /> Company
            </button>
            <button type="button" onClick={() => setRole('admin')} className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${role === 'admin' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Shield size={18} /> Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1"><Mail size={14}/> Email Address</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="block w-full rounded-xl border-slate-200 focus:ring-blue-500 py-3 px-4 bg-slate-50" placeholder="you@example.com" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1"><Lock size={14}/> Password</label>
              <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="block w-full rounded-xl border-slate-200 focus:ring-blue-500 py-3 px-4 bg-slate-50" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading} className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl font-bold text-white transition-colors shadow-md ${role === 'company' ? 'bg-indigo-600 hover:bg-indigo-700' : role === 'admin' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-slate-500">
            Don't have an account? <Link href="/register" className="text-blue-600 font-bold hover:underline">Get Started</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
