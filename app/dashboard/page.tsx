"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Shield, Award, Users, FileText, Settings, HelpCircle, LogOut } from 'lucide-react';
import DashboardTab from '@/components/dashboard/dashboard-tab';
import TrustScoreTab from '@/components/dashboard/trust-score-tab';
import PassportTab from '@/components/dashboard/passport-tab';
import ExpertReviewTab from '@/components/dashboard/expert-review-tab';
import MatchingTab from '@/components/dashboard/matching-tab';

type Section = 'dashboard' | 'trust' | 'expert' | 'matching' | 'passport' | 'settings' | 'support';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  const menuItems = [
    { id: 'dashboard' as Section, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trust' as Section, label: 'Trust Score', icon: Shield },
    { id: 'expert' as Section, label: 'Expert Review', icon: Award },
    { id: 'matching' as Section, label: 'Matching', icon: Users },
    { id: 'passport' as Section, label: 'Passport', icon: FileText }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardTab />;
      case 'trust':
        return <TrustScoreTab />;
      case 'passport':
        return <PassportTab />;
      case 'expert':
        return <ExpertReviewTab />;
      case 'matching':
        return <MatchingTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-800 flex select-none">
      
      {/* Sidebar matching Image 1 exactly */}
      <aside className="w-64 border-r border-zinc-200/60 bg-[#F8F9FA] flex flex-col justify-between hidden md:flex shrink-0">
        
        <div className="p-6 space-y-8 text-left">
          {/* Logo brand slot */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded bg-[#0052cc] flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-sans font-black tracking-wider text-lg text-[#001D6E] uppercase">PLACIFY</span>
            </div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 pl-0.5">HIRING INTELLIGENCE</span>
          </div>

          {/* Nav Menu */}
          <nav className="space-y-1.5 pt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-[#E6F0FF] text-[#0052cc]' : 'text-zinc-650 hover:text-zinc-900 hover:bg-zinc-100'}`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#0052cc]' : 'text-zinc-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom */}
        <div className="p-6 border-t border-zinc-200/50 space-y-5 text-left">
          
          <button 
            onClick={() => setActiveSection('passport')}
            className="w-full bg-[#0052CC] hover:bg-[#0040A3] text-white py-3 rounded-xl text-center font-bold text-xs uppercase tracking-wider transition-colors shadow-sm block"
          >
            Get Certified
          </button>

          <div className="space-y-1.5">
            <button 
              onClick={() => setActiveSection('settings')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
            >
              <Settings className="w-4.5 h-4.5 text-zinc-400" /> Settings
            </button>
            <button 
              onClick={() => setActiveSection('support')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
            >
              <HelpCircle className="w-4.5 h-4.5 text-zinc-400" /> Support
            </button>
            <button 
              onClick={() => { if (typeof window !== 'undefined') window.location.href = '/login'; }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50/50 transition-all"
            >
              <LogOut className="w-4.5 h-4.5 text-rose-400" /> Sign Out
            </button>
          </div>

        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white p-8 md:p-12 overflow-y-auto max-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
