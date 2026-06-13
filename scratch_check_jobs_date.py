import os
filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\jobs\[id]\page.tsx"
if os.path.exists(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        if "toLocaleDateString" in content:
            print("Found toLocaleDateString in jobs page")
            content = content.replace("const [loading, setLoading] = useState(true);", "const [loading, setLoading] = useState(true);\n  const [isMounted, setIsMounted] = useState(false);")
            content = content.replace("useEffect(() => {\n    fetchJob();\n  }, [params.id]);", "useEffect(() => {\n    setIsMounted(true);\n    fetchJob();\n  }, [params.id]);")
            content = content.replace("if (loading) return", "if (!isMounted || loading) return")
            with open(filepath, "w", encoding="utf-8") as f2:
                f2.write(content)
            print("Hydration fixed in jobs page")
        else:
            print("No toLocaleDateString found in jobs page")
