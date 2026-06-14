with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\candidates\[id]\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

# 1. Fetch intel
old_fetch = "const [candidate, setCandidate] = useState<any>(null);"
new_fetch = "const [candidate, setCandidate] = useState<any>(null);\n  const [intel, setIntel] = useState<any>(null);"

content = content.replace(old_fetch, new_fetch)

old_load = """            const { data } = await supabase.from('candidates').select('*, candidate_profiles(*), candidate_experience(*), candidate_education(*), candidate_projects(*)').eq('id', params.id as string).single();
            setCandidate(data);"""
            
new_load = """            const { data } = await supabase.from('candidates').select('*, candidate_profiles(*), candidate_experience(*), candidate_education(*), candidate_projects(*)').eq('id', params.id as string).single();
            setCandidate(data);
            if (data) {
                const { data: report } = await supabase.from('resume_intelligence_reports').select('ats_resume_score, last_analyzed_at').eq('candidate_id', data.id).single();
                setIntel(report);
            }"""

content = content.replace(old_load, new_load)

# 2. Add UI
old_ui = """                {/* Right Column */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-4">Skills</h3>"""
                        
new_ui = """                {/* Right Column */}
                <div className="space-y-8">
                    {intel?.ats_resume_score && (
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                            <Sparkles className="text-indigo-500 mb-2" size={32}/>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">ATS Resume Intelligence</h3>
                            <div className="text-4xl font-black text-slate-900 mb-2">{intel.ats_resume_score}<span className="text-xl text-slate-400">/100</span></div>
                            <div className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                                {intel.ats_resume_score >= 80 ? 'Strong Profile' : intel.ats_resume_score >= 60 ? 'Good Profile' : 'Needs Improvement'}
                            </div>
                        </div>
                    )}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-4">Skills</h3>"""

content = content.replace(old_ui, new_ui)

if "Sparkles" not in content:
    content = content.replace(
        "import { ChevronLeft, MapPin, Briefcase, Mail, CheckCircle2, ShieldCheck, Download, ExternalLink, Calendar, Link as LinkIcon } from 'lucide-react';",
        "import { ChevronLeft, MapPin, Briefcase, Mail, CheckCircle2, ShieldCheck, Download, ExternalLink, Calendar, Link as LinkIcon, Sparkles } from 'lucide-react';"
    )

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\candidates\[id]\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Patched company view")
