with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\layout.tsx", "r", encoding="utf-8-sig") as f:
    content = f.read()

# We need to add a state for the search query and an onKeyDown handler
import re

# Add state hook if not present
if "const [searchQuery, setSearchQuery] = useState('');" not in content:
    content = content.replace(
        "const [unreadCount, setUnreadCount] = useState(0);",
        "const [unreadCount, setUnreadCount] = useState(0);\n  const [searchQuery, setSearchQuery] = useState('');"
    )

# Replace the static search div with an input
old_search = """<div className="flex items-center bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium text-slate-500 w-96 border border-slate-100">
            <Search size={16} className="mr-2 opacity-50"/> Search jobs, candidates, or messages...
          </div>"""

new_search = """<div className="flex items-center bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium text-slate-500 w-96 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
            <Search size={16} className="mr-2 opacity-50"/> 
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  router.push(`/company/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              placeholder="Search jobs, candidates, or messages..." 
              className="bg-transparent border-none outline-none w-full text-gray-700 placeholder:text-gray-400"
            />
          </div>"""

content = content.replace(old_search, new_search)

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\company\layout.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Updated global search bar in layout")
