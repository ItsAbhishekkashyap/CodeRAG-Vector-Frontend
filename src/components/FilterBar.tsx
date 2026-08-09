"use client";

import React from "react";
import { Code2, Search } from "lucide-react";

interface FilterBarProps {
  totalFiles: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  domainFilter: string;
  setDomainFilter: (filter: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  totalFiles,
  searchQuery,
  setSearchQuery,
  domainFilter,
  setDomainFilter
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
      <div className="flex items-center gap-2.5 text-slate-50 font-black text-base sm:text-xl">
        <Code2 className="w-6 h-6 text-cyan-400" />
        <span>Audit Results Breakdown</span>
        <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
          {totalFiles} files
        </span>
      </div>

      {/* Responsive Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
        <div className="relative shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter files..."
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono w-40 sm:w-48"
          />
          <Search className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
        </div>

        {[
          { id: "ALL", label: "All" },
          { id: "CRITICAL", label: "Critical" },
          { id: "OOPS", label: "OOPS" },
          { id: "DBMS", label: "DBMS" },
          { id: "SECURITY", label: "Security" },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setDomainFilter(btn.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
              domainFilter === btn.id
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};
