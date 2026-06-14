import os

files_to_fix = [
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\verification\page.tsx",
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\verification\page.tsx",
    r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\verification\page.tsx"
]

for file_path in files_to_fix:
    with open(file_path, "r", encoding="utf-8-sig") as f:
        content = f.read()
    
    # Fix the payload status key
    content = content.replace("verification_status: verification?.verification_status", "status: verification?.status")
    content = content.replace("verification_status: verification?.status", "status: verification?.status")
    
    # Fix the UI references
    content = content.replace("verification?.verification_status", "verification?.status")
    content = content.replace("verification.verification_status", "verification.status")
    content = content.replace("v.verification_status", "v.status")
    
    # Fix the capitalization logic for candidate/company pages
    content = content.replace("=== 'Rejected' ? 'Pending' : (verification?.status || 'Pending')", "=== 'rejected' ? 'pending' : (verification?.status || 'pending')")
    content = content.replace("=== 'Rejected'", "=== 'rejected'")
    content = content.replace("'Pending'", "'pending'")
    content = content.replace("'Approved'", "'approved'")
    content = content.replace("'Rejected'", "'rejected'")
    
    # Also replace 'Not Submitted' to 'Not submitted' to avoid conflicts, actually the UI can use whatever it wants, but let's keep database 'pending'
    # Wait, the UI renders the status text. I should capitalize it in the UI, but in the DB it should be lowercase.
    # Let's fix the specific error checking:
    
    # Candidate / Company inserts:
    content = content.replace("await supabase.from('candidate_verifications').update(payload).eq('id', verification.id);", "const {error} = await supabase.from('candidate_verifications').update(payload).eq('id', verification.id); if(error) throw new Error(error.message);")
    content = content.replace("await supabase.from('candidate_verifications').insert([payload]);", "const {error} = await supabase.from('candidate_verifications').insert([payload]); if(error) throw new Error(error.message);")
    
    content = content.replace("await supabase.from('company_verifications').update(payload).eq('id', verification.id);", "const {error} = await supabase.from('company_verifications').update(payload).eq('id', verification.id); if(error) throw new Error(error.message);")
    content = content.replace("await supabase.from('company_verifications').insert([payload]);", "const {error} = await supabase.from('company_verifications').insert([payload]); if(error) throw new Error(error.message);")
    
    # Admin page updates:
    content = content.replace("await supabase.from('candidate_verifications').update({ status }).eq('id', id);", "const {error} = await supabase.from('candidate_verifications').update({ status }).eq('id', id); if(error) throw new Error(error.message);")
    content = content.replace("await supabase.from('company_verifications').update({ status }).eq('id', id);", "const {error} = await supabase.from('company_verifications').update({ status }).eq('id', id); if(error) throw new Error(error.message);")
    
    with open(file_path, "w", encoding="utf-8-sig") as f:
        f.write(content)
        
    print(f"Fixed {os.path.basename(file_path)}")
