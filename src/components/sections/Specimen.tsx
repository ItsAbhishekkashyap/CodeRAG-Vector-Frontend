"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, useReady } from "@/lib/motion";

type Note = [string, string];
const CODE: [string, Note[]?][] = [
  ["import os"], [""],
  ["class UserAccount:"],
  ["    def __init__(self, user_id, username, password, email):"],
  ["        self.user_id = user_id", [["OOP-001", "Public attributes with no getters or setters."]]],
  ["        self.username = username"],
  ["        self.password = password"],
  ["        self.email = email"],
  ["        self.is_admin = False"], [""],
  ["    def change_password(self, new_pass):"],
  ["        self.password = new_pass", [["OS-001", "Shared state changed without a mutex."]]], [""],
  ["def authenticate_user(username, input_password):"],
  ["    query = f\"SELECT * FROM users WHERE username = '{username}' AND password = '{input_password}'\"", [
    ["NET-002", "User input formatted into SQL. Injection risk."],
    ["DB-004", "SELECT * instead of explicit columns."],
  ]],
  ["    print(f\"Executing query: {query}\")"],
  ["    return query"],
];

const STEPS = [
  { h: "Read the file", p: "The crawler loads the source and splits it into chunks of up to 300 lines, breaking on class and function boundaries." },
  { h: "Pull the matching rules", p: "Each chunk is embedded and ChromaDB returns the rules closest to it. A class with public fields brings back OOP-001." },
  { h: "Flag what breaks them", p: "Gemini checks the code against only those rules and marks each violation with the rule it breaks." },
  { h: "Score it and write the fix", p: "Four domain scores are averaged into one, and you get a remediation plan plus a refactored version of the file." },
];

const DOMAINS: [string, number][] = [["OOP", 70], ["DBMS", 55], ["OS", 70], ["Security", 65]];

/** user_service.py from the sample project, reviewed line by line as you scroll. */
export const Specimen: React.FC = () => {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const ready = useReady();

  useEffect(() => {
    if (!ready || !section.current || !pin.current || !sheet.current) return;
    const pinEl = pin.current, body = sheet.current, root = section.current;
    const lines = Array.from(body.querySelectorAll<HTMLElement>(".ln"));
    const steps = Array.from(root.querySelectorAll<HTMLElement>(".step"));
    const beam = body.querySelector<HTMLElement>(".beam")!;
    const scoreEls = Array.from(root.querySelectorAll<HTMLElement>("[data-score]"));
    const state = root.querySelector<HTMLElement>("[data-violations]")!;
    const showAll = () => {
      lines.forEach((l) => l.classList.add("read", "hit"));
      scoreEls.forEach((s) => (s.textContent = "65"));
      state.textContent = "4 violations";
    };

    if (prefersReducedMotion()) {
      showAll();
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll(".shead .mask > span"), { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root.querySelector(".shead"), start: "top 85%" } });

      const mm = gsap.matchMedia();
      // pinned scan on desktop and on phones tall enough to hold the sheet
      mm.add({ desk: "(min-width: 901px)", phone: "(max-width: 900px) and (min-height: 600px)" }, (c) => {
        const { desk, phone } = (c.conditions || {}) as { desk?: boolean; phone?: boolean };
        if (!desk && !phone) return;
        pinEl.classList.add("js-pin");
        lines.forEach((l) => l.classList.remove("read", "hit"));
        gsap.timeline({
          scrollTrigger: {
            trigger: pinEl,
            start: desk ? "top 90px" : "top 70px",
            end: desk ? "+=1800" : "+=1500",
            pin: true,
            scrub: true,
            anticipatePin: 1,
            refreshPriority: 2,
            onUpdate(self) {
              const p = self.progress;
              const y = Math.min(1, p / 0.82) * (body.offsetHeight - 6);
              beam.style.transform = `translateY(${y}px)`;
              let hits = 0;
              lines.forEach((l) => {
                const read = l.offsetTop <= y;
                l.classList.toggle("read", read);
                if (l.classList.contains("flag")) {
                  const hit = read && p > 0.28;
                  l.classList.toggle("hit", hit);
                  if (hit) hits += l.querySelectorAll(".note").length;
                }
              });
              const idx = p < 0.22 ? 0 : p < 0.48 ? 1 : p < 0.8 ? 2 : 3;
              steps.forEach((s, i) => s.classList.toggle("on", i === idx));
              const sc = String(Math.round(90 - 25 * Math.min(1, Math.max(0, (p - 0.28) / 0.6))));
              scoreEls.forEach((s) => (s.textContent = sc));
              state.textContent = `${hits} ${hits === 1 ? "violation" : "violations"}`;
            },
          },
        });
        return () => {
          pinEl.classList.remove("js-pin");
          showAll();
        };
      });
      // very short screens: everything visible, lines light up as they scroll past
      mm.add("(max-width: 900px) and (max-height: 599px)", () => {
        showAll();
        gsap.from(lines, { opacity: 0.25, stagger: 0.04, duration: 0.6, scrollTrigger: { trigger: body, start: "top 80%", end: "bottom 60%", scrub: true } });
      });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section className="specimen wrap" id="specimen" ref={section} aria-labelledby="specimen-title">
      <div className="shead">
        <h2 id="specimen-title">
          <span className="mask"><span>Watch one file</span></span>
          <span className="mask"><span>get reviewed.</span></span>
        </h2>
        <p>
          <span className="tag">From ./sample_project</span>
          This is <code>user_service.py</code> from the sample project, audited the same way your code will be. Scroll to move the scanner.
        </p>
      </div>

      <div className="specimen__pin" ref={pin}>
        <div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div className={`step${i === 0 ? " on" : ""}`} key={s.h}>
                <span className="n">Step {i + 1} of 4</span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
          <div className="dial">
            <b data-score>65</b>
            <span>/ 100 overall</span>
          </div>
          <div className="dial__doms">
            {DOMAINS.map(([n, v]) => (
              <div key={n}>
                {n} {v}
                <i style={{ ["--v" as string]: v / 100 }} />
              </div>
            ))}
          </div>
        </div>

        <figure className="sheet" style={{ margin: 0 }} aria-label="Annotated audit of sample_project/user_service.py">
          <div className="sheet__bar">
            <b>sample_project/user_service.py</b>
            <span>
              <span className="sheet__score"><span data-score>65</span>/100 · </span>
              <span data-violations>4 violations</span>
            </span>
          </div>
          <div className="sheet__body" ref={sheet}>
            <div className="beam" />
            {CODE.map(([src, notes], i) => (
              <div className={`ln${notes ? " flag" : ""}`} key={i}>
                <span className="no">{i + 1}</span>
                <span className="src">{src || " "}</span>
                <span className="notes">
                  {(notes || []).map(([id, t]) => (
                    <span className="note" key={id}>
                      <b>{id}</b>
                      {t}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </figure>
      </div>
    </section>
  );
};
