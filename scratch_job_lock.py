# -*- coding: utf-8 -*-
import re

with open(r"app\candidate\jobs\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# We need to fetch the candidate's profile_completion_pct and enforce the lock
fetch_logic = """
  const [completionPct, setCompletionPct] = useState(0);

  useEffect(() => {
    fetchJobs();
    if (user) fetchCandidateStats();
  }, [user, searchTerm, activeFilter]);

  const fetchCandidateStats = async () => {
    const { data } = await supabase.from('candidates').select('profile_completion_pct').eq('user_id', user?.id).single();
    if (data) setCompletionPct(data.profile_completion_pct || 0);
  };
"""

button_logic = """
                    {completionPct < 80 ? (
                      <button disabled className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold bg-gray-100 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2" title="Complete 80% of your profile to unlock applications">
                        <Lock size={16} /> Locked (Need 80%)
                      </button>
                    ) : (
                      <button onClick={() => handleApply(job.id)} disabled={isApplying === job.id} className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2">
                        {isApplying === job.id ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        Easy Apply
                      </button>
                    )}
"""

content = re.sub(r'  useEffect\(\(\) => \{.*?\}, \[searchTerm, activeFilter\]\);', fetch_logic, content, flags=re.DOTALL)
content = re.sub(r'                    <button onClick=\{.*?Easy Apply\n                    </button>', button_logic, content, flags=re.DOTALL)
content = content.replace("import { Search, MapPin, Briefcase, Filter, Loader2, Bookmark, BookmarkCheck, Building2, Send, Clock, DollarSign, ChevronRight } from 'lucide-react';", "import { Search, MapPin, Briefcase, Filter, Loader2, Bookmark, BookmarkCheck, Building2, Send, Clock, DollarSign, ChevronRight, Lock } from 'lucide-react';")

with open(r"app\candidate\jobs\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Implemented 80% Profile Completion Application Lock!")
