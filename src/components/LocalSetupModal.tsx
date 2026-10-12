"use client";

import React, { useEffect, useRef, useState } from "react";
import { lockScroll } from "@/lib/motion";

interface LocalSetupModalProps {
  onClose: () => void;
  open?: boolean;
}

const STEPS: { title: string; cmds: string[] }[] = [
  {
    title: "Start the audit engine",
    cmds: ["cd CodeRAG-Vector\\backend", ".\\venv\\Scripts\\Activate", "python -m uvicorn main:app --reload --port 8000"],
  },
  {
    title: "Start the dashboard in a second terminal",
    cmds: ["cd CodeRAG-Vector\\frontend", "npm run dev"],
  },
  {
    title: "Open the app",
    cmds: ["http://localhost:3000"],
  },
];

const Cmd: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="cmd">
      <code data-lenis-prevent>{text}</code>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(text).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};

/** Slide-in drawer with the local setup steps. Scrolls on its own; the page behind stays put. */
export const LocalSetupModal: React.FC<LocalSetupModalProps> = ({ onClose, open = true }) => {
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    lockScroll("setup", open);
    if (!open) return;
    const t = setTimeout(() => closeBtn.current?.focus(), 300);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => () => lockScroll("setup", false), []);

  return (
    <div className={`setup${open ? " open" : ""}`} aria-hidden={!open}>
      <div className="setup__veil" onClick={onClose} />
      <aside className="setup__panel" data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="setupTitle">
        <div className="setup__head">
          <h2 id="setupTitle" className="setup__title">Run it locally</h2>
          <button className="x" ref={closeBtn} onClick={onClose} aria-label="Close" tabIndex={open ? 0 : -1} />
        </div>
        <ol>
          {STEPS.map((s) => (
            <li key={s.title}>
              <div>
                <h3 className="setup__step">{s.title}</h3>
                {s.cmds.map((c) => <Cmd key={c} text={c} />)}
              </div>
            </li>
          ))}
        </ol>
        <p className="tip">
          To audit any folder on your PC, paste its absolute path into the audit field and press Run audit.
        </p>
      </aside>
    </div>
  );
};
