content = """'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { 
  Bell, Send, Loader2, Users, Building2, 
  ShieldCheck, AlertCircle, History, User as UserIcon
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function AdminNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [target, setTarget] = useState('all_candidates');
  const [specificUserId, setSpecificUserId] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('audit_logs')
        .select('*')
        .eq('target_entity', 'broadcast')
        .order('created_at', { ascending: false })
        .limit(50);
        
      setHistory(data || []);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast("error", "Error", "Title and Message are required");
      return;
    }

    try {
      setSending(true);
      let targetUserIds: string[] = [];

      if (target === 'specific') {
        if (!specificUserId.trim()) throw new Error("Specific User ID required");
        targetUserIds = [specificUserId.trim()];
      } else if (target === 'all_candidates') {
        const { data } = await supabase.from('candidates').select('user_id').not('user_id', 'is', null);
        targetUserIds = data?.map(d => d.user_id) || [];
      } else if (target === 'verified_candidates') {
        const { data } = await supabase.from('candidates').select('user_id').eq('verification_badge', true).not('user_id', 'is', null);
        targetUserIds = data?.map(d => d.user_id) || [];
      } else if (target === 'all_companies') {
        const { data } = await supabase.from('companies').select('user_id').not('user_id', 'is', null);
        targetUserIds = data?.map(d => d.user_id) || [];
      } else if (target === 'verified_companies') {
        const { data } = await supabase.from('companies').select('user_id').eq('verification_badge', true).not('user_id', 'is', null);
        targetUserIds = data?.map(d => d.user_id) || [];
      }

      if (targetUserIds.length === 0) {
        toast("error", "Error", "No users found for this target group");
        setSending(false);
        return;
      }

      // Batch insert notifications
      const payloads = targetUserIds.map(uid => ({
        user_id: uid,
        title: title.trim(),
        message: message.trim(),
        type: type
      }));

      const { error: insertError } = await supabase.from('notifications').insert(payloads);
      if (insertError) throw insertError;

      // Log broadcast
      await supabase.from('audit_logs').insert({
        admin_id: user?.id,
        action: `Broadcasted '${title}' to ${target} (${targetUserIds.length} users)`,
        target_entity: 'broadcast',
        target_id: 'global'
      });

      toast("success", "Broadcast Successful", `Notification sent to ${targetUserIds.length} users.`);
      setTitle('');
      setMessage('');
      fetchHistory();
    } catch (e: any) {
      toast("error", "Error", e.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="text-indigo-600" /> Global Notification Center
        </h1>
        <p className="text-gray-500 mt-1">Broadcast realtime alerts and messages to platform users.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Broadcaster */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Send className="text-emerald-600"/> Create Broadcast</h2>
            
            <form onSubmit={handleBroadcast} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Audience</label>
                  <select 
                    value={target}
                    onChange={e => setTarget(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-gray-900 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all_candidates">All Candidates</option>
                    <option value="verified_candidates">Verified Candidates Only</option>
                    <option value="all_companies">All Companies</option>
                    <option value="verified_companies">Verified Companies Only</option>
                    <option value="specific">Specific User ID</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notification Type</label>
                  <select 
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-gray-900 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="info">Information (Blue)</option>
                    <option value="success">Success (Green)</option>
                    <option value="warning">Warning (Yellow)</option>
                    <option value="alert">Alert (Red)</option>
                  </select>
                </div>
              </div>

              {target === 'specific' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">User ID (UUID)</label>
                  <input 
                    type="text" 
                    value={specificUserId}
                    onChange={e => setSpecificUserId(e.target.value)}
                    placeholder="Enter precise User ID..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notification Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Platform Maintenance, New Feature..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 font-bold text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message Content</label>
                <textarea 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Enter the broadcast message..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 min-h-[120px] resize-none"
                  required
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium">Notifications will appear instantly in the target's dashboard.</p>
                <button 
                  type="submit" 
                  disabled={sending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {sending ? <Loader2 size={18} className="animate-spin"/> : <Send size={18}/>}
                  Dispatch Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 flex items-center gap-2"><History className="text-indigo-600"/> Broadcast Log</h2>
            </div>
            
            <div className="p-4 space-y-3 overflow-y-auto max-h-[500px]">
              {history.map(log => (
                <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-relaxed">{log.action}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <Clock size={12}/> {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">
                  No previous broadcasts.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
"""

with open(r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\notifications\page.tsx", "w", encoding="utf-8-sig") as f:
    f.write(content)

print("Admin Notification Center built")
