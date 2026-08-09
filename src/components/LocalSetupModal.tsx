"use client";

import React from "react";
import { Laptop, Server, X } from "lucide-react";

interface LocalSetupModalProps {
  onClose: () => void;
}

export const LocalSetupModal: React.FC<LocalSetupModalProps> = ({ onClose }) => {
  return (
    <div className="bg-[#131924] border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
        <div className="flex items-center gap-2.5 text-slate-50 font-bold text-base">
          <Laptop className="w-5 h-5 text-emerald-400" />
          <span>Local Machine Setup & Execution Procedure</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white bg-[#1c2433] hover:bg-[#253044] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Backend Setup */}
        <div className="space-y-2.5 bg-[#0b0f17] p-4 rounded-xl border border-[#1e2638]">
          <div className="font-bold text-emerald-400 flex items-center gap-2 text-xs">
            <Server className="w-4 h-4" /> Step 1: Launch Backend (FastAPI Audit Engine)
          </div>
          <ol className="list-decimal list-inside space-y-2 text-slate-300 font-mono text-[11px] leading-relaxed">
            <li>Open Terminal in project directory</li>
            <li>
              <code className="text-emerald-300 bg-[#131924] px-1.5 py-0.5 rounded border border-[#1e2638]">
                cd RepoGuard-AI\backend
              </code>
            </li>
            <li>
              Activate Virtual Environment:
              <br />
              <code className="text-emerald-300 bg-[#131924] px-1.5 py-0.5 rounded border border-[#1e2638] mt-1 inline-block">
                .\venv\Scripts\Activate
              </code>
            </li>
            <li>
              Start FastAPI Server:
              <br />
              <code className="text-emerald-300 bg-[#131924] px-1.5 py-0.5 rounded border border-[#1e2638] mt-1 inline-block">
                python -m uvicorn main:app --reload --port 8000
              </code>
            </li>
          </ol>
        </div>

        {/* Frontend Setup */}
        <div className="space-y-2.5 bg-[#0b0f17] p-4 rounded-xl border border-[#1e2638]">
          <div className="font-bold text-emerald-400 flex items-center gap-2 text-xs">
            <Laptop className="w-4 h-4" /> Step 2: Launch Frontend (Dashboard UI)
          </div>
          <ol className="list-decimal list-inside space-y-2 text-slate-300 font-mono text-[11px] leading-relaxed">
            <li>Open a second Terminal window</li>
            <li>
              <code className="text-emerald-300 bg-[#131924] px-1.5 py-0.5 rounded border border-[#1e2638]">
                cd RepoGuard-AI\frontend
              </code>
            </li>
            <li>
              Run Next.js Dev Server:
              <br />
              <code className="text-emerald-300 bg-[#131924] px-1.5 py-0.5 rounded border border-[#1e2638] mt-1 inline-block">
                npm run dev
              </code>
            </li>
            <li>
              Open browser:
              <br />
              <code className="text-cyan-300 bg-[#131924] px-1.5 py-0.5 rounded border border-[#1e2638] mt-1 inline-block">
                http://localhost:3000
              </code>
            </li>
          </ol>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2 font-medium">
        <span>💡 To audit any local folder on your PC, paste its absolute folder path into the input box below and click &quot;Run Deep RAG Audit&quot;.</span>
      </div>
    </div>
  );
};
