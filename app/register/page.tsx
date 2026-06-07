"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Shield, Globe, ArrowLeft, X, Loader2, CheckCircle, Github, Linkedin, HelpCircle } from "lucide-react";

export default function RegisterPage() {
  const [file, setFile] = useState<File|null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith(".pdf") || droppedFile.name.endsWith(".docx"))) {
      processFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = (f: File) => {
    setFile(f);
    setUploading(true);
    // Simulate AI parsing
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
      // In production: POST to /api/resume/parse → redirect to profile completion
      setTimeout(() => {
        window.location.href = "/profile";
      }, 2000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-violet-50/20 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-100/30 via-violet-100/20 to-transparent rounded-full blur-3xl pointer-events-none"/>

      {/* Header */}
      <header className="border-b border-zinc-200/60 bg-white/80 backdrop-blur-lg sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <a href="/" className="text-[#0052CC] font-black text-base tracking-tight">PLACIFY</a>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500">Need help?</span>
            <button className="text-xs font-bold text-[#0052CC] border border-[#0052CC] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">Support</button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-16 relative z-10">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}}>
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-black text-zinc-900">Create Your Verified Candidate Profile</h1>
            <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">
              Experience the future of hiring. Our AI parses your history to build a high-trust technical passport in seconds.
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100 p-8">
            {/* Social Auth */}
            <button className="w-full bg-[#0052CC] hover:bg-[#003FA3] text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 transition-colors mb-4">
              <Linkedin className="w-4 h-4"/>
              Continue with LinkedIn
            </button>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="py-3 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button className="py-3 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                <Github className="w-4 h-4"/>
                GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-zinc-200"/>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Or upload document</span>
              <div className="flex-1 h-px bg-zinc-200"/>
            </div>

            {/* Resume Upload */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                isDragOver ? "border-[#0052CC] bg-blue-50/50" :
                uploaded ? "border-emerald-300 bg-emerald-50/50" :
                "border-zinc-200 hover:border-[#0052CC]/50 hover:bg-blue-50/30"
              }`}>

              <AnimatePresence mode="wait">
                {uploading ? (
                  <motion.div key="uploading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-3">
                    <Loader2 className="w-10 h-10 text-[#0052CC] mx-auto animate-spin"/>
                    <div className="text-sm font-bold text-zinc-700">Parsing resume with AI...</div>
                    <div className="text-xs text-zinc-400">{file?.name}</div>
                    <div className="w-48 mx-auto h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-[#0052CC] rounded-full" initial={{width:"0%"}} animate={{width:"100%"}} transition={{duration:3}}/>
                    </div>
                  </motion.div>
                ) : uploaded ? (
                  <motion.div key="done" initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="space-y-2">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto"/>
                    <div className="text-sm font-bold text-emerald-700">Resume parsed successfully!</div>
                    <div className="text-xs text-zinc-400">Redirecting to complete your profile...</div>
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{opacity:0}} animate={{opacity:1}}>
                    <label className="cursor-pointer space-y-3 block">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-5 h-5 text-[#0052CC]"/>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-900">Upload Resume</div>
                        <div className="text-xs text-zinc-500 mt-1">Drag and drop your PDF or DOCX file here</div>
                        <div className="text-[10px] text-zinc-400 mt-1">Maximum size: 10MB</div>
                      </div>
                      <input type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={handleFileSelect}/>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Security footer */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-zinc-400">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3"/> AES-256 Encrypted</span>
            <span className="flex items-center gap-1"><Globe className="w-3 h-3"/> GDPR Compliant</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
