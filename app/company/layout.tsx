"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard, Briefcase, Users, MessageSquare, BarChart2,
  HelpCircle, Settings, Plus, Sparkles, Building2, Loader2,
  Search, Bell
} from "lucide-react";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/company/dashboard" },
  { id: "create_job", label: "Create Job", icon: Plus, href: "/company/jobs/create" },
  { id: "jobs", label: "Job Workspace", icon: Briefcase, href: "/company/workspace" },
  { id: "candidates", label: "Candidate Pool", icon: Users, href: "/company/candidates" },
  { id: "messaging", label: "Messages", icon: MessageSquare, href: "/company/messages" },
  { id: "reports", label: "Reports", icon: BarChart2, href: "/company/reports" },
  { id: "analytics", label: "Analytics", icon: BarChart2, href: "/company/analytics" },
];

const BOTTOM_NAV = [
  { id: "billing", label: "Billing", icon: LayoutDashboard, href: "/company/billing" },
  { id: "support", label: "Support", icon: HelpCircle, href: "/company/support" },
  { id: "settings", label: "Settings", icon: Settings, href: "/company/settings" },
  { id: "ai", label: "AI Assistant", icon: Sparkles, href: "/company/ai-assistant" },
];

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();



  useEffect(() => {
    if (pathname === '/company/register') return; // Bypass auth guard for registration
    
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "candidate") {
        router.push("/candidate/dashboard");
      } else if (user.role === "admin") {
        router.push("/admin/dashboard");
      }
    }
  }, [user, isLoading, router, pathname]);

  if (pathname === '/company/register') return <>{children}</>;

  if (isLoading || !user || (user.role !== "company" && user.role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
        <div className="w-12 h-12 bg-[#0052CC] rounded-xl flex items-center justify-center shadow-lg animate-pulse">
            <Building2 className="w-6 h-6 text-white"/>
        </div>
        <div className="flex items-center gap-2 text-zinc-500 font-medium">
            <Loader2 className="w-4 h-4 animate-spin"/> Authenticating session...
        </div>
      </div>
    );
  }

  const initials = user?.name ? user.name.split(" ").map((n: string) => n[0]).join("").substring(0,2).toUpperCase() : "HR";


  // Clean layout for Registration pages
  if (pathname.endsWith('/register')) {
    return (
      <div className="min-h-screen bg-white font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-52 bg-[#F8F9FB] border-r border-zinc-200/60 flex flex-col h-screen sticky top-0 overflow-y-auto shrink-0">
        <div className="p-5 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0052CC] rounded-xl flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white"/>
            </div>
            <div>
              <div className="text-sm font-black text-zinc-900">PLACIFY</div>
              <div className="text-[9px] text-zinc-400 font-medium">Intelligence OS</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/company/dashboard");
            return (
              <button key={item.id}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive ? "bg-[#0052CC] text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"}`}>
                <Icon className="w-4 h-4"/>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 space-y-0.5 border-t border-zinc-200/60 mt-auto">
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <button key={item.id} 
                onClick={() => router.push(item.href)} 
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive ? "bg-zinc-200 text-zinc-900" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"}`}>
                <Icon className="w-4 h-4"/>
                {item.label}
              </button>
            )
          })}
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Unified Header */}
        <header className="border-b border-zinc-200/60 bg-white px-6 py-3 flex items-center justify-between shrink-0">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"/>
            <input className="w-full bg-[#F5F7FA] border-0 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#0052CC]/20 focus:bg-white transition-all outline-none"
              placeholder="Global search for candidates, jobs, or intelligence..."/>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <button className="relative p-2 rounded-xl hover:bg-zinc-100"><Bell className="w-4 h-4 text-zinc-500"/><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"/></button>
            <button className="p-2 rounded-xl hover:bg-zinc-100"><HelpCircle className="w-4 h-4 text-zinc-500"/></button>
            <button className="p-2 rounded-xl hover:bg-zinc-100"><Settings className="w-4 h-4 text-zinc-500"/></button>
            <div className="flex items-center gap-2 ml-2">
              <div className="text-right"><div className="text-xs font-bold text-zinc-900">{user?.name || 'Company User'}</div><div className="text-[10px] text-zinc-400">Placify Verified</div></div>
              <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">{initials}</div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
