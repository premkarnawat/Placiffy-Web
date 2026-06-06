"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onLogin: (tab: 'candidate' | 'company' | 'admin') => void;
  onDemo: () => void;
}

export function Navbar({ onLogin, onDemo }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const navLinks = [
    { label: 'Services', id: 'services' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-gold-animated shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.02 }}
          >
            <img src="/logo.jpg" alt="Placify" className="h-9 w-auto rounded-lg object-contain mix-blend-multiply" />
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="hover-underline px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-50"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Login dropdown */}
            <div className="relative group">
              <button className="btn-outline text-xs flex items-center gap-1.5 py-2.5 px-5">
                Sign In <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 glass rounded-2xl border border-zinc-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                {[
                  { label: '🏢  Company Portal', tab: 'company' as const },
                  { label: '👤  Candidate Portal', tab: 'candidate' as const },
                  { label: '🛡️  Admin Portal', tab: 'admin' as const },
                ].map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => onLogin(item.tab)}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={onDemo} className="btn-primary text-xs py-2.5 px-5">
              <span>Book a Demo</span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-zinc-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[68px] left-4 right-4 z-40 glass rounded-2xl border border-zinc-100 shadow-2xl p-4 lg:hidden"
          >
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="w-full text-left px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-xl transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-zinc-100 mt-2 pt-2 space-y-2">
              {[
                { label: 'Company Login', tab: 'company' as const },
                { label: 'Candidate Login', tab: 'candidate' as const },
                { label: 'Admin Login', tab: 'admin' as const },
              ].map(item => (
                <button key={item.tab} onClick={() => onLogin(item.tab)} className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                  {item.label}
                </button>
              ))}
              <button onClick={onDemo} className="w-full btn-primary text-xs py-3">
                <span>Book a Demo</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
