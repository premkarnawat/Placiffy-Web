import React from 'react';
import { Menu, ShoppingBag } from 'lucide-react';
import ArcConveyor from './ArcConveyor';

export default function Hero() {
  return (
    <div className="relative w-full h-screen bg-[#ba1200] overflow-hidden text-[#f4dcb9]"
         style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c-8.284 0-15-6.716-15-15s6.716-15 15-15 15 6.716 15 15-6.716 15-15 15zm0 30c-8.284 0-15-6.716-15-15s6.716-15 15-15 15 6.716 15 15-6.716 15-15 15zm-30-30c-8.284 0-15-6.716-15-15s6.716-15 15-15 15 6.716 15 15-6.716 15-15 15z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`
         }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full px-8 py-8 flex justify-between items-center z-50">
        <button className="p-3 border border-[#f4dcb9]/30 rounded-xl hover:bg-[#f4dcb9]/10 transition-colors backdrop-blur-md">
          <Menu className="w-6 h-6" />
        </button>
        <button className="p-3 border border-[#f4dcb9]/30 rounded-xl hover:bg-[#f4dcb9]/10 transition-colors backdrop-blur-md">
          <ShoppingBag className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute inset-0 flex flex-col items-center pt-24 z-10 w-full h-full pointer-events-none">
        
        <div className="flex items-center gap-4 text-[#f4dcb9]/80 mb-2 mt-2 z-20">
          <span className="w-16 h-[1px] bg-[#f4dcb9]/50"></span>
          <span className="tracking-[0.4em] text-xs font-bold uppercase">J A P A N E S E</span>
          <span className="w-16 h-[1px] bg-[#f4dcb9]/50"></span>
        </div>

        <h1 className="text-7xl md:text-[140px] leading-[0.9] text-center text-[#f4dcb9] drop-shadow-2xl z-10 flex flex-col items-center font-black uppercase tracking-tighter"
            style={{ fontFamily: "Impact, system-ui, sans-serif" }}>
          <span>DADAJ</span>
          <span>BIRYANI</span>
        </h1>

        <ArcConveyor />

        {/* Bottom Actions */}
        <div className="absolute bottom-12 flex flex-col items-center z-50 pointer-events-auto">
          <p className="text-[#f4dcb9] text-xs font-bold tracking-[0.3em] text-center mb-6 leading-relaxed">
            RED'S<br/>CHILLLII
          </p>
          <button className="border border-[#f4dcb9]/40 rounded-lg px-10 py-3 text-[#f4dcb9] text-xs font-bold tracking-widest hover:bg-[#f4dcb9]/10 transition-colors uppercase">
            BUY NOW
          </button>
        </div>
        
        {/* Floating elements styling approx */}
        <div className="absolute bottom-10 left-[10%] w-48 h-[2px] bg-[#2a1306] -rotate-[35deg] transform origin-left shadow-[0_0_10px_black] rounded-full z-40"></div>
      </div>
    </div>
  );
}
