"use client";

import React from "react";
import {
  Code2,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  Lock,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";

interface AuditResult {
  filename: string;
  oops_score: number;
  dbms_score: number;
  os_concurrency_score: number;
  security_score: number;
  overall_score: number;
  violations: string[];
  recommendations: string[];
  optimized_code_snippet: string;
}

interface AuditCardProps {
  file: AuditResult;
  isExpanded: boolean;
  onToggleDiff: () => void;
  copiedFile: string | null;
  onCopySnippet: (filename: string, code: string) => void;
}

export const AuditCard: React.FC<AuditCardProps> = ({
  file,
  isExpanded,
  onToggleDiff,
  copiedFile,
  onCopySnippet
}) => {
  const isPassed = file.overall_score >= 80;

  return (
    <div className="aurora-glass-hover rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80">
      
      {/* CARD HEADER */}
      <div
        onClick={onToggleDiff}
        className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/60 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400 shrink-0">
            <Code2 className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-slate-50 text-sm sm:text-base font-mono truncate">
              {file.filename}
            </h3>
            <div className="text-xs text-slate-400 font-semibold mt-0.5 flex items-center gap-2">
              <span>Overall Score:</span>
              <span className="font-mono font-black text-cyan-300">{file.overall_score}/100</span>
            </div>
          </div>
        </div>

        {/* Status Badge & Accordion Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          {isPassed ? (
            <span className="px-4 py-1.5 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> PASSED
            </span>
          ) : (
            <span className="px-4 py-1.5 rounded-full text-xs font-black bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 shadow-sm">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> CRITICAL VULNERABILITY
            </span>
          )}

          <button className="p-1.5 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* EXPANDED CONTENT DRAWER */}
      {isExpanded && (
        <div className="border-t border-slate-800/80 p-6 space-y-6 bg-slate-950/80">
          
          {/* SPLIT-PANE DESIGN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Left Pane: OOPS & DBMS Architecture */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Layers className="w-4.5 h-4.5 text-cyan-400" /> OOPS & DBMS Architecture
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  OOPS: {file.oops_score}% | DBMS: {file.dbms_score}%
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-black text-cyan-400 uppercase tracking-wider block">
                  Architecture Audit Findings
                </span>
                <ul className="space-y-2">
                  {file.violations
                    .filter(v => v.includes("[OOPS]") || v.includes("[DBMS]"))
                    .map((v, i) => (
                      <li key={i} className="text-xs font-semibold text-slate-200 bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
                        <span className="text-cyan-400 font-black">•</span>
                        <span className="leading-relaxed">{v}</span>
                      </li>
                    ))}
                  {file.violations.filter(v => v.includes("[OOPS]") || v.includes("[DBMS]")).length === 0 && (
                    <li className="text-xs text-slate-400 italic">No structural OOPS or DBMS violations flagged.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Right Pane: OS & Security Vulnerabilities */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Lock className="w-4.5 h-4.5 text-rose-400" /> OS & Security Vulnerabilities
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  OS: {file.os_concurrency_score}% | Sec: {file.security_score}%
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-black text-rose-400 uppercase tracking-wider block">
                  Security & Transport Findings
                </span>
                <ul className="space-y-2">
                  {file.violations
                    .filter(v => v.includes("[Security") || v.includes("[OS]"))
                    .map((v, i) => (
                      <li key={i} className="text-xs font-semibold text-slate-200 bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
                        <span className="text-rose-400 font-black">•</span>
                        <span className="leading-relaxed">{v}</span>
                      </li>
                    ))}
                  {file.violations.filter(v => v.includes("[Security") || v.includes("[OS]")).length === 0 && (
                    <li className="text-xs text-slate-400 italic">No critical OS or transport security issues flagged.</li>
                  )}
                </ul>
              </div>
            </div>

          </div>

          {/* Remediation Action Plan */}
          {file.recommendations.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" /> Remediation Action Plan
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {file.recommendations.map((r, i) => (
                  <li key={i} className="text-xs font-semibold text-slate-200 bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
                    <span className="text-emerald-400 font-black">✓</span>
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* REFACTORED CODE OUTPUT */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 flex-wrap gap-2">
              <span className="flex items-center gap-2 text-slate-100 font-bold">
                <Terminal className="w-4 h-4 text-cyan-400" /> Refactored Source Code
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopySnippet(file.filename, file.optimized_code_snippet);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 shadow-sm"
              >
                {copiedFile === file.filename ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>
            </div>

            {/* Dark Code Block */}
            <div className="bg-[#03050a] p-5 rounded-2xl text-xs font-mono overflow-x-auto max-w-full border border-slate-800/80 shadow-2xl">
              <pre className="text-emerald-300 leading-relaxed whitespace-pre font-mono">
                <code>{file.optimized_code_snippet}</code>
              </pre>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
