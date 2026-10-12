"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, hasFinePointer, lockScroll, prefersReducedMotion, scramble, useReady } from "@/lib/motion";

interface HeaderProps {
  showSetupGuide: boolean;
  onToggleSetupGuide: () => void;
  onScrollToAudit: () => void;
}

const LINKS = [
  { href: "#specimen", label: "How it reads" },
  { href: "#lenses", label: "Rules" },
  { href: "#pipeline", label: "Pipeline" },
];

export const Header: React.FC<HeaderProps> = ({
  showSetupGuide,
  onToggleSetupGuide,
  onScrollToAudit
}) => {
  const nav = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const ready = useReady();

  // mobile menu open/close
  const setMenu = useCallback((open: boolean) => {
    setMenuOpen(open);
    document.documentElement.classList.toggle("menu-open", open);
    lockScroll("menu", open);
  }, []);

  useEffect(() => {
    if (!menuOpen || prefersReducedMotion()) return;
    const links = menuRef.current?.querySelectorAll<HTMLElement>("a span, a.menu-audit span");
    const t = setTimeout(() => links?.forEach((l, i) => setTimeout(() => scramble(l), i * 70)), 220);
    return () => clearTimeout(t);
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    const onResize = () => window.innerWidth > 860 && setMenu(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.documentElement.classList.remove("menu-open");
      lockScroll("menu", false);
    };
  }, [setMenu]);

  // entrance, solid background on scroll, colour by section
  useEffect(() => {
    if (!ready || !nav.current) return;
    const el = nav.current;
    const ctx = gsap.context(() => {
      if (!prefersReducedMotion()) gsap.from(el, { yPercent: -100, duration: 1, ease: "expo.out", delay: 0.2 });
      const lensEnd = () => {
        const lenses = document.querySelector(".lenses");
        const track = document.querySelector<HTMLElement>(".lenses__track");
        if (lenses?.classList.contains("js-h") && track) return "+=" + (track.scrollWidth - window.innerWidth + window.innerHeight - 70);
        return "bottom 70px";
      };
      ScrollTrigger.create({ trigger: ".lenses", start: "top 70px", end: lensEnd, invalidateOnRefresh: true, toggleClass: { targets: el, className: "is-dark" } });
      ScrollTrigger.create({ trigger: "#command-zone", start: "top 70px", end: "bottom 70px", toggleClass: { targets: el, className: "is-cobalt" } });
      ScrollTrigger.create({ trigger: ".footer", start: "top 70px", end: "max", toggleClass: { targets: el, className: "is-dark" } });
      ScrollTrigger.create({ start: 60, end: "max", onToggle: (s) => el.classList.toggle("is-solid", s.isActive) });
    });
    return () => ctx.revert();
  }, [ready]);

  const onHoverScramble = (e: React.MouseEvent<HTMLElement>) => {
    if (hasFinePointer() && !prefersReducedMotion()) scramble(e.currentTarget);
  };

  return (
    <>
      <header className="nav" ref={nav}>
        <a href="#top" className="brand" data-scroll onClick={() => setMenu(false)}>
          CodeRAG<i>Vector</i>
        </a>

        <nav className="nav__links" aria-label="Sections">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} data-scroll onMouseEnter={onHoverScramble}>
              {l.label}
            </a>
          ))}
          <a
            href="#command-zone"
            onMouseEnter={onHoverScramble}
            onClick={(e) => {
              e.preventDefault();
              onScrollToAudit();
            }}
          >
            Audit
          </a>
        </nav>

        <div className="nav__right">
          <span className="status"><b />Engine online</span>
          <button
            className="pill"
            onClick={onToggleSetupGuide}
            onMouseEnter={onHoverScramble}
            aria-expanded={showSetupGuide}
          >
            Run locally
          </button>
          <button
            className="burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mmenu"
            onClick={() => setMenu(!menuOpen)}
          >
            <i /><i />
          </button>
        </div>
      </header>

      <div className="mmenu" id="mmenu" ref={menuRef} aria-hidden={!menuOpen}>
        <ol>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} data-scroll tabIndex={menuOpen ? 0 : -1} onClick={() => setMenu(false)}>
                <span>{l.label}</span>
              </a>
            </li>
          ))}
          <li>
            <a
              href="#command-zone"
              className="menu-audit"
              tabIndex={menuOpen ? 0 : -1}
              onClick={(e) => {
                e.preventDefault();
                setMenu(false);
                onScrollToAudit();
              }}
            >
              <span>Audit</span>
            </a>
          </li>
        </ol>
        <div className="mmenu__foot">
          <span className="status"><b />Engine online</span>
          <button
            className="pill"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => {
              setMenu(false);
              onToggleSetupGuide();
            }}
          >
            Run locally
          </button>
        </div>
      </div>
    </>
  );
};
