"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, hasFinePointer, prefersReducedMotion, useReady } from "@/lib/motion";

const Row = ({ a, b, cls }: { a: React.ReactNode; b: React.ReactNode; cls?: string }) => (
  <div className="row"><span>{a}</span><span className={cls}>{b}</span></div>
);
const Meter = ({ v }: { v: number }) => <div className="meter"><i style={{ width: `${v}%` }} /></div>;

const STAGES: { k: string; h: string; p: string; t: string; peek: React.ReactNode }[] = [
  {
    k: "01", h: "Fetch", t: "git / fs",
    p: "Reads a local path, or shallow-clones a public GitHub URL into a temporary folder.",
    peek: (<><h6><span>Fetch</span><b>git</b></h6><div className="dim">$ git clone --depth 1</div><div>github.com/expressjs/express</div><Row a={<span className="dim">files found</span>} b="142" cls="hi" /></>),
  },
  {
    k: "02", h: "Filter", t: "crawler",
    p: "Skips node_modules, .git, .next and venv, then keeps at most 15 key source files.",
    peek: (<><h6><span>Filter</span><b>crawler</b></h6><div className="del">node_modules/</div><div className="del">.git/</div><div className="del">.next/</div><div className="del">venv/</div><Row a="kept" b="15 of 142" cls="ok" /></>),
  },
  {
    k: "03", h: "Chunk", t: "LangChain",
    p: "Splits each file on class and function boundaries, 300 lines at most per chunk.",
    peek: (<><h6><span>Chunk</span><b>LangChain</b></h6><Row a="user_service.py" b="1 chunk" cls="hi" /><Row a="database_manager.py" b="1 chunk" cls="hi" /><Row a="lib/router/index.js" b="3 chunks" cls="hi" /><div className="dim">max 300 lines each</div></>),
  },
  {
    k: "04", h: "Retrieve", t: "ChromaDB",
    p: "Embeds every chunk and pulls the nearest rules from the 17 stored in the collection.",
    peek: (<><h6><span>Retrieve</span><b>ChromaDB</b></h6><Row a="OOP-001" b="0.91" /><Meter v={91} /><Row a="NET-002" b="0.86" /><Meter v={86} /><Row a="OS-001" b="0.74" /><Meter v={74} /></>),
  },
  {
    k: "05", h: "Judge", t: "Gemini 1.5 Flash",
    p: "Sends the code and its rules to the model, which returns violations, four scores and a rewrite.",
    peek: (<><h6><span>Judge</span><b>Gemini 1.5 Flash</b></h6><div>{"{"}</div><div>&nbsp; &quot;oops_score&quot;: <span className="hi">70</span>,</div><div>&nbsp; &quot;dbms_score&quot;: <span className="hi">55</span>,</div><div>&nbsp; &quot;security_score&quot;: <span className="hi">65</span>,</div><div>&nbsp; &quot;violations&quot;: [<span className="dim">4</span>]</div><div>{"}"}</div></>),
  },
  {
    k: "06", h: "Report", t: "FastAPI",
    p: "Averages the scores per file and per project, and returns everything as one JSON report.",
    peek: (<><h6><span>Report</span><b>FastAPI</b></h6><Row a="files audited" b="2" /><Row a="violations" b="8" /><Row a="overall score" b="65 / 100" cls="hi" /><div className="ok">200 OK</div></>),
  },
];

/** The six server stages. Mouse: a card follows the cursor. Touch: each card unfolds as its row reaches mid-screen. */
export const Pipeline: React.FC = () => {
  const section = useRef<HTMLElement>(null);
  const peek = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const lastShown = useRef(0);
  if (hovered !== null) lastShown.current = hovered;
  const [fine, setFine] = useState(false);
  const ready = useReady();

  useEffect(() => setFine(hasFinePointer() && !prefersReducedMotion()), []);

  // floating card that trails the cursor
  useEffect(() => {
    if (!fine || !peek.current) return;
    const pk = peek.current;
    let px = 0, py = 0, qx = 0, qy = 0, lastX = 0, raf = 0;
    const move = (e: MouseEvent) => {
      qx = e.clientX + 28;
      qy = e.clientY - 60;
    };
    const loop = () => {
      px += (qx - px) * 0.14;
      py += (qy - py) * 0.14;
      const vx = px - lastX;
      lastX = px;
      const x = Math.min(px, window.innerWidth - 320);
      pk.style.transform = `translate3d(${x}px,${py}px,0) rotate(${Math.max(-6, Math.min(6, vx * 0.4))}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, [fine]);

  // reveals
  useEffect(() => {
    if (!ready || !section.current || prefersReducedMotion()) return;
    const root = section.current;
    const ctx = gsap.context(() => {
      gsap.from(".shead .mask > span", { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".shead", start: "top 85%" } });
      gsap.from(".pipe > li", { y: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: ".pipe", start: "top 80%" } });
      if (!hasFinePointer()) {
        root.querySelectorAll<HTMLElement>(".pipe > li").forEach((li) => {
          const card = li.querySelector(".peek-inline");
          if (card) gsap.from(card, { clipPath: "inset(0 0 100% 0 round 10px)", y: 14, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: li, start: "top 70%" } });
          ScrollTrigger.create({ trigger: li, start: "top 55%", end: "bottom 45%", toggleClass: "active" });
        });
      }
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section className="wrap" id="pipeline" ref={section} aria-labelledby="pipeline-title">
      <div className="shead">
        <h2 id="pipeline-title">
          <span className="mask"><span>What happens</span></span>
          <span className="mask"><span>when you press run.</span></span>
        </h2>
        <p>
          One request to <code>/api/scan-repo</code>. Six stages on the FastAPI server, usually done in under a minute for a small repo.
        </p>
      </div>
      <div className="pipe-wrap">
        <ol className="pipe">
          {STAGES.map((s, i) => (
            <li key={s.k} onMouseEnter={() => fine && setHovered(i)} onMouseLeave={() => fine && setHovered(null)}>
              <span className="k">{s.k}</span>
              <h3 className="pipe__h">{s.h}</h3>
              <p>{s.p}</p>
              <span className="t">{s.t}</span>
              <div className="peek-inline" aria-hidden="true">{s.peek}</div>
            </li>
          ))}
        </ol>
      </div>
      {fine && (
        <div className={`peek${hovered !== null ? " on" : ""}`} ref={peek} aria-hidden="true">
          {STAGES[lastShown.current].peek}
        </div>
      )}
    </section>
  );
};
