"use client";

import React, { useEffect, useRef } from "react";
import { gsap, hasFinePointer, prefersReducedMotion, useReady } from "@/lib/motion";

interface IntroBannerProps {
  onStartScan: () => void;
  onToggleSetup: () => void;
}

const LINES: { text: string; cls: string; mask?: string }[] = [
  { text: "Code review,", cls: "l1" },
  { text: "by the", cls: "l2" },
  { text: "rulebook.", cls: "l3 pen", mask: "m3" },
];

/** Splits a line into per-letter spans, grouped per word so words never break. */
const Letters: React.FC<{ text: string }> = ({ text }) => {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, wi) => (
        <React.Fragment key={wi}>
          <span style={{ whiteSpace: "nowrap", display: "inline-block" }}>
            {[...w].map((c, ci) => (
              <span className="ch" key={ci}>{c}</span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </>
  );
};

export const IntroBanner: React.FC<IntroBannerProps> = ({
  onStartScan,
  onToggleSetup
}) => {
  const hero = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const ready = useReady();

  // letters widen and thicken near the pointer; on touch screens a slow sweep (and your finger) drives it
  useEffect(() => {
    const h = hero.current, t = title.current;
    if (!h || !t || prefersReducedMotion()) return;
    const chars = Array.from(t.querySelectorAll<HTMLElement>(".ch"));
    const pt = { x: -9999, y: -9999 };
    // touch screens get a gentler, tighter bulge so lines never re-wrap mid-sweep
    const fine = hasFinePointer();
    const amp = fine ? 41 : 16, radius = fine ? 360 : 170, boost = fine ? 100 : 60;
    let queued = false;
    const flex = () => {
      queued = false;
      chars.forEach((ch) => {
        const r = ch.getBoundingClientRect();
        const d = Math.hypot(pt.x - (r.left + r.width / 2), (pt.y - (r.top + r.height / 2)) * 1.4);
        const k = Math.max(0, 1 - d / radius);
        ch.style.setProperty("--w", (84 + k * amp).toFixed(1));
        ch.style.setProperty("--g", String(Math.round(800 + k * boost)));
      });
    };
    const queue = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(flex);
      }
    };

    if (fine) {
      const move = (e: MouseEvent) => {
        pt.x = e.clientX;
        pt.y = e.clientY;
        queue();
      };
      const leave = () => {
        pt.x = pt.y = -9999;
        queue();
      };
      h.addEventListener("mousemove", move);
      h.addEventListener("mouseleave", leave);
      return () => {
        h.removeEventListener("mousemove", move);
        h.removeEventListener("mouseleave", leave);
      };
    }

    // touch: a sweep travels across each line in turn while the hero is on screen
    let touching = false;
    const lines = Array.from(t.querySelectorAll<HTMLElement>(".mask > span"));
    const sweep = gsap.timeline({ repeat: -1, repeatDelay: 1.2, paused: true });
    lines.forEach((line) => {
      const o = { p: 0 };
      sweep.to(o, {
        p: 1,
        duration: 1.6,
        ease: "sine.inOut",
        onUpdate() {
          if (touching) return;
          const r = line.getBoundingClientRect();
          pt.x = r.left - 120 + (r.width + 240) * o.p;
          pt.y = r.top + r.height / 2;
          queue();
        },
      }, "-=0.5");
    });
    sweep.add(() => {
      if (!touching) {
        pt.x = pt.y = -9999;
        queue();
      }
    });
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? sweep.play() : sweep.pause()));
    io.observe(h);
    const tmove = (e: TouchEvent) => {
      touching = true;
      pt.x = e.touches[0].clientX;
      pt.y = e.touches[0].clientY;
      queue();
    };
    const tend = () => {
      touching = false;
    };
    h.addEventListener("touchmove", tmove, { passive: true });
    h.addEventListener("touchend", tend);
    return () => {
      io.disconnect();
      sweep.kill();
      h.removeEventListener("touchmove", tmove);
      h.removeEventListener("touchend", tend);
    };
  }, []);

  // entrance once the preloader lifts
  useEffect(() => {
    if (!ready || !hero.current) return;
    const ctx = gsap.context(() => {
      const path = hero.current!.querySelector(".stroke path");
      if (prefersReducedMotion()) return;
      gsap.from(".hero__title .mask > span", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.09 });
      gsap.from(".hero__meta, .hero__foot, .cue, .facts", { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.35 });
      if (path) gsap.fromTo(path, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "expo.inOut", delay: 0.75 });
    }, hero);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section className="hero wrap" ref={hero}>
      <div className="hero__meta">
        <span>RAG code auditor for Python, JavaScript, TypeScript and SQL</span>
        <span>FastAPI, ChromaDB, Gemini 1.5 Flash</span>
      </div>

      <h1 className="hero__title" ref={title} aria-label="Code review, by the rulebook.">
        {LINES.map((l) => (
          <span className={`mask ${l.mask ?? ""}`} key={l.text}>
            <span className={l.cls} aria-hidden="true">
              <Letters text={l.text} />
              {l.cls.startsWith("l3") && (
                <svg className="stroke" viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden="true">
                  <path pathLength={1} d="M3 13 C 70 6, 150 4, 230 8 S 360 15, 397 7" />
                </svg>
              )}
            </span>
            {" "}
          </span>
        ))}
      </h1>

      <div className="hero__foot">
        <p className="hero__lede">
          Point it at a local folder or a public GitHub repo. Each file is matched against{" "}
          <em>17 computer-science rules</em> on object design, SQL, concurrency and network security, then scored,
          explained and rewritten.
        </p>
        <div className="hero__ctas">
          <button className="btn magnetic" onClick={onStartScan}>
            Audit a repository
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M2 8h12M9 3l5 5-5 5" />
            </svg>
          </button>
          <button className="link" onClick={onToggleSetup}>Run it on your machine</button>
        </div>
      </div>

      <div className="cue" aria-hidden="true">
        <i />
        <span>Scroll to watch a file get reviewed</span>
      </div>

      <div className="facts">
        <div><b>17</b><span>rules in the vector store</span></div>
        <div><b>4</b><span>domains scored per file</span></div>
        <div><b>15</b><span>files audited per scan, max</span></div>
        <div><b>300</b><span>lines per chunk</span></div>
      </div>
    </section>
  );
};
