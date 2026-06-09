# -*- coding: utf-8 -*-
import os

for layout_path in [r"app\company\layout.tsx", r"app\candidate\layout.tsx"]:
    if os.path.exists(layout_path):
        with open(layout_path, "r", encoding="utf-8") as f:
            content = f.read()

        import re
        
        # Remove the bad early return
        content = re.sub(r'  // Bypass auth guard for registration pages\n  if \(pathname === \'/company/register\' \|\| pathname === \'/candidate/register\'\) \{\n    return <>{children}</>;\n  \}\n', '', content)
        
        # Rewrite the useEffect to include the bypass
        old_effect = r'  useEffect\(\(\) => \{\n    if \(!isLoading\) \{\n      if \(!user\) \{\n        router\.push\("/login"\);\n      \} else if \(user\.role === "(.*?)"\) \{\n        router\.push\("/(.*?)/dashboard"\);\n      \} else if \(user\.role === "(.*?)"\) \{\n        router\.push\("/(.*?)/dashboard"\);\n      \}\n    \}\n  \}, \[user, isLoading, router\]\);'
        
        # We will dynamically replace it
        if "app\\company\\layout" in layout_path:
            new_effect = """  useEffect(() => {
    if (pathname === '/company/register') return; // Bypass auth guard for registration
    
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "candidate") {
        router.push("/candidate/dashboard");
      } else if (user.role === "admin") {
        router.push("/admin/dashboard");
      }
    }
  }, [user, isLoading, router, pathname]);"""
        else:
            new_effect = """  useEffect(() => {
    if (pathname === '/candidate/register') return; // Bypass auth guard for registration
    
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "company") {
        router.push("/company/dashboard");
      } else if (user.role === "admin") {
        router.push("/admin/dashboard");
      }
    }
  }, [user, isLoading, router, pathname]);"""

        content = re.sub(old_effect, new_effect, content, flags=re.DOTALL)
        
        # We ALSO need to bypass the render condition!
        old_render_cond = r'  if \(isLoading \|\| !user \|\| \(user\.role !== "(.*?)" && user\.role !== "(.*?)"\)\) \{'
        
        if "app\\company\\layout" in layout_path:
            new_render_cond = """  if (pathname === '/company/register') return <>{children}</>;\n\n  if (isLoading || !user || (user.role !== "company" && user.role !== "admin")) {"""
            content = re.sub(old_render_cond, new_render_cond, content)
        else:
            new_render_cond = """  if (pathname === '/candidate/register') return <>{children}</>;\n\n  if (isLoading || !user || (user.role !== "candidate" && user.role !== "admin")) {"""
            content = re.sub(old_render_cond, new_render_cond, content)
            
        with open(layout_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed hooks in {layout_path}")
