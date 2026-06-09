# -*- coding: utf-8 -*-
import os

auth_context = """"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from './supabase';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'company' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          throw new Error("No session");
        }

        // Strict DB Role Verification
        let role: 'candidate' | 'company' | 'admin' = 'candidate';
        
        const { data: company } = await supabase.from('companies').select('id').eq('user_id', session.user.id).maybeSingle();
        if (company) {
          role = 'company';
        } else if (session.user.email === 'admin@placify.com' || session.user.user_metadata?.role === 'admin') {
          role = 'admin';
        }

        const sbUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || (role === 'company' ? 'Company User' : 'Candidate'),
          role: role
        };

        if (mounted) {
          setToken(session.access_token);
          setUser(sbUser);
        }
      } catch (e) {
        if (mounted) {
          setToken(null);
          setUser(null);
          localStorage.clear();
          sessionStorage.clear();
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setToken(null);
        setUser(null);
        localStorage.clear();
        sessionStorage.clear();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies manually if any
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
"""

with open(r"lib\auth-context.tsx", "w", encoding="utf-8") as f:
    f.write(auth_context)

print("Rewrote lib/auth-context.tsx with strict DB role verification and deep logout!")
