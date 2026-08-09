# CodeRAG Vector - Frontend Architecture & System Documentation

**CodeRAG Vector** is a high-performance, modular enterprise dashboard built with **Next.js 14**, **React 18**, and **Tailwind CSS**. It serves as the visual DevSecOps command center for the CodeRAG Vector audit engine, rendering real-time codebase health metrics, OWASP security vulnerabilities, Computer Science architecture findings, and refactored code output.

---

## 🎨 Design System & Palette Specifications

The UI utilizes a modern **Midnight Aurora & Cosmic Obsidian** design system:
- **Canvas Background**: Deep Void Sapphire (`#05070E`) with floating animated ambient mesh glow orbs.
- **Surface Panels**: `aurora-glass` backdrop-blur-xl cards (`rgba(14, 19, 34, 0.75)`).
- **Typography**: `Outfit` for bold headings, `Plus Jakarta Sans` for body text, and `JetBrains Mono` for code blocks.
- **Brand Accents**: Gradient clips (`from-cyan-400 via-indigo-500 to-purple-500`) and Cyber Emerald (`#10B981`).

---

## 🧩 Component Architecture & Directory Structure

The frontend is built on a **Modular Component Architecture** (8 decoupled reusable components located in `src/components/`):

```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css          # Midnight Aurora theme, glassmorphism & keyframe animations
│   │   ├── layout.tsx           # Root Next.js layout metadata & font configuration
│   │   └── page.tsx             # Clean orchestrator component assembling all modular UI zones
│   └── components/
│       ├── Header.tsx           # Sticky top navigation bar with brand logo & setup drawer toggle
│       ├── IntroBanner.tsx      # Interactive hero banner with animated glow orbs & feature tabs
│       ├── LocalSetupModal.tsx  # Step-by-step local machine setup & execution procedure drawer
│       ├── ExecutiveMetrics.tsx # 3 Metric cards (Quality Score Index, Audited Files, Flagged Violations)
│       ├── CommandZone.tsx      # Target repository path input bar & GitHub URL scan CTA button
│       ├── FilterBar.tsx        # Search bar and category filter tabs (All, Critical, OOPS, DBMS, Security)
│       ├── AuditCard.tsx        # Expandable file breakdown card with split-pane findings & code diff block
│       └── Footer.tsx           # Multi-column enterprise footer with system specs & compliance tags
├── scripts/
│   └── test_frontend.mjs        # Automated integration test runner (npm test)
├── next.config.mjs              # Next.js 14 configuration settings
└── package.json                 # Project dependencies & npm scripts
```

---

## ⚙️ Modular Component Breakdown

### 1. `Header.tsx`
- **Location**: `src/components/Header.tsx`
- **Function**: Sticky top navigation bar featuring the glowing `CodeRAG Vector` logo badge, quick scroll navigation links, and the local machine setup modal trigger button.

### 2. `IntroBanner.tsx`
- **Location**: `src/components/IntroBanner.tsx`
- **Function**: Interactive introductory hero section with floating background glow orbs (`animate-mesh-1`, `animate-mesh-2`), action CTAs, and interactive tabbed feature cards previewing the 4 audit domains (**OOPS**, **DBMS**, **OS Concurrency**, **OWASP Security**).

### 3. `LocalSetupModal.tsx`
- **Location**: `src/components/LocalSetupModal.tsx`
- **Function**: Step-by-step interactive drawer giving first-time visitors exact terminal commands to launch both Backend (`python -m uvicorn main:app`) and Frontend (`npm run dev`).

### 4. `ExecutiveMetrics.tsx`
- **Location**: `src/components/ExecutiveMetrics.tsx`
- **Function**: Displays 3 high-impact summary cards:
  - **Codebase Quality Index**: Overall score gauge.
  - **Audited Source Files**: Number of scanned `.py, .js, .ts, .tsx, .sql` files.
  - **Flagged Violations**: Counter highlighting critical risks in Terracotta/Rose badge.

### 5. `CommandZone.tsx`
- **Location**: `src/components/CommandZone.tsx`
- **Function**: Input zone allowing users to scan local file paths (e.g. `./sample_project`) OR public GitHub repository URLs (e.g. `https://github.com/expressjs/express`) with a tactile **"RUN DEEP RAG AUDIT"** action button.

### 6. `FilterBar.tsx`
- **Location**: `src/components/FilterBar.tsx`
- **Function**: Search input bar and category filter tabs for instant client-side filtering.

### 7. `AuditCard.tsx`
- **Location**: `src/components/AuditCard.tsx`
- **Function**: Expandable accordion card featuring:
  - **Left Pane**: OOPS Encapsulation & DBMS SQL findings.
  - **Right Pane**: OS Concurrency Deadlock & OWASP Security findings.
  - **Dark Code Block**: `bg-[#03050a]` refactored code output with one-click copy button feedback.

### 8. `Footer.tsx`
- **Location**: `src/components/Footer.tsx`
- **Function**: Multi-column enterprise footer displaying system specs (FastAPI Core, ChromaDB Vector DB, Python 3.11), core audit capabilities, and OWASP Top 10 compliance tags.

---

## 🚀 How to Run & Deploy

### **Local Development**
```bash
# Install dependencies
npm install

# Start Next.js dev server
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### **Production Deployment (Vercel)**
1. Push `frontend/` to GitHub.
2. Import project into **[Vercel](https://vercel.com)**.
3. Configure Environment Variable:
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://coderag-vector-backend.onrender.com
   ```
4. Click **Deploy**.
