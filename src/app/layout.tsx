import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoGuard AI - Enterprise Security & Health Dashboard",
  description: "Automated RAG-Powered Codebase Security & CS Auditor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="bg-[#080c14] text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
