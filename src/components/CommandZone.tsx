"use client";

import React from "react";
import { FolderSearch, Terminal, Zap, RefreshCw, Github } from "lucide-react";

interface CommandZoneProps {
  repoPath: string;
  setRepoPath: (path: string) => void;
  loading: boolean;
  onRunAudit: (path?: string) => void;
}

export const CommandZone: React.FC<CommandZoneProps> = ({
  repoPath,
  setRepoPath,
  loading,
  onRunAudit
}) => {
  return (
    <section id="command-zone" className="aurora-glass rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-800/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-slate-50 font-black text-base sm:text-lg">
          <FolderSearch className="w-6 h-6 text-cyan-400" />
          <span>Target Repository Input</span>
        </div>
        <span className="text-xs font-mono text-cyan-400 font-bold hidden sm:inline">Local Directory or GitHub URL Scan</span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-3.5 w-full">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={repoPath}
            onChange={(e) => setRepoPath(e.target.value)}
            placeholder="Enter local path (e.g. ./sample_project) or GitHub URL (e.g. https://github.com/owner/repo)..."
            className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-5 py-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono shadow-inner"
          />
          <Terminal className="absolute right-4 top-4.5 w-4 h-4 text-slate-500" />
        </div>

        <button
          onClick={() => onRunAudit()}
          disabled={loading}
          className="relative group overflow-hidden py-4 px-8 rounded-2xl font-black text-xs sm:text-sm tracking-wider text-white shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shrink-0 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 group-hover:opacity-90 transition-opacity"></div>
          <div className="relative flex items-center gap-2">
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-white" />
                <span>Auditing Codebase...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 text-cyan-200" />
                <span>RUN DEEP RAG AUDIT</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400 font-bold">
        <span>Quick Presets:</span>
        <button
          onClick={() => {
            setRepoPath("./sample_project");
            onRunAudit("./sample_project");
          }}
          className="px-3 py-1 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 font-bold transition-all"
        >
          + ./sample_project (Local)
        </button>

        <button
          onClick={() => {
            const demoUrl = "https://github.com/expressjs/express";
            setRepoPath(demoUrl);
            onRunAudit(demoUrl);
          }}
          className="px-3 py-1 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 font-bold transition-all flex items-center gap-1.5"
        >
          <Github className="w-3.5 h-3.5 text-cyan-400" />
          <span>+ Express.js (GitHub Cloud)</span>
        </button>
      </div>
    </section>
  );
};
