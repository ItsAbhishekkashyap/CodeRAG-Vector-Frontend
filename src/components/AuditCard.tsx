"use client";

import React, { useEffect, useRef, useState } from "react";
import { queueRefresh } from "@/lib/motion";

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

const barColor = (v: number) => (v >= 80 ? "var(--pass)" : v >= 60 ? "var(--warn)" : "var(--crit)");

/** "[OOPS] Public attributes…" → tag + message */
const Finding: React.FC<{ text: string }> = ({ text }) => {
  const m = text.match(/^\[(.*?)\]\s*(.*)$/);
  return m ? (
    <li><span className="tagd">{m[1]}</span>{m[2]}</li>
  ) : (
    <li>{text}</li>
  );
};

/** Light syntax tint for the refactored snippet: comments, strings, keywords. */
const KEYWORDS = /\b(import|from|class|def|return|with|self|var|const|let|function|async|await|if|else|for|in|try|except)\b/;
function highlight(code: string) {
  return code.split("\n").map((line, i) => {
    if (/^\s*(#|\/\/)/.test(line)) return <span key={i} className="c">{line}{"\n"}</span>;
    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:import|from|class|def|return|with|self|var|const|let|function|async|await|if|else|for|in|try|except)\b)/g);
    return (
      <span key={i}>
        {parts.map((p, j) =>
          !p ? null : /^["']/.test(p) ? <span key={j} className="s">{p}</span> : KEYWORDS.test(p) && p.match(KEYWORDS)?.[0] === p ? <span key={j} className="k">{p}</span> : p
        )}
        {"\n"}
      </span>
    );
  });
}

export const AuditCard: React.FC<AuditCardProps> = ({
  file,
  isExpanded,
  onToggleDiff,
  copiedFile,
  onCopySnippet
}) => {
  const isPassed = file.overall_score >= 80;
  const architecture = file.violations.filter(v => v.includes("[OOPS]") || v.includes("[DBMS]"));
  const security = file.violations.filter(v => v.includes("[Security") || v.includes("[OS]"));
  const clean = file.violations.length === 0 || file.violations[0] === "No critical violations flagged.";

  // score bars draw in the first time the row scrolls into view
  const rowRef = useRef<HTMLLIElement>(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setDrawn(true);
        io.disconnect();
      }
    }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the drawer changes page height; re-measure scroll animations after it settles
  useEffect(() => {
    queueRefresh(760);
  }, [isExpanded]);

  const bars: [string, number][] = [
    ["OOP", file.oops_score],
    ["DBMS", file.dbms_score],
    ["OS", file.os_concurrency_score],
    ["Sec", file.security_score],
  ];

  return (
    <li className={`file${isExpanded ? " open" : ""}${drawn ? " drawn" : ""}`} ref={rowRef}>
      <button className="file__row" onClick={onToggleDiff} aria-expanded={isExpanded}>
        <span className="file__name">
          {file.filename}
          <small>{clean ? "No violations" : `${file.violations.length} ${file.violations.length === 1 ? "violation" : "violations"}`}</small>
        </span>
        <span className="bars">
          {bars.map(([n, v]) => (
            <span key={n}>
              <span><span>{n}</span><span>{v}</span></span>
              <i style={{ ["--v" as string]: v / 100, ["--c" as string]: barColor(v) }} />
            </span>
          ))}
        </span>
        <span className="file__score">{file.overall_score}<small> /100</small></span>
        <span className="file__verdict">
          <span className={`verdict ${isPassed ? "v-pass" : "v-crit"}`}>{isPassed ? "Passed" : "Needs work"}</span>
        </span>
        <span className="plus" aria-hidden="true" />
      </button>

      <div className="file__drawer">
        <div>
          <div className="drawer">
            <div>
              <h4 className="drawer__h">Object design &amp; databases <span>OOP {file.oops_score} · DBMS {file.dbms_score}</span></h4>
              <ul>
                {architecture.map((v, i) => <Finding key={i} text={v} />)}
                {architecture.length === 0 && <li className="empty">No object design or database issues.</li>}
              </ul>
            </div>

            <div>
              <h4 className="drawer__h">Concurrency &amp; security <span>OS {file.os_concurrency_score} · Sec {file.security_score}</span></h4>
              <ul>
                {security.map((v, i) => <Finding key={i} text={v} />)}
                {security.length === 0 && <li className="empty">No concurrency or security issues.</li>}
              </ul>
            </div>

            {file.recommendations.length > 0 && (
              <div className="fix">
                <h4 className="drawer__h">How to fix it <span>{file.recommendations.length}</span></h4>
                <ul>
                  {file.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}

            <div className="codebox">
              <div className="codebox__bar">
                <span>Refactored {file.filename}</span>
                <button
                  className="copy"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopySnippet(file.filename, file.optimized_code_snippet);
                  }}
                >
                  {copiedFile === file.filename ? "Copied" : "Copy code"}
                </button>
              </div>
              <pre data-lenis-prevent tabIndex={0} aria-label={`Refactored ${file.filename}`}>
                <code>{highlight(file.optimized_code_snippet)}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
