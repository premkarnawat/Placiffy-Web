# -*- coding: utf-8 -*-
with open(r"app\login\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

handle_social = """
  const handleSocialLogin = (provider: string) => {
    toast('info', `${provider} Integration`, `${provider} OAuth is currently being configured in the Supabase Dashboard. Please use Email/Password for now.`);
  };"""

content = content.replace("const { toast } = useToast();\n", "const { toast } = useToast();\n" + handle_social)

# Update buttons
content = content.replace("""<button className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <Linkedin size={18} className="text-blue-700" /> LinkedIn
            </button>""", """<button type="button" onClick={() => handleSocialLogin('LinkedIn')} className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <Linkedin size={18} className="text-blue-700" /> LinkedIn
            </button>""")

content = content.replace("""<button className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <Github size={18} /> GitHub
            </button>""", """<button type="button" onClick={() => handleSocialLogin('GitHub')} className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <Github size={18} /> GitHub
            </button>""")

with open(r"app\login\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
