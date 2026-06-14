with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\verification\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

# 1. Update the payload logic
old_payload_start = """      let registrationDoc = verification?.registration_document_url;
      if (files['registrationDoc']) registrationDoc = await uploadFile(files['registrationDoc'], 'registration');

      const payload = {"""
      
new_payload_start = """      let gstCert = verification?.gst_certificate_url;
      if (files['gstCert']) gstCert = await uploadFile(files['gstCert'], 'gst-cert');

      let panCard = verification?.pan_url;
      if (files['panCard']) panCard = await uploadFile(files['panCard'], 'pan-card');

      let incorpCert = verification?.incorporation_certificate_url;
      if (files['incorpCert']) incorpCert = await uploadFile(files['incorpCert'], 'incorp-cert');

      const payload = {"""

content = content.replace(old_payload_start, new_payload_start)

# 2. Update payload fields
old_payload_fields = """        gst_number: gstNumber,
        pan_number: panNumber,
        linkedin_url: linkedinUrl,
        registration_document_url: registrationDoc,"""
        
new_payload_fields = """        gst_number: gstNumber,
        pan_number: panNumber,
        linkedin_url: linkedinUrl,
        gst_certificate_url: gstCert,
        pan_url: panCard,
        incorporation_certificate_url: incorpCert,"""

content = content.replace(old_payload_fields, new_payload_fields)

# 3. Update the UI inputs
old_ui = """                <p className="text-sm font-bold text-slate-700 mb-1">Company Registration Document</p>
                <p className="text-xs text-slate-500 mb-4">GST/CIN/Incorporation Cert (PDF or Image)</p>
                <input type="file" onChange={e => handleFileChange('registrationDoc', e)} className="text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {verification?.registration_document_url && <a href={verification.registration_document_url} target="_blank" className="text-xs text-blue-600 mt-2 block">View Uploaded Document</a>}"""
                
new_ui = """                <p className="text-sm font-bold text-slate-700 mb-1">Incorporation Certificate</p>
                <input type="file" onChange={e => handleFileChange('incorpCert', e)} className="text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {verification?.incorporation_certificate_url && <a href={verification.incorporation_certificate_url} target="_blank" className="text-xs text-blue-600 mt-2 block">View Uploaded Document</a>}
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50 group">
                <p className="text-sm font-bold text-slate-700 mb-1">GST Certificate</p>
                <input type="file" onChange={e => handleFileChange('gstCert', e)} className="text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {verification?.gst_certificate_url && <a href={verification.gst_certificate_url} target="_blank" className="text-xs text-blue-600 mt-2 block">View Uploaded Document</a>}
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50 group">
                <p className="text-sm font-bold text-slate-700 mb-1">PAN Card Image</p>
                <input type="file" onChange={e => handleFileChange('panCard', e)} className="text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {verification?.pan_url && <a href={verification.pan_url} target="_blank" className="text-xs text-blue-600 mt-2 block">View Uploaded Document</a>}"""

content = content.replace(old_ui, new_ui)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\verification\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Patched company verification form")
