"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Building2, UploadCloud, ChevronRight, Loader2, Globe, MapPin, Briefcase, Mail, Phone, User, FileText, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompanyRegistration() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  
  const [formData, setFormData] = useState({
    name: '',
    official_email: '',
    password: '',
    website: '',
    industry: 'Technology',
    size: '1-10',
    hq_location: '',
    linkedin_url: '',
    gst: '',
    contact_name: '',
    designation: '',
    country_code: '+91',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fileName = `logo_${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("company_logos").upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from("company_logos").getPublicUrl(fileName);
      setLogoUrl(data.publicUrl);
      toast("success", "Logo Uploaded", "Your company logo is set.");
    } catch (err: any) {
      toast("error", "Upload Failed", err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) return setStep(2);
    
    setLoading(true);
    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.official_email,
        password: formData.password,
        options: {
          data: {
            user_type: 'company'
          }
        }
      });
      
      if (authError) {
        if (authError.message.includes("already registered")) {
           throw new Error("This email is already registered. Please login.");
        }
        throw authError;
      }
      
      // Wait for session to be established
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token || authData?.session?.access_token;
      
      if (!token) throw new Error("Authentication failed. No token received.");
      
      // Save token locally just in case
      localStorage.setItem("token", token);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://placify-backend-dzj7.onrender.com";
      
      // Format phone number
      const fullPhone = `${formData.country_code} ${formData.phone}`;
      
      const payload = { 
        ...formData, 
        phone: fullPhone,
        logo_url: logoUrl 
      };

      const res = await fetch(`${API_URL}/api/company/onboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to onboard company");
      }

      toast("success", "Company Registered", "Your workspace has been successfully created.");
      router.push("/company/dashboard");
      
    } catch (err: any) {
      toast("error", "Registration Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Create Company Workspace</h2>
        <p className="mt-2 text-sm text-slate-600">Start sourcing verified talent in minutes.</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl shadow-indigo-900/5 sm:rounded-3xl sm:px-10 border border-slate-100 overflow-hidden relative">
          
          <div className="flex items-center justify-between mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>1</div>
            <div className={`flex-1 h-1 mx-2 rounded-full ${step === 2 ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b">Company Identity</h3>
                  
                  <div className="flex flex-col items-center mb-6">
                    <label className="relative cursor-pointer group">
                      <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400 transition-colors">
                        {logoUrl ? <img src={logoUrl} className="w-full h-full object-cover" /> : <UploadCloud className="text-slate-400 group-hover:text-indigo-500" size={32} />}
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                    <span className="text-xs font-semibold text-slate-500 mt-2">Upload Logo</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1"><Building2 size={14}/> Company Name</label>
                      <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 py-2.5 px-4 bg-slate-50" placeholder="Acme Corp" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1"><Mail size={14}/> Official Email</label>
                      <input required type="email" name="official_email" value={formData.official_email} onChange={handleChange} className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 py-2.5 px-4 bg-slate-50" placeholder="hr@acme.com" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1"><Lock size={14}/> Password</label>
                      <input required type="password" name="password" minLength={6} value={formData.password} onChange={handleChange} className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 py-2.5 px-4 bg-slate-50" placeholder="••••••••" />
                      <span className="text-xs text-slate-500 mt-1">Must be at least 6 characters</span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1"><Globe size={14}/> Website</label>
                      <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 py-2.5 px-4 bg-slate-50" placeholder="https://acme.com" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1"><Briefcase size={14}/> Industry</label>
                      <select name="industry" value={formData.industry} onChange={handleChange} className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 py-2.5 px-4 bg-slate-50">
                        <option>Technology</option><option>Finance</option><option>Healthcare</option><option>Retail</option>
                      </select>
                    </div>
                  </div>
                  
                  <button type="submit" className="w-full mt-6 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2">
                    Next Step <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b">Contact & Location</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1"><MapPin size={14}/> Headquarters</label>
                      <input required type="text" name="hq_location" value={formData.hq_location} onChange={handleChange} className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 py-2.5 px-4 bg-slate-50" placeholder="San Francisco, CA" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1"><User size={14}/> Contact Person</label>
                      <input required type="text" name="contact_name" value={formData.contact_name} onChange={handleChange} className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 py-2.5 px-4 bg-slate-50" placeholder="John Doe" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1"><Briefcase size={14}/> Designation</label>
                      <input required type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 py-2.5 px-4 bg-slate-50" placeholder="HR Manager" />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1"><Phone size={14}/> Phone Number</label>
                      <div className="flex gap-2">
                        <input required type="text" name="country_code" value={formData.country_code} onChange={handleChange} className="w-24 rounded-xl border-slate-200 focus:ring-indigo-500 py-2.5 px-4 bg-slate-50 font-medium" placeholder="+91" />
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="flex-1 rounded-xl border-slate-200 focus:ring-indigo-500 py-2.5 px-4 bg-slate-50" placeholder="9876543210" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1"><FileText size={14}/> GST (Optional)</label>
                      <input type="text" name="gst" value={formData.gst} onChange={handleChange} className="w-full rounded-xl border-slate-200 focus:ring-indigo-500 py-2.5 px-4 bg-slate-50" />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="w-1/3 py-3 rounded-xl font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors">Back</button>
                    <button type="submit" disabled={loading} className="w-2/3 flex justify-center items-center py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md">
                      {loading ? <Loader2 className="animate-spin" size={20} /> : "Complete Registration"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}
