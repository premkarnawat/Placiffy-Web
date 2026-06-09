# -*- coding: utf-8 -*-
with open(r"app\company\candidates\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

old_card_start = r'(\<div key=\{c\.id\}.*?)(?=\<div className="flex items-center justify-between pt-4 border-t border-gray-50"\>)'
match = re.search(old_card_start, content, flags=re.DOTALL)
if not match:
    print("Could not match old card")
    exit(1)

old_card = match.group(0)

# We will replace the bottom section of the card
old_bottom = """                          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                              <div className="flex items-center gap-1.5 text-xs font-bold">
                                  <ShieldCheck size={16} className={c.is_verified ? "text-blue-500" : "text-gray-400"} />
                                  <span className={c.is_verified ? "text-blue-700" : "text-gray-500"}>Trust Score: {c.trust_score || 0}</span>
                              </div>
                              <button className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ArrowRight size={16}/>
                              </button>
                          </div>"""

new_bottom = """                          <div className="flex items-center justify-between pt-4 border-t border-gray-50 mb-4">
                              <div className="flex flex-col gap-1 text-xs font-bold">
                                  <div className="flex items-center gap-1.5">
                                      <ShieldCheck size={16} className={c.is_verified ? "text-blue-500" : "text-gray-400"} />
                                      <span className={c.is_verified ? "text-blue-700" : "text-gray-500"}>Trust Score: {c.trust_score || 0}</span>
                                  </div>
                                  <div className="text-gray-400 font-medium">Availability: {c.availability || 'Immediate'}</div>
                                  <div className="text-gray-400 font-medium">Notice Period: {c.notice_period || 'None'}</div>
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-auto">
                              <button onClick={(e) => { e.stopPropagation(); window.location.href = `/company/candidates/${c.id}`}} className="px-3 py-2 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">View Profile</button>
                              <button onClick={(e) => { e.stopPropagation(); window.location.href = `/company/candidates/${c.id}/passport`}} className="px-3 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors">View Passport</button>
                              <button className="px-3 py-2 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">Save</button>
                              <button className="px-3 py-2 bg-[#0052CC] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">Shortlist</button>
                              <button onClick={(e) => { e.stopPropagation(); window.location.href = `/company/messages?candidate=${c.id}`}} className="px-3 py-2 border border-blue-200 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 transition-colors">Message</button>
                              <button className="px-3 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors">Interview</button>
                          </div>"""

if old_bottom in content:
    content = content.replace(old_bottom, new_bottom)
    with open(r"app\company\candidates\page.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed candidate card bottom")
else:
    print("Could not find old bottom")
