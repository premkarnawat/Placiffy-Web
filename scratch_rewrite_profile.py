# -*- coding: utf-8 -*-
content = """'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, Briefcase, GraduationCap, Code, FolderGit2, ShieldCheck, Settings, UploadCloud, Loader2, Award, Heart, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

import PersonalForm from '@/components/candidate/profile/PersonalForm';
import ArrayForm from '@/components/candidate/profile/ArrayForm';
import PreferencesForm from '@/components/candidate/profile/PreferencesForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://placify-backend-dzj7.onrender.com';

const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
  { id: 'education', label: 'Education', icon: <GraduationCap size={18} /> },
  { id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
  { id: 'internships', label: 'Internships', icon: <Briefcase size={18} /> },
  { id: 'projects', label: 'Projects', icon: <FolderGit2 size={18} /> },
  { id: 'certifications', label: 'Certifications', icon: <ShieldCheck size={18} /> },
  { id: 'courses', label: 'Courses', icon: <Award size={18} /> },
  { id: 'skills', label: 'Skills', icon: <Code size={18} /> },
  { id: 'preferences', label: 'Preferences', icon: <Heart size={18} /> },
];

export default function ProfileEditor() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState<any>({
    personal: { fullName: '', email: '', phone: '', location: '', headline: '' },
    preferences: { expectedCTC: '', noticePeriodDays: 30, workModel: '', preferredLocations: '' },
    skills: { technical: '', soft: '' },
    education: [],
    experience: [],
    internships: [],
    projects: [],
    certifications: [],
    courses: []
  });

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    setIsFetching(true);
    try {
      const { data: cand } = await supabase.from('candidates').select('*').eq('user_id', user?.id).single();
      const { data: usr } = await supabase.from('users').select('*').eq('id', user?.id).single();
      const { data: prefs } = await supabase.from('candidate_preferences').select('*').eq('candidate_id', user?.id).single();
      
      const { data: edu } = await supabase.from('candidate_education').select('*').eq('candidate_id', user?.id);
      const { data: exp } = await supabase.from('candidate_experience').select('*').eq('candidate_id', user?.id);
      const { data: proj } = await supabase.from('candidate_projects').select('*').eq('candidate_id', user?.id);
      const { data: certs } = await supabase.from('candidate_certifications').select('*').eq('candidate_id', user?.id);
      const { data: ints } = await supabase.from('candidate_internships').select('*').eq('candidate_id', user?.id);
      const { data: courses } = await supabase.from('candidate_courses').select('*').eq('candidate_id', user?.id);

      setFormData({
        personal: {
          fullName: usr?.name || '', email: usr?.email || '', phone: cand?.phone || '', 
          location: cand?.location || cand?.current_location || '', headline: cand?.headline || ''
        },
        preferences: {
          expectedCTC: prefs?.expected_ctc || '',
          noticePeriodDays: prefs?.notice_period_days || 30,
          workModel: prefs?.work_model_preference || '',
          preferredLocations: prefs?.preferred_locations?.join(', ') || ''
        },
        skills: { technical: cand?.skills?.join(', ') || '', soft: '' },
        education: edu || [],
        experience: exp || [],
        internships: ints || [],
        projects: proj || [],
        certifications: certs || [],
        courses: courses || []
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  };

  const handleResumeUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      
      toast('info', 'Uploading & Parsing', 'Extracting details using Llama-3 AI...');
      await supabase.storage.from('candidate_resumes').upload(fileName, file);
      
      // Also log resume version
      await supabase.from('candidate_resume_versions').insert({
        candidate_id: user?.id,
        version_number: 1,
        file_url: fileName
      });

      const fd = new FormData(); fd.append('file', file);
      const res = await fetch(`${API_URL}/api/resume/parse-public`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Failed to parse resume');
      
      const data = await res.json();
      if (data.status === 'success' && data.extracted_data) {
        const d = data.extracted_data;
        setFormData((prev: any) => ({
          ...prev,
          personal: { ...prev.personal, fullName: d.personal?.fullName || prev.personal.fullName, location: d.personal?.location || prev.personal.location, headline: d.personal?.headline || prev.personal.headline },
          education: d.education || prev.education,
          experience: d.experience || prev.experience,
          internships: d.internships || prev.internships,
          projects: d.projects || prev.projects,
          certifications: d.certifications || prev.certifications,
          courses: d.courses || prev.courses,
          skills: { technical: d.skills?.technical?.join(', ') || prev.skills.technical }
        }));
        toast('success', 'Auto-Fill Complete', 'Details populated from your resume.');
      }
    } catch (err: any) {
      toast('error', 'Auto-Fill Failed', err.message);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Update candidates & users table
      await supabase.from('users').update({ name: formData.personal.fullName }).eq('id', user?.id);
      await supabase.from('candidates').update({
        phone: formData.personal.phone, location: formData.personal.location, current_location: formData.personal.location,
        headline: formData.personal.headline, skills: formData.skills.technical.split(',').map((s:string)=>s.trim()).filter(Boolean)
      }).eq('user_id', user?.id);

      // 2. Update Preferences
      const prefs = {
        candidate_id: user?.id, expected_ctc: formData.preferences.expectedCTC,
        notice_period_days: formData.preferences.noticePeriodDays,
        work_model_preference: formData.preferences.workModel,
        preferred_locations: formData.preferences.preferredLocations.split(',').map((s:string)=>s.trim()).filter(Boolean)
      };
      const { data: pCheck } = await supabase.from('candidate_preferences').select('id').eq('candidate_id', user?.id);
      if (pCheck && pCheck.length > 0) await supabase.from('candidate_preferences').update(prefs).eq('candidate_id', user?.id);
      else await supabase.from('candidate_preferences').insert(prefs);

      // Sync array tables (For simplicity in this massive UI, we delete existing and re-insert)
      await supabase.from('candidate_education').delete().eq('candidate_id', user?.id);
      if (formData.education.length) await supabase.from('candidate_education').insert(formData.education.map((i:any)=>({...i, candidate_id: user?.id})));

      await supabase.from('candidate_experience').delete().eq('candidate_id', user?.id);
      if (formData.experience.length) await supabase.from('candidate_experience').insert(formData.experience.map((i:any)=>({...i, candidate_id: user?.id})));
      
      await supabase.from('candidate_internships').delete().eq('candidate_id', user?.id);
      if (formData.internships.length) await supabase.from('candidate_internships').insert(formData.internships.map((i:any)=>({...i, candidate_id: user?.id})));
      
      await supabase.from('candidate_projects').delete().eq('candidate_id', user?.id);
      if (formData.projects.length) await supabase.from('candidate_projects').insert(formData.projects.map((i:any)=>({...i, candidate_id: user?.id})));

      // Log activity
      await supabase.from('candidate_activity_logs').insert({ candidate_id: user?.id, action_type: 'profile_updated', metadata: { sections: activeSection } });

      toast('success', 'Profile Saved', 'Your changes have been saved successfully.');
    } catch (e: any) {
      toast('error', 'Save Failed', e.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isFetching) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div><h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1><p className="text-gray-500 mt-1">Complete your profile to unlock applications.</p></div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2.5 rounded-xl font-medium transition-all cursor-pointer shadow-sm border border-indigo-200">
            <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} disabled={isParsing} />
            {isParsing ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />} Auto-Fill from Resume
          </label>
          <button onClick={handleSave} disabled={isSaving || isParsing} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2">
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />} Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-1">
            {SECTIONS.map((sec) => (
              <button key={sec.id} onClick={() => setActiveSection(sec.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left ${activeSection === sec.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                {sec.icon} {sec.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          {activeSection === 'personal' && <PersonalForm data={formData.personal} onChange={(d) => setFormData({...formData, personal: d})} />}
          {activeSection === 'preferences' && <PreferencesForm data={formData.preferences} onChange={(d) => setFormData({...formData, preferences: d})} />}
          
          {activeSection === 'education' && (
            <ArrayForm title="Education" items={formData.education} 
              fields={[{name: 'degree', label: 'Degree'}, {name: 'college', label: 'College/University'}, {name: 'startYear', label: 'Start Year'}, {name: 'endYear', label: 'End Year'}]}
              onUpdate={items => setFormData({...formData, education: items})}
              renderItem={item => (<div><div className="font-bold">{item.degree}</div><div className="text-sm text-gray-500">{item.college} ({item.startYear} - {item.endYear})</div></div>)}
            />
          )}

          {activeSection === 'experience' && (
            <ArrayForm title="Experience" items={formData.experience} 
              fields={[{name: 'designation', label: 'Designation'}, {name: 'company', label: 'Company'}, {name: 'startDate', label: 'Start Date'}, {name: 'endDate', label: 'End Date'}, {name: 'responsibilities', label: 'Responsibilities', type: 'textarea', fullWidth: true}]}
              onUpdate={items => setFormData({...formData, experience: items})}
              renderItem={item => (<div><div className="font-bold">{item.designation}</div><div className="text-sm text-gray-500">{item.company} | {item.startDate} - {item.endDate}</div></div>)}
            />
          )}

          {activeSection === 'internships' && (
            <ArrayForm title="Internships" items={formData.internships} 
              fields={[{name: 'role', label: 'Role'}, {name: 'company', label: 'Company'}, {name: 'duration', label: 'Duration'}, {name: 'description', label: 'Description', type: 'textarea', fullWidth: true}]}
              onUpdate={items => setFormData({...formData, internships: items})}
              renderItem={item => (<div><div className="font-bold">{item.role}</div><div className="text-sm text-gray-500">{item.company} | {item.duration}</div></div>)}
            />
          )}

          {activeSection === 'projects' && (
            <ArrayForm title="Projects" items={formData.projects} 
              fields={[{name: 'projectName', label: 'Project Name'}, {name: 'role', label: 'Your Role'}, {name: 'githubLink', label: 'GitHub Link'}, {name: 'description', label: 'Description', type: 'textarea', fullWidth: true}]}
              onUpdate={items => setFormData({...formData, projects: items})}
              renderItem={item => (<div><div className="font-bold">{item.projectName || item.project_name}</div><div className="text-sm text-gray-500">{item.role}</div></div>)}
            />
          )}

          {activeSection === 'skills' && (
             <div className="space-y-4">
               <h3 className="text-lg font-bold">Skills</h3>
               <div><label className="text-sm font-medium">Technical Skills (Comma separated)</label>
               <textarea value={formData.skills.technical} onChange={e => setFormData({...formData, skills: { ...formData.skills, technical: e.target.value }})} className="w-full p-2 border rounded mt-1" rows={4} /></div>
             </div>
          )}

          {/* Add placeholders for certifications, courses if needed */}
        </div>
      </div>
    </div>
  );
}
"""

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Rewrote massive Profile Edit page!")
