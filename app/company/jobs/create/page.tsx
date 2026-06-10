'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import {
  Briefcase, MapPin, Calendar, Building2, Users, Loader2,
  DollarSign, GraduationCap, FileText, CheckCircle2, SlidersHorizontal,
  Plus, X, Zap
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';


export default function CreateJobWorkspace() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

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


  const [formData, setFormData] = useState({
    job_title: '', department: 'Engineering', employment_type: 'Full-time', work_mode: 'Remote',
    location: '', city: '', state: '', country: '', salary_min: '', salary_max: '', salary_currency: 'USD',
    salary_negotiable: true, experience_min: '', experience_max: '', freshers_allowed: false,
    notice_period_required: '30 Days', openings: 1, bond_required: false, bond_duration: 0, bond_amount: 0,
    education_required: "Bachelor\'s Degree", education_preferred: "Master\'s Degree",
    job_description: '', about_role: '', key_responsibilities: '', benefits: ''
  });

  const [atsWeights, setAtsWeights] = useState({
    experience_weight: 20, education_weight: 10, location_weight: 10, notice_period_weight: 10,
    semantic_weight: 10, skill_mandatory: 70, skill_good: 20, skill_secondary: 10
  });

  const [mandatorySkills, setMandatorySkills] = useState<string[]>([]);
  const [goodToHaveSkills, setGoodToHaveSkills] = useState<string[]>([]);
  const [secondarySkills, setSecondarySkills] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState({ mandatory: '', good: '', secondary: '' });

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>, type: 'mandatory' | 'good' | 'secondary') => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput[type].trim();
      if (!val) return;
      if (type === 'mandatory' && !mandatorySkills.includes(val)) setMandatorySkills(p => [...p, val]);
      if (type === 'good' && !goodToHaveSkills.includes(val)) setGoodToHaveSkills(p => [...p, val]);
      if (type === 'secondary' && !secondarySkills.includes(val)) setSecondarySkills(p => [...p, val]);
      setTagInput(p => ({ ...p, [type]: '' }));
    }
  };

  const removeTag = (type: 'mandatory' | 'good' | 'secondary', tag: string) => {
    if (type === 'mandatory') setMandatorySkills(p => p.filter(t => t !== tag));
    if (type === 'good') setGoodToHaveSkills(p => p.filter(t => t !== tag));
    if (type === 'secondary') setSecondarySkills(p => p.filter(t => t !== tag));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAtsWeights(p => ({ ...p, [e.target.name]: parseInt(e.target.value) || 0 }));
  };


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtracting(true);
    toast("info", "AI Parsing JD", "Extracting core entities via Gemini Flash...");
    
    try {
      let fullText = '';
      if (file.name.endsWith('.pdf')) {
        const fileUrl = URL.createObjectURL(file);
        const pdfjsLib = await loadPdfJs();
        const pdf = await pdfjsLib.getDocument(fileUrl).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((s: any) => s.str).join(' ') + ' ';
        }
      } else {
        fullText = await file.text();
      }

      const res = await fetch("/api/company/jobs/analyze", { 
        method: "POST", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText })
      });
      
      if (!res.ok) throw new Error("Failed to extract data");
      const json = await res.json();
      const data = json.data;
      
      setFormData(prev => ({
          ...prev, job_title: data.job_title || prev.job_title, experience_min: data.experience_min || prev.experience_min,
          experience_max: data.experience_max || prev.experience_max, salary_min: data.salary_min || prev.salary_min,
          salary_max: data.salary_max || prev.salary_max, city: data.city || prev.city, job_description: data.job_description || prev.job_description
      }));
      if (data.mandatory_skills?.length > 0) setMandatorySkills(data.mandatory_skills);
      toast("success", "Auto-Filled", "Gemini successfully populated the ATS pipeline fields!");
    } catch (err: any) {
        toast("error", "Extraction Failed", err.message);
    } finally {
        setExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.job_title || mandatorySkills.length === 0) {
      toast("error", "Missing Fields", "Job Title and Mandatory Skills are absolutely required.");
      return;
    }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication required");
      const { data: company, error: companyError } = await supabase.from('companies').select('id').eq('user_id', session.user.id).single();
      if (companyError || !company) throw new Error("Company profile not found");

      const payload = {
        company_id: company.id, job_title: formData.job_title, department: formData.department,
        employment_type: formData.employment_type, work_mode: formData.work_mode,
        location: formData.location || `${formData.city}, ${formData.country}`, city: formData.city, state: formData.state, country: formData.country,
        salary_min: parseInt(formData.salary_min) || 0, salary_max: parseInt(formData.salary_max) || 0,
        salary_currency: formData.salary_currency, salary_negotiable: formData.salary_negotiable,
        experience_min: parseInt(formData.experience_min) || 0, experience_max: parseInt(formData.experience_max) || 0,
        freshers_allowed: formData.freshers_allowed, notice_period_required: formData.notice_period_required,
        openings: parseInt(formData.openings as any) || 1, bond_required: formData.bond_required,
        bond_duration: parseInt(formData.bond_duration as any) || 0, bond_amount: parseInt(formData.bond_amount as any) || 0,
        education_required: formData.education_required, education_preferred: formData.education_preferred,
        job_description: formData.job_description, about_role: formData.about_role,
        key_responsibilities: formData.key_responsibilities, benefits: formData.benefits,
        mandatory_skills: mandatorySkills, good_to_have_skills: goodToHaveSkills, secondary_skills: secondarySkills,
        skill_weightage_json: { mandatory: atsWeights.skill_mandatory, good_to_have: atsWeights.skill_good, secondary: atsWeights.skill_secondary },
        experience_weight: atsWeights.experience_weight, education_weight: atsWeights.education_weight,
        location_weight: atsWeights.location_weight, notice_period_weight: atsWeights.notice_period_weight, semantic_weight: atsWeights.semantic_weight,
        status: 'active'
      };

      const res = await fetch("/api/company/jobs/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      toast("success", "Job Deployed to ATS", "The Semantic Engine has ingested the job profile.");
      router.push("/company/workspace");
    } catch (err: any) {
      toast("error", "Deployment Failed", err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 1, title: "Basic Information", icon: Briefcase }, { id: 2, title: "ATS Skills Matrix", icon: Zap },
    { id: 3, title: "Compensation & Perks", icon: DollarSign }, { id: 4, title: "Experience & Education", icon: GraduationCap },
    { id: 5, title: "Hiring Constraints", icon: Users }, { id: 6, title: "Full Description", icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="bg-white border-b border-slate-200 pt-8 pb-6 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div><h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2"><Zap className="text-blue-600" /> Advanced Job Creation</h1></div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input type="file" id="jd-upload" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} disabled={extracting}/>
              <label htmlFor="jd-upload" className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-bold cursor-pointer transition-colors border border-indigo-200">
                {extracting ? <Loader2 className="w-4 h-4 animate-spin"/> : <FileText className="w-4 h-4"/>} {extracting ? "Analyzing JD..." : "Auto-fill with AI"}
              </label>
            </div>
            <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-colors">
              {loading && <Loader2 className="w-4 h-4 animate-spin"/>} Deploy Job to ATS
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 mt-8 flex overflow-x-auto gap-2 no-scrollbar">
          {sections.map(sec => (
            <button key={sec.id} type="button" onClick={() => setActiveTab(sec.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === sec.id ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}>
              <sec.icon className="w-4 h-4" /> {sec.title}
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 mt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {activeTab === 1 && (
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Briefcase className="text-blue-500"/> Foundation details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Job Title *</label><input type="text" name="job_title" value={formData.job_title} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Department</label><input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Employment Type</label>
                  <select name="employment_type" value={formData.employment_type} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"><option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option></select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Work Mode</label>
                  <select name="work_mode" value={formData.work_mode} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"><option value="Remote">Remote</option><option value="Hybrid">Hybrid</option><option value="On-site">On-site</option></select>
                </div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Country</label><input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
              </div>
            </motion.div>
          )}
          {activeTab === 2 && (
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-6">
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 shadow-lg text-white">
                <div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold flex items-center gap-2"><Zap className="text-yellow-400"/> Semantic Skills Matrix</h2></div></div>
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-2xl p-5"><label className="block text-sm font-bold mb-3">Mandatory Skills</label>
                    <div className="flex flex-wrap gap-2 mb-3">{mandatorySkills.map(tag => (<span key={tag} className="bg-white text-blue-900 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">{tag} <button type="button" onClick={() => removeTag('mandatory', tag)}><X size={14}/></button></span>))}</div>
                    <input type="text" value={tagInput.mandatory} onChange={e => setTagInput(p => ({...p, mandatory: e.target.value}))} onKeyDown={e => handleAddTag(e, 'mandatory')} className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none text-white placeholder:text-blue-300" placeholder="Type a skill and press Enter..." />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 3 && (
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><DollarSign className="text-emerald-500"/> Compensation Budget</h2>
              <div className="grid grid-cols-3 gap-6">
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Min Salary</label><input type="number" name="salary_min" value={formData.salary_min} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Max Salary</label><input type="number" name="salary_max" value={formData.salary_max} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Currency</label><input type="text" name="salary_currency" value={formData.salary_currency} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
              </div>
            </motion.div>
          )}
          {activeTab >= 4 && (
             <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">Experience & Constraints</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold text-slate-700 mb-2">Min Years Exp.</label><input type="number" name="experience_min" value={formData.experience_min} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2">Max Years Exp.</label><input type="number" name="experience_max" value={formData.experience_max} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2">Job Description</label><textarea name="job_description" value={formData.job_description} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none h-32" /></div>
                </div>
             </motion.div>
          )}
        </form>
      </div>
    </div>
  );
}
