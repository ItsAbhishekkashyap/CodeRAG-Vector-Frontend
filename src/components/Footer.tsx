"use client";

import React from "react";
import { ShieldCheck, Lock, Terminal, Activity, Layers, Database, Cpu } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#05070e] relative z-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* MULTI-COLUMN ENTERPRISE FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
          
          {/* Column 1: Brand Overview (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-50 tracking-tight">CodeRAG</span>
                <span className="ml-2 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full">
                  Vector
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Automated DevSecOps & CS Standards Auditor. Enforces Object-Oriented Architecture, Database Query Safety, Operating System Concurrency, and OWASP Top 10 Security rules.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Vector Audit Engine Active</span>
            </div>
          </div>

          {/* Column 2: Audit Modules (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> Audit Engine Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> OOPS Encapsulation & Interface Safety
              </li>
              <li className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> DBMS ACID & N+1 Query Prevention
              </li>
              <li className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> OS Thread Locks & Deadlock Safety
              </li>
              <li className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> OWASP HTTPS & Transport Security
              </li>
            </ul>
          </div>

          {/* Column 3: Tech Stack Specs (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" /> System Specs
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px] text-slate-400 font-semibold">
              <li className="px-2.5 py-1 bg-slate-900/80 rounded border border-slate-800">FastAPI Async Core</li>
              <li className="px-2.5 py-1 bg-slate-900/80 rounded border border-slate-800">ChromaDB Vector Store</li>
              <li className="px-2.5 py-1 bg-slate-900/80 rounded border border-slate-800">Python 3.11 RAG Pipeline</li>
              <li className="px-2.5 py-1 bg-slate-900/80 rounded border border-slate-800">Next.js 14 React UI</li>
            </ul>
          </div>

          {/* Column 4: Compliance & Certifications (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" /> Security Standards
            </h4>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> OWASP Top 10 Compliant
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Enforces Zero-Trust HTTPS, parameter sanitization, and secret redaction.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} CodeRAG Vector. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span className="text-cyan-400 font-mono font-bold">Local Machine DevSecOps Suite</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
