"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger, useReady } from "@/lib/motion";

/** Film grain overlay and the cobalt scroll-progress hairline. */
export const Ambient: React.FC = () => {
  const bar = useRef<HTMLDivElement>(null);
  const ready = useReady();

  useEffect(() => {
    if (!ready || !bar.current) return;
    const el = bar.current;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      refreshPriority: -1,
      onUpdate: (s) => (el.style.transform = `scaleX(${s.progress})`),
    });
    return () => st.kill();
  }, [ready]);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="sprog" ref={bar} aria-hidden="true" />
    </>
  );
};
