"use client";
import React from 'react';
import { ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react';

export default function AdminMessages() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
        <MessageSquare size={40} />
      </div>
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">Messaging Overseer</h1>
      <p className="text-lg text-slate-500 max-w-lg font-medium">
        The master messaging console allows Root Admins to intervene in conversations between candidates, companies, and support agents.
      </p>
      
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-6 mt-8 max-w-md w-full flex items-start gap-4">
        <AlertCircle size={24} className="shrink-0 mt-0.5" />
        <div className="text-left text-sm font-medium">
          <p className="font-bold text-amber-900 mb-1">Strict Isolation Policy Active</p>
          As part of the strict build isolation, the unified real-time messaging interface is shared via the database layer. Direct admin intervention requires creating standard 1-on-1 thread rows in `conversations`.
        </div>
      </div>
    </div>
  );
}
