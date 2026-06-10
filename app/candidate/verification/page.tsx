'use client';
import React, { useEffect, useState } from 'react';
import { Shield, Mail, Phone, GraduationCap, Briefcase, FileCheck, ExternalLink, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function VerificationPage() {
  const [cand, setCand] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('candidates').select('*, candidate_profiles(*)').eq('user_id', user.id).single();
      setCand(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;

  const CompletionBadge = ({ isComplete }: { isComplete: boolean }) => (
    isComplete 
      ? <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full"><CheckCircle2 size={14} /> VERIFIED</div>
      : <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full"><AlertCircle size={14} /> PENDING</div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Verification Hub</h1>
        <p className="text-gray-500 mt-1">Manage your credentials and unlock higher trust tiers for premium jobs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Contact Verifications */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <Shield className="text-blue-500" size={20} />
            <h2 className="font-bold text-gray-900">Identity & Contact</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600"><Mail size={20} /></div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Email Address</p>
                  <p className="text-xs text-gray-500">{cand?.user_id ? 'Authenticated via Supabase' : 'Pending'}</p>
                </div>
              </div>
              <CompletionBadge isComplete={!!cand?.user_id} />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600"><Phone size={20} /></div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Mobile Number</p>
                  <p className="text-xs text-gray-500">{cand?.candidate_profiles?.[0]?.mobile_number || 'Link your phone number'}</p>
                </div>
              </div>
              <CompletionBadge isComplete={!!cand?.candidate_profiles?.[0]?.mobile_number} />
            </div>
          </div>
        </div>

        {/* Professional Verifications */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <FileCheck className="text-emerald-500" size={20} />
            <h2 className="font-bold text-gray-900">Professional Credentials</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-6 flex items-center justify-between opacity-75">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600"><GraduationCap size={20} /></div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Degree Verification</p>
                  <p className="text-xs text-gray-500">Requires University DigiLocker</p>
                </div>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">Connect <ExternalLink size={12}/></button>
            </div>
            <div className="p-6 flex items-center justify-between opacity-75">
              <div className="flex items-center gap-4">
                <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600"><Briefcase size={20} /></div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Employment History</p>
                  <p className="text-xs text-gray-500">Requires EPFO / UAN Link</p>
                </div>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">Connect <ExternalLink size={12}/></button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
