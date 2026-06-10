# -*- coding: utf-8 -*-
import os
import re

target_file = r"app\candidate\page.tsx"

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

# I will add a small widget pointing to the resume intelligence page if there is an overview page.
# If app/candidate/page.tsx exists, let's inject a card.
if "export default function CandidateDashboard()" in content or "export default function Dashboard()" in content:
    widget_code = """
        {/* Resume Intelligence Widget */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit className="text-blue-400" size={20} />
                <h3 className="font-bold text-lg">Resume Intelligence</h3>
              </div>
              <p className="text-sm text-slate-400">AI analysis of your resume quality and ATS structure.</p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-bold tracking-wider mb-1">SCORE</div>
                <div className="text-3xl font-black text-white">--<span className="text-sm text-slate-500">/100</span></div>
              </div>
              <a href="/candidate/resume-intelligence" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-500/25">
                View Report
              </a>
            </div>
          </div>
        </div>
"""
    # Replace the existing grid if there is one, or just add it to the top.
    # Since I don't know the exact structure of app/candidate/page.tsx, I will just print the first 2000 chars to see it.
    print(content[:2000])
else:
    print("Could not identify Candidate Dashboard structure.")

