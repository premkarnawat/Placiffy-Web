# -*- coding: utf-8 -*-
resume_form_code = """import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast';
import { UploadCloud, FileText, Trash2, Loader2, CheckCircle2, Eye } from 'lucide-react';

export default function ResumeForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) fetchResume();
  }, [user]);

  const fetchResume = async () => {
    try {
      const { data, error } = await supabase.from('candidates').select('resume_url').eq('user_id', user?.id).single();
      if (error) throw error;
      setResumeUrl(data?.resume_url || null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast('error', 'Invalid File', 'Only PDF files are allowed.');
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `master-${user?.id}-${Date.now()}.pdf`;
      toast('info', 'Uploading...', 'Securing your resume to the vault.');
      
      const { error: uploadErr } = await supabase.storage.from('candidate_resumes').upload(fileName, file);
      if (uploadErr) throw new Error("Failed to upload to storage: " + uploadErr.message);

      const { data: { publicUrl } } = supabase.storage.from('candidate_resumes').getPublicUrl(fileName);
      
      const { error: updateErr } = await supabase.from('candidates').update({ resume_url: publicUrl }).eq('user_id', user?.id);
      if (updateErr) throw new Error("Failed to link resume: " + updateErr.message);

      setResumeUrl(publicUrl);
      toast('success', 'Resume Secured', 'Your master resume is now active for companies.');
    } catch (err: any) {
      toast('error', 'Upload Failed', err.message);
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your master resume? Companies will no longer be able to see it.")) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('candidates').update({ resume_url: null }).eq('user_id', user?.id);
      if (error) throw new Error(error.message);
      
      setResumeUrl(null);
      toast('success', 'Resume Deleted', 'Your master resume has been removed.');
    } catch (err: any) {
      toast('error', 'Delete Failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <FileText size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Master Resume Vault</h2>
          <p className="text-sm text-gray-500">This is the default resume that companies and ATS algorithms will analyze.</p>
        </div>
      </div>

      {resumeUrl ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="text-red-500" size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">Active Resume.pdf</h3>
                  <CheckCircle2 className="text-green-500" size={18} />
                </div>
                <p className="text-sm text-gray-500 mt-1">Currently visible to verified companies.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a 
                href={resumeUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                <Eye size={18} /> View
              </a>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 font-medium transition-colors"
              >
                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />} Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:bg-gray-50 transition-colors">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Upload Master Resume</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            Upload your ATS-friendly PDF resume. We will securely store it and make it available to companies you apply to.
          </p>
          
          <label className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl cursor-pointer transition-colors shadow-sm">
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
            {isUploading ? 'Uploading...' : 'Select PDF File'}
            <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={isUploading} />
          </label>
        </div>
      )}
    </div>
  );
}
"""

with open(r"components\candidate\profile\ResumeForm.tsx", "w", encoding="utf-8") as f:
    f.write(resume_form_code)

print("Created Master Resume Vault in components/candidate/profile/ResumeForm.tsx")
