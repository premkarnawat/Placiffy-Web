"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";
interface Toast { id: string; type: ToastType; title: string; message?: string; }

interface ToastCtx { toast: (type: ToastType, title: string, message?: string) => void; }
const ToastContext = createContext<ToastCtx>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { id, type, title, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const icons = { success: <CheckCircle className="w-5 h-5 text-emerald-500"/>, error: <XCircle className="w-5 h-5 text-red-500"/>, info: <Info className="w-5 h-5 text-blue-500"/> };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} initial={{opacity:0,x:60}} animate={{opacity:1,x:0}} exit={{opacity:0,x:60}}
              transition={{duration:0.3}} className={`toast ${t.type}`}>
              {icons[t.type]}
              <div className="flex-1">
                <div className="text-sm font-bold text-zinc-900">{t.title}</div>
                {t.message && <div className="text-xs text-zinc-500 mt-0.5">{t.message}</div>}
              </div>
              <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4"/>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
