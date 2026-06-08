"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Building2, UploadCloud, ChevronRight, Loader2, Globe, MapPin, Briefcase, Mail, Phone, User, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { motion } from 'framer-motion';

export default function CompanyRegistration() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  
  const [formData, setFormData] = useState({
    name: '',
    official_email: '',
    website: '',
    industry: 'Technology',
    size: '1-10',
    hq_location: '',
    linkedin_url: '',
    gst: '',
    contact_name: '',
    designation: '',
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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://placify-backend-dzj7.onrender.com";
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required. Please login first.");

      const payload = { ...formData, logo_url: logoUrl };
      
      const res = await fetch(`${API_URL}/api/company/onboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Registration failed");
      }
      
      toast("success", "Company Registered", "Welcome to Placify Hiring OS!");
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
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="text-white" size={24} />
          </div>
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">PLACIFY</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Create Your Workspace</h2>
        <p className="mt-2 text-sm text-gray-600">Start hiring verified talent faster.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-2xl"
      >
        <div className="bg-white py-8 px-4 shadow-xl shadow-blue-900/5 sm:rounded-3xl sm:px-10 border border-slate-100">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
            <div className="w-4"></div>
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex justify-center mb-8">
                  <label className="relative cursor-pointer group">
                    <div className={`w-28 h-28 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-colors ${logoUrl ? 'border-blue-500 bg-white' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400'}`}>
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain rounded-full p-2" />
                      ) : (
                        <>
                          <UploadCloud className="text-slate-400 group-hover:text-blue-500 mb-1" size={28} />
                          <span className="text-xs text-slate-500 font-medium text-center px-2">Upload<br/>Logo</span>
                        </>
                      )}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Building2 className="text-slate-400" size={18}/></div>
                      <input required type="text" name="name" value={formData.name} onChange={handleChange} className="pl-10 block w-full rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4 bg-slate-50" placeholder="e.g. Acme Corp" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Official Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="text-slate-400" size={18}/></div>
                      <input required type="email" name="official_email" value={formData.official_email} onChange={handleChange} className="pl-10 block w-full rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4 bg-slate-50" placeholder="hr@acme.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Website</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Globe className="text-slate-400" size={18}/></div>
                      <input type="url" name="website" value={formData.website} onChange={handleChange} className="pl-10 block w-full rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4 bg-slate-50" placeholder="https://acme.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Industry</label>
                    <select name="industry" value={formData.industry} onChange={handleChange} className="block w-full rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4 bg-slate-50">
                      <option>Technology</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                      <option>Retail</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Company Size</label>
                    <select name="size" value={formData.size} onChange={handleChange} className="block w-full rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4 bg-slate-50">
                      <option>1-10</option>
                      <option>11-50</option>
                      <option>51-200</option>
                      <option>201-500</option>
                      <option>500+</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-8">
                  Continue to Contact Details <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Headquarters Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="text-slate-400" size={18}/></div>
                      <input required type="text" name="hq_location" value={formData.hq_location} onChange={handleChange} className="pl-10 block w-full rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4 bg-slate-50" placeholder="San Francisco, CA" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Person Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="text-slate-400" size={18}/></div>
                      <input required type="text" name="contact_name" value={formData.contact_name} onChange={handleChange} className="pl-10 block w-full rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4 bg-slate-50" placeholder="Jane Doe" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Designation</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Briefcase className="text-slate-400" size={18}/></div>
                      <input required type="text" name="designation" value={formData.designation} onChange={handleChange} className="pl-10 block w-full rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4 bg-slate-50" placeholder="Head of Talent" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="text-slate-400" size={18}/></div>
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="pl-10 block w-full rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4 bg-slate-50" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">GST / Tax ID (Optional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FileText className="text-slate-400" size={18}/></div>
                      <input type="text" name="gst" value={formData.gst} onChange={handleChange} className="pl-10 block w-full rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4 bg-slate-50" placeholder="GSTIN..." />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={() => setStep(1)} className="w-1/3 flex justify-center py-3.5 px-4 border border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                    Back
                  </button>
                  <button type="submit" disabled={loading} className="w-2/3 flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                    {loading ? 'Creating Workspace...' : 'Complete Registration'}
                  </button>
                </div>
              </motion.div>
            )}

          </form>
        </div>
      </motion.div>
    </div>
  );
}
