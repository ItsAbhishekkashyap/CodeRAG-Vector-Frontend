"use client";

import React, { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, useReady } from "@/lib/motion";

interface CommandZoneProps {
  repoPath: string;
  setRepoPath: (path: string) => void;
  loading: boolean;
  onRunAudit: (path?: string) => void;
  loadingStage?: string;
}

const STAGES = ["Fetch and filter files", "Retrieve matching rules", "Audit each file", "Build the report"];

/** Maps the dashboard's loading message onto the four visible stages. */
function stageClasses(loading: boolean, loadingStage = "") {
  if (!loading) return ["done", "done", "done", "done"];
  if (/^Executing/i.test(loadingStage)) return ["done", "done", "now", ""];
  return ["now", "", "", ""];
}

export const CommandZone: React.FC<CommandZoneProps> = ({
  repoPath,
  setRepoPath,
  loading,
  onRunAudit,
  loadingStage
}) => {
  const section = useRef<HTMLElement>(null);
  const ready = useReady();
  const stages = stageClasses(loading, loadingStage);

  useEffect(() => {
    if (!ready || !section.current || prefersReducedMotion()) return;
    const root = section.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(root, { clipPath: "inset(4% 3% 0% 3% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "top 25%", scrub: true } });
      gsap.from(".mask > span", { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root, start: "top 70%" } });
      gsap.from(".field, .presets, .stages li", { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: ".field", start: "top 90%" } });
      gsap.to(".console__big", { yPercent: -18, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section id="command-zone" className="console wrap" ref={section} aria-labelledby="audit-title">
      <div className="console__big" aria-hidden="true">RUN</div>
      <div className="console__grid">
        <h2 id="audit-title">
          <span className="mask"><span>Audit a</span></span>
          <span className="mask"><span>repository.</span></span>
        </h2>
        <p>Paste a local folder path the backend can see, or the URL of any public GitHub repository.</p>
      </div>

      <form
        className="field"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          onRunAudit();
        }}
      >
        <label htmlFor="repoPath" aria-label="Repository path or GitHub URL">›</label>
        <input
          id="repoPath"
          type="text"
          value={repoPath}
          onChange={(e) => setRepoPath(e.target.value)}
          spellCheck={false}
          placeholder="./my_project or https://github.com/owner/repo"
        />
        <button className="run magnetic" type="submit" disabled={loading}>
          <span className="spin" />
          <span>{loading ? "Auditing…" : "Run audit"}</span>
        </button>
      </form>

      <div className="presets">
        <span>Try</span>
        <button
          className="chip"
          onClick={() => {
            setRepoPath("./sample_project");
            onRunAudit("./sample_project");
          }}
        >
          ./sample_project
        </button>
        <button
          className="chip"
          onClick={() => {
            const demoUrl = "https://github.com/expressjs/express";
            setRepoPath(demoUrl);
            onRunAudit(demoUrl);
          }}
        >
          github.com/expressjs/express
        </button>
      </div>

      <ol className="stages" aria-live="polite">
        {STAGES.map((s, i) => (
          <li key={s} className={stages[i]}>{s}</li>
        ))}
      </ol>
    </section>
  );
};
