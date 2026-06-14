content = """'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { 
  Building2, Mail, Phone, Globe, MapPin, Users, 
  Briefcase, CheckCircle2, ShieldCheck, CreditCard, Clock, Loader2, Link as LinkIcon
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function CompanySettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ jobs: 0, applicants: 0, hires: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (user) fetchCompanyData();
  }, [user]);

  const fetchCompanyData = async () => {
    try {
      const { data: compData, error } = await supabase.from('companies').select('*').eq('user_id', user?.id).single();
      if (error) throw error;
      
      setProfile(compData);
      setFormData(compData);

      // Fetch Stats
      if (compData) {
        const [jRes, aRes] = await Promise.all([
          supabase.from('jobs').select('id', { count: 'exact' }).eq('company_id', compData.id),
          supabase.from('applications').select('id, status, jobs!inner(company_id)').eq('jobs.company_id', compData.id)
        ]);
        
        const apps = aRes.data || [];
        setStats({
          jobs: jRes.count || 0,
          applicants: apps.length,
          hires: apps.filter((a:any) => a.status === 'joined').length
        });
      }
    } catch (e: any) {
      console.error(e);
      toast({ title: "Error", description: "Could not load company profile.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('companies').update({
        name: formData.name,
        website: formData.website,
        industry: formData.industry,
        company_size: formData.company_size,
        location: formData.location,
        description: formData.description
      }).eq('id', profile.id);

      if (error) throw error;

      setProfile(formData);
      setIsEditing(false);
      toast({ title: "Success", description: "Company profile updated successfully." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[70vh]"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  if (!profile) return <div className="p-8 text-center text-gray-500">Company profile not found. Please complete registration.</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="text-blue-600" /> Company Profile
          </h1>
          <p className="text-gray-500 mt-1">Manage your public presence and account settings.</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="bg-white border border-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => { setIsEditing(false); setFormData(profile); }} className="bg-white border border-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-2">
              {saving && <Loader2 size={16} className="animate-spin"/>} Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form / Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
              <div className="w-24 h-24 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl font-black border-4 border-white shadow-sm overflow-hidden">
                {profile.logo_url ? <img src={profile.logo_url} className="w-full h-full object-cover"/> : profile.name?.[0] || 'C'}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full text-2xl font-bold text-gray-900 border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent mb-2"/>
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
                )}
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-lg"><MapPin size={14}/> {isEditing ? <input value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-transparent border-b border-gray-300 outline-none w-24"/> : profile.location || 'Location Not Set'}</span>
                  <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-lg"><Briefcase size={14}/> {isEditing ? <input value={formData.industry || ''} onChange={e => setFormData({...formData, industry: e.target.value})} className="bg-transparent border-b border-gray-300 outline-none w-24"/> : profile.industry || 'Industry Not Set'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Company Email</label>
                <div className="flex items-center gap-3 text-gray-900 font-medium p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Mail size={18} className="text-slate-400"/> {user?.email}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Website</label>
                <div className="flex items-center gap-3 text-gray-900 font-medium p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <LinkIcon size={18} className="text-slate-400"/> 
                  {isEditing ? (
                    <input type="url" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} className="bg-transparent border-none outline-none w-full" placeholder="https://"/>
                  ) : (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{profile.website || 'Not provided'}</a>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Company Description</label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 min-h-[120px]">
                  {isEditing ? (
                    <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-full bg-transparent border-none outline-none resize-none text-gray-700 text-sm" placeholder="Tell us about your company..."/>
                  ) : (
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{profile.description || 'No description provided.'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata & Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><ShieldCheck className="text-emerald-500" size={20}/> Verification & Plan</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 size={16}/> Verified Business
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                  <CreditCard size={16}/> Professional Plan
                </div>
                <button onClick={() => router.push('/company/billing')} className="text-xs text-blue-600 font-bold hover:underline">Manage</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                  <Clock size={16}/> Member Since
                </div>
                <span className="text-sm font-medium text-slate-800">{new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="text-purple-500" size={20}/> Lifetime Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                <div className="text-2xl font-black text-gray-900 mb-1">{stats.jobs}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jobs Posted</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                <div className="text-2xl font-black text-blue-600 mb-1">{stats.applicants}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applicants</div>
              </div>
              <div className="col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                <div className="text-2xl font-black text-emerald-600 mb-1">{stats.hires}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Successful Hires</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\settings\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated company settings page")
