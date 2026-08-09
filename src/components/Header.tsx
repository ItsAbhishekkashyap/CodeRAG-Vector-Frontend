"use client";

import React from "react";
import { ShieldCheck, Laptop, Terminal } from "lucide-react";

interface HeaderProps {
  showSetupGuide: boolean;
  onToggleSetupGuide: () => void;
  onScrollToAudit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  showSetupGuide,
  onToggleSetupGuide,
  onScrollToAudit
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#05070e]/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative p-2.5 rounded-xl bg-slate-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-gradient-aurora">
                CodeRAG
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full shadow-sm">
                Vector
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              RAG-Powered CS Quality & Vulnerability Auditor
            </p>
          </div>
        </div>

        {/* Center Quick Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-400">
          <button
            onClick={onScrollToAudit}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Audit Engine</span>
          </button>

          <button
            onClick={onToggleSetupGuide}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Laptop className="w-3.5 h-3.5 text-indigo-400" />
            <span>Local Machine Setup</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSetupGuide}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all active:scale-95 shadow-md ${
              showSetupGuide
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-500/10"
                : "bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80"
            }`}
          >
            <Laptop className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">How to Run Locally</span>
            <span className="sm:hidden">Run Guide</span>
          </button>
        </div>

      </div>
    </header>
  );
};
