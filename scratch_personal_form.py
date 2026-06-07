# -*- coding: utf-8 -*-
with open(r"components\candidate\profile\PersonalForm.tsx", "w", encoding="utf-8") as f:
    f.write("""'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function PersonalForm({ data, onChange, userId }: { data: any, onChange: (d: any) => void, userId?: string }) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !userId) return;
    const file = e.target.files[0];
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar_${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('profile_photos').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('profile_photos').getPublicUrl(filePath);
      
      onChange({...data, profile_photo_url: publicUrl});
      
      // Persist immediately to candidates table so it reflects
      await supabase.from('candidates').update({ profile_photo_url: publicUrl }).eq('user_id', userId);
      
      toast('success', 'Photo Uploaded', 'Your profile photo has been updated.');
    } catch (err: any) {
      toast('error', 'Upload Failed', err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 shrink-0 group">
          {data.profile_photo_url ? (
            <img src={data.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Camera size={32} />
            </div>
          )}
          <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
            <span className="text-[10px] font-bold mt-1">UPLOAD</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-bold">Profile Photo</h3>
          <p className="text-sm text-gray-500">Upload a professional headshot. This photo will be used on your Candidate Passport.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Full Name</label><input type="text" value={data.fullName || ''} onChange={e => onChange({...data, fullName: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
          <div><label className="text-sm font-medium">Email</label><input type="email" value={data.email || ''} onChange={e => onChange({...data, email: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
          <div><label className="text-sm font-medium">Phone</label><input type="text" value={data.phone || ''} onChange={e => onChange({...data, phone: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
          <div><label className="text-sm font-medium">Location</label><input type="text" value={data.location || ''} onChange={e => onChange({...data, location: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
          <div><label className="text-sm font-medium">Professional Headline</label><input type="text" value={data.headline || ''} onChange={e => onChange({...data, headline: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
        </div>
      </div>
    </div>
  );
}
""")
