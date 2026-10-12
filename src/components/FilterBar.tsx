"use client";

import React from "react";

interface FilterBarProps {
  totalFiles: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  domainFilter: string;
  setDomainFilter: (filter: string) => void;
}

const FILTERS = [
  { id: "ALL", label: "All" },
  { id: "CRITICAL", label: "Below 75" },
  { id: "OOPS", label: "OOP issues" },
  { id: "DBMS", label: "DBMS issues" },
  { id: "SECURITY", label: "Security issues" },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  totalFiles,
  searchQuery,
  setSearchQuery,
  domainFilter,
  setDomainFilter
}) => {
  return (
    <>
      <div className="filters">
        <div className="seg" role="group" aria-label="Filter files">
          {FILTERS.map((btn) => (
            <button
              key={btn.id}
              aria-pressed={domainFilter === btn.id}
              onClick={() => setDomainFilter(btn.id)}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <label className="search">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l3.5 3.5" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by file name"
            aria-label="Filter by file name"
          />
        </label>
      </div>
      <div className="count">
        {totalFiles} {totalFiles === 1 ? "file" : "files"}
      </div>
    </>
  );
};
