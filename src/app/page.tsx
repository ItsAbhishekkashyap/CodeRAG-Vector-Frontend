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
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Preloader } from "@/components/motion/Preloader";
import { Cursor } from "@/components/motion/Cursor";
import { Ambient } from "@/components/motion/Ambient";
import { FloatingAudit } from "@/components/motion/FloatingAudit";
import { Marquee } from "@/components/sections/Marquee";
import { Specimen } from "@/components/sections/Specimen";
import { Lenses } from "@/components/sections/Lenses";
import { Pipeline } from "@/components/sections/Pipeline";
import { smoothScrollTo } from "@/lib/motion";

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
      smoothScrollTo(elem);
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
    <>
      <SmoothScroll />
      <Preloader />
      <Ambient />
      <Cursor />

      {/* Header */}
      <Header
        showSetupGuide={showSetupGuide}
        onToggleSetupGuide={() => setShowSetupGuide(!showSetupGuide)}
        onScrollToAudit={scrollToCommandZone}
      />

      <main id="top">
        {/* Landing hero */}
        <IntroBanner
          onStartScan={scrollToCommandZone}
          onToggleSetup={() => setShowSetupGuide(true)}
        />

        <Marquee />
        <Specimen />
        <Lenses />
        <Pipeline />

        {/* Command Zone Input Bar */}
        <CommandZone
          repoPath={repoPath}
          setRepoPath={setRepoPath}
          loading={loading}
          onRunAudit={handleRunAudit}
          loadingStage={loadingStage}
        />

        {/* Audit Report */}
        <section className="report wrap" id="report" aria-labelledby="report-title">
          <ExecutiveMetrics
            overallScore={overallScore}
            totalFiles={totalFiles}
            totalViolations={totalViolations}
            repoPath={report?.summary?.repo_path}
          />

          <FilterBar
            totalFiles={filteredResults.length}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            domainFilter={domainFilter}
            setDomainFilter={setDomainFilter}
          />

          <ul className={`files${loading ? "" : " in"}`}>
            {/* Error Banner */}
            {error && (
              <li className="state state--err" role="alert">
                <div>
                  <h3 className="state__h">The audit couldn&rsquo;t run</h3>
                  <p><code>{error}</code></p>
                </div>
                <button className="pill" onClick={scrollToCommandZone}>Edit the path</button>
              </li>
            )}

            {/* Loading Indicator */}
            {loading && (
              <li className="state" aria-live="polite">
                <div>
                  <h3 className="state__h">{loadingStage}</h3>
                  <p>Retrieving CS rules database and performing static code analysis...</p>
                </div>
                <span className="run" style={{ background: "var(--ink)", color: "var(--paper)" }} aria-hidden="true">
                  <span className="spin" style={{ display: "inline-block" }} />
                </span>
              </li>
            )}

            {/* Empty State */}
            {!loading && filteredResults.length === 0 && (
              <li className="state">
                <div>
                  <h3 className="state__h">No audited files match</h3>
                  <p>Run a scan, clear the search, or switch the filter to All.</p>
                </div>
                <button
                  className="pill"
                  onClick={() => {
                    setDomainFilter("ALL");
                    setSearchQuery("");
                  }}
                >
                  Show all files
                </button>
              </li>
            )}

            {/* Accordion Audit Breakdown List */}
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
          </ul>
        </section>
      </main>

      {/* Footer */}
      <Footer onOpenSetup={() => setShowSetupGuide(true)} />

      {/* Local Setup drawer */}
      <LocalSetupModal open={showSetupGuide} onClose={() => setShowSetupGuide(false)} />

      <FloatingAudit />
    </>
  );
}
