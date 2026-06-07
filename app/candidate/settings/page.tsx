'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Shield, Lock, Bell, Database, Save, CheckCircle, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [consents, setConsents] = useState<any>({
    data_processing_consent: true, resume_parsing_consent: true, verification_consent: false,
    ai_analysis_consent: false, passport_consent: false, communication_consent: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      supabase.from('candidate_consents').select('*').eq('candidate_id', user.id).single().then(({data}) => {
        if (data) setConsents(data);
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: check } = await supabase.from('candidate_consents').select('id').eq('candidate_id', user?.id);
      if (check && check.length > 0) {
        await supabase.from('candidate_consents').update(consents).eq('candidate_id', user?.id);
      } else {
        await supabase.from('candidate_consents').insert({ ...consents, candidate_id: user?.id });
      }
      toast('success', 'Preferences Saved', 'Consent preferences updated securely.');
    } catch (e:any) {
      toast('error', 'Error', e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const Toggle = ({ label, desc, checked, onChange }: any) => (
    <div className="flex items-start justify-between p-4 border border-gray-100 rounded-2xl mb-3 bg-gray-50/50">
      <div>
        <h4 className="font-bold text-gray-900 text-sm">{label}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4 mt-1">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Settings className="text-blue-600"/> Settings & Consents</h1>
        <p className="text-gray-500 mt-1">Manage your privacy, security, and data usage preferences.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <Database className="text-blue-500"/>
          <h2 className="text-xl font-bold text-gray-900">Data Governance & AI Consent</h2>
        </div>

        <div className="space-y-4">
          <Toggle 
            label="Resume AI Parsing" 
            desc="Allow Placify Llama-3 AI models to parse your uploaded resume to build your profile." 
            checked={consents.resume_parsing_consent} 
            onChange={(v:boolean) => setConsents({...consents, resume_parsing_consent: v})} 
          />
          <Toggle 
            label="AI Vector Matching (ATS)" 
            desc="Allow generating a pgvector embedding of your profile for automated job matching." 
            checked={consents.ai_analysis_consent} 
            onChange={(v:boolean) => setConsents({...consents, ai_analysis_consent: v})} 
          />
          <Toggle 
            label="Background Verification" 
            desc="Authorize Placify's expert team to verify your education and employment history." 
            checked={consents.verification_consent} 
            onChange={(v:boolean) => setConsents({...consents, verification_consent: v})} 
          />
          <Toggle 
            label="Candidate Passport Generation" 
            desc="Enable creation of a secure, shareable PDF Passport of your verified credentials." 
            checked={consents.passport_consent} 
            onChange={(v:boolean) => setConsents({...consents, passport_consent: v})} 
          />
        </div>

        <div className="mt-8 flex justify-end">
          <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-sm">
            {isSaving ? 'Saving...' : <><Save size={18}/> Save Preferences</>}
          </button>
        </div>
      </div>
    </div>
  );
}
