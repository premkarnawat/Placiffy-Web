# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Rewrite handleResumeUpload to use local PDF.js and the fast Next.js API
refactored_upload = """  const handleResumeUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      
      toast('info', 'Uploading & Parsing', 'Extracting details securely from your Resume...');
      
      // 1. Upload to Supabase to secure the master resume
      const { data: uploadData, error: upErr } = await supabase.storage.from('candidate_resumes').upload(fileName, file);
      if (upErr) throw upErr;
      
      const { data: { publicUrl } } = supabase.storage.from('candidate_resumes').getPublicUrl(fileName);
      await supabase.from('candidates').update({ resume_url: publicUrl }).eq('user_id', user?.id);

      // 2. Fast Client-Side PDF Text Extraction using PDF.js
      const arrayBuffer = await file.arrayBuffer();
      // Dynamically load pdf.js from CDN
      const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.mjs' as any);
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.mjs';
      
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((s: any) => s.str).join(' ') + ' ';
      }

      // 3. Hit native Next.js gpt-4o-mini parser (Extremely Fast < 3s)
      const res = await fetch('/api/candidate/parse-resume', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText })
      });
      
      if (!res.ok) throw new Error('Failed to parse resume data');
      
      const data = await res.json();
      if (data.status === 'success' && data.extracted_data) {
        const d = data.extracted_data;
        setFormData((prev: any) => ({
          ...prev,
          personal: { ...prev.personal, ...d.personal },
          preferences: { ...prev.preferences, ...d.preferences },
          education: d.education || prev.education,
          experience: d.experience || prev.experience,
          projects: d.projects || prev.projects,
          certifications: d.certifications || prev.certifications,
          links: d.links || prev.links
        }));
        
        // Auto-save parsed results to database so they persist immediately!
        toast('success', 'Auto-Fill Complete', 'Details populated. Saving to database...');
        setTimeout(() => handleSave(), 500); 
      }
    } catch (err: any) {
      console.error(err);
      toast('error', 'Auto-Fill Failed', err.message);
    } finally {
      setIsParsing(false);
    }
  };"""

content = re.sub(r'  const handleResumeUpload = async \(e: any\) => \{.*?(?=  const handleSave = async \(\) => \{)', refactored_upload, content, flags=re.DOTALL)

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Rewrote handleResumeUpload to use blazing fast client-side PDF.js extraction + native Next API!")
