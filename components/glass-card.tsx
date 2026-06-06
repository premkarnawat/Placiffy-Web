import React from 'react';
import { clsx } from 'clsx';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export function GlassCard({ children, className, glow = false, ...props }: GlassCardProps) {
  return (
    <div 
      className={clsx(
        "glass-panel rounded-2xl p-6 transition-all duration-300 relative overflow-hidden",
        glow && "glow-border hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]",
        className
      )}
      {...props}
    >
      {glow && (
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-orange-600/10 rounded-full blur-[60px] pointer-events-none -mr-12 -mt-12" />
      )}
      {children}
    </div>
  );
}
