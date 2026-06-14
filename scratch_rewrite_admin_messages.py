content = """'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  MessageSquare, Search, Filter, ShieldAlert, 
  Building2, User as UserIcon, Loader2, Download, CheckCircle2 
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function AdminMessaging() {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, flagged

  useEffect(() => {
    fetchGlobalConversations();

    const channel = supabase.channel('admin_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => fetchGlobalConversations())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchGlobalConversations = async () => {
    try {
      // Fetch all unique conversations with participants
      const { data: convData } = await supabase.from('conversations').select('id, status, created_at').order('created_at', { ascending: false });
      if (!convData || convData.length === 0) { setLoading(false); return; }
      
      const convIds = convData.map(c => c.id);
      
      const [partsRes, msgsRes, candsRes, compsRes] = await Promise.all([
        supabase.from('conversation_participants').select('conversation_id, user_id').in('conversation_id', convIds),
        supabase.from('messages').select('conversation_id, content, created_at, sender_id, read_at').in('conversation_id', convIds).order('created_at', { ascending: false }),
        supabase.from('candidates').select('user_id, first_name, last_name, profile_photo_url'),
        supabase.from('companies').select('user_id, company_name, logo_url')
      ]);

      const parts = partsRes.data || [];
      const msgs = msgsRes.data || [];
      const cands = candsRes.data || [];
      const comps = compsRes.data || [];

      const enriched = convData.map(conv => {
        const convParts = parts.filter(p => p.conversation_id === conv.id);
        const convMsgs = msgs.filter(m => m.conversation_id === conv.id);
        
        // Try to identify candidate and company
        const candPart = convParts.find(p => cands.some(c => c.user_id === p.user_id));
        const compPart = convParts.find(p => comps.some(c => c.user_id === p.user_id));
        
        const cand = cands.find(c => c.user_id === candPart?.user_id);
        const comp = comps.find(c => c.user_id === compPart?.user_id);
        
        const lastMsg = convMsgs[0];
        
        return {
          id: conv.id,
          status: conv.status,
          created_at: conv.created_at,
          candidate: cand ? { name: `${cand.first_name} ${cand.last_name}`, photo: cand.profile_photo_url } : null,
          company: comp ? { name: comp.company_name, logo: comp.logo_url } : null,
          lastMessage: lastMsg?.content,
          lastMessageTime: lastMsg?.created_at,
          totalMessages: convMsgs.length,
          flagged: conv.status === 'flagged'
        };
      });

      setConversations(enriched.sort((a,b) => new Date(b.lastMessageTime || b.created_at).getTime() - new Date(a.lastMessageTime || a.created_at).getTime()));
    } catch (e: any) {
      console.error(e);
      toast("error", "Error", "Failed to fetch global conversations");
    } finally {
      setLoading(false);
    }
  };

  const handleFlag = async (convId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'flagged' ? 'active' : 'flagged';
      await supabase.from('conversations').update({ status: newStatus }).eq('id', convId);
      fetchGlobalConversations();
      toast("success", "Status Updated", `Conversation has been ${newStatus}.`);
    } catch (e) {
      toast("error", "Error", "Failed to update status");
    }
  };

  const filtered = conversations.filter(c => {
    const term = searchTerm.toLowerCase();
    const candMatch = c.candidate?.name.toLowerCase().includes(term);
    const compMatch = c.company?.name.toLowerCase().includes(term);
    const textMatch = c.lastMessage?.toLowerCase().includes(term);
    const searchMatch = candMatch || compMatch || textMatch;
    
    const flagMatch = filterType === 'all' || (filterType === 'flagged' && c.flagged);
    return searchMatch && flagMatch;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-indigo-600" /> Messaging Overseer
          </h1>
          <p className="text-gray-500 mt-1">Monitor global communications between candidates and companies.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm font-medium"
            />
          </div>
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Conversations</option>
            <option value="flagged">Flagged Only</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Participants</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Latest Activity</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(conv => (
                <tr key={conv.id} className={`transition-colors ${conv.flagged ? 'bg-red-50/50' : 'hover:bg-slate-50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        {conv.candidate?.photo ? (
                          <img src={conv.candidate.photo} className="w-6 h-6 rounded-full object-cover"/>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-[10px] font-bold"><UserIcon size={12}/></div>
                        )}
                        <span className="font-medium text-gray-900">{conv.candidate?.name || 'Unknown Candidate'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {conv.company?.logo ? (
                          <img src={conv.company.logo} className="w-6 h-6 rounded-md object-cover border border-gray-200"/>
                        ) : (
                          <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center text-purple-600 text-[10px] font-bold"><Building2 size={12}/></div>
                        )}
                        <span className="font-medium text-gray-900">{conv.company?.name || 'Unknown Company'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 line-clamp-2 max-w-sm">{conv.lastMessage || 'No messages yet'}</div>
                    <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                      {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleString() : new Date(conv.created_at).toLocaleString()} 
                      <span className="mx-2">•</span> 
                      {conv.totalMessages} Messages
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {conv.flagged ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                        <ShieldAlert size={12}/> Flagged
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <CheckCircle2 size={12}/> Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleFlag(conv.id, conv.status)}
                        className={`p-2 rounded-xl transition-colors ${conv.flagged ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-red-600 bg-red-50 hover:bg-red-100'}`}
                        title={conv.flagged ? "Unflag" : "Flag"}
                      >
                        {conv.flagged ? <CheckCircle2 size={16}/> : <ShieldAlert size={16}/>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No conversations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\messages\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Messaging Overseer rebuilt")
