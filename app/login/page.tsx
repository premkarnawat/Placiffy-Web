"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { supabase } from '@/lib/supabase';
import { Linkedin, Github, Mail, Lock } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://placify-backend-dzj7.onrender.com';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSocialLogin = (provider: string) => {
    toast('info', `${provider} Integration`, `${provider} OAuth is currently being configured in the Supabase Dashboard. Please use Email/Password for now.`);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
              const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
  
        if (authError) {
          throw new Error(authError.message);
        }
        
        // Fetch user role from public.users table to know where to route
        const { data: userData } = await supabase.from('users').select('*').eq('id', authData.user.id).single();
        const role = userData?.role || 'candidate';
        const name = userData?.name || 'User';

        login(authData.session.access_token, {
          id: authData.user.id,
          email: authData.user.email || '',
          role: role,
          name: name
        });
        
        toast('success' , 'Welcome back!', 'Login successful');
        const user = { role }; // Local mock for router push
      
      if (user.role === 'admin') router.push('/admin');
      else if (user.role === 'company') router.push('/company/dashboard');
      else router.push('/candidate/dashboard');
      
    } catch (error: any) {
      toast('error' , 'Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <header className="flex items-center px-8 py-6 bg-transparent absolute top-0 w-full z-50">
        <a href="/" className="text-2xl font-bold tracking-tight text-blue-700">PLACIFY</a>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white/20 z-0" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 relative z-10 border border-gray-100"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Enter your credentials to access your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                  placeholder="********"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#1A56DB] hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider"><span className="bg-white px-4 text-gray-400">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => handleSocialLogin('LinkedIn')} className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <Linkedin size={18} className="text-blue-700" /> LinkedIn
            </button>
            <button type="button" onClick={() => handleSocialLogin('GitHub')} className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <Github size={18} /> GitHub
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account? <a href="/register" className="text-blue-600 font-medium hover:underline">Register</a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
