# -*- coding: utf-8 -*-
with open(r"app\company\jobs\create\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Add pdfjs-dist import at the top
content = content.replace("import { useToast } from '@/components/ui/toast';", "import { useToast } from '@/components/ui/toast';\nimport * as pdfjsLib from 'pdfjs-dist';\n\n// Initialize PDF.js worker seamlessly\nif (typeof window !== 'undefined') {\n  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;\n}")

# Update handleFileUpload
patch = """
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtracting(true);
    toast("info", "AI Parsing JD", "Extracting core entities via Gemini Flash...");
    
    try {
      let fullText = '';
      if (file.name.endsWith('.pdf')) {
        const fileUrl = URL.createObjectURL(file);
        const pdf = await pdfjsLib.getDocument(fileUrl).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((s: any) => s.str).join(' ') + ' ';
        }
      } else {
        fullText = await file.text();
      }

      const res = await fetch("/api/company/jobs/analyze", { 
        method: "POST", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText })
      });
      
      if (!res.ok) throw new Error("Failed to extract data");
      const json = await res.json();
      const data = json.data;
      
      setFormData(prev => ({
          ...prev, job_title: data.job_title || prev.job_title, experience_min: data.experience_min || prev.experience_min,
          experience_max: data.experience_max || prev.experience_max, salary_min: data.salary_min || prev.salary_min,
          salary_max: data.salary_max || prev.salary_max, city: data.city || prev.city, job_description: data.job_description || prev.job_description
      }));
      if (data.mandatory_skills?.length > 0) setMandatorySkills(data.mandatory_skills);
      toast("success", "Auto-Filled", "Gemini successfully populated the ATS pipeline fields!");
    } catch (err: any) {
        toast("error", "Extraction Failed", err.message);
    } finally {
        setExtracting(false);
    }
  };
"""

content = re.sub(r'  const handleFileUpload = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{.*?\n  \};\n', patch, content, flags=re.DOTALL)

with open(r"app\company\jobs\create\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected PDF.js extraction into the Job Creation frontend!")
