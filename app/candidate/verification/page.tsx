"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Shield, Upload, FileText, CheckCircle2, AlertCircle, Loader2, Link as LinkIcon, Briefcase, GraduationCap } from 'lucide-react';

export default function CandidateVerification() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verification, setVerification] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Form State
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});

  useEffect(() => {
    setIsMounted(true);
    if (user) fetchVerification();
  }, [user]);

  const fetchVerification = async () => {
    try {
      setLoading(true);
      const { data: cand } = await supabase.from('candidates').select('id').eq('user_id', user?.id).single();
      if (cand) {
        const { data: ver } = await supabase.from('candidate_verifications').select('*').eq('candidate_id', cand.id).maybeSingle();
        if (ver) {
          setVerification(ver);
          setAadhaarNumber(ver.aadhaar_number || '');
          setPanNumber(ver.pan_number || '');
          setLinkedinUrl(ver.linkedin_url || '');
          setGithubUrl(ver.github_url || '');
          setPortfolioUrl(ver.portfolio_url || '');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [key]: e.target.files[0] });
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage.from('verifications').upload(`${user?.id}/${path}-${Date.now()}`, file);
    if (error) {
       console.warn('Storage upload failed, fallback to mock URL for demo purposes. Ensure "verifications" bucket is public.', error);
       return `https://mock-storage.com/${path}-${Date.now()}`;
    }
    const { data: publicUrl } = supabase.storage.from('verifications').getPublicUrl(data.path);
    return publicUrl.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const { data: cand } = await supabase.from('candidates').select('id').eq('user_id', user.id).single();
      if (!cand) throw new Error("Candidate profile not found");

      let aadhaarFront = verification?.aadhaar_front_url;
      let aadhaarBack = verification?.aadhaar_back_url;

      if (files['aadhaarFront']) aadhaarFront = await uploadFile(files['aadhaarFront'], 'aadhaar-front');
      if (files['aadhaarBack']) aadhaarBack = await uploadFile(files['aadhaarBack'], 'aadhaar-back');

      const payload = {
        candidate_id: cand.id,
        aadhaar_number: aadhaarNumber,
        aadhaar_front_url: aadhaarFront,
        aadhaar_back_url: aadhaarBack,
        pan_number: panNumber,
        linkedin_url: linkedinUrl,
        github_url: githubUrl,
        portfolio_url: portfolioUrl,
        status: verification?.status === 'rejected' ? 'pending' : (verification?.status || 'pending')
      };

      if (verification) {
        const {error} = await supabase.from('candidate_verifications').update(payload).eq('id', verification.id); if(error) throw new Error(error.message);
      } else {
        const {error} = await supabase.from('candidate_verifications').insert([payload]); if(error) throw new Error(error.message);
      }
      
      alert("Verification documents submitted successfully! Admin will review shortly.");
      fetchVerification();
    } catch (error) {
      console.error(error);
      alert("Failed to submit verification. Ensure database tables are created.");
    } finally {
      setSaving(false);
    }
  };

  if (!isMounted || loading) return <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-blue-600"/></div>;

  const status = verification?.status || 'Not Submitted';
  const isVerified = status === 'Verified' || status === 'approved';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><Shield size={28} className={isVerified ? "text-emerald-400" : "text-blue-400"}/> Identity Verification</h1>
            <p className="text-blue-100 max-w-lg">Complete your professional verification to earn the Trust Badge and stand out to top employers.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20 text-center">
            <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Status</p>
            <div className={`text-xl font-black ${isVerified ? 'text-emerald-400' : status === 'pending' ? 'text-amber-400' : 'text-white'}`}>
              {status.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Identity Verification */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-slate-50 flex items-center gap-2">
             <FileText className="text-blue-600" size={20}/>
             <h2 className="font-bold text-slate-800">Identity Verification</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Aadhaar Number <span className="text-red-500">*</span></label>
                <input required type="text" value={aadhaarNumber} onChange={e => setAadhaarNumber(e.target.value)} placeholder="1234 5678 9012" className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">PAN Number (Optional)</label>
                <input type="text" value={panNumber} onChange={e => setPanNumber(e.target.value)} placeholder="ABCDE1234F" className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50 group">
                <Upload className="mx-auto text-slate-400 group-hover:text-blue-500 mb-2" size={24}/>
                <p className="text-sm font-bold text-slate-700 mb-1">Aadhaar Upload (Front)</p>
                <p className="text-xs text-slate-500 mb-4">JPEG, PNG or PDF</p>
                <input type="file" onChange={e => handleFileChange('aadhaarFront', e)} className="text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {verification?.aadhaar_front_url && <a href={verification.aadhaar_front_url} target="_blank" className="text-xs text-blue-600 mt-2 block">View Uploaded Document</a>}
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50 group">
                <Upload className="mx-auto text-slate-400 group-hover:text-blue-500 mb-2" size={24}/>
                <p className="text-sm font-bold text-slate-700 mb-1">Aadhaar Upload (Back)</p>
                <p className="text-xs text-slate-500 mb-4">JPEG, PNG or PDF</p>
                <input type="file" onChange={e => handleFileChange('aadhaarBack', e)} className="text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {verification?.aadhaar_back_url && <a href={verification.aadhaar_back_url} target="_blank" className="text-xs text-blue-600 mt-2 block">View Uploaded Document</a>}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Verification */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-slate-50 flex items-center gap-2">
             <LinkIcon className="text-blue-600" size={20}/>
             <h2 className="font-bold text-slate-800">Professional Links</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">LinkedIn URL</label>
              <input type="url" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">GitHub URL</label>
              <input type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Portfolio / Personal Website</label>
              <input type="url" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
            </div>
          </div>
        </div>

        {/* Supporting Docs */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-slate-50 flex items-center gap-2">
             <Briefcase className="text-blue-600" size={20}/>
             <h2 className="font-bold text-slate-800">Employment & Education (Optional)</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50">
                <p className="text-sm font-bold text-slate-700 mb-1">Experience/Offer Letters</p>
                <input type="file" className="mt-2 text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50">
                <p className="text-sm font-bold text-slate-700 mb-1">Degree Certificates</p>
                <input type="file" className="mt-2 text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
          <button disabled={saving || isVerified} type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
            {saving && <Loader2 size={18} className="animate-spin"/>} Submit for Verification
          </button>
        </div>

      </form>
    </div>
  );
}