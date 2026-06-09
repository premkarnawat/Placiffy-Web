import sys
file_path = r'c:/Users/premk/.gemini/antigravity/playground/ruby-galaxy/components/candidate/profile/PersonalForm.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_str = """      <div className=\"space-y-4\">
        <h3 className=\"text-lg font-bold\">Personal Information</h3>
        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
          <div><label className=\"text-sm font-medium\">Full Name</label><input type=\"text\" value={data.fullName || ''} onChange={e => onChange({...data, fullName: e.target.value})} className=\"w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors\" /></div>
          <div><label className=\"text-sm font-medium\">Email</label><input type=\"email\" value={data.email || ''} onChange={e => onChange({...data, email: e.target.value})} className=\"w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors\" /></div>
          <div><label className=\"text-sm font-medium\">Phone</label><input type=\"text\" value={data.phone || ''} onChange={e => onChange({...data, phone: e.target.value})} className=\"w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors\" /></div>
          <div><label className=\"text-sm font-medium\">Location</label><input type=\"text\" value={data.location || ''} onChange={e => onChange({...data, location: e.target.value})} className=\"w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors\" /></div>
          <div><label className=\"text-sm font-medium\">Professional Headline</label><input type=\"text\" value={data.headline || ''} onChange={e => onChange({...data, headline: e.target.value})} className=\"w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors\" /></div>
        </div>
      </div>
    </div>"""new_str = """      <div className=\"space-y-4\">
        <h3 className=\"text-lg font-bold\">Personal Information</h3>
        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
          <div><label className=\"text-sm font-medium\">Full Name</label><input type=\"text\" value={data.fullName || ''} onChange={e => onChange({...data, fullName: e.target.value})} className=\"w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors\" /></div>
          <div><label className=\"text-sm font-medium\">Email</label><input type=\"email\" value={data.email || ''} onChange={e => onChange({...data, email: e.target.value})} className=\"w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors\" /></div>
          <div><label className=\"text-sm font-medium\">Location</label><input type=\"text\" value={data.location || ''} onChange={e => onChange({...data, location: e.target.value})} className=\"w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors\" /></div>
          <div><label className=\"text-sm font-medium\">Professional Headline</label><input type=\"text\" value={data.headline || ''} onChange={e => onChange({...data, headline: e.target.value})} className=\"w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors\" /></div>
          <div><label className=\"text-sm font-medium\">Years of Experience</label><input type=\"number\" min=\"0\" value={data.experience_years || ''} onChange={e => onChange({...data, experience_years: e.target.value ? Number(e.target.value) : ''})} className=\"w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors\" /></div>
          <div className=\"md:col-span-2\"><label className=\"text-sm font-medium\">Professional Summary</label><textarea rows={4} value={data.summary || ''} onChange={e => onChange({...data, summary: e.target.value})} className=\"w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors\" /></div>
        </div>
      </div>
    </div>"""

if old_str in content:
    content = content.replace(old_str, new_str)
    with open(file_path, 'w', encoding='utf-8') as fw:
        fw.write(content)
    print(\"Updated PersonalForm.tsx successfully\")
else:
    print(\"Could not find the target string in PersonalForm.tsx\")