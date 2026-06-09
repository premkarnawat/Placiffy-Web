# -*- coding: utf-8 -*-
import os

os.makedirs(r"app\admin", exist_ok=True)

admin_layout = """"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Shield, FileText, Search, LogOut, Menu, X, ChevronDown, User
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== 'admin') {
        router.replace(`/${user.role}/dashboard`);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Verification Center', href: '/admin/verification', icon: Shield },
    { name: 'System Logs', href: '/admin/logs', icon: FileText },
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
          <div className="p-6 border-b border-gray-100 bg-red-50">
            <h1 className="text-xl font-black text-red-700 tracking-tight flex items-center gap-2"><Shield size={20}/> Admin Command</h1>
            <p className="text-xs text-red-500 mt-1 font-bold">God Mode</p>
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
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                      : 'text-gray-600 hover:bg-red-50 hover:text-red-700'}
                  `}
                >
                  <item.icon size={18} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-red-600'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-2">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={18} className="text-red-500" /> Secure Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex-1 flex items-center ml-12 lg:ml-0">
          </div>

          <div className="flex items-center gap-3 sm:gap-5 relative">
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-700 font-bold">A</span>
                </div>
                <ChevronDown size={14} className="text-gray-500" />
              </button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                    <p className="text-xs text-red-600 font-bold mt-0.5">Administrator</p>
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
    </div>
  );
}
"""

with open(r"app\admin\layout.tsx", "w", encoding="utf-8") as f:
    f.write(admin_layout)

print("Created isolated Admin Layout with strict role guards!")
