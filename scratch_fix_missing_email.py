# -*- coding: utf-8 -*-
import os
import re

# Fix company registration
path_company = r"app\company\register\page.tsx"
if os.path.exists(path_company):
    with open(path_company, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Restore the email field inside signUp
    content = content.replace(
"""      const { data: authData, error: authError } = await supabase.auth.signUp({
          password: formData.password,""",
"""      const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.official_email,
          password: formData.password,""")
          
    with open(path_company, "w", encoding="utf-8") as f:
        f.write(content)

# Fix candidate registration
path_candidate = r"app\candidate\register\page.tsx"
if os.path.exists(path_candidate):
    with open(path_candidate, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Restore the email field inside signUp
    content = content.replace(
"""      const { data: sessionData, error: authError } = await supabase.auth.signUp({
          password: authData.password,""",
"""      const { data: sessionData, error: authError } = await supabase.auth.signUp({
          email: authData.email,
          password: authData.password,""")
          
    with open(path_candidate, "w", encoding="utf-8") as f:
        f.write(content)

print("Restored missing email fields in signUp blocks!")
