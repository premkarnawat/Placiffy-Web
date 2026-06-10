# -*- coding: utf-8 -*-
with open(r"components\passport\passport-showcase.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# We need to add the Resume Intelligence Score to the Passport Data Interface and UI
interface_patch = """interface PassportData {
  candidate_id: string;
  name: string;
  role: string;
  trust_score: number;
  ats_score: number;
  resume_intelligence_score?: number;
  resume_intelligence_grade?: string;
"""

content = content.replace("interface PassportData {\n  candidate_id: string;\n  name: string;\n  role: string;\n  trust_score: number;\n  ats_score: number;", interface_patch)

# Inject the intelligence score below the ATS Matching Rating
ui_patch = """            {/* Real-time Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">ATS Matching Rating</h3>
                  <p className="text-slate-500 text-[10px] mt-1">Machine Readability</p>
                </div>
                <div className="text-3xl font-black text-blue-400 mt-2">{data.ats_score}%</div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/50 border border-indigo-500/20 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/20 blur-xl rounded-full"></div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-1"><BrainCircuit className="w-3 h-3"/> Resume Intelligence</h3>
                  <p className="text-slate-500 text-[10px] mt-1">AI Quality Assessment</p>
                </div>
                <div className="flex items-end gap-2 mt-2">
                  <div className="text-3xl font-black text-white">{data.resume_intelligence_score || '--'}</div>
                  <div className="mb-1 text-sm font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {data.resume_intelligence_grade || 'Pending'}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Current Designation</h3>
                  <p className="text-slate-500 text-[10px] mt-1">Verified Experience</p>
                </div>
                <div className="text-lg font-bold text-emerald-400 mt-2">{data.current_job_role}</div>
              </div>
            </div>"""

content = re.sub(r'            \{\/\* Real-time Metrics Grid \*\/.*?</div>\n            </div>', ui_patch, content, flags=re.DOTALL)

# Don't forget to import BrainCircuit if not already
if "BrainCircuit" not in content:
    content = content.replace("import { Shield, CheckCircle, Download, Link2, MapPin, Briefcase, Award } from 'lucide-react';", "import { Shield, CheckCircle, Download, Link2, MapPin, Briefcase, Award, BrainCircuit } from 'lucide-react';")


with open(r"components\passport\passport-showcase.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected Resume Intelligence metrics into the Passport UI!")
