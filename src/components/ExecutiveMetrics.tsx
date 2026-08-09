"use client";

import React from "react";
import { Activity, FileCode, ShieldAlert, CheckCircle2 } from "lucide-react";

interface ExecutiveMetricsProps {
  overallScore: number;
  totalFiles: number;
  totalViolations: number;
}

export const ExecutiveMetrics: React.FC<ExecutiveMetricsProps> = ({
  overallScore,
  totalFiles,
  totalViolations
}) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      
      {/* Card 1: Codebase Quality Index */}
      <div className="aurora-glass-hover rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            Codebase Quality Index
          </span>
          <Activity className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-50 font-mono">
            {overallScore}%
          </span>
          <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-sm ${
            overallScore >= 80
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
              : overallScore >= 60
              ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
              : "bg-rose-500/15 text-rose-300 border-rose-500/30"
          }`}>
            {overallScore >= 80 ? "EXCELLENT" : overallScore >= 60 ? "MODERATE" : "CRITICAL"}
          </span>
        </div>

        <p className="text-xs text-slate-400 font-medium">
          Evaluated across OOPS, DBMS, OS Concurrency & OWASP rules.
        </p>
      </div>

      {/* Card 2: Audited Source Files */}
      <div className="aurora-glass-hover rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            Audited Source Files
          </span>
          <FileCode className="w-5 h-5 text-indigo-400" />
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-50 font-mono">
            {totalFiles}
          </span>
          <span className="text-xs text-slate-400 font-mono font-bold">Key Files</span>
        </div>

        <p className="text-xs text-slate-400 font-medium">
          Scans Python, JavaScript, TypeScript & SQL files.
        </p>
      </div>

      {/* Card 3: Flagged Violations */}
      <div className="aurora-glass-hover rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-2xl relative overflow-hidden sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            Flagged Violations
          </span>
          <ShieldAlert className={`w-5 h-5 ${totalViolations > 0 ? "text-rose-400 animate-pulse" : "text-emerald-400"}`} />
        </div>

        <div className="flex items-baseline gap-3">
          <span className={`text-4xl sm:text-5xl font-black tracking-tight font-mono ${
            totalViolations > 0 ? "text-rose-400" : "text-emerald-400"
          }`}>
            {totalViolations}
          </span>
          <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-sm ${
            totalViolations > 0
              ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
              : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
          }`}>
            {totalViolations > 0 ? "ACTION REQUIRED" : "COMPLIANT"}
          </span>
        </div>

        <p className="text-xs text-slate-400 font-medium">
          {totalViolations > 0 ? "Review recommendations below to fix issues." : "Codebase meets standard security baselines."}
        </p>
      </div>

    </section>
  );
};
