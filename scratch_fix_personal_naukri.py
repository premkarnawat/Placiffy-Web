# -*- coding: utf-8 -*-
with open(r"components\candidate\profile\PersonalForm.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Rewrite the Personal Information section to use `data` and include all Naukri fields
naukri_fields = """      <div className="space-y-6">
        <h3 className="text-lg font-bold border-b pb-2">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Full Name</label><input type="text" value={data.fullName || ''} onChange={e => onChange({...data, fullName: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
          <div><label className="text-sm font-medium">Email</label><input type="email" value={data.email || ''} onChange={e => onChange({...data, email: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" disabled /></div>
          <div><label className="text-sm font-medium">Mobile Number</label><input type="tel" value={data.mobile_number || ''} onChange={e => onChange({...data, mobile_number: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
          <div><label className="text-sm font-medium">Date of Birth</label><input type="date" value={data.date_of_birth || ''} onChange={e => onChange({...data, date_of_birth: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
          <div>
            <label className="text-sm font-medium">Gender</label>
            <select value={data.gender || ''} onChange={e => onChange({...data, gender: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div><label className="text-sm font-medium">Nationality</label><input type="text" value={data.nationality || ''} onChange={e => onChange({...data, nationality: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
        </div>

        <h3 className="text-lg font-bold border-b pb-2 mt-8">Location & Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><label className="text-sm font-medium">Current Address</label><input type="text" value={data.current_address || ''} onChange={e => onChange({...data, current_address: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
          <div><label className="text-sm font-medium">City</label><input type="text" value={data.city || ''} onChange={e => onChange({...data, city: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
          <div><label className="text-sm font-medium">State</label><input type="text" value={data.state || ''} onChange={e => onChange({...data, state: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
          <div><label className="text-sm font-medium">Country</label><input type="text" value={data.country || ''} onChange={e => onChange({...data, country: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
          <div><label className="text-sm font-medium">Pincode</label><input type="text" value={data.pincode || ''} onChange={e => onChange({...data, pincode: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
        </div>

        <h3 className="text-lg font-bold border-b pb-2 mt-8">Professional Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Professional Headline</label><input type="text" value={data.headline || ''} onChange={e => onChange({...data, headline: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
          <div><label className="text-sm font-medium">Years of Experience</label><input type="number" min="0" value={data.experience_years || ''} onChange={e => onChange({...data, experience_years: e.target.value ? Number(e.target.value) : ''})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
          <div className="md:col-span-2"><label className="text-sm font-medium">Professional Summary</label><textarea rows={4} value={data.summary || ''} onChange={e => onChange({...data, summary: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors" /></div>
        </div>
      </div>
"""

# Replace the original block
content = re.sub(r'      <div className="space-y-4">\n        <h3 className="text-lg font-bold">Personal Information</h3>.*?</div>\n      </div>', naukri_fields, content, flags=re.DOTALL)

with open(r"components\candidate\profile\PersonalForm.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully injected all Naukri fields into PersonalForm using correct React Prop mapping!")
