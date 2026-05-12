import React from 'react';
import { GraduationCap, LayoutDashboard, UserPlus, Users } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-700 shrink-0">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-sm tracking-tighter">SIMS</div>
        <div>
          <h1 className="text-sm md:text-lg font-bold leading-none uppercase tracking-wider">Student Information Management</h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest hidden sm:block">IT318-Web Development | Final Practical Examination</p>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-6">
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Host Platform</p>
          <p className="text-xs font-mono text-blue-400">RENDER-SERVICES-PROD</p>
        </div>
        <div className="h-8 w-[1px] bg-slate-700"></div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-wide">Status: Online</span>
        </div>
      </div>
    </header>
  );
};
