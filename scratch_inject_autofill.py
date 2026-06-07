# -*- coding: utf-8 -*-
with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add API_URL constant
api_url_code = """
const SECTIONS = [
"""
api_url_replacement = """
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://placify-backend-dzj7.onrender.com';

const SECTIONS = [
"""
content = content.replace(api_url_code, api_url_replacement)

# 2. Add isParsing state
state_code = """
  const [activeSection, setActiveSection] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
"""
state_replacement = """
  const [activeSection, setActiveSection] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isParsing, setIsParsing] = useState(false);
"""
content = content.replace(state_code, state_replacement)

# 3. Add handleResumeUpload function
func_code = """
  const calculateCompletion = () => {
"""
func_replacement = """
  const handleResumeUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      toast('info', 'Uploading Resume', 'Uploading your resume to secure storage...');
      const { error: uploadError } = await supabase.storage.from('candidate_resumes').upload(filePath, file);
      if (uploadError) throw uploadError;

      // 2. Parse via FastAPI
      toast('info', 'Parsing Resume', 'Extracting details using Llama-3 AI...');
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      
      const res = await fetch(`${API_URL}/api/resume/parse-public`, {
        method: 'POST',
        body: formDataObj
      });
      
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Failed to parse resume'); }
      
      const data = await res.json();
      if (data.status === 'success' && data.extracted_data) {
        // 3. Auto-fill the form
        setFormData(prev => ({
          ...prev,
          personal: {
            ...prev.personal,
            fullName: data.extracted_data.fullName || prev.personal.fullName,
            email: data.extracted_data.email || prev.personal.email,
            current_location: data.extracted_data.location || prev.personal.current_location,
          },
          professional: {
            ...prev.professional,
            current_designation: data.extracted_data.headline || prev.professional.current_designation,
          },
          skills: data.extracted_data.skills || prev.skills,
        }));
        toast('success', 'Auto-Fill Complete', 'Your details have been populated from your resume.');
      }
    } catch (err: any) {
      toast('error', 'Auto-Fill Failed', err.message);
    } finally {
      setIsParsing(false);
    }
  };

  const calculateCompletion = () => {
"""
content = content.replace(func_code, func_replacement)

# 4. Add the Auto-Fill Button UI next to Save Changes
ui_code = """
          <button 
            onClick={handleSave}
            disabled={isSaving}
"""
ui_replacement = """
          <label className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2.5 rounded-xl font-medium transition-all cursor-pointer shadow-sm border border-indigo-200">
            <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} disabled={isParsing} />
            {isParsing ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
            <span className="hidden sm:inline">Auto-Fill from Resume</span>
            <span className="sm:hidden">Auto-Fill</span>
          </label>
          <button 
            onClick={handleSave}
            disabled={isSaving || isParsing}
"""
content = content.replace(ui_code, ui_replacement)


with open(r"app\candidate\profile\edit\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected Auto-Fill functionality into Profile Editor!")
