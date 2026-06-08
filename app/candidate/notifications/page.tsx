'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Bell, Search, MessageSquare, Briefcase, ShieldCheck, Zap, Trash2, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const fetchNotifications = async () => {
    try {
      const { data } = await supabase.from('notifications').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
      
      // If none, mock a welcome notification to ensure the UI is visible, matching user requirement to avoid purely empty states if we want to show it off (Wait, "Use real data. No placeholders." So I'll just show empty state).
      setNotifications(data || []);
      setFiltered(data || []);
    } catch (e) {
      console.error(e);
      toast('error', 'Error fetching notifications', 'Could not load your notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Realtime subscription
      const channel = supabase.channel(`notifications_${user.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, payload => {
          setNotifications(prev => [payload.new, ...prev]);
          toast('info', 'New Notification', payload.new.title);
        })
        .subscribe();
        
      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  useEffect(() => {
    let result = notifications;
    if (searchQuery) {
      result = result.filter(n => n.title?.toLowerCase().includes(searchQuery.toLowerCase()) || n.message?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (typeFilter !== 'All') {
      result = result.filter(n => n.type === typeFilter.toLowerCase());
    }
    setFiltered(result);
  }, [searchQuery, typeFilter, notifications]);

  const markAsRead = async (id: string) => {
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {}
  };

  const markAllRead = async () => {
    try {
      await supabase.from('notifications').update({ read: true }).eq('user_id', user?.id).eq('read', false);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast('success', 'Marked All Read', 'All notifications marked as read.');
    } catch (e) {}
  };

  const deleteNotification = async (id: string) => {
    try {
      await supabase.from('notifications').delete().eq('id', id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast('success', 'Deleted', 'Notification removed.');
    } catch (e) {}
  };

  const getIcon = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'message': return <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><MessageSquare size={20}/></div>;
      case 'job_match': return <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><Zap size={20}/></div>;
      case 'verification': return <div className="p-2 bg-green-100 text-green-600 rounded-xl"><ShieldCheck size={20}/></div>;
      case 'interview': return <div className="p-2 bg-purple-100 text-purple-600 rounded-xl"><Briefcase size={20}/></div>;
      default: return <div className="p-2 bg-gray-100 text-gray-600 rounded-xl"><Bell size={20}/></div>;
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="text-blue-600" size={32}/> Notifications
          </h1>
          <p className="text-gray-500 mt-1">Stay updated on your verification, applications, and messages.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{unreadCount} Unread</span>
          <button onClick={markAllRead} disabled={unreadCount===0} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl font-medium transition-colors shadow-sm text-sm disabled:opacity-50 flex items-center gap-2">
            <Check size={16}/> Mark all read
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input 
            type="text" placeholder="Search notifications..." 
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          <button onClick={() => setTypeFilter('All')} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${typeFilter === 'All' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>All</button>
          <button onClick={() => setTypeFilter('message')} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${typeFilter === 'message' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>Messages</button>
          <button onClick={() => setTypeFilter('job_match')} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${typeFilter === 'job_match' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>Job Matches</button>
          <button onClick={() => setTypeFilter('verification')} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${typeFilter === 'verification' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>Verification</button>
        </div>
      </div>

      {/* Feed */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
            <p className="text-gray-500 mt-1">You don&apos;t have any notifications right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(notif => (
              <div key={notif.id} className={`p-6 flex gap-4 transition-colors ${notif.read ? 'bg-white' : 'bg-blue-50/30'}`}>
                <div className="shrink-0">{getIcon(notif.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm ${notif.read ? 'font-medium text-gray-900' : 'font-extrabold text-gray-900'}`}>{notif.title}</h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(notif.created_at).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className={`text-sm mt-1 leading-relaxed ${notif.read ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>{notif.message}</p>
                </div>
                <div className="flex flex-col items-center gap-2 ml-4 shrink-0 opacity-0 md:opacity-100 transition-opacity">
                  {!notif.read && (
                    <button onClick={() => markAsRead(notif.id)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Mark as read">
                      <Check size={16}/>
                    </button>
                  )}
                  <button onClick={() => deleteNotification(notif.id)} className="p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
