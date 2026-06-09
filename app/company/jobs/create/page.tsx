"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Briefcase, MapPin, Calendar, Clock, AlertCircle, Building2, Users, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { motion } from 'framer-motion';

export default function CreateJobWorkspace() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [customFields, setCustomFields] = useState<{type: string, label: string}[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");

  const addCustomField = () => {
    if (!newFieldLabel.trim()) return;
    setCustomFields((prev: any) => [...prev, { type: newFieldType, label: newFieldLabel.trim() }]);
    setNewFieldLabel("");
  };

const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setExtracting(true);
    toast("info", "Extracting JD", "Our AI is reading your document...");
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://placify-backend-dzj7.onrender.com";
    const formDataObj = new FormData();
    formDataObj.append("file", file);
    
    try {
        const res = await fetch(`${API_URL}/api/jobs/extract-jd`, {
            method: "POST",
            body: formDataObj
        });
        
        if (!res.ok) throw new Error("Failed to extract data");
        const json = await res.json();
        const data = json.data;
        
        setFormData((prev: any) => ({
            ...prev,
            title: data.Title || prev.title,
            required_skills: Array.isArray(data.Skills) ? data.Skills.join(", ") : (data.Skills || prev.required_skills),
            experience: data.Experience || prev.experience,
            location: data.Location || prev.location,
            salary_range: data.Salary || prev.salary_range,
            notice_period: data["Notice Period"] || prev.notice_period
        }));
        
        toast("success", "Auto-Filled", "AI successfully populated the form from your JD!");
    } catch (err: any) {
        toast("error", "Extraction Failed", err.message);
    } finally {
        setExtracting(false);
    }
  };
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    required_skills: '',
    preferred_skills: '',
    experience: '3-5 Years',
    education: 'Bachelor\'s Degree',
    location: '',
    work_model: 'Remote',
    salary_range: '',
    employment_type: 'Full-time',
    notice_period: 'Immediate to 30 Days',
    priority: 'High',
    open_positions: 1,
    deadline: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Always get the fresh, native Supabase session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication required");
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://placify-backend-dzj7.onrender.com";

      const payload = {
        ...formData,
        required_skills: formData.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        preferred_skills: formData.preferred_skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        open_positions: parseInt(formData.open_positions as any) || 1,
        custom_fields: customFields
      };

      const res = await fetch(`${API_URL}/api/company/jobs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to create job workspace");
      }

      toast("success", "Job Workspace Created", "AI is currently generating the pgvector embedding for this job in the background.");
      router.push("/company/jobs");
      
    } catch (err: any) {
      toast("error", "Failed to Create Job", err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Briefcase className="text-blue-600" size={32}/> Create Job Workspace
        </h1>
        <p className="text-gray-500 mt-1">Configure the job requirements to activate the AI Sourcing Engine.</p>
        
        <div className="mt-6 bg-blue-50 border border-blue-100 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div>
                <h3 className="font-bold text-blue-900 text-lg">Have a Job Description document?</h3>
                <p className="text-blue-700 text-sm mt-1">Upload a PDF or DOCX file, and our AI will automatically extract and fill this form for you.</p>
            </div>
            <label className="shrink-0 cursor-pointer px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                {extracting ? <Loader2 className="w-5 h-5 animate-spin"/> : <Briefcase className="w-5 h-5"/>}
                {extracting ? "Extracting..." : "Upload JD"}
                <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileUpload} disabled={extracting}/>
            </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-8">
        
        {/* Basic Details */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center gap-2"><Building2 size={20} className="text-gray-400"/> Basic Details</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-4 bg-gray-50" placeholder="Senior React Native Developer" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
              <input required type="text" name="department" value={formData.department} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-4 bg-gray-50" placeholder="Engineering" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Employment Type</label>
              <select name="employment_type" value={formData.employment_type} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-4 bg-gray-50">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Job Description</label>
              <textarea required name="description" rows={5} value={formData.description} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4 bg-gray-50" placeholder="Describe the responsibilities and expectations..." />
            </div>
          </div>
        </div>

        {/* AI Sourcing Criteria */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center gap-2"><Briefcase size={20} className="text-blue-500"/> AI Sourcing Criteria</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Required Skills (Comma separated)</label>
              <input required type="text" name="required_skills" value={formData.required_skills} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-4 bg-gray-50" placeholder="React, Node.js, PostgreSQL" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Skills</label>
              <input type="text" name="preferred_skills" value={formData.preferred_skills} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-4 bg-gray-50" placeholder="AWS, Docker, GraphQL" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Experience Required</label>
              <select name="experience" value={formData.experience} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-4 bg-gray-50">
                <option>0-2 Years</option>
                <option>3-5 Years</option>
                <option>5-8 Years</option>
                <option>8+ Years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Education Requirement</label>
              <input type="text" name="education" value={formData.education} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-4 bg-gray-50" placeholder="Bachelor's in CS" />
            </div>
          </div>
        </div>

        {/* Logistics */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center gap-2"><MapPin size={20} className="text-emerald-500"/> Logistics & Compensation</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Work Model</label>
              <select name="work_model" value={formData.work_model} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-4 bg-gray-50">
                <option>Remote</option>
                <option>Hybrid</option>
                <option>Onsite</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-4 bg-gray-50" placeholder="San Francisco, CA or Worldwide" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><span className="font-bold text-gray-400">₹</span> Salary Range (LPA)</label>
              <input required type="text" name="salary_range" value={formData.salary_range} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-4 bg-gray-50" placeholder="₹12 LPA - ₹15 LPA" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><Clock size={14}/> Notice Period</label>
              <select name="notice_period" value={formData.notice_period} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-4 bg-gray-50">
                <option>Immediate to 15 Days</option>
                <option>30 Days</option>
                <option>60 Days</option>
                <option>90 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><Users size={14}/> Openings</label>
              <input required type="number" min="1" name="open_positions" value={formData.open_positions} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-4 bg-gray-50" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><AlertCircle size={14}/> Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-4 bg-gray-50">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><Calendar size={14}/> Application Deadline</label>
              <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-4 bg-gray-50" />
            </div>
          </div>
        </div>

        {/* Custom Screening Fields */}
        <div className="space-y-6 pt-6 border-t">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center gap-2"><AlertCircle size={20} className="text-gray-400"/> Screening & Assessment (Optional)</h2>
          
          <div className="bg-gray-50 p-4 rounded-xl space-y-4">
            <p className="text-sm text-gray-500 font-medium">Add custom questions, work sample requests, or assessment links for candidates applying to this job.</p>
            
            {customFields.map((field: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-white p-3 border rounded-lg">
                    <div>
                        <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded uppercase mr-2">{field.type}</span>
                        <span className="text-sm font-semibold">{field.label}</span>
                    </div>
                    <button type="button" onClick={() => setCustomFields((prev: any) => prev.filter((_: any, i: number) => i !== idx))} className="text-red-500 text-sm font-bold">Remove</button>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-3">
                <select value={newFieldType} onChange={(e: any) => setNewFieldType(e.target.value)} className="rounded-xl border-gray-200 text-sm bg-white px-3 py-2">
                    <option value="text">Short Text</option>
                    <option value="textarea">Long Answer</option>
                    <option value="link">Portfolio/Assessment Link</option>
                    <option value="file">File Upload (Work Sample)</option>
                </select>
                <input type="text" value={newFieldLabel} onChange={(e: any) => setNewFieldLabel(e.target.value)} placeholder="E.g., Link to your GitHub" className="flex-1 rounded-xl border-gray-200 text-sm px-4 py-2" />
                <button type="button" onClick={addCustomField} className="px-4 py-2 bg-zinc-900 text-white font-bold rounded-xl text-sm">Add Field</button>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-8 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors flex items-center gap-2">
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Generating AI Embedding...' : 'Publish Workspace'}
          </button>
        </div>

      </form>
    </div>
  );
}
