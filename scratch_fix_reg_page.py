# -*- coding: utf-8 -*-
with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the password input JSX
old_password = """                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                      </div>"""

new_password = """                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input type={showPassword ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10" />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                            {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                          </button>
                        </div>
                      </div>"""

if old_password in content:
    content = content.replace(old_password, new_password)

# Make Full Name and Email Address mandatory with red star
content = content.replace(
    '<label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>',
    '<label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>'
)
content = content.replace(
    '<label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>',
    '<label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>'
)

# Add state variables
if "showPassword" not in content:
    content = content.replace(
        "const [isUploading, setIsUploading] = useState(false);",
        "const [isUploading, setIsUploading] = useState(false);\n  const [showPassword, setShowPassword] = useState(false);\n  const [showConfirmPassword, setShowConfirmPassword] = useState(false);"
    )

# Add initial state
content = content.replace(
    "password: '',\n    consent: false",
    "password: '',\n    confirmPassword: '',\n    consent: false"
)

# Replace lucide imports
if "Eye," not in content:
    content = content.replace(
        "import { Check, Upload, FileText, Loader2, ArrowRight } from 'lucide-react';",
        "import { Check, Upload, FileText, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';"
    )

# Replace handleSubmit logic
old_submit = """        // 1. Register Auth
        const regRes = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            full_name: formData.fullName,
            role: 'candidate'
          })
        });
  
        if (!regRes.ok) {
          const err = await regRes.json();
          throw new Error(err.detail || 'Registration failed');
        }
  
        const { access_token, user } = await regRes.json();
        login(access_token, user);
  
        // 2. Update Profile
        const token = access_token;"""

new_submit = """        if (formData.password !== formData.confirmPassword) {
          toast('error', 'Error', 'Passwords do not match');
          return;
        }

        // 1. Register with Supabase Native Auth
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
  
        if (authError) {
          throw new Error(authError.message);
        }
  
        if (!authData.session) {
          toast('info', 'Please check your email to verify your account');
          // If no session, they must confirm email
          return;
        }
        
        // Push user to public.users table to fulfill any FK constraints
        try {
          await supabase.from('users').upsert({
            id: authData.user!.id,
            email: formData.email,
            name: formData.fullName,
            role: 'candidate'
          });
        } catch (e) {
          console.error('Failed to sync user data', e);
        }

        login(authData.session.access_token, {
          id: authData.user!.id,
          email: formData.email,
          role: 'candidate',
          name: formData.fullName
        });
  
        // 2. Update Profile
        const token = authData.session.access_token;"""

if old_submit in content:
    content = content.replace(old_submit, new_submit)
else:
    print("WARNING: Could not find old_submit string")

with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
