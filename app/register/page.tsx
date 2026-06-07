"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Linkedin, Github, FileText, ArrowRight, CheckCircle, Shield, FileBadge, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://placify-backend-dzj7.onrender.com';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    headline: '',
    summary: '',
    location: '',
    skills: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    expectedSalary: '',
    noticePeriod: '',
    consent: false
  });

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      
      const res = await fetch(`${API_URL}/api/resume/parse-public`, {
        method: 'POST',
        body: formDataObj
      });
      
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Failed to parse resume'); }
      
      const data = await res.json();
      if (data.status === 'success' && data.extracted_data) {
        setFormData(prev => ({
          ...prev,
          fullName: data.extracted_data.fullName || prev.fullName,
          email: data.extracted_data.email || prev.email,
          headline: data.extracted_data.headline || prev.headline,
          skills: data.extracted_data.skills || prev.skills,
          location: data.extracted_data.location || prev.location
        }));
      }
      
      toast('success', 'Resume parsed successfully');
      setStep(2);
    } catch (err: any) {
      toast('error', 'Upload Error', err.message);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSocialLogin = (provider: string) => {
    toast('info', `${provider} Integration`, `${provider} OAuth is currently being configured in the Supabase Dashboard. Please use Email/Password or Resume upload for now.`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      toast('error' , 'Error', 'You must agree to verification consent');
      return;
    }

    try {
      // 1. Register Auth
        if (formData.password !== formData.confirmPassword) {
          toast('error', 'Error', 'Passwords do not match');
          return;
        }

        // 1. Register with Supabase Native Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              role: 'candidate'
            }
          }
        });
  
        if (authError) {
          throw new Error(authError.message);
        }
  
        if (!authData.session) {
          toast('info', 'Verification', 'Please check your email to verify your account');
          return;
        }
        
        try {
          await supabase.from('users').upsert({
            id: authData.user!.id,
            email: formData.email,
            name: formData.fullName,
            role: 'candidate'
          });
          
          await supabase.from('candidates').upsert({
            user_id: authData.user!.id,
            headline: formData.headline,
            skills: formData.skills,
            location: formData.location
          });
        } catch (e) {
          console.error('Failed to sync user data', e);
        }

        login(authData.session.access_token, {
          id: authData.user!.id,
          email: formData.email,
          role: 'candidate',
          name: formData.fullName
        });

        // 2. Update Profile
        const token = authData.session.access_token;
      await fetch(`${API_URL}/api/candidates/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          headline: formData.headline,
          summary: formData.summary,
          location: formData.location,
          skills: formData.skills.split(',').map(s => s.trim()),
          linkedin_url: formData.linkedinUrl,
          github_url: formData.githubUrl,
          portfolio_url: formData.portfolioUrl
        })
      });

      toast('success' , 'Success', 'Profile created successfully');
      router.push('/candidate/dashboard');

    } catch (error: any) {
      toast('error' , 'Registration Failed', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <header className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="text-2xl font-bold tracking-tight text-blue-700">PLACIFY</div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Need help?</span>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium">Support</button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 font-serif">Create Your Verified Candidate Profile</h1>
          <p className="text-gray-600">Experience the future of hiring. Our AI parses your history to build a high-trust technical passport in seconds.</p>
        </div>

        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8"
              >
                <div className="space-y-4">
                  <button onClick={() => handleSocialLogin('LinkedIn')} className="w-full flex items-center justify-center gap-3 bg-[#1A56DB] hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium transition-colors shadow-sm">
                    <Linkedin size={20} />
                    Continue with LinkedIn
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleSocialLogin('Google')} className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium transition-colors">
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                      Google
                    </button>
                    <button onClick={() => handleSocialLogin('GitHub')} className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium transition-colors">
                      <Github size={20} />
                      GitHub
                    </button>
                  </div>
                </div>

                <div className="relative py-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-wider">
                    <span className="bg-white px-4 text-gray-400 font-medium">Or Upload Document</span>
                  </div>
                </div>

                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors rounded-xl p-10 text-center cursor-pointer relative"
                >
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${file ? 'z-0 hidden' : 'z-10'}`} />
                  <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <Upload size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Upload Resume</h3>
                  <p className="text-gray-500 text-sm mb-4">Drag and drop your PDF or DOCX file here</p>
                  <p className="text-xs text-gray-400">Maximum size: 10MB</p>
                  
                  {file && (
                    <div className="mt-4 p-3 bg-white border border-blue-100 rounded-lg flex items-center justify-between text-left relative z-20">
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-500" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.preventDefault(); handleUpload(); }}
                        disabled={isUploading}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        {isUploading ? 'Parsing...' : 'Process'}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8"
              >
                <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-800">
                  <CheckCircle className="text-green-600" />
                  <div>
                    <h4 className="font-semibold text-sm">Resume successfully parsed!</h4>
                    <p className="text-xs text-green-700 mt-0.5">Please review and complete your profile below.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                          {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                      <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Professional Headline</label>
                    <input type="text" name="headline" required value={formData.headline} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills (comma separated)</label>
                    <input type="text" name="skills" required value={formData.skills} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>

                  <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="pt-0.5">
                        <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Verification Consent</p>
                        <p className="text-xs text-gray-500 mt-1">I authorize PLACIFY to parse my profile, evaluate my skills via AI, and perform necessary background verifications to establish my Trust Score.</p>
                      </div>
                    </label>
                  </div>

                  <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#1A56DB] hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium transition-colors shadow-sm">
                    Complete Registration <ArrowRight size={18} />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
          <div className="flex items-center gap-1.5"><Lock size={14} /> AES-256 Encrypted</div>
          <div className="flex items-center gap-1.5"><Shield size={14} /> GDPR Compliant</div>
        </div>

        <div className="mt-8 text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 font-medium hover:underline">Sign In</a>
        </div>
      </main>
    </div>
  );
}
