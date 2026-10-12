"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, useReady } from "@/lib/motion";

const LENSES = [
  {
    title: "Object design", sub: "Encapsulation, abstraction and clean ownership of resources.",
    rules: [["OOP-001", "Strict encapsulation and access control"], ["OOP-002", "Abstract interfaces over concrete classes"], ["OOP-003", "Virtual destructors and runtime polymorphism"], ["OOP-004", "Matched heap deallocation (RAII)"], ["OOP-005", "Namespace scope isolation"]],
    code: "self.password = password", why: "Public state anyone can overwrite.",
  },
  {
    title: "Databases & SQL", sub: "Schema integrity, transactions and lean queries.",
    rules: [["DB-001", "Normalization from 1NF to BCNF"], ["DB-002", "Primary and foreign key constraints"], ["DB-003", "ACID transactions and isolation"], ["DB-004", "Explicit column projection and indexing"]],
    code: "UPDATE accounts SET balance = balance - {amount}", why: "Two updates, no commit or rollback.",
  },
  {
    title: "Concurrency", sub: "Race conditions, deadlocks, leaks and starved threads.",
    rules: [["OS-001", "Critical sections and race conditions"], ["OS-002", "Deadlock prevention and lock ordering"], ["OS-003", "Thrashing and memory leaks"], ["OS-004", "Starvation and bounded thread pools"]],
    code: "self.password = new_pass", why: "Shared state changed with no lock held.",
  },
  {
    title: "Network security", sub: "OWASP basics: transport, input and exposure.",
    rules: [["NET-001", "TLS and HTTPS for every connection"], ["NET-002", "SQL injection and input sanitization"], ["NET-003", "Connection pooling and keep-alive"], ["NET-004", "Firewalls and private subnet routing"]],
    code: "f\"... WHERE username = '{username}'\"", why: "User input pasted straight into SQL.",
  },
];

/** The four rule domains on a horizontal track that scrolls sideways as you scroll down. */
export const Lenses: React.FC = () => {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const prog = useRef<HTMLElement>(null);
  const ready = useReady();

  useEffect(() => {
    if (!ready || !section.current || !track.current) return;
    const root = section.current, tr = track.current;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(root, { clipPath: "inset(0% 3% 0% 3% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "top top", scrub: true } });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px), (max-width: 900px) and (min-height: 560px)", () => {
        root.classList.add("js-h");
        const dist = () => tr.scrollWidth - window.innerWidth;
        const tw = gsap.to(tr, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => "+=" + dist(),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            refreshPriority: 1,
            invalidateOnRefresh: true,
            onUpdate: (s) => {
              if (prog.current) prog.current.style.transform = `scaleX(${s.progress})`;
            },
          },
        });
        gsap.from(root.querySelectorAll(".panel--intro .mask > span"), { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root, start: "top 60%" } });
        root.querySelectorAll<HTMLElement>(".panel > .ghost").forEach((g) => {
          gsap.fromTo(g, { xPercent: 25 }, { xPercent: -25, ease: "none", scrollTrigger: { trigger: g.parentElement, containerAnimation: tw, start: "left right", end: "right left", scrub: true } });
        });
        root.querySelectorAll<HTMLElement>(".panel:not(.panel--intro)").forEach((p) => {
          gsap.from(p.querySelectorAll(".rules li"), { x: 40, opacity: 0, stagger: 0.06, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: p, containerAnimation: tw, start: "left 75%" } });
        });
        return () => {
          root.classList.remove("js-h");
          gsap.set(tr, { x: 0 });
        };
      });
      // short landscape phones: panels stack, each one still animates in
      mm.add("(max-width: 900px) and (max-height: 559px)", () => {
        root.querySelectorAll<HTMLElement>(".panel").forEach((p) => {
          gsap.from(p.querySelectorAll("h2 .mask > span, h3, .rules li"), { y: 40, opacity: 0, stagger: 0.05, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 80%" } });
        });
      });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section className="lenses" id="lenses" ref={section} aria-labelledby="lenses-title">
      <div className="lenses__track" ref={track}>
        <div className="panel panel--intro">
          <div>
            <h2 id="lenses-title">
              <span className="mask"><span>Four lenses.</span></span>
              <span className="mask"><span>Seventeen rules.</span></span>
            </h2>
            <p>
              Every file is read through all four. The rules come from operating systems, OOP, DBMS and computer networks
              coursework, stored as vectors so only the relevant ones are applied.
            </p>
          </div>
        </div>

        {LENSES.map((l, i) => (
          <article className="panel" key={l.title}>
            <span className="ghost" aria-hidden="true">0{i + 1}</span>
            <div className="panel__top">
              <span>Lens {i + 1} of 4</span>
              <span>{l.rules.length} rules</span>
            </div>
            <div />
            <div className="panel__body">
              <h3>
                {l.title}
                <small>{l.sub}</small>
              </h3>
              <ul className="rules">
                {l.rules.map(([id, name]) => (
                  <li key={id}>
                    <code>{id}</code>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="catch">
              <span>Typical catch</span>
              <code data-lenis-prevent>{l.code}</code>
              <span>{l.why}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="lenses__prog">
        <i ref={prog} />
      </div>
    </section>
  );
};
