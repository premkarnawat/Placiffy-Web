"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Building2, Briefcase, ShieldCheck, CreditCard, 
  Search, Bell, Settings, LogOut, MessageSquare, ChevronDown, User, Activity, PieChart, Receipt, BookOpen, Menu, X
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    if (pathname.endsWith('/login')) return; // Allow public access to login
    
    if (!isLoading) {
      if (!user) {
        router.replace('/admin/login');
      } else if (user.role !== 'admin') {
        // Kick them out securely
        router.replace(`/${user.role || 'candidate'}/dashboard`);
      }
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading || (user && user.role !== 'admin' && !pathname.endsWith('/login'))) {
    return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // Clean layout for Login page
  if (pathname.endsWith('/login')) {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Candidates', href: '/admin/candidates', icon: Users },
    { name: 'Companies', href: '/admin/companies', icon: Building2 },
    { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
    { name: 'Verification', href: '/admin/verification', icon: ShieldCheck },
    { name: 'Passports', href: '/admin/passports', icon: CreditCard },
    { name: 'ATS Center', href: '/admin/ats', icon: Activity },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Support', href: '/admin/support', icon: BookOpen },
    { name: 'Analytics', href: '/admin/analytics', icon: PieChart },
    { name: 'Billing', href: '/admin/billing', icon: Receipt },
    { name: 'Audit Logs', href: '/admin/audit', icon: Search },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-slate-900 text-white rounded-lg shadow-sm">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-800 bg-slate-900/50">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2"><ShieldCheck className="text-blue-500"/> Placify Admin</h1>
            <p className="text-xs text-slate-400 mt-1">Command Center</p>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <item.icon size={18} className={isActive ? 'text-white' : 'text-slate-500'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <LogOut size={18} className="text-red-500" /> End Session
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex-1 flex items-center ml-12 lg:ml-0">
            <div className="max-w-md w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search candidates, companies, or tickets (Ctrl+K)"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 relative">
            <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
            
            <Link href="/admin/messages" className="relative text-gray-500 hover:text-slate-900 transition-colors">
              <MessageSquare size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white"></span>
            </Link>

            <Link href="/admin/alerts" className="relative text-gray-500 hover:text-slate-900 transition-colors">
              <Bell size={20} />
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-blue-500 overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">
                  AD
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">Admin</p>
                  <p className="text-[10px] font-bold text-blue-600 leading-tight">System Owner</p>
                </div>
                <ChevronDown size={14} className="text-gray-500" />
              </button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl shadow-gray-200 border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-gray-50 bg-slate-900 text-white">
                    <p className="text-sm font-bold truncate">{user?.email}</p>
                    <p className="text-xs text-blue-400 mt-0.5 font-medium">Root Access</p>
                  </div>
                  <div className="p-1.5">
                    <Link onClick={() => setProfileDropdownOpen(false)} href="/admin/settings" className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-slate-900 rounded-lg transition-colors"><Settings size={16}/> System Settings</Link>
                  </div>
                  <div className="p-1.5 border-t border-gray-100">
                    <button onClick={() => { setProfileDropdownOpen(false); logout(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"><LogOut size={16}/> Terminate Session</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
