"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabase';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Check local storage (FastAPI custom auth)
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }

    // 2. Check Supabase Auth (OAuth flow)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setToken(session.access_token);
        
        let role = localStorage.getItem('userRole') || 'candidate';
        const { data: company } = await supabase.from('companies').select('id').eq('user_id', session.user.id).maybeSingle();
        if (company) role = 'company';
        
        const sbUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || (role === 'company' ? 'Company User' : 'Candidate'),
          role: role
        };
        setUser(sbUser);
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('user', JSON.stringify(sbUser));
        localStorage.setItem('userRole', role);
      }
      setIsLoading(false);
    });

    // Listen to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setToken(session.access_token);
        
        let role = localStorage.getItem('userRole') || 'candidate';
        const { data: company } = await supabase.from('companies').select('id').eq('user_id', session.user.id).maybeSingle();
        if (company) role = 'company';

        const sbUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || (role === 'company' ? 'Company User' : 'Candidate'),
          role: role
        };
        setUser(sbUser);
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('user', JSON.stringify(sbUser));
        localStorage.setItem('userRole', role);
      }
    });


    return () => subscription.unsubscribe();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    await supabase.auth.signOut();
    router.push('/login');
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
