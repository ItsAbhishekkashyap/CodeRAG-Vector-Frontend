"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Database,
  Cpu,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Code2,
  Terminal,
  Activity
} from "lucide-react";

interface IntroBannerProps {
  onStartScan: () => void;
  onToggleSetup: () => void;
}

export const IntroBanner: React.FC<IntroBannerProps> = ({
  onStartScan,
  onToggleSetup
}) => {
  const [activeTab, setActiveTab] = useState<"oops" | "dbms" | "os" | "security">("oops");

  return (
    <section className="relative overflow-hidden rounded-3xl aurora-glass border border-slate-800/80 p-6 sm:p-10 shadow-2xl space-y-8">
      
      {/* FLOATING AMBIENT GLOW ORBS */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-mesh-1"></div>
      <div className="absolute top-1/2 -right-32 w-[30rem] h-[30rem] bg-purple-500/15 rounded-full blur-3xl pointer-events-none animate-mesh-2"></div>
      <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: HERO HEADLINE & CTA */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-black tracking-wider uppercase shadow-md">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Next-Gen Enterprise Codebase Auditor</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-50 tracking-tight leading-none">
              CodeRAG Vector <br className="hidden sm:block" />
              <span className="text-gradient-aurora">Health & Security</span> Audit Engine
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium max-w-xl">
              Recursively analyzes local source code across Object-Oriented Architecture, Database SQL Optimization, OS Concurrency Deadlock Safety, and OWASP Top 10 Security.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onStartScan}
              className="relative group overflow-hidden py-3.5 px-7 rounded-2xl font-black text-xs sm:text-sm tracking-wider text-white shadow-xl transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 group-hover:opacity-90 transition-opacity"></div>
              <div className="relative flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-200" />
                <span>START REPOSITORY AUDIT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={onToggleSetup}
              className="py-3.5 px-6 rounded-2xl font-extrabold text-xs sm:text-sm text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all active:scale-95 flex items-center gap-2"
            >
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>How to Run Locally</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE FEATURE SPOTLIGHT CARDS */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> Core Audit Engine Modules
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            {[
              { id: "oops", label: "OOPS", icon: Layers, color: "text-indigo-400" },
              { id: "dbms", label: "DBMS", icon: Database, color: "text-cyan-400" },
              { id: "os", label: "OS Lock", icon: Cpu, color: "text-purple-400" },
              { id: "security", label: "OWASP", icon: Lock, color: "text-emerald-400" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                    isActive
                      ? "bg-slate-800 text-white shadow-md border border-slate-700"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Showcase Box */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 shadow-inner">
            {activeTab === "oops" && (
              <>
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Layers className="w-5 h-5" /> OOPS Architecture & Encapsulation
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Detects public data member exposure, missing getters/setters, tight coupling, and violation of SOLID object-oriented principles.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono font-bold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enforces Encapsulation & Interface Safety
                </div>
              </>
            )}

            {activeTab === "dbms" && (
              <>
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Database className="w-5 h-5" /> DBMS Query & Transaction Safety
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Flag missing indexing, raw unparameterized SQL queries, N+1 query patterns, and non-atomic database transactions.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono font-bold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enforces ACID Compliance & Query Optimization
                </div>
              </>
            )}

            {activeTab === "os" && (
              <>
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Cpu className="w-5 h-5" /> OS Concurrency & Deadlock Prevention
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Audits multithreaded code for unhandled race conditions, missing mutex locks, unsafe thread joins, and potential circular deadlocks.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono font-bold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enforces Reentrant Locks & Thread Safety
                </div>
              </>
            )}

            {activeTab === "security" && (
              <>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Lock className="w-5 h-5" /> OWASP Top 10 & HTTPS Transport
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Identifies unencrypted HTTP transport endpoints, hardcoded secret tokens, missing CORS headers, and raw parameter exposure.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono font-bold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enforces TLS 1.3 & Zero-Trust Standards
                </div>
              </>
            )}
          </div>

        </div>

      </div>

    </section>
  );
};
