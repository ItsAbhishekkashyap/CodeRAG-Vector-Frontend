"use client";

import React, { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, queueRefresh, useReady } from "@/lib/motion";

interface ExecutiveMetricsProps {
  overallScore: number;
  totalFiles: number;
  totalViolations: number;
  repoPath?: string;
}

/** Number that counts up to its value whenever the value changes. */
const Count: React.FC<{ value: number }> = ({ value }) => {
  const el = useRef<HTMLSpanElement>(null);
  const shown = useRef(0);
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    if (prefersReducedMotion()) {
      node.textContent = String(value);
      shown.current = value;
      return;
    }
    const o = { v: shown.current };
    const tw = gsap.to(o, {
      v: value,
      duration: 1.2,
      ease: "expo.out",
      onUpdate: () => {
        node.textContent = String(Math.round(o.v));
        shown.current = o.v;
      },
    });
    return () => {
      tw.kill();
    };
  }, [value]);
  return <span ref={el}>{value}</span>;
};

export const ExecutiveMetrics: React.FC<ExecutiveMetricsProps> = ({
  overallScore,
  totalFiles,
  totalViolations,
  repoPath
}) => {
  const root = useRef<HTMLDivElement>(null);
  const ready = useReady();
  const verdict = overallScore >= 80 ? ["Excellent", "v-pass"] : overallScore >= 60 ? ["Moderate", "v-warn"] : ["Critical", "v-crit"];
  const hasIssues = totalViolations > 0;

  useEffect(() => {
    queueRefresh();
  }, [overallScore, totalFiles, totalViolations]);

  useEffect(() => {
    if (!ready || !root.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".report__head .mask > span", { yPercent: 110, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".report__head", start: "top 85%" } });
      gsap.from(".summary > div", { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".summary", start: "top 85%" } });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <div ref={root}>
      <div className="report__head">
        <h2 id="report-title">
          <span className="mask"><span>Report</span></span>
        </h2>
        {repoPath && <span className="src">{repoPath}</span>}
      </div>

      <div className="summary">
        <div>
          <div className="lbl">
            <span>Codebase quality</span>
            <span className={`verdict ${verdict[1]}`}>{verdict[0]}</span>
          </div>
          <div className="big">
            <Count value={overallScore} />
            <small>/ 100</small>
          </div>
          <div className="ruler" aria-hidden="true">
            <div className="ruler__scale"><i /><i /><i /></div>
            <div className="ruler__mark" data-v={overallScore} style={{ left: `${Math.min(100, Math.max(0, overallScore))}%` }} />
            <div className="ruler__ticks"><span>0</span><span>60</span><span>80</span><span>100</span></div>
          </div>
        </div>
        <div>
          <div className="lbl"><span>Files audited</span></div>
          <div className="big"><Count value={totalFiles} /></div>
        </div>
        <div>
          <div className="lbl">
            <span>Violations</span>
            <span className={`verdict ${hasIssues ? "v-crit" : "v-pass"}`}>{hasIssues ? "Fix needed" : "Compliant"}</span>
          </div>
          <div className="big"><Count value={totalViolations} /></div>
        </div>
      </div>
    </div>
  );
};
