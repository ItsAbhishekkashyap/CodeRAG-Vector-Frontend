"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { IntroBanner } from "@/components/IntroBanner";
import { LocalSetupModal } from "@/components/LocalSetupModal";
import { ExecutiveMetrics } from "@/components/ExecutiveMetrics";
import { CommandZone } from "@/components/CommandZone";
import { FilterBar } from "@/components/FilterBar";
import { AuditCard } from "@/components/AuditCard";
import { Footer } from "@/components/Footer";
import { FileCode, AlertTriangle, RefreshCw } from "lucide-react";

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

interface ScanReportResponse {
  status: string;
  scanned_files_count: number;
  overall_project_score: number;
  audit_results: AuditResult[];
  summary: {
    total_files: number;
    total_violations: number;
    repo_path: string;
  };
}

export default function RepoGuardDashboard() {
  const [repoPath, setRepoPath] = useState("./sample_project");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>("");
  const [report, setReport] = useState<ScanReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // Run audit scan against FastAPI backend
  const handleRunAudit = async (targetPath?: string) => {
    const pathToScan = targetPath || repoPath;
    if (!pathToScan.trim()) return;

    setLoading(true);
    setError(null);
    setLoadingStage("Scanning codebase structure & indexing target files...");

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

    try {
      await new Promise((res) => setTimeout(res, 400));
      setLoadingStage("Executing Multi-Domain Static & Dynamic Security Audit...");

      const response = await fetch(`${baseUrl}/api/scan-repo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_path: pathToScan })
      });

      if (!response.ok) {
        const fallbackRes = await fetch(`${baseUrl}/api/scan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repo_path: pathToScan })
        });
        
        if (!fallbackRes.ok) {
          const errData = await fallbackRes.json().catch(() => null);
          throw new Error(errData?.detail || `Audit request failed with status ${response.status}`);
        }
        const data: ScanReportResponse = await fallbackRes.json();
        setReport(data);
      } else {
        const data: ScanReportResponse = await response.json();
        setReport(data);
      }
    } catch (err: any) {
      console.error("Scan error:", err);
      setError(err.message || "Could not connect to local audit backend.");
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  // Initial audit scan on load
  useEffect(() => {
    handleRunAudit();
  }, []);

  const toggleDiff = (filename: string) => {
    setExpandedFiles((prev) => ({ ...prev, [filename]: !prev[filename] }));
  };

  const copySnippet = (filename: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const scrollToCommandZone = () => {
    const elem = document.getElementById("command-zone");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Metrics
  const overallScore = report?.overall_project_score ?? 0;
  const totalFiles = report?.scanned_files_count ?? 0;
  const totalViolations = report?.summary?.total_violations ?? 0;

  // Filtered files list
  const filteredResults = (report?.audit_results || []).filter((item) => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (domainFilter === "ALL") return true;
    if (domainFilter === "CRITICAL") return item.overall_score < 75;
    if (domainFilter === "OOPS") return item.oops_score < 80;
    if (domainFilter === "DBMS") return item.dbms_score < 80;
    if (domainFilter === "SECURITY") return item.security_score < 80;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#05070e] text-slate-100 antialiased flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Header */}
      <Header
        showSetupGuide={showSetupGuide}
        onToggleSetupGuide={() => setShowSetupGuide(!showSetupGuide)}
        onScrollToAudit={scrollToCommandZone}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
        
        {/* Local Setup Procedure Drawer */}
        {showSetupGuide && (
          <LocalSetupModal onClose={() => setShowSetupGuide(false)} />
        )}

        {/* Eye-Catching Landing Intro Hero Section */}
        <IntroBanner
          onStartScan={scrollToCommandZone}
          onToggleSetup={() => setShowSetupGuide(true)}
        />

        {/* Executive Metrics Summary */}
        <ExecutiveMetrics
          overallScore={overallScore}
          totalFiles={totalFiles}
          totalViolations={totalViolations}
        />

        {/* Command Zone Input Bar */}
        <CommandZone
          repoPath={repoPath}
          setRepoPath={setRepoPath}
          loading={loading}
          onRunAudit={handleRunAudit}
        />

        {/* Audit Results Breakdown */}
        <section className="space-y-5">
          <FilterBar
            totalFiles={filteredResults.length}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            domainFilter={domainFilter}
            setDomainFilter={setDomainFilter}
          />

          {/* Error Banner */}
          {error && (
            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-3 text-xs sm:text-sm shadow-xl">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold block text-sm">Execution Exception</span>
                <span className="font-mono opacity-90">{error}</span>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="aurora-glass rounded-3xl p-12 text-center space-y-4 shadow-2xl">
              <RefreshCw className="w-9 h-9 animate-spin text-cyan-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-50">{loadingStage}</h3>
                <p className="text-xs text-slate-400 font-medium">
                  Retrieving CS rules database and performing static code analysis...
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredResults.length === 0 && (
            <div className="aurora-glass rounded-3xl p-16 text-center text-slate-400 space-y-2 border border-slate-800">
              <FileCode className="w-12 h-12 mx-auto text-slate-500" />
              <p className="font-extrabold text-slate-200 text-base">No Audited Files Match Selected Criteria</p>
              <p className="text-xs text-slate-400 font-medium">Try running a scan or selecting &quot;All&quot; filter tab.</p>
            </div>
          )}

          {/* Accordion Audit Breakdown Cards List */}
          {!loading &&
            filteredResults.map((file) => (
              <AuditCard
                key={file.filename}
                file={file}
                isExpanded={expandedFiles[file.filename] || false}
                onToggleDiff={() => toggleDiff(file.filename)}
                copiedFile={copiedFile}
                onCopySnippet={copySnippet}
              />
            ))}
        </section>

      </main>

      {/* Robust Enterprise Footer */}
      <Footer />

    </div>
  );
}
