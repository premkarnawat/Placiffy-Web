"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Briefcase, MapPin, DollarSign, Calendar, Clock, AlertCircle, Building2, Users, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { motion } from 'framer-motion';

export default function CreateJobWorkspace() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://placify-backend-dzj7.onrender.com";
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const payload = {
        ...formData,
        required_skills: formData.required_skills.split(',').map(s => s.trim()).filter(Boolean),
        preferred_skills: formData.preferred_skills.split(',').map(s => s.trim()).filter(Boolean),
        open_positions: parseInt(formData.open_positions as any) || 1
      };

      const res = await fetch(`${API_URL}/api/company/jobs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
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
      toast("error", "Failed to Create Job", err.message);
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
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><DollarSign size={14}/> Salary Range</label>
              <input required type="text" name="salary_range" value={formData.salary_range} onChange={handleChange} className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-4 bg-gray-50" placeholder="$120k - $150k" />
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
