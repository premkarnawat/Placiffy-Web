with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\help\page.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

old_query = """        const { data: fData } = await supabase.from('faqs').select('*');
        const { data: kData } = await supabase.from('knowledge_base').select('*');
        setFaqs(fData || []);
        setKbArticles(kData || []);"""

new_query = """        const { data: kData } = await supabase.from('knowledge_base_articles').select('*');
        setFaqs([]); // Use hardcoded FAQs or empty for now
        setKbArticles(kData || []);"""

content = content.replace(old_query, new_query)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\candidate\help\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)
print("Updated candidate help page")
