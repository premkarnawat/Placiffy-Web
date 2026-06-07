'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { FileText, Upload, Download, Trash2, RefreshCw, Eye, CheckCircle2, AlertCircle, Clock, FileUp } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function ResumeManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) fetchResumes();
  }, [user]);

  const fetchResumes = async () => {
    try {
      const { data } = await supabase.from('candidate_resume_versions').select('*').eq('candidate_id', user?.id).order('created_at', { ascending: false });
      setVersions(data || []);
    } catch (e) {
      console.error(e);
      toast('error', 'Error fetching resumes', 'Could not load your resume history.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user?.id) return;
    const file = e.target.files[0];
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/resume_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('candidate_resumes').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('candidate_resumes').getPublicUrl(filePath);
      
      // Demote old active resumes
      await supabase.from('candidate_resume_versions').update({ is_active: false }).eq('candidate_id', user.id).eq('is_active', true);

      // Create new version
      await supabase.from('candidate_resume_versions').insert({
        candidate_id: user.id,
        file_url: publicUrl,
        file_name: file.name,
        parsed_status: 'pending',
        is_active: true
      });

      // Update candidates table reference
      await supabase.from('candidates').update({ resume_url: publicUrl }).eq('user_id', user.id);

      toast('success', 'Resume Uploaded', 'Your new resume is now active.');
      fetchResumes();
      
      // Trigger parsing simulation
      simulateParsing(publicUrl);

    } catch (err: any) {
      toast('error', 'Upload Failed', err.message);
    } finally {
      setUploading(false);
    }
  };

  const simulateParsing = async (url: string) => {
    setTimeout(async () => {
      await supabase.from('candidate_resume_versions').update({ parsed_status: 'completed', ats_status: 'ready' }).eq('file_url', url);
      fetchResumes();
      toast('success', 'Parsing Complete', 'Your resume has been successfully parsed by the AI engine.');
    }, 4000);
  };

  const handleDelete = async (id: string, isActive: boolean) => {
    if (isActive) {
      toast('error', 'Action Denied', 'You cannot delete your currently active resume.');
      return;
    }
    try {
      await supabase.from('candidate_resume_versions').delete().eq('id', id);
      toast('success', 'Resume Deleted', 'Archived resume has been removed.');
      fetchResumes();
    } catch (e: any) {
      toast('error', 'Deletion Failed', e.message);
    }
  };

  const handleMakeActive = async (id: string, url: string) => {
    try {
      await supabase.from('candidate_resume_versions').update({ is_active: false }).eq('candidate_id', user?.id).eq('is_active', true);
      await supabase.from('candidate_resume_versions').update({ is_active: true }).eq('id', id);
      await supabase.from('candidates').update({ resume_url: url }).eq('user_id', user?.id);
      
      toast('success', 'Resume Activated', 'This version is now your active resume.');
      fetchResumes();
    } catch (e: any) {
      toast('error', 'Action Failed', e.message);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  const activeResume = versions.find(v => v.is_active);
  const archivedResumes = versions.filter(v => !v.is_active);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="text-indigo-600" size={32}/> Resume Management
          </h1>
          <p className="text-gray-500 mt-1">Manage your active resume and version history.</p>
        </div>
        <div>
          <label className={`bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 cursor-pointer ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
            {uploading ? <RefreshCw size={18} className="animate-spin" /> : <Upload size={18} />}
            {uploading ? 'Uploading...' : 'Upload New Resume'}
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Active Resume */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-md p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><CheckCircle2 className="text-blue-500"/> Current Active Resume</h2>
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider">Primary</span>
        </div>

        {activeResume ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0 border border-red-100">
                <FileText size={28}/>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 truncate max-w-[200px] sm:max-w-sm">{activeResume.file_name || 'resume.pdf'}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mt-1">
                  <span className="flex items-center gap-1"><Clock size={14}/> {new Date(activeResume.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1">
                    {activeResume.parsed_status === 'completed' ? <CheckCircle2 size={14} className="text-green-500"/> : <RefreshCw size={14} className="text-amber-500 animate-spin"/>}
                    {activeResume.parsed_status === 'completed' ? 'Parsed Successfully' : 'Parsing AI...'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <a href={activeResume.file_url} target="_blank" rel="noreferrer" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
                <Eye size={16}/> View
              </a>
              <button onClick={() => toast('info', 'Re-Parsing', 'Initiating deep parse...')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
                <RefreshCw size={16}/> Parse
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileUp size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No active resume. Please upload your primary resume.</p>
          </div>
        )}
      </div>

      {/* Version History */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Clock size={20} className="text-gray-400"/> Version History (Archived)</h2>
        
        {archivedResumes.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No previous versions found.</p>
        ) : (
          <div className="space-y-3">
            {archivedResumes.map((resume) => (
              <div key={resume.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={20}/>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{resume.file_name || 'Archived Resume'}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Uploaded on {new Date(resume.created_at).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button onClick={() => handleMakeActive(resume.id, resume.file_url)} className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    Make Active
                  </button>
                  <a href={resume.file_url} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download size={16}/>
                  </a>
                  <button onClick={() => handleDelete(resume.id, false)} className="p-1.5 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
