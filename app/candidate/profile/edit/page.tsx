'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { User, Briefcase, GraduationCap, FolderGit2, ShieldCheck, UploadCloud, Loader2, Link as LinkIcon, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

import PersonalForm from '@/components/candidate/profile/PersonalForm';
import ArrayForm from '@/components/candidate/profile/ArrayForm';
import PreferencesForm from '@/components/candidate/profile/PreferencesForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://placify-backend-dzj7.onrender.com';

const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
  { id: 'education', label: 'Education', icon: <GraduationCap size={18} /> },
  { id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
  { id: 'projects', label: 'Projects', icon: <FolderGit2 size={18} /> },
  { id: 'certifications', label: 'Certifications', icon: <ShieldCheck size={18} /> },
  { id: 'links', label: 'Links & Socials', icon: <LinkIcon size={18} /> },
];

export default function ProfileEditor() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [completionPct, setCompletionPct] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const [candidateId, setCandidateId] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
    personal: { fullName: '', email: '', location: '', headline: '', summary: '', experience_years: 0, profile_photo_url: '' },
    preferences: { expected_salary: '', notice_period: '30 Days', availability_status: 'Actively Looking' },
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    links: []
  });

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    setIsFetching(true);
    try {
      const { data: cand } = await supabase.from('candidates').select('*').eq('user_id', user?.id).single();
      if (!cand) return;
      setCandidateId(cand.id);

      const { data: profile } = await supabase.from('candidate_profiles').select('*').eq('candidate_id', cand.id).single();
      
      const { data: edu } = await supabase.from('candidate_education').select('*').eq('candidate_id', cand.id);
      const { data: exp } = await supabase.from('candidate_experience').select('*').eq('candidate_id', cand.id);
      const { data: proj } = await supabase.from('candidate_projects').select('*').eq('candidate_id', cand.id);
      const { data: certs } = await supabase.from('candidate_certifications').select('*').eq('candidate_id', cand.id);
      const { data: links } = await supabase.from('candidate_links').select('*').eq('candidate_id', cand.id);

      setFormData({
        personal: {
          fullName: user?.user_metadata?.full_name || '', email: user?.email || '', 
          location: cand.location || '', headline: cand.headline || '', summary: cand.summary || '', experience_years: cand.experience_years || 0, profile_photo_url: cand.profile_photo_url || ''
        },
        preferences: {
          expected_salary: profile?.expected_salary || '',
          notice_period: profile?.notice_period || '30 Days',
          availability_status: profile?.availability_status || 'Actively Looking'
        },
        education: edu || [],
        experience: exp || [],
        projects: proj || [],
        certifications: certs || [],
        links: links || []
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
      
      toast('info', 'Uploading & Parsing', 'Extracting details securely from your Resume...');
      
      // 1. Upload to Supabase to secure the master resume
      const { data: uploadData, error: upErr } = await supabase.storage.from('candidate_resumes').upload(fileName, file);
      if (upErr) throw upErr;
      
      const { data: { publicUrl } } = supabase.storage.from('candidate_resumes').getPublicUrl(fileName);
      await supabase.from('candidates').update({ resume_url: publicUrl }).eq('user_id', user?.id);


      // 2. Fast Client-Side PDF Text Extraction using PDF.js via Script Tag
      const loadPdfJs = async (): Promise<any> => {
        if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = () => {
            const lib = (window as any).pdfjsLib;
            lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve(lib);
          };
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      const pdfjsLib = await loadPdfJs();

      
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((s: any) => s.str).join(' ') + ' ';
      }

      // 3. Hit native Next.js gpt-4o-mini parser (Extremely Fast < 3s)
      const res = await fetch('/api/candidate/parse-resume', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText })
      });
      
      if (!res.ok) throw new Error('Failed to parse resume data');
      
      const data = await res.json();
      if (data.status === 'success' && data.extracted_data) {
        const d = data.extracted_data;
        setFormData((prev: any) => ({
          ...prev,
          personal: { ...prev.personal, ...d.personal },
          preferences: { ...prev.preferences, ...d.preferences },
          education: d.education || prev.education,
          experience: d.experience || prev.experience,
          projects: d.projects || prev.projects,
          certifications: d.certifications || prev.certifications,
          links: d.links || prev.links
        }));
        
        // Auto-save parsed results to database so they persist immediately!
        toast('success', 'Auto-Fill Complete', 'Details populated. Saving to database...');
        setTimeout(() => handleSave(), 500); 
      }
    } catch (err: any) {
      console.error(err);
      toast('error', 'Auto-Fill Failed', err.message);
    } finally {
      setIsParsing(false);
    }
  };  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!candidateId) throw new Error("Candidate record not found");


      const { error: candErr } = await supabase.from('candidates').update({
        location: formData.personal.location || null,
        headline: formData.personal.headline || null,
        summary: formData.personal.summary || null,
        experience_years: parseInt(formData.personal.experience_years) || 0
      }).eq('id', candidateId);
      if (candErr) throw new Error("Failed to update candidate record: " + candErr.message);

      const prefs = {
        candidate_id: candidateId, 
        gender: formData.personal.gender || null,
        date_of_birth: formData.personal.date_of_birth || null,
        mobile_number: formData.personal.mobile_number || null,
        current_address: formData.personal.current_address || null,
        city: formData.personal.city || null,
        state: formData.personal.state || null,
        country: formData.personal.country || null,
        pincode: formData.personal.pincode || null,
        nationality: formData.personal.nationality || null,
        current_job_role: formData.preferences.current_job_role || null,
        industry: formData.preferences.industry || null,
        current_ctc: formData.preferences.current_ctc ? parseFloat(formData.preferences.current_ctc) : null,
        expected_salary: formData.preferences.expected_salary ? parseFloat(formData.preferences.expected_salary) : null,
        notice_period: formData.preferences.notice_period || null,
        preferred_location: formData.preferences.preferred_location || null,
        work_mode: formData.preferences.work_mode || null,
        employment_type: formData.preferences.employment_type || null,
        availability_status: formData.preferences.availability_status || null
      };

      
      const { data: pCheck } = await supabase.from('candidate_profiles').select('id').eq('candidate_id', candidateId);
      if (pCheck && pCheck.length > 0) {
        const { error: pErr } = await supabase.from('candidate_profiles').update(prefs).eq('candidate_id', candidateId);
        if (pErr) throw new Error("Failed to update profile preferences: " + pErr.message);
      } else {
        const { error: pErr } = await supabase.from('candidate_profiles').insert(prefs);
        if (pErr) throw new Error("Failed to insert profile preferences: " + pErr.message);
      }

      const { error: edDelErr } = await supabase.from('candidate_education').delete().eq('candidate_id', candidateId);
      if (edDelErr) throw new Error("Failed to clear education: " + edDelErr.message);
      if (formData.education.length) {
        const { error: edInsErr } = await supabase.from('candidate_education').insert(formData.education.map((i:any)=>({candidate_id: candidateId, institution: i.institution, degree: i.degree, field_of_study: i.field_of_study, start_date: i.start_date || null, end_date: i.end_date || null, description: i.description})));
        if (edInsErr) throw new Error("Failed to save education: " + edInsErr.message);
      }

      const { error: expDelErr } = await supabase.from('candidate_experience').delete().eq('candidate_id', candidateId);
      if (expDelErr) throw new Error("Failed to clear experience: " + expDelErr.message);
      if (formData.experience.length) {
        const { error: expInsErr } = await supabase.from('candidate_experience').insert(formData.experience.map((i:any)=>({candidate_id: candidateId, company_name: i.company_name, title: i.title, location: i.location, start_date: i.start_date || null, end_date: i.end_date || null, is_current: i.is_current || false, description: i.description})));
        if (expInsErr) throw new Error("Failed to save experience: " + expInsErr.message);
      }
      
      const { error: projDelErr } = await supabase.from('candidate_projects').delete().eq('candidate_id', candidateId);
      if (projDelErr) throw new Error("Failed to clear projects: " + projDelErr.message);
      if (formData.projects.length) {
        const { error: projInsErr } = await supabase.from('candidate_projects').insert(formData.projects.map((i:any)=>({candidate_id: candidateId, name: i.name, description: i.description, url: i.url, start_date: i.start_date || null, end_date: i.end_date || null})));
        if (projInsErr) throw new Error("Failed to save projects: " + projInsErr.message);
      }

      const { error: certDelErr } = await supabase.from('candidate_certifications').delete().eq('candidate_id', candidateId);
      if (certDelErr) throw new Error("Failed to clear certifications: " + certDelErr.message);
      if (formData.certifications.length) {
        const { error: certInsErr } = await supabase.from('candidate_certifications').insert(formData.certifications.map((i:any)=>({candidate_id: candidateId, name: i.name, issuer: i.issuer, issue_date: i.issue_date || null, url: i.url})));
        if (certInsErr) throw new Error("Failed to save certifications: " + certInsErr.message);
      }

      const { error: linkDelErr } = await supabase.from('candidate_links').delete().eq('candidate_id', candidateId);
      if (linkDelErr) throw new Error("Failed to clear links: " + linkDelErr.message);
      if (formData.links.length) {
        const { error: linkInsErr } = await supabase.from('candidate_links').insert(formData.links.map((i:any)=>({candidate_id: candidateId, platform: i.platform, url: i.url})));
        if (linkInsErr) throw new Error("Failed to save links: " + linkInsErr.message);
      }


      // NAUKRI-STYLE PROFILE COMPLETION ENGINE (10% per section)
      let completionScore = 0;
      
      // 1. Resume (10%)
      const { data: cData } = await supabase.from('candidates').select('resume_url').eq('id', candidateId).single();
      if (cData?.resume_url) completionScore += 10;
      
      // 2. Personal Details (10%)
      if (formData.personal.headline && formData.personal.summary && formData.personal.location) completionScore += 10;
      
      // 3. Education (10%)
      if (formData.education && formData.education.length > 0) completionScore += 10;
      
      // 4. Experience (10%)
      if (formData.experience && formData.experience.length > 0) completionScore += 10;
      
      // 5. Skills (10%) - Assuming stored in summary/headline for now, give partial if summary exists
      if (formData.personal.summary && formData.personal.summary.length > 20) completionScore += 10;
      
      // 6. Projects (10%)
      if (formData.projects && formData.projects.length > 0) completionScore += 10;
      
      // 7. Certifications (10%)
      if (formData.certifications && formData.certifications.length > 0) completionScore += 10;
      
      // 8. Portfolio/Links (10%)
      if (formData.links && formData.links.length > 0) completionScore += 10;
      
      // 9. Preferences/CTC (10%)
      if (formData.preferences.expected_salary && formData.preferences.notice_period) completionScore += 10;
      
      // 10. Profile Photo (10%)
      if (formData.personal.profile_photo_url) completionScore += 10;

      // Ensure it does not exceed 100
      completionScore = Math.min(100, completionScore);

      // Save Completion Score back to database
      await supabase.from('candidates').update({ profile_completion_pct: completionScore }).eq('id', candidateId);

      // Automatically generate ATS vector embeddings in the background

      fetch('/api/candidate/embed', { method: 'POST', body: JSON.stringify({ candidateId, summary: formData.personal.summary || '', headline: formData.personal.headline || '' }) }).catch(console.error);

      toast('success', 'Profile Saved', 'Your changes have been saved permanently.');
    } catch (e: any) {
      console.error(e);
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
          {activeSection === 'personal' && <PersonalForm data={formData.personal} userId={user?.id} onChange={(d) => setFormData({...formData, personal: d})} />}
          
          {activeSection === 'education' && (
            <ArrayForm title="Education" items={formData.education} 
              fields={[{name: 'institution', label: 'Institution', required: true}, {name: 'degree', label: 'Degree', required: true}, {name: 'field_of_study', label: 'Field of Study'}, {name: 'start_date', label: 'Start Date', type: 'date'}, {name: 'end_date', label: 'End Date', type: 'date'}, {name: 'description', label: 'Description', type: 'textarea'}]}
              onUpdate={items => setFormData({...formData, education: items})}
              renderItem={item => (<div><div className="font-bold">{item.degree}</div><div className="text-sm text-gray-500">{item.institution}</div></div>)}
            />
          )}

          {activeSection === 'experience' && (
            <ArrayForm title="Experience" items={formData.experience} 
              fields={[{name: 'title', label: 'Title', required: true}, {name: 'company_name', label: 'Company', required: true}, {name: 'location', label: 'Location'}, {name: 'start_date', label: 'Start Date', type: 'date'}, {name: 'end_date', label: 'End Date', type: 'date'}, {name: 'is_current', label: 'Current Role?', type: 'checkbox'}, {name: 'description', label: 'Description', type: 'textarea', fullWidth: true}]}
              onUpdate={items => setFormData({...formData, experience: items})}
              renderItem={item => (<div><div className="font-bold">{item.title}</div><div className="text-sm text-gray-500">{item.company_name}</div></div>)}
            />
          )}

          {activeSection === 'projects' && (
            <ArrayForm title="Projects" items={formData.projects} 
              fields={[{name: 'name', label: 'Project Name', required: true}, {name: 'url', label: 'Project URL'}, {name: 'start_date', label: 'Start Date', type: 'date'}, {name: 'end_date', label: 'End Date', type: 'date'}, {name: 'description', label: 'Description', type: 'textarea', fullWidth: true}]}
              onUpdate={items => setFormData({...formData, projects: items})}
              renderItem={item => (<div><div className="font-bold">{item.name}</div><div className="text-sm text-gray-500">{item.url}</div></div>)}
            />
          )}

          {activeSection === 'certifications' && (
            <ArrayForm title="Certifications" items={formData.certifications}
              fields={[{name: 'name', label: 'Certificate Name', required: true}, {name: 'issuer', label: 'Issuer'}, {name: 'issue_date', label: 'Issue Date', type: 'date'}, {name: 'url', label: 'Credential URL'}]}
              onUpdate={items => setFormData({...formData, certifications: items})}
              renderItem={item => (<div><div className="font-bold">{item.name}</div><div className="text-sm text-gray-500">{item.issuer}</div></div>)}
            />
          )}

          {activeSection === 'links' && (
            <ArrayForm title="Links & Socials" items={formData.links}
              fields={[{name: 'platform', label: 'Platform (e.g. LinkedIn, GitHub)', required: true}, {name: 'url', label: 'URL', required: true}]}
              onUpdate={items => setFormData({...formData, links: items})}
              renderItem={item => (<div><div className="font-bold">{item.platform}</div><div className="text-sm text-gray-500">{item.url}</div></div>)}
            />
          )}
        </div>
      </div>
    </div>
  );
}