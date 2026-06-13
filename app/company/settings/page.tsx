"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Settings as SettingsIcon, UploadCloud, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function CompanySettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "", website: "", industry: "", employee_count: "", description: ""
  });

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase.from('companies').select('*, verification_badge').eq('user_id', user?.id).single();
      if (data) {
        setCompany(data);
        setFormData({
            name: data.name || "",
            website: data.website || "",
            industry: data.industry || "",
            employee_count: data.employee_count || "",
            description: data.description || ""
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !company) return;
      
      try {
          toast("info", "Uploading Logo", "Please wait...");
          const fileName = `logo_${company.id}_${Date.now()}`;
          const { error } = await supabase.storage.from("company_logos").upload(fileName, file);
          if (error) throw error;
          
          const { data } = supabase.storage.from("company_logos").getPublicUrl(fileName);
          await supabase.from('companies').update({ logo_url: data.publicUrl }).eq('id', company.id);
          setCompany({ ...company, logo_url: data.publicUrl });
          toast("success", "Logo Updated", "Your company logo has been successfully updated.");
      } catch (err: any) {
          toast("error", "Upload Failed", err.message);
      }
  };

  const handleSave = async () => {
      if (!company) return;
      setSaving(true);
      try {
          await supabase.from('companies').update(formData).eq('id', company.id);
          toast("success", "Profile Saved", "Your company settings have been updated.");
      } catch (err: any) {
          toast("error", "Save Failed", err.message);
      } finally {
          setSaving(false);
      }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="max-w-[1000px] mx-auto p-4 sm:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          {company?.verification_badge && <span className="text-emerald-500 bg-emerald-50 text-sm px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-200"><ShieldCheck size={16}/> Verified Employer</span>}
          <SettingsIcon className="text-blue-600" size={32}/> Company Settings
        </h1>
        <p className="text-gray-500 mt-1">Manage your company profile, branding, and notification preferences.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-xl font-bold border-b pb-2">Branding</h2>
        <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {company?.logo_url ? <img src={company.logo_url} className="w-full h-full object-cover"/> : <UploadCloud className="text-gray-400"/>}
            </div>
            <div>
                <h3 className="font-bold text-gray-900">Company Logo</h3>
                <p className="text-sm text-gray-500 mb-3">PNG, JPG, JPEG or WEBP (Max 5MB)</p>
                <label className="px-4 py-2 bg-zinc-900 text-white font-bold rounded-xl text-sm cursor-pointer hover:bg-zinc-800 transition-colors">
                    Upload Logo
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload}/>
                </label>
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-xl font-bold border-b pb-2">Company Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                <input type="text" value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border-gray-200" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Website URL</label>
                <input type="text" value={formData.website} onChange={(e: any) => setFormData({...formData, website: e.target.value})} className="w-full rounded-xl border-gray-200" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Industry</label>
                <input type="text" value={formData.industry} onChange={(e: any) => setFormData({...formData, industry: e.target.value})} className="w-full rounded-xl border-gray-200" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Employee Count</label>
                <input type="text" value={formData.employee_count} onChange={(e: any) => setFormData({...formData, employee_count: e.target.value})} className="w-full rounded-xl border-gray-200" />
            </div>
            <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={(e: any) => setFormData({...formData, description: e.target.value})} className="w-full rounded-xl border-gray-200 h-24" />
            </div>
        </div>
        <div className="flex justify-end pt-4">
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
                {saving ? <Loader2 className="animate-spin w-4 h-4"/> : null} Save Profile
            </button>
        </div>
      </div>
    </div>
  );
}
