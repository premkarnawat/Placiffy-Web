import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      if (data?.user?.user_metadata?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Unauthorized. Admin access only.');
      }
      
      toast('success', 'Authentication Successful', 'Welcome to the Command Center.');
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast('error', 'Authentication Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-bl-full -z-10"></div>
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Command Center</h1>
            <p className="text-slate-400 mt-2 text-sm font-medium">Placify Authorized Personnel Only</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl outline-none transition-all" 
                    placeholder="admin@placify.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Master Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl outline-none transition-all" 
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <span className="text-xs font-bold text-blue-600 cursor-pointer hover:text-blue-700">Need help?</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Shield size={18}/> Authorize <ArrowRight size={18}/></>}
              </button>
            </form>
          </div>
          <div className="bg-gray-50 border-t border-gray-100 p-4 text-center">
             <Link href="/" className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1.5"><ArrowRight size={14} className="rotate-180"/> Return to Public Site</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
