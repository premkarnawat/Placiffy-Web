'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Briefcase, Plus, MessageSquare, 
  Settings, LogOut, Loader2, Sparkles, Shield, HelpCircle, Bell
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/company/dashboard" },
  { id: "create_job", label: "Create Job", icon: Plus, href: "/company/jobs/create" },
  { id: "jobs", label: "Job Workspace", icon: Briefcase, href: "/company/workspace" },
  { id: "candidates", label: "Candidate Pool", icon: Users, href: "/company/candidates" },
  { id: "messaging", label: "Messages", icon: MessageSquare, href: "/company/messages" },
  { id: "billing", label: "Billing", icon: Shield, href: "/company/billing" },
  { id: "support", label: "Support", icon: HelpCircle, href: "/company/support" },
  { id: "settings", label: "Settings", icon: Settings, href: "/company/settings" },
  { id: "ai", label: "AI Assistant", icon: Sparkles, href: "/company/ai-assistant" }
];

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      checkRegistration();
      fetchNotifications();
      
      const channel = supabase.channel(`company_global_${user.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, () => fetchNotifications())
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, () => fetchNotifications())
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, () => fetchNotifications())
        .subscribe();
        
      return () => { supabase.removeChannel(channel); };
    }
  }, [user, router]);

  const fetchNotifications = async () => {
    try {
      const [nRes, mRes] = await Promise.all([
        supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', user?.id).eq('read', false),
        supabase.from('messages').select('id', { count: 'exact', head: true }).eq('receiver_id', user?.id).eq('read', false)
      ]);
      setUnreadCount((nRes.count || 0) + (mRes.count || 0));
    } catch (e) {
      console.error(e);
    }
  };

  const checkRegistration = async () => {
    const { data } = await supabase.from('companies').select('id').eq('user_id', user?.id).single();
    if (!data && pathname !== '/company/register') {
      router.push('/company/register');
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-50">
        <div className="font-black text-xl text-blue-600 tracking-tight">Placify</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 flex flex-col`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
          <div className="font-black text-2xl text-blue-600 tracking-tight cursor-pointer" onClick={() => router.push('/')}>Placify <span className="text-sm font-bold text-gray-400 align-middle ml-1">OS</span></div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/company/dashboard");
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  router.push(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-500 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {item.id === 'messaging' && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100 space-y-2 shrink-0">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen pt-16 lg:pt-0">
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-100 items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium text-slate-500 w-96 border border-slate-100">
            <Search size={16} className="mr-2 opacity-50"/> Search jobs, candidates, or messages...
          </div>
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2">
              <HelpCircle size={20} />
              <span className="text-sm font-bold">Support</span>
            </button>
            <button className="text-gray-400 hover:text-blue-600 transition-colors relative">
              <MessageSquare size={20} />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>
            <button className="text-gray-400 hover:text-blue-600 transition-colors relative">
              <Bell size={20} />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                C
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 bg-slate-50 relative">
          {children}
        </main>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
