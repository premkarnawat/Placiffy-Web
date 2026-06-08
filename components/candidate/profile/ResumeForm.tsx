"use client";
﻿import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, UploadCloud, Loader2, CheckCircle2, ShieldCheck, Download, Trash2, Zap } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function ResumeForm({ userId }: { userId?: string }) {
  const { toast } = useToast();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (userId) fetchResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchResume = async () => {
    try {
      const { data, error } = await supabase
        .from("candidate_resumes")
        .select("*")
        .eq("candidate_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (data) setResume(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !userId) return;
    const file = e.target.files[0];
    setUploading(true);

    try {
      const fileName = `${userId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error: uploadError } = await supabase.storage.from("candidate_resumes").upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("candidate_resumes").getPublicUrl(fileName);

      const fd = new FormData();
      fd.append("file", file);
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://placify-backend-dzj7.onrender.com";
      const res = await fetch(`${API_URL}/api/resume/parse`, { method: "POST", body: fd });
      
      if (!res.ok) throw new Error("Resume parsed with errors or failed.");
      
      const parsedData = await res.json();
      const atsScore = Math.floor(Math.random() * 20) + 70; // temporary until we use pgvector dynamically

      // Delete previous resume to maintain accuracy in pgvector similarity search
      await supabase.from("candidate_resumes").delete().eq("candidate_id", userId);

      const { data: newResume, error: dbError } = await supabase.from("candidate_resumes").insert({
        candidate_id: userId,
        file_name: file.name,
        resume_url: publicUrl,
        parsed_data: parsedData.extracted_data || parsedData,
        resume_embedding: parsedData.vector_embedding,
        ats_score: atsScore,
        parsed_at: new Date().toISOString()
      }).select().single();

      if (dbError) throw dbError;

      setResume(newResume);
      toast("success", "Resume Uploaded", "Your resume has been processed by our ATS engine.");
      
      // Update trust score event
      await supabase.from("trust_score_events").insert({
        candidate_id: userId,
        event_type: "resume_upload",
        event_description: "Uploaded new parsed resume",
        score_impact: 10
      });
      
      // Trigger trust score recalculation async
      fetch(`${API_URL}/api/trust-score/recalculate`, { method: "POST", headers: {"Content-Type": "application/json"} }).catch(()=>{});

    } catch (err: any) {
      toast("error", "Upload Failed", err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!resume) return;
    try {
      await supabase.from("candidate_resumes").delete().eq("id", resume.id);
      setResume(null);
      toast("success", "Resume Deleted", "Your active resume has been removed.");
    } catch (e: any) {
      toast("error", "Failed to delete", e.message);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Resume & ATS Profile</h2>
          <p className="text-gray-500 mt-1">Upload your resume to activate our vector matching engine.</p>
        </div>
        
        <label className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium cursor-pointer transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2">
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
          {resume ? "Replace Resume" : "Upload Resume"}
          <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {!resume ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center">
          <FileText size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Active Resume</h3>
          <p className="text-gray-500 max-w-md">You need to upload a resume for the AI Assistant and ATS matching engine to recommend jobs to you.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 p-6 flex items-start justify-between bg-blue-50/30">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0 text-red-500">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{resume.file_name}</h3>
                <p className="text-sm text-gray-500 mt-1">Uploaded on {new Date(resume.created_at).toLocaleDateString()}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1"><CheckCircle2 size={12}/> Parsed Successfully</span>
                  {resume.ats_score && <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1"><Zap size={12}/> {resume.ats_score}% ATS Baseline</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={resume.resume_url} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Download size={20} /></a>
              <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={20} /></button>
            </div>
          </div>
          
          <div className="p-6">
            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-4"><ShieldCheck size={18} className="text-blue-600"/> Extracted ATS Data</h4>
            {resume.parsed_data ? (
              <div className="space-y-4">
                {resume.parsed_data.skills && (
                  <div>
                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Detected Skills</h5>
                    <div className="flex flex-wrap gap-2">
                      {resume.parsed_data.skills.map((skill: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
                {resume.parsed_data.experience && Array.isArray(resume.parsed_data.experience) && (
                  <div className="pt-2">
                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Experience Timeline</h5>
                    <div className="space-y-3 border-l-2 border-gray-100 pl-4 ml-1">
                      {resume.parsed_data.experience.map((exp: any, i: number) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[21px] top-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></div>
                          <div className="font-bold text-gray-900 text-sm">{exp.title || exp.job_title}</div>
                          <div className="text-xs text-gray-500">{exp.company} • {exp.duration || exp.dates}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No structured data could be extracted. Please try uploading a cleaner PDF format without multi-column layouts.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
