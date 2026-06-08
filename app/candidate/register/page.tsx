"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { UploadCloud, CheckCircle2, User, Mail, MapPin, Briefcase, FileText, ChevronRight, Loader2, Github, Linkedin, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function CandidateRegistration() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  
  const [authData, setAuthData] = useState({ email: '', password: '' });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    user_id: '',
    headline: '',
    summary: '',
    location: '',
    current_company: '',
    current_role: '',
    skills: '',
    experience_years: 0
  });

  const handleOAuth = async (provider: 'google' | 'github' | 'linkedin_oidc') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/candidate/dashboard` }});
      if (error) throw error;
    } catch (e: any) {
      toast("error", "OAuth Failed", e.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: authData.email,
        password: authData.password,
        options: { data: { user_type: 'candidate' } }
      });
      if (error) throw error;
      
      if (data.user) {
        setFormData(prev => ({ ...prev, user_id: data.user.id }));
        setStep(2);
      }
    } catch (e: any) {
      if (e.message.includes("already registered")) {
        // Try login
        const { data, error } = await supabase.auth.signInWithPassword({ email: authData.email, password: authData.password });
        if (error) {
           toast("error", "Auth Failed", error.message);
        } else if (data.user) {
           setFormData(prev => ({ ...prev, user_id: data.user.id }));
           setStep(2);
        }
      } else {
        toast("error", "Signup Failed", e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
    setParsing(true);
    
    try {
      const body = new FormData();
      body.append("file", file);
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://placify-backend-dzj7.onrender.com";
      // This is a SYNCHRONOUS parse to auto-fill the UI as requested by user
      const res = await fetch(`${API_URL}/api/resume/parse-sync`, { method: "POST", body });
      const { status, parsed_data, detail } = await res.json();
      
      if (!res.ok) throw new Error(detail || "Parsing failed");
      
      // Auto-fill form data from AI JSON extraction
      setFormData(prev => ({
        ...prev,
        headline: parsed_data.experience?.[0]?.title || '',
        current_company: parsed_data.experience?.[0]?.company || '',
        current_role: parsed_data.experience?.[0]?.title || '',
        summary: parsed_data.summary || '',
        skills: (parsed_data.skills || []).join(', '),
        location: parsed_data.contact?.location || ''
      }));
      
      toast("success", "Resume Parsed", "Your details have been successfully extracted.");
      setStep(3); // Move to review step
      
    } catch (err: any) {
      toast("error", "Extraction Failed", err.message);
    } finally {
      setParsing(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Upload Resume to Storage if exists
      let resume_url = "";
      if (resumeFile) {
        const fileName = `${formData.user_id}_${resumeFile.name}`;
        const { error: uploadError } = await supabase.storage.from("resumes").upload(fileName, resumeFile);
        if (!uploadError) {
          const { data } = supabase.storage.from("resumes").getPublicUrl(fileName);
          resume_url = data.publicUrl;
        }
      }

      // 2. Insert into Candidates table
      const { error } = await supabase.from('candidates').upsert({
        user_id: formData.user_id,
        headline: formData.headline,
        summary: formData.summary,
        location: formData.location,
        current_company: formData.current_company,
        current_role: formData.current_role,
        skills: formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        experience_years: Number(formData.experience_years),
        resume_url,
        profile_completion_pct: 100
      });
      
      if (error) throw error;
      
      toast("success", "Profile Created", "Welcome to Placify!");
      router.push("/candidate/dashboard");
      
    } catch (err: any) {
      toast("error", "Registration Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Create Candidate Profile</h2>
        <p className="mt-2 text-sm text-slate-600">Get matched with top companies instantly.</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl shadow-blue-900/5 sm:rounded-3xl sm:px-10 border border-slate-100 overflow-hidden relative">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map(i => (
              <React.Fragment key={i}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {step > i ? <CheckCircle2 size={16} /> : i}
                </div>
                {i < 3 && <div className={`flex-1 h-1 mx-2 rounded-full ${step > i ? 'bg-blue-600' : 'bg-slate-100'}`}></div>}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            
            {/* STEP 1: AUTHENTICATION */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <form onSubmit={handleEmailAuth} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                    <input required type="email" value={authData.email} onChange={e => setAuthData({...authData, email: e.target.value})} className="block w-full rounded-xl border-slate-200 focus:ring-blue-500 py-3 px-4 bg-slate-50" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                    <input required type="password" value={authData.password} onChange={e => setAuthData({...authData, password: e.target.value})} className="block w-full rounded-xl border-slate-200 focus:ring-blue-500 py-3 px-4 bg-slate-50" placeholder="••••••••" minLength={6} />
                  </div>
                  <button type="submit" disabled={loading} className="w-full flex justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Continue with Email"}
                  </button>
                </form>

                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500 font-medium">Or continue with</span></div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <button onClick={() => handleOAuth('google')} className="w-full flex justify-center items-center py-3 border border-slate-200 rounded-xl hover:bg-slate-50"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google"/></button>
                    <button onClick={() => handleOAuth('github')} className="w-full flex justify-center items-center py-3 border border-slate-200 rounded-xl hover:bg-slate-50"><Github className="w-5 h-5 text-slate-900"/></button>
                    <button onClick={() => handleOAuth('linkedin_oidc')} className="w-full flex justify-center items-center py-3 border border-slate-200 rounded-xl hover:bg-slate-50"><Linkedin className="w-5 h-5 text-blue-700"/></button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: RESUME UPLOAD */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="text-center py-8">
                <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <FileText size={32} className="text-blue-600"/>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Your Resume</h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">Our AI will instantly parse your resume to automatically fill out your professional profile.</p>
                
                <label className="relative cursor-pointer group block w-full max-w-sm mx-auto">
                  <div className={`w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${parsing ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400'}`}>
                    {parsing ? (
                      <>
                        <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
                        <span className="text-sm font-bold text-blue-600">AI is extracting your data...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="text-slate-400 group-hover:text-blue-500 mb-2" size={32} />
                        <span className="text-sm font-bold text-slate-700">Click to upload PDF</span>
                        <span className="text-xs text-slate-400 mt-1">Max 5MB</span>
                      </>
                    )}
                  </div>
                  <input type="file" accept=".pdf" className="hidden" disabled={parsing} onChange={handleResumeUpload} />
                </label>

                <button onClick={() => setStep(3)} className="mt-8 text-sm font-bold text-slate-500 hover:text-slate-800 underline">Skip & fill manually</button>
              </motion.div>
            )}

            {/* STEP 3: REVIEW DETAILS */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b">Review & Confirm Profile</h3>
                
                <form onSubmit={handleFinalSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Professional Headline</label>
                      <input required type="text" value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} className="w-full rounded-xl border-slate-200 focus:ring-blue-500 py-2.5 px-4 bg-slate-50" placeholder="Senior Frontend Engineer" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Current Company</label>
                      <input type="text" value={formData.current_company} onChange={e => setFormData({...formData, current_company: e.target.value})} className="w-full rounded-xl border-slate-200 focus:ring-blue-500 py-2.5 px-4 bg-slate-50" placeholder="Google" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Years of Experience</label>
                      <input required type="number" min="0" value={formData.experience_years} onChange={e => setFormData({...formData, experience_years: Number(e.target.value)})} className="w-full rounded-xl border-slate-200 focus:ring-blue-500 py-2.5 px-4 bg-slate-50" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Top Skills (Comma Separated)</label>
                      <input required type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full rounded-xl border-slate-200 focus:ring-blue-500 py-2.5 px-4 bg-slate-50" placeholder="React, Python, AWS" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
                      <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full rounded-xl border-slate-200 focus:ring-blue-500 py-2.5 px-4 bg-slate-50" placeholder="New York, NY" />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Professional Summary</label>
                      <textarea rows={4} value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full rounded-xl border-slate-200 focus:ring-blue-500 py-3 px-4 bg-slate-50" placeholder="Passionate engineer with..." />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setStep(2)} className="w-1/3 py-3 rounded-xl font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors">Back</button>
                    <button type="submit" disabled={loading} className="w-2/3 flex justify-center items-center py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                      {loading ? <Loader2 className="animate-spin" size={20} /> : "Complete Registration"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
