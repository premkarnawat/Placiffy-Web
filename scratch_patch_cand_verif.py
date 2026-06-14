with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\verification\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

# 1. Inject the file upload handles in the submit payload
old_payload_start = """      if (files['aadhaarFront']) aadhaarFront = await uploadFile(files['aadhaarFront'], 'aadhaar-front');
      if (files['aadhaarBack']) aadhaarBack = await uploadFile(files['aadhaarBack'], 'aadhaar-back');

      const payload = {"""
      
new_payload_start = """      if (files['aadhaarFront']) aadhaarFront = await uploadFile(files['aadhaarFront'], 'aadhaar-front');
      if (files['aadhaarBack']) aadhaarBack = await uploadFile(files['aadhaarBack'], 'aadhaar-back');
      
      let panUrl = verification?.pan_url;
      if (files['panUrl']) panUrl = await uploadFile(files['panUrl'], 'pan');
      
      let passportUrl = verification?.passport_url;
      if (files['passportUrl']) passportUrl = await uploadFile(files['passportUrl'], 'passport');
      
      let otherLinks = verification?.other_links || {};
      if (files['experienceLetter']) otherLinks.experience_letter = await uploadFile(files['experienceLetter'], 'experience-letter');
      if (files['degreeCertificate']) otherLinks.degree_certificate = await uploadFile(files['degreeCertificate'], 'degree-certificate');

      const payload = {"""

content = content.replace(old_payload_start, new_payload_start)

# 2. Add the fields to payload
old_payload_fields = """        aadhaar_front_url: aadhaarFront,
        aadhaar_back_url: aadhaarBack,
        pan_number: panNumber,
        linkedin_url: linkedinUrl,
        github_url: githubUrl,
        portfolio_url: portfolioUrl,
        status: verification?.status === 'rejected' ? 'pending' : (verification?.status || 'pending')"""
        
new_payload_fields = """        aadhaar_front_url: aadhaarFront,
        aadhaar_back_url: aadhaarBack,
        pan_number: panNumber,
        pan_url: panUrl,
        passport_url: passportUrl,
        linkedin_url: linkedinUrl,
        github_url: githubUrl,
        portfolio_url: portfolioUrl,
        other_links: otherLinks,
        status: verification?.status === 'rejected' ? 'pending' : (verification?.status || 'pending')"""

content = content.replace(old_payload_fields, new_payload_fields)

# 3. Add onChange bindings to HTML inputs
content = content.replace(
    '<p className="text-sm font-bold text-slate-700 mb-1">PAN Card (Optional)</p>\n                <p className="text-xs text-slate-500 mb-4">JPEG, PNG or PDF</p>\n                <input type="file"',
    '<p className="text-sm font-bold text-slate-700 mb-1">PAN Card (Optional)</p>\n                <p className="text-xs text-slate-500 mb-4">JPEG, PNG or PDF</p>\n                <input type="file" onChange={e => handleFileChange(\'panUrl\', e)}'
)
content = content.replace(
    '<p className="text-sm font-bold text-slate-700 mb-1">Passport (Optional)</p>\n                <p className="text-xs text-slate-500 mb-4">JPEG, PNG or PDF</p>\n                <input type="file"',
    '<p className="text-sm font-bold text-slate-700 mb-1">Passport (Optional)</p>\n                <p className="text-xs text-slate-500 mb-4">JPEG, PNG or PDF</p>\n                <input type="file" onChange={e => handleFileChange(\'passportUrl\', e)}'
)
content = content.replace(
    '<p className="text-sm font-bold text-slate-700 mb-1">Experience/Offer Letters</p>\n                <input type="file"',
    '<p className="text-sm font-bold text-slate-700 mb-1">Experience/Offer Letters</p>\n                <input type="file" onChange={e => handleFileChange(\'experienceLetter\', e)}'
)
content = content.replace(
    '<p className="text-sm font-bold text-slate-700 mb-1">Degree Certificates</p>\n                <input type="file"',
    '<p className="text-sm font-bold text-slate-700 mb-1">Degree Certificates</p>\n                <input type="file" onChange={e => handleFileChange(\'degreeCertificate\', e)}'
)

# Render existing links if present in verification obj
content = content.replace(
    '<input type="file" onChange={e => handleFileChange(\'panUrl\', e)} className="mt-2 text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />',
    '<input type="file" onChange={e => handleFileChange(\'panUrl\', e)} className="mt-2 text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />\n                {verification?.pan_url && <a href={verification.pan_url} target="_blank" className="text-xs text-blue-600 mt-2 block">View Uploaded Document</a>}'
)
content = content.replace(
    '<input type="file" onChange={e => handleFileChange(\'passportUrl\', e)} className="mt-2 text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />',
    '<input type="file" onChange={e => handleFileChange(\'passportUrl\', e)} className="mt-2 text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />\n                {verification?.passport_url && <a href={verification.passport_url} target="_blank" className="text-xs text-blue-600 mt-2 block">View Uploaded Document</a>}'
)
content = content.replace(
    '<input type="file" onChange={e => handleFileChange(\'experienceLetter\', e)} className="mt-2 text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />',
    '<input type="file" onChange={e => handleFileChange(\'experienceLetter\', e)} className="mt-2 text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />\n                {verification?.other_links?.experience_letter && <a href={verification.other_links.experience_letter} target="_blank" className="text-xs text-blue-600 mt-2 block">View Uploaded Document</a>}'
)
content = content.replace(
    '<input type="file" onChange={e => handleFileChange(\'degreeCertificate\', e)} className="mt-2 text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />',
    '<input type="file" onChange={e => handleFileChange(\'degreeCertificate\', e)} className="mt-2 text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />\n                {verification?.other_links?.degree_certificate && <a href={verification.other_links.degree_certificate} target="_blank" className="text-xs text-blue-600 mt-2 block">View Uploaded Document</a>}'
)


with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\verification\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Patched candidate verification form with file bindings and db payload.")
