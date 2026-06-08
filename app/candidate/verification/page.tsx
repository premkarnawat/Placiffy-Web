'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, CheckCircle2, Circle, Clock, Lock, ArrowRight, Upload, AlertCircle } from 'lucide-react';

export default function VerificationPage() {
  const { user } = useAuth();
  const [profileScore, setProfileScore] = useState(0);
  const [hasResume, setHasResume] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('unverified');
  
  useEffect(() => {
    if (user) fetchStatus();
  }, [user]);

  const fetchStatus = async () => {
    try {
      const { data: cand } = await supabase.from('candidates').select('profile_completion_pct, resume_url, verification_status').eq('user_id', user?.id).single();
      if (cand) {
        setProfileScore(cand.profile_completion_pct || 0);
        setHasResume(!!cand.resume_url);
        setVerificationStatus(cand.verification_status || 'unverified');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const steps = [
    { id: 1, title: 'Resume Uploaded', status: hasResume ? 'complete' : 'pending', desc: 'Llama-3 parsed your history.' },
    { id: 2, title: 'Profile 100% Complete', status: profileScore === 100 ? 'complete' : (hasResume ? 'current' : 'pending'), desc: `Currently at ${profileScore}%` },
    { id: 3, title: 'Portfolio Review', status: verificationStatus === 'in_progress' ? 'current' : (verificationStatus === 'verified' ? 'complete' : 'locked'), desc: 'Automated GitHub/Behance check.' },
    { id: 4, title: 'Work Sample Analysis', status: 'locked', desc: 'Domain specific automated testing.' },
    { id: 5, title: 'Expert Review', status: 'locked', desc: 'Manual review by a senior professional.' },
    { id: 6, title: 'Verification Complete', status: verificationStatus === 'verified' ? 'complete' : 'locked', desc: 'Trust Score upgraded to RA+.' },
    { id: 7, title: 'Passport Generated', status: verificationStatus === 'verified' ? 'complete' : 'locked', desc: 'Your immutable career identity.' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Journey</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Complete your verification to receive a Placify Passport, unlock premium jobs, and boost your Trust Score.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Pipeline Visual */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ArrowRight className="text-blue-500"/> Your Pipeline</h2>
            
            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-6 md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:to-gray-100">
              {steps.map((step, i) => (
                <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-4">
                  
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${
                    step.status === 'complete' ? 'bg-green-500 text-white' : 
                    step.status === 'current' ? 'bg-blue-500 text-white ring-4 ring-blue-100' : 
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {step.status === 'complete' ? <CheckCircle2 size={20} /> : 
                     step.status === 'current' ? <Clock size={20} /> : 
                     step.status === 'locked' ? <Lock size={18} /> : <Circle size={18} />}
                  </div>

                  {/* Content Box */}
                  <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border ${
                    step.status === 'complete' ? 'bg-green-50/30 border-green-100' :
                    step.status === 'current' ? 'bg-blue-50 border-blue-200 shadow-sm' :
                    'bg-white border-gray-100 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-bold ${step.status === 'current' ? 'text-blue-900' : 'text-gray-900'}`}>{step.title}</h3>
                      {step.status === 'complete' && <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Done</span>}
                      {step.status === 'current' && <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Action Required</span>}
                    </div>
                    <p className="text-sm text-gray-500">{step.desc}</p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-lg sticky top-24">
            <ShieldCheck size={40} className="text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Pending Action</h3>
            
            {profileScore < 100 ? (
              <>
                <p className="text-gray-300 text-sm mb-6">Your profile is currently {profileScore}% complete. You must reach 100% to unlock the Expert Review stage.</p>
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
                    <AlertCircle size={18} className="text-amber-400" />
                    <span className="text-sm font-medium">Missing: Professional Summary</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
                    <AlertCircle size={18} className="text-amber-400" />
                    <span className="text-sm font-medium">Missing: Projects & Portfolio</span>
                  </div>
                </div>
                <button onClick={() => window.location.href='/candidate/profile/edit'} className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-colors">
                  Complete Profile Now
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-300 text-sm mb-6">Your profile is fully complete! You are ready to trigger the Automated Portfolio Review.</p>
                <button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                  <Upload size={18} /> Submit for Review
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
