with open("package.json", "r", encoding="utf-8") as f:
    print("@supabase/ssr" in f.read())
