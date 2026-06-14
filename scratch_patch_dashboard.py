with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

# Add state for ATS score
content = content.replace(
    "const [data, setData] = useState<any>({});",
    "const [data, setData] = useState<any>({});\n  const [atsScore, setAtsScore] = useState<number | null>(null);"
)

# Fetch ATS score
old_fetch = """        const profileRes = await fetch('/api/candidates/profile', {
          headers: { 'Authorization': `Bearer ${session.session.access_token}` }
        });"""
        
new_fetch = """        const profileRes = await fetch('/api/candidates/profile', {
          headers: { 'Authorization': `Bearer ${session.session.access_token}` }
        });
        
        try {
            const profData = await profileRes.clone().json();
            if (profData?.id) {
                const atsRes = await fetch(`/api/candidate/resume-intelligence?candidate_id=${profData.id}`);
                const atsData = await atsRes.json();
                if (atsData?.report?.ats_resume_score) {
                    setAtsScore(atsData.report.ats_resume_score);
                }
            }
        } catch(e) {}"""

content = content.replace(old_fetch, new_fetch)

# Add ATS Widget UI
old_ui = """      {/* AI Insights & Verification CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">"""

new_ui = """      {/* ATS Resume & Verification CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 text-white relative overflow-hidden lg:col-span-2">
          <ShieldCheck size={120} className="absolute -right-10 -bottom-10 text-white opacity-10" />
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-3"><Lock className="text-blue-400" /> Unlock Premium Status</h2>
          <p className="text-blue-100 mb-6">You are currently unverified. Complete the Verification Journey to get your Candidate Passport and double your ATS ranking.</p>
          <button onClick={() => router.push('/candidate/verification')} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg flex items-center gap-2">
            Start Verification <ChevronRight size={18} />
          </button>
        </div>
        
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden group" onClick={() => router.push('/candidate/resume-intelligence')}>
          <Sparkles className="absolute -top-4 -right-4 text-blue-50 opacity-50 group-hover:opacity-100 transition-opacity" size={100}/>
          <h3 className="font-bold text-slate-500 uppercase tracking-wider text-xs mb-2">ATS Resume Score</h3>
          <div className="text-5xl font-black text-slate-900 mb-2 relative z-10">{atsScore !== null ? atsScore : '--'}</div>
          <p className="text-xs text-slate-500 font-medium mb-4 relative z-10">{atsScore !== null ? 'Out of 100' : 'Not analyzed yet'}</p>
          <div className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full relative z-10 flex items-center gap-1 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            View Full Report <ChevronRight size={14}/>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">"""

content = content.replace(old_ui, new_ui)
content = content.replace(
    '<div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">\n        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 text-white relative overflow-hidden">',
    '<div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">\n        {/* Removing duplicate verification banner */}'
)
# Make sure Sparkles is imported
if "Sparkles" not in content:
    content = content.replace(
        "import { LayoutDashboard, Briefcase, FileText, Settings, LogOut, ChevronRight, Search, Activity, Star, Zap, Bell, CheckCircle, ShieldCheck, Lock, ArrowUpRight, Copy, ExternalLink, Calendar, MapPin, Building2, TrendingUp, Filter, Bookmark, AlertCircle, Clock, Video } from 'lucide-react';",
        "import { LayoutDashboard, Briefcase, FileText, Settings, LogOut, ChevronRight, Search, Activity, Star, Zap, Bell, CheckCircle, ShieldCheck, Lock, ArrowUpRight, Copy, ExternalLink, Calendar, MapPin, Building2, TrendingUp, Filter, Bookmark, AlertCircle, Clock, Video, Sparkles } from 'lucide-react';"
    )

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Patched Dashboard")
