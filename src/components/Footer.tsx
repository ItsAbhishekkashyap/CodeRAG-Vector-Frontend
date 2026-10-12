"use client";

import React, { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, useReady } from "@/lib/motion";

interface FooterProps {
  onOpenSetup?: () => void;
}

const WORD = "CodeRAG Vector";

export const Footer: React.FC<FooterProps> = ({ onOpenSetup }) => {
  const root = useRef<HTMLElement>(null);
  const ready = useReady();

  useEffect(() => {
    if (!ready || !root.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".footer__word", { yPercent: 25, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true } });
      gsap.from(".footer__word .fc", { yPercent: 100, duration: 1.2, ease: "expo.out", stagger: 0.035, scrollTrigger: { trigger: ".footer__word", start: "top 95%" } });
      gsap.from(".footer__cols > div", { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: ".footer__cols", start: "top 90%" } });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <footer className="footer" ref={root}>
      <div className="wrap">
        <div className="footer__cols">
          <div>
            <p>
              An automated reviewer for code quality and security. It checks object design, database safety, concurrency
              and network security against a fixed rulebook, and shows its work.
            </p>
          </div>
          <nav aria-label="Domains">
            <h2 className="footer__h">Domains</h2>
            <ul>
              <li>Object design</li>
              <li>Databases &amp; SQL</li>
              <li>Concurrency</li>
              <li>Network security</li>
            </ul>
          </nav>
          <div>
            <h2 className="footer__h">Stack</h2>
            <ul>
              <li>FastAPI</li>
              <li>ChromaDB</li>
              <li>LangChain</li>
              <li>Next.js 14</li>
            </ul>
          </div>
          <nav aria-label="Jump to">
            <h2 className="footer__h">Jump to</h2>
            <ul>
              <li><a href="#command-zone" data-scroll>Run an audit</a></li>
              <li><a href="#lenses" data-scroll>Read the rules</a></li>
              {onOpenSetup && <li><button onClick={onOpenSetup}>Local setup</button></li>}
            </ul>
          </nav>
        </div>
      </div>
      <div className="footer__word" aria-hidden="true">
        {[...WORD].map((c, i) => (
          <span className="fc" key={i}>{c === " " ? " " : c}</span>
        ))}
      </div>
      <div className="footer__base wrap">
        <span>© {new Date().getFullYear()} CodeRAG Vector</span>
        <a href="#top" className="totop" data-scroll>
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
};
