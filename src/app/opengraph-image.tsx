import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";
import { loadGoogleFont } from "@/lib/og-font";

// edge runtime: the Node build of next/og cannot resolve its font path on Windows
export const runtime = "edge";

export const alt = `${SITE.name}: code review, by the rulebook`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HEADLINE = "Code review,by therulebook.CodeRAG";
const BODY = "Vector17 rules, 4 domains, freeAI audit for OOP design, SQL safety, concurrency and OWASP security";

export default async function OpengraphImage() {
  const [display, body] = await Promise.all([
    loadGoogleFont("Archivo", 800, HEADLINE),
    loadGoogleFont("Instrument Sans", 500, BODY),
  ]);
  const displayFamily = display ? "ArchivoDisplay" : "sans-serif";
  const bodyFamily = body ? "InstrumentSans" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#E8E9E3",
          color: "#0C0E12",
          padding: "64px 72px",
          fontFamily: bodyFamily,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 26, color: "#5F636B" }}>
          <span style={{ display: "flex", alignItems: "baseline", color: "#0C0E12" }}>
            <span style={{ fontFamily: displayFamily, fontWeight: 800, fontSize: 30 }}>CodeRAG</span>
            <span style={{ color: "#2233FF", marginLeft: 8 }}>Vector</span>
          </span>
          <span>17 rules, 4 domains, free</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: displayFamily, fontSize: 136, fontWeight: 800, lineHeight: 0.9, letterSpacing: -6 }}>
          <span>Code review,</span>
          <span style={{ paddingLeft: 120 }}>by the</span>
          <span style={{ color: "#2233FF", borderBottom: "8px solid #2233FF", alignSelf: "flex-start", paddingBottom: 8 }}>rulebook.</span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#5F636B" }}>
          AI audit for OOP design, SQL safety, concurrency and OWASP security
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        ...(display ? [{ name: "ArchivoDisplay", data: display, weight: 800 as const, style: "normal" as const }] : []),
        ...(body ? [{ name: "InstrumentSans", data: body, weight: 500 as const, style: "normal" as const }] : []),
      ],
    }
  );
}
