# -*- coding: utf-8 -*-
import re

with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the password input
old_password = r"""                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1\.5">Password <span className="text-red-500">\*</span></label>
                        <input type="password" name="password" required value={formData\.password} onChange={handleChange} className="w-full px-4 py-2\.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                      </div>"""

new_password = """                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input type={showPassword ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange} className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                            {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                          </button>
                        </div>
                      </div>"""

content = re.sub(old_password, new_password, content, flags=re.DOTALL)

# Replace handleSubmit fetch logic
old_fetch = r"""        // 1\. Register Auth
        const regRes = await fetch\(`\$\{API_URL\}/api/auth/register`, \{
          method: 'POST',
          headers: \{ 'Content-Type': 'application/json' \},
          body: JSON\.stringify\(\{
            email: formData\.email,
            password: formData\.password,
            full_name: formData\.fullName,
            role: 'candidate'
          \}\)
        \}\);

        if \(\!regRes\.ok\) \{
          const err = await regRes\.json\(\);
          throw new Error\(err\.detail \|\| 'Registration failed'\);
        \}
        
        const regData = await regRes\.json\(\);
        
        // 2\. Login
        login\(regData\.access_token, regData\.user\);
        toast\('success', 'Welcome to Placify', 'Your account has been created'\);
        router\.push\('/candidate/dashboard'\);"""

new_fetch = """        if (formData.password !== formData.confirmPassword) {
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
        router.push('/candidate/dashboard');"""

content = re.sub(old_fetch, new_fetch, content, flags=re.DOTALL)

with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
