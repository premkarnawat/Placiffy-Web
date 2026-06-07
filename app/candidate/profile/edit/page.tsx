'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  User, Briefcase, GraduationCap, Code, FolderOpen, Award, Link as LinkIcon, 
  Camera, ChevronRight, CheckCircle, Save, Loader2, FileText, MapPin, Calendar, 
  Phone, Mail, Globe, ArrowLeft, Plus, Trash2, Edit2
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

const SECTIONS = [
  { id: 'personal', title: 'Personal Details', icon: User, weight: 10 },
  { id: 'professional', title: 'Professional', icon: Briefcase, weight: 10 },
  { id: 'education', title: 'Education', icon: GraduationCap, weight: 10 },
  { id: 'experience', title: 'Experience', icon: Briefcase, weight: 15 },
  { id: 'skills', title: 'Skills', icon: Code, weight: 10 },
  { id: 'projects', title: 'Projects', icon: FolderOpen, weight: 10 },
  { id: 'certifications', title: 'Certifications', icon: Award, weight: 5 },
  { id: 'portfolio', title: 'Portfolio & Links', icon: LinkIcon, weight: 10 },
];

export default function ProfileBuilder() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    personal: { fullName: '', gender: '', birthdate: '', phone: '', email: '', current_location: '', permanent_address: '', nationality: '', work_authorization: '' },
    professional: { industry: 'Software Engineering', current_designation: '', current_company: '', experience_years: '', expected_salary: '', notice_period: '', preferred_work_mode: [], preferred_employment_type: [], willing_to_relocate: false },
    portfolio: { github: '', linkedin: '', portfolio: '', behance: '', dribbble: '', leetcode: '', hackerRank: '', kaggle: '' },
    skills: '',
  });

  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (user) fetchProfileData();
  }, [user, authLoading]);

  const fetchProfileData = async () => {
    try {
      const { data: candidate, error } = await supabase.from('candidates').select('*').eq('user_id', user?.id).single();
      const { data: usr } = await supabase.from('users').select('*').eq('id', user?.id).single();
      
      if (candidate) {
        setFormData({
          personal: {
            fullName: usr?.name || '',
            email: usr?.email || '',
            gender: candidate.gender || '',
            birthdate: candidate.birthdate || '',
            phone: candidate.phone || '',
            current_location: candidate.location || candidate.current_location || '',
            permanent_address: candidate.permanent_address || '',
            nationality: candidate.nationality || '',
            work_authorization: candidate.work_authorization || ''
          },
          professional: {
            industry: candidate.industry || 'Software Engineering',
            current_designation: candidate.current_role || '',
            current_company: candidate.current_company || '',
            experience_years: candidate.experience_years?.toString() || '',
            expected_salary: candidate.expected_salary_min?.toString() || '',
            notice_period: candidate.notice_period_days?.toString() || '',
            preferred_work_mode: candidate.preferred_work_mode || [],
            preferred_employment_type: candidate.preferred_employment_type || [],
            willing_to_relocate: candidate.willing_to_relocate || false
          },
          portfolio: candidate.portfolio_links || { github: candidate.github_url || '', linkedin: candidate.linkedin_url || '', portfolio: candidate.portfolio_url || '' },
          skills: candidate.skills || '',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  };

  const calculateCompletion = () => {
    let score = 0;
    if (formData.personal.fullName && formData.personal.phone) score += 10;
    if (formData.professional.industry) score += 10;
    if (formData.skills.length > 5) score += 10;
    if (formData.portfolio.linkedin) score += 10;
    // Add logic for real arrays when built
    return score + 20; // Base Resume Uploaded + Verification 
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Update public.candidates
      const { error } = await supabase.from('candidates').upsert({
        user_id: user?.id,
        gender: formData.personal.gender,
        birthdate: formData.personal.birthdate,
        phone: formData.personal.phone,
        location: formData.personal.current_location,
        current_location: formData.personal.current_location,
        permanent_address: formData.personal.permanent_address,
        nationality: formData.personal.nationality,
        work_authorization: formData.personal.work_authorization,
        industry: formData.professional.industry,
        current_role: formData.professional.current_designation,
        current_company: formData.professional.current_company,
        experience_years: parseFloat(formData.professional.experience_years) || null,
        expected_salary_min: parseFloat(formData.professional.expected_salary) || null,
        notice_period_days: parseInt(formData.professional.notice_period) || null,
        willing_to_relocate: formData.professional.willing_to_relocate,
        skills: formData.skills,
        portfolio_links: formData.portfolio,
        github_url: formData.portfolio.github,
        linkedin_url: formData.portfolio.linkedin,
        portfolio_url: formData.portfolio.portfolio,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

      if (error) throw error;
      toast('success', 'Profile Updated', 'Your profile details have been successfully saved.');
    } catch (error: any) {
      toast('error', 'Update Failed', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching || authLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={() => router.push('/candidate/profile')} className="flex items-center text-gray-500 hover:text-gray-900 mb-2 transition-colors text-sm">
            <ArrowLeft size={16} className="mr-1" /> Back to Passport
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-500 mt-1">Enhance your profile to unlock job applications and boost your trust score.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-gray-500">Profile Strength</div>
            <div className="text-lg font-bold text-blue-600">{calculateCompletion()}%</div>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm disabled:opacity-70"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sticky top-24">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                  {section.title}
                  {isActive && <ChevronRight size={16} className="ml-auto text-blue-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[600px]">
          <AnimatePresence mode="wait">
            
            {activeSection === 'personal' && (
              <motion.div key="personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><User className="text-blue-600"/> Personal Details</h2>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                      <Camera size={24} className="text-gray-400" />
                    </div>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Upload Photo</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input type="text" value={formData.personal.fullName} onChange={(e) => setFormData({...formData, personal: {...formData.personal, fullName: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input type="email" disabled value={formData.personal.email} className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                    <input type="tel" value={formData.personal.phone} onChange={(e) => setFormData({...formData, personal: {...formData.personal, phone: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                    <input type="date" value={formData.personal.birthdate} onChange={(e) => setFormData({...formData, personal: {...formData.personal, birthdate: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Location (City, State, Country)</label>
                    <input type="text" value={formData.personal.current_location} onChange={(e) => setFormData({...formData, personal: {...formData.personal, current_location: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'professional' && (
              <motion.div key="professional" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Briefcase className="text-blue-600"/> Professional Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry / Domain *</label>
                    <select value={formData.professional.industry} onChange={(e) => setFormData({...formData, professional: {...formData.professional, industry: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Data Science & Analytics">Data Science & Analytics</option>
                      <option value="Product Management">Product Management</option>
                      <option value="DevOps & Cloud">DevOps & Cloud</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Experience (Years)</label>
                    <input type="number" step="0.1" value={formData.professional.experience_years} onChange={(e) => setFormData({...formData, professional: {...formData.professional, experience_years: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Designation</label>
                    <input type="text" value={formData.professional.current_designation} onChange={(e) => setFormData({...formData, professional: {...formData.professional, current_designation: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Company</label>
                    <input type="text" value={formData.professional.current_company} onChange={(e) => setFormData({...formData, professional: {...formData.professional, current_company: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Notice Period (Days)</label>
                    <input type="number" value={formData.professional.notice_period} onChange={(e) => setFormData({...formData, professional: {...formData.professional, notice_period: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'portfolio' && (
              <motion.div key="portfolio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><LinkIcon className="text-blue-600"/> Portfolio & Links</h2>
                  <p className="text-sm text-gray-500 mt-1">Dynamic fields based on your selected industry: <span className="font-semibold text-blue-600">{formData.professional.industry}</span></p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn URL *</label>
                    <input type="url" value={formData.portfolio.linkedin} onChange={(e) => setFormData({...formData, portfolio: {...formData.portfolio, linkedin: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://linkedin.com/in/username" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Personal Website / Portfolio</label>
                    <input type="url" value={formData.portfolio.portfolio} onChange={(e) => setFormData({...formData, portfolio: {...formData.portfolio, portfolio: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://yourwebsite.com" />
                  </div>
                  
                  {/* Dynamic Fields based on Industry */}
                  {['Software Engineering', 'Data Science & Analytics', 'DevOps & Cloud'].includes(formData.professional.industry) && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">GitHub URL</label>
                        <input type="url" value={formData.portfolio.github} onChange={(e) => setFormData({...formData, portfolio: {...formData.portfolio, github: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://github.com/username" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">LeetCode / HackerRank URL</label>
                        <input type="url" value={formData.portfolio.leetcode} onChange={(e) => setFormData({...formData, portfolio: {...formData.portfolio, leetcode: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://leetcode.com/username" />
                      </div>
                    </>
                  )}

                  {formData.professional.industry === 'UI/UX Design' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Behance URL</label>
                        <input type="url" value={formData.portfolio.behance} onChange={(e) => setFormData({...formData, portfolio: {...formData.portfolio, behance: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://behance.net/username" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Dribbble URL</label>
                        <input type="url" value={formData.portfolio.dribbble} onChange={(e) => setFormData({...formData, portfolio: {...formData.portfolio, dribbble: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://dribbble.com/username" />
                      </div>
                    </>
                  )}

                  {formData.professional.industry === 'Data Science & Analytics' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Kaggle URL</label>
                      <input type="url" value={formData.portfolio.kaggle} onChange={(e) => setFormData({...formData, portfolio: {...formData.portfolio, kaggle: e.target.value}})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://kaggle.com/username" />
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Other sections like Skills, Education, Experience placeholders */}
            {['skills', 'education', 'experience', 'projects', 'certifications'].includes(activeSection) && (
              <motion.div key="other" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <FileText className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Build {SECTIONS.find(s => s.id === activeSection)?.title}</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">You can add your {activeSection} details here. These will be automatically populated from your resume if you upload one.</p>
                <button className="bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2">
                  <Plus size={18} /> Add New Entry
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
