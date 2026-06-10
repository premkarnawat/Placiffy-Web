# -*- coding: utf-8 -*-
with open(r"components\candidate\profile\PreferencesForm.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# We will rewrite the PreferencesForm to include the new Naukri-style fields
new_preferences = """
export default function PreferencesForm({ formData, setFormData }: { formData: any, setFormData: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Job Role</label>
          <input type="text" value={formData.current_job_role || ''} onChange={e => setFormData({...formData, current_job_role: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Senior Frontend Developer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
          <input type="text" value={formData.industry || ''} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Information Technology" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current CTC (LPA)</label>
          <input type="number" step="0.1" value={formData.current_ctc || ''} onChange={e => setFormData({...formData, current_ctc: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. 15.5" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary / CTC (LPA)</label>
          <input type="number" step="0.1" value={formData.expected_salary || ''} onChange={e => setFormData({...formData, expected_salary: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. 25.0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period</label>
          <select value={formData.notice_period || ''} onChange={e => setFormData({...formData, notice_period: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            <option value="Immediate">Immediate</option>
            <option value="15 Days">15 Days</option>
            <option value="30 Days">30 Days</option>
            <option value="60 Days">60 Days</option>
            <option value="90 Days">90 Days</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Location</label>
          <input type="text" value={formData.preferred_location || ''} onChange={e => setFormData({...formData, preferred_location: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Bangalore, Remote" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
          <select value={formData.work_mode || ''} onChange={e => setFormData({...formData, work_mode: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            <option value="">Select Mode</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
          <select value={formData.employment_type || ''} onChange={e => setFormData({...formData, employment_type: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            <option value="">Select Type</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Availability Status</label>
          <select value={formData.availability_status || ''} onChange={e => setFormData({...formData, availability_status: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            <option value="Actively Looking">Actively Looking</option>
            <option value="Open to Offers">Open to Offers</option>
            <option value="Not Looking">Not Looking</option>
          </select>
        </div>
      </div>
    </div>
  );
}
"""

content = re.sub(r'export default function PreferencesForm.*?(?=;)', new_preferences, content, flags=re.DOTALL)
# Wait, re.sub might miss the last '}' if not careful. Let's just overwrite it completely since it's small.

with open(r"components\candidate\profile\PreferencesForm.tsx", "w", encoding="utf-8") as f:
    f.write(new_preferences)

print("Updated PreferencesForm with complete Naukri Schema fields!")
