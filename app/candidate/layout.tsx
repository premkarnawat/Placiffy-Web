"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Briefcase, FileText, Shield, Award, CreditCard, 
  Search, Bell, Settings, LogOut, HelpCircle, UserPlus, Menu, X, MessageSquare, ChevronDown, User
} from 'lucide-react';
import Link from 'next/link';
import AIAssistant from '@/components/candidate/AIAssistant';
import { supabase } from '@/lib/supabase';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);


  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
    if (user) {
      supabase.from('candidates').select('profile_photo_url').eq('user_id', user.id).single().then(({data}) => {
        if (data?.profile_photo_url) setProfilePhoto(data.profile_photo_url);
      });
    }
  }, [user, isLoading, router]);


  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/candidate/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', href: '/candidate/jobs', icon: Briefcase },
    { name: 'Applications', href: '/candidate/applications', icon: FileText },
    { name: 'Messages', href: '/candidate/messages', icon: MessageSquare },
    { name: 'Resume', href: '/candidate/resume', icon: FileText },
    { name: 'Verification', href: '/candidate/verification', icon: Shield },
    { name: 'Trust Score', href: '/candidate/trust-score', icon: Award },
    { name: 'Passport', href: '/candidate/passport', icon: CreditCard },
    { name: 'Support', href: '/candidate/support', icon: HelpCircle },
    { name: 'Help Center', href: '/candidate/help', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-xl font-bold text-blue-700 tracking-tight">Candidate Hub</h1>
            <p className="text-xs text-gray-500 mt-1">Hiring OS</p>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}
                  `}
                >
                  <item.icon size={18} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-2">
            <button className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <UserPlus size={16} /> Refer a Friend
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              <HelpCircle size={18} className="text-gray-400" /> Help Center
            </button>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={18} className="text-red-500" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex-1 flex items-center ml-12 lg:ml-0">
            <div className="max-w-md w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search jobs, skills, or companies..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 relative">
            <Link href="/candidate/support" className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              <HelpCircle size={18} /> Support
            </Link>
            <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
            
            <Link href="/candidate/messages" className="relative text-gray-500 hover:text-gray-900 transition-colors">
              <MessageSquare size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white"></span>
            </Link>

            <Link href="/candidate/notifications" className="relative text-gray-500 hover:text-gray-900 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 overflow-hidden flex-shrink-0">
                  <img src={profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <ChevronDown size={14} className="text-gray-500" />
              </button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Candidate Account</p>
                  </div>
                  <div className="p-1.5">
                    <Link onClick={() => setProfileDropdownOpen(false)} href="/candidate/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"><User size={16}/> View Profile</Link>
                    <Link onClick={() => setProfileDropdownOpen(false)} href="/candidate/profile/edit" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"><Settings size={16}/> Edit Profile</Link>
                    <Link onClick={() => setProfileDropdownOpen(false)} href="/candidate/settings" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"><Shield size={16}/> Settings & Privacy</Link>
                  </div>
                  <div className="p-1.5 border-t border-gray-100">
                    <button onClick={() => { setProfileDropdownOpen(false); logout(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"><LogOut size={16}/> Sign Out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
      <AIAssistant />
    </div>
  );
}
