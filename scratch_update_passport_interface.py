with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\components\passport\passport-showcase.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

new_interface = """interface PassportData {
  candidate_id: string;
  name: string;
  role: string;
  trust_score: number;
  ats_score: number;
  resume_intel_score?: number | null;
  resume_intelligence_score?: number;
  resume_intelligence_grade?: string;

  profile_photo_url: string;
  skills: string[];
  experience_years: number;
  summary: string;
  location: string;
  current_job_role: string;
  
  activity_score?: number;
  verification_status?: string;
  education_summary?: string;
  project_summary?: string;
  certification_summary?: string;
  generated_date?: string;
  last_updated?: string;
}"""

content = content.replace("interface PassportData {\n  candidate_id: string;\n  name: string;\n  role: string;\n  trust_score: number;\n  ats_score: number;\n  resume_intel_score?: number | null;\n  resume_intelligence_score?: number;\n  resume_intelligence_grade?: string;\n\n  profile_photo_url: string;\n  skills: string[];\n  experience_years: number;\n  summary: string;\n  location: string;\n  current_job_role: string;\n}", new_interface)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\components\passport\passport-showcase.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated interface")
