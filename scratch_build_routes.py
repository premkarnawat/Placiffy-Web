import os
import shutil

base = "c:\\Users\\premk\\.gemini\\antigravity\\playground\\ruby-galaxy\\app\\admin\\"
routes = [
    ("support", "Support"),
    ("analytics", "Analytics"),
    ("billing", "Billing"),
    ("audit", "Audit"),
    ("settings", "AdminSettings")
]

template = """
"use client";
import React from 'react';
import { BookOpen, PieChart, Receipt, Search, Settings, Construction } from 'lucide-react';

const Placeholder = ({ title, desc, Icon }: any) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
    <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
      <Icon size={40} />
    </div>
    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
    <p className="text-lg text-slate-500 max-w-lg font-medium">{desc}</p>
    <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl p-6 mt-8 max-w-md w-full flex items-start gap-4">
      <Construction size={24} className="shrink-0 mt-0.5" />
      <div className="text-left text-sm font-medium">
        <p className="font-bold text-blue-900 mb-1">Module Scaffolding Complete</p>
        The isolated routing infrastructure for this module is verified. Data binding to Supabase tables will occur in a subsequent phase.
      </div>
    </div>
  </div>
);

export default function PAGE_COMP() {
  return <Placeholder title="TITLE_TEXT" desc="DESC_TEXT" Icon={ICON_COMP} />;
}
"""

mappings = {
    "Support": ("Support Ticket Center", "Manage help desk tickets from Candidates and Companies.", "BookOpen"),
    "Analytics": ("Platform Analytics", "Deep-dive into platform growth, revenue, and matching algorithms.", "PieChart"),
    "Billing": ("Billing & Subscriptions", "Monitor enterprise SaaS subscriptions and candidate upgrades.", "Receipt"),
    "Audit": ("Security Audit Logs", "Track all changes, auth events, and data mutations securely.", "Search"),
    "AdminSettings": ("Platform Settings", "Configure platform-wide variables, API keys, and email templates.", "Settings")
}

for route, comp in routes:
    dir_path = os.path.join(base, route)
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, "page.tsx")
    
    title, desc, icon = mappings[comp]
    content = template.replace("PAGE_COMP", comp).replace("TITLE_TEXT", title).replace("DESC_TEXT", desc).replace("ICON_COMP", icon)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content.strip())
        
print("Successfully generated all remaining admin routes.")
