import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\candidates\[id]\page.tsx"

if os.path.exists(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Inject isMounted state and effect
    content = content.replace("const [loading, setLoading] = useState(true);", "const [loading, setLoading] = useState(true);\n  const [isMounted, setIsMounted] = useState(false);")
    content = content.replace("useEffect(() => {\n    fetchCandidate();\n  }, [params.id]);", "useEffect(() => {\n    setIsMounted(true);\n    fetchCandidate();\n  }, [params.id]);")
    
    # Replace loading check
    content = content.replace("if (loading) return", "if (!isMounted || loading) return")
    
    # Fix the dates to use split('T')[0] for extra safety
    content = content.replace("{new Date(a.applied_at).toLocaleDateString()}", "{a.applied_at ? a.applied_at.split('T')[0] : 'N/A'}")
    content = content.replace("{new Date(cand.created_at).toLocaleDateString()}", "{cand.created_at ? cand.created_at.split('T')[0] : 'N/A'}")
    content = content.replace("{cand.last_active_at ? new Date(cand.last_active_at).toLocaleDateString() : 'N/A'}", "{cand.last_active_at ? cand.last_active_at.split('T')[0] : 'N/A'}")
    content = content.replace("{cand.last_profile_update ? new Date(cand.last_profile_update).toLocaleDateString() : 'N/A'}", "{cand.last_profile_update ? cand.last_profile_update.split('T')[0] : 'N/A'}")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Sanitized candidates profile page")
else:
    print("File not found")
