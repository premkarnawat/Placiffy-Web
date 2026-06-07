# -*- coding: utf-8 -*-
with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_handle_upload = """  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    // Simulate parsing and extracting details
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        fullName: 'Alex Montgomery',
        email: 'alex.m@example.design',
        headline: 'Senior Product Designer & AI Orchestrator',
        skills: 'Design Systems, AI Prompting, React / Framer, UX Research',
        location: 'San Francisco, CA'
      }));
      setIsUploading(false);
      setStep(2);
    }, 2000);
  };"""

new_handle_upload = """  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      
      const res = await fetch(`${API_URL}/api/resume/parse-public`, {
        method: 'POST',
        body: formDataObj
      });
      
      if (!res.ok) throw new Error('Failed to parse resume');
      
      const data = await res.json();
      if (data.status === 'success' && data.extracted_data) {
        setFormData(prev => ({
          ...prev,
          fullName: data.extracted_data.fullName || prev.fullName,
          email: data.extracted_data.email || prev.email,
          headline: data.extracted_data.headline || prev.headline,
          skills: data.extracted_data.skills || prev.skills,
          location: data.extracted_data.location || prev.location
        }));
      }
      
      toast('success', 'Resume parsed successfully');
      setStep(2);
    } catch (err: any) {
      toast('error', 'Upload Error', err.message);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSocialLogin = (provider: string) => {
    toast('info', `${provider} Integration`, `${provider} OAuth is currently being configured in the Supabase Dashboard. Please use Email/Password or Resume upload for now.`);
  };"""

content = content.replace(old_handle_upload, new_handle_upload)

# Add onClick to social buttons
content = content.replace("""<button className="w-full flex items-center justify-center gap-3 bg-[#1A56DB] hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium transition-colors shadow-sm">""", """<button onClick={() => handleSocialLogin('LinkedIn')} className="w-full flex items-center justify-center gap-3 bg-[#1A56DB] hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium transition-colors shadow-sm">""")
content = content.replace("""<button className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium transition-colors">
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                      Google
                    </button>""", """<button onClick={() => handleSocialLogin('Google')} className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium transition-colors">
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                      Google
                    </button>""")
content = content.replace("""<button className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium transition-colors">
                      <Github size={20} />
                      GitHub
                    </button>""", """<button onClick={() => handleSocialLogin('GitHub')} className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium transition-colors">
                      <Github size={20} />
                      GitHub
                    </button>""")

with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
