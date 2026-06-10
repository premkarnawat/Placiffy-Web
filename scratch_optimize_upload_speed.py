# -*- coding: utf-8 -*-
with open(r"app\company\jobs\create\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_upload_logic = """    toast("info", "AI Parsing JD", "Uploading original document and extracting core entities...");
    
    try {
      // 1. Upload the raw JD to Supabase storage natively
      const timestamp = new Date().getTime();
      const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('jds').upload(filename, file);
      
      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage.from('jds').getPublicUrl(filename);
        setFormData(p => ({ ...p, original_jd_url: publicUrlData.publicUrl }));
      }"""

new_upload_logic = """    toast("info", "AI Parsing JD", "Extracting core entities via Gemini...");
    
    try {
      // 1. Fire off the Supabase upload NON-BLOCKINGLY for instant UX
      const timestamp = new Date().getTime();
      const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      supabase.storage.from('jds').upload(filename, file).then(({ data, error }) => {
        if (!error && data) {
          const { data: publicUrlData } = supabase.storage.from('jds').getPublicUrl(filename);
          setFormData(p => ({ ...p, original_jd_url: publicUrlData.publicUrl }));
        }
      }).catch(console.error);"""

if old_upload_logic in content:
    content = content.replace(old_upload_logic, new_upload_logic)
    with open(r"app\company\jobs\create\page.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Optimization applied: Supabase upload is now non-blocking.")
else:
    print("Could not find the target string to replace.")
