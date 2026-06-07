# -*- coding: utf-8 -*-
with open(r"app\register\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "const regRes = await fetch(`${API_URL}/api/auth/register`, {" in line:
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
            
    new_lines.append(line)

content = "".join(new_lines)
with open(r"app\register\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
