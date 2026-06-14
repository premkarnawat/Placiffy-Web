with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

content = content.replace(".eq('candidate_id', cand.id).single(),", ".eq('candidate_id', cand.id).maybeSingle(),")

null_check = """  if (!data) return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <XCircle className="text-red-500 mb-4" size={48} />
      <h2 className="text-xl font-bold text-slate-900">Dashboard Unavailable</h2>
      <p className="text-slate-500 mt-2 max-w-md">We couldn't load your dashboard. This usually happens if your profile is incomplete. Please finish setting up your candidate profile.</p>
      <button onClick={() => router.push('/candidate/profile')} className="mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Complete Profile</button>
    </div>
  );

  return ("""

content = content.replace("  return (\n    <div className=\"max-w-7xl", null_check + '\n    <div className="max-w-7xl')

# Fix dynamic tailwind colors for insights
# hover:border-${insight.color}-300 bg-${insight.color}-400 text-${insight.color}-700 bg-${insight.color}-50 hover:bg-${insight.color}-100
# Since there are only a few colors (blue, amber, purple, red, green), I'll map them explicitly.

color_map = """
  const getColorStyles = (color: string) => {
    switch(color) {
      case 'amber': return { border: 'hover:border-amber-300', line: 'bg-amber-400', btn: 'bg-amber-50 text-amber-700 hover:bg-amber-100' };
      case 'purple': return { border: 'hover:border-purple-300', line: 'bg-purple-400', btn: 'bg-purple-50 text-purple-700 hover:bg-purple-100' };
      case 'red': return { border: 'hover:border-red-300', line: 'bg-red-400', btn: 'bg-red-50 text-red-700 hover:bg-red-100' };
      case 'green': return { border: 'hover:border-emerald-300', line: 'bg-emerald-400', btn: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' };
      default: return { border: 'hover:border-blue-300', line: 'bg-blue-400', btn: 'bg-blue-50 text-blue-700 hover:bg-blue-100' };
    }
  };
"""

# inject color_map before return
content = content.replace("  if (!data) return (", color_map + "\n  if (!data) return (")

# Now replace the dynamic classes in the JSX
old_insight_jsx = """                <div key={idx} className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3 relative overflow-hidden group hover:border-${insight.color}-300 transition-colors`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${insight.color}-400`}></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{insight.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{insight.description}</p>
                  </div>
                  <button onClick={()=>router.push(insight.link)} className={`self-start text-xs font-bold px-4 py-2 rounded-lg bg-${insight.color}-50 text-${insight.color}-700 hover:bg-${insight.color}-100 transition-colors`}>
                    {insight.action}
                  </button>
                </div>"""

new_insight_jsx = """                <div key={idx} className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3 relative overflow-hidden group ${getColorStyles(insight.color).border} transition-colors`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${getColorStyles(insight.color).line}`}></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{insight.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{insight.description}</p>
                  </div>
                  <button onClick={()=>router.push(insight.link)} className={`self-start text-xs font-bold px-4 py-2 rounded-lg transition-colors ${getColorStyles(insight.color).btn}`}>
                    {insight.action}
                  </button>
                </div>"""

content = content.replace(old_insight_jsx, new_insight_jsx)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\dashboard\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Fixed candidate dashboard crashes")
