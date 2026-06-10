# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Add state for completionPct
state_patch = """  const [isParsing, setIsParsing] = useState(false);
  const [completionPct, setCompletionPct] = useState(0);"""
content = content.replace("  const [isParsing, setIsParsing] = useState(false);", state_patch)

# Load completionPct from the initial fetch
fetch_patch = """        const { data: cand } = await supabase.from('candidates').select('*, candidate_profiles(*)').eq('user_id', user.id).single();
        if (cand) {
          setCandidateId(cand.id);
          setCompletionPct(cand.profile_completion_pct || 0);"""
content = content.replace("        const { data: cand } = await supabase.from('candidates').select('*, candidate_profiles(*)').eq('user_id', user.id).single();\n        if (cand) {\n          setCandidateId(cand.id);", fetch_patch)

# Add the UI progress ring in the header
header_patch = """        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-500 mt-1">Complete your profile to unlock applications.</p>
            </div>
            {completionPct > 0 && (
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * completionPct) / 100} className={`${completionPct >= 80 ? 'text-green-500' : 'text-blue-500'} transition-all duration-1000`} />
                  </svg>
                  <span className={`absolute text-xs font-bold ${completionPct >= 80 ? 'text-green-600' : 'text-blue-600'}`}>{completionPct}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">Profile Score</span>
                  <span className="text-xs text-gray-500">{completionPct >= 80 ? 'Ready to Apply!' : 'Needs improvement'}</span>
                </div>
              </div>
            )}
          </div>
"""
content = re.sub(r'        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">\n          <div>\n            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>\n            <p className="text-gray-500 mt-1">Complete your profile to unlock applications.</p>\n          </div>', header_patch, content, flags=re.DOTALL)

with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected Profile Completion Ring into frontend UI!")
