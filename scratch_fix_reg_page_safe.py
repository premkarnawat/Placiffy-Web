# -*- coding: utf-8 -*-
with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    # 1. Imports
    if "import { Check, Upload, FileText, Loader2, ArrowRight } from 'lucide-react';" in line:
        new_lines.append("import { Check, Upload, FileText, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';\n")
        continue

    # 2. State variables
    if "const [isUploading, setIsUploading] = useState(false);" in line:
        new_lines.append(line)
        new_lines.append("  const [showPassword, setShowPassword] = useState(false);\n")
        new_lines.append("  const [showConfirmPassword, setShowConfirmPassword] = useState(false);\n")
        continue
        
    # 3. Form Data State
    if "password: ''," in line:
        new_lines.append(line)
        new_lines.append("    confirmPassword: '',\n")
        continue

    # 4. handleSubmit
    if "const regRes = await fetch(`${API_URL}/api/auth/register`," in line:
        new_lines.append("""        if (formData.password !== formData.confirmPassword) {
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
          toast('info', 'Verification', 'Please check your email to verify your account');
          return;
        }
        
        try {
          await supabase.from('users').upsert({
            id: authData.user.id,
            email: formData.email,
            name: formData.fullName,
            role: 'candidate'
          });
          
          await supabase.from('candidates').upsert({
            user_id: authData.user.id,
            headline: formData.headline,
            skills: formData.skills,
            location: formData.location
          });
        } catch (e) {
          console.error('Failed to sync user data', e);
        }

        login(authData.session.access_token, {
          id: authData.user.id,
          email: formData.email,
          role: 'candidate',
          name: formData.fullName
        });

        // 2. Update Profile
        const token = authData.session.access_token;\n""")
        skip = True
        continue

    if skip:
        if "// 2. Update Profile" in line:
            skip = False
            continue
        else:
            continue

    # 5. JSX Fields
    if '<label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>' in line:
        new_lines.append('                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>\n')
        continue
        
    if '<label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>' in line:
        new_lines.append('                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>\n')
        continue

    if '<label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>' in line:
        new_lines.append('                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>\n')
        new_lines.append('                      <div className="relative">\n')
        new_lines.append('                        <input type={showPassword ? \'text\' : \'password\'} name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10" />\n')
        new_lines.append('                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">\n')
        new_lines.append('                          {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}\n')
        new_lines.append('                        </button>\n')
        new_lines.append('                      </div>\n')
        new_lines.append('                    </div>\n')
        new_lines.append('                    <div>\n')
        new_lines.append('                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>\n')
        new_lines.append('                      <div className="relative">\n')
        new_lines.append('                        <input type={showConfirmPassword ? \'text\' : \'password\'} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10" />\n')
        new_lines.append('                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">\n')
        new_lines.append('                          {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}\n')
        new_lines.append('                        </button>\n')
        new_lines.append('                      </div>\n')
        skip = True
        continue
        
    if skip:
        # We skipped the handleSubmit earlier and unset it on "Update Profile".
        # If we are skipping the password block, we stop skipping on the next div (Location)
        if '                    <div>' in line and 'Location' in lines[i+1]:
            skip = False
            new_lines.append(line)
            continue
        elif '                    <div>' in line and 'LinkedIn' in lines[i+1]:
            # fallback if Location doesn't exist
            skip = False
            new_lines.append(line)
            continue
        else:
            continue

    new_lines.append(line)

with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.writelines(new_lines)
