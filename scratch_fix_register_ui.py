# -*- coding: utf-8 -*-
with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add confirmPassword to formData
content = content.replace("password: '',\n    consent: false", "password: '',\n    confirmPassword: '',\n    consent: false")

# 2. Add show password state
if "const [showPassword, setShowPassword] = useState(false);" not in content:
    content = content.replace("const [isUploading, setIsUploading] = useState(false);", "const [isUploading, setIsUploading] = useState(false);\n  const [showPassword, setShowPassword] = useState(false);\n  const [showConfirmPassword, setShowConfirmPassword] = useState(false);")

# 3. Update mandatory fields with *
content = content.replace(">Full Name</label>", ">Full Name <span className=\"text-red-500\">*</span></label>")
content = content.replace(">Email Address</label>", ">Email Address <span className=\"text-red-500\">*</span></label>")
content = content.replace(">Password</label>", ">Password <span className=\"text-red-500\">*</span></label>")

# 4. Add Confirm Password field
confirm_password_jsx = """
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={18} />
                      </div>
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                        className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
"""
# Find password input area and append the confirm password jsx, and add the showPassword toggle to the password field.
old_password_jsx = """                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={18} />
                      </div>
                      <input 
                        type="password"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>"""

new_password_jsx = """                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={18} />
                      </div>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
""" + confirm_password_jsx

content = content.replace(old_password_jsx, new_password_jsx)

# Add Eye, EyeOff to lucide-react imports
if "Eye," not in content and "EyeOff," not in content:
    content = content.replace("Mail, Lock, User,", "Mail, Lock, User, Eye, EyeOff,")

# 5. Fix the handleSubmit to use Supabase Auth!
old_submit = """      const regRes = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          role: 'candidate'
        })
      });
      
      if (!regRes.ok) { const err = await regRes.json(); throw new Error(err.detail || 'Registration failed'); }
      
      const regData = await regRes.json();
      
      // 2. Login
      login(regData.access_token, regData.user);
      toast('success', 'Welcome to Placify', 'Your account has been created');
      router.push('/candidate/dashboard');"""

new_submit = """      if (formData.password !== formData.confirmPassword) {
        toast('error', 'Error', 'Passwords do not match');
        return;
      }
      
      // 1. Register with Supabase Auth directly
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'candidate'
          }
        }
      });
      
      if (authError) throw new Error(authError.message);
      
      // 2. Add custom data to public.users if possible
      if (authData.user) {
        await supabase.from('users').upsert({
          id: authData.user.id,
          email: formData.email,
          name: formData.fullName,
          role: 'candidate'
        });
        
        // Add parsed resume info to candidates table
        await supabase.from('candidates').upsert({
          user_id: authData.user.id,
          headline: formData.headline,
          skills: formData.skills,
          location: formData.location
        });
      }
      
      toast('success', 'Welcome to Placify', 'Your account has been created');
      // Auth provider will detect the session and redirect, but we can push explicitly
      router.push('/candidate/dashboard');"""

content = content.replace(old_submit, new_submit)

with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
