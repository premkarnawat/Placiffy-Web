with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\jobs\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

# 1. Add state variable
content = content.replace("const [profileScore, setProfileScore] = useState(0);",
"const [profileScore, setProfileScore] = useState(0);\n  const [resumeScore, setResumeScore] = useState<number>(0);")

# 2. Update fetchCandidateProfile
old_fetch = """  const fetchCandidateProfile = async () => {
    const { data } = await supabase.from('candidates').select('id, profile_score').eq('user_id', user?.id).single();
    if (data) {
      setCandidateId(data.id);
      setProfileScore(data.profile_score || 0);
    }
  };"""

new_fetch = """  const fetchCandidateProfile = async () => {
    const { data } = await supabase.from('candidates').select('id, profile_completion_pct').eq('user_id', user?.id).single();
    if (data) {
      setCandidateId(data.id);
      setProfileScore(data.profile_completion_pct || 0);
      const { data: r } = await supabase.from('resume_intelligence_reports').select('ats_resume_score').eq('candidate_id', data.id).single();
      if (r) setResumeScore(r.ats_resume_score || 0);
    }
  };"""
content = content.replace(old_fetch, new_fetch)

# 3. Add to UI
old_ui = """            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">{job.employment_type || 'Full Time'}</span>
              <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">{job.work_mode || 'Hybrid'}</span>
            </div>"""

new_ui = """            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">{job.employment_type || 'Full Time'}</span>
              <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">{job.work_mode || 'Hybrid'}</span>
            </div>
            {resumeScore > 0 && (
              <div className="mb-6 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                   <Zap size={16} className="text-amber-500" />
                   <span className="text-slate-600 font-medium">ATS Match Probability</span>
                </div>
                <span className="font-bold text-amber-600">{Math.max(65, resumeScore - (job.experience_min ? 5 : 0))}%</span>
              </div>
            )}"""
content = content.replace(old_ui, new_ui)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\jobs\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated jobs map")
