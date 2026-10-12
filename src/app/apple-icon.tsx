import { ImageResponse } from "next/og";

// edge runtime: the Node build of next/og cannot resolve its font path on Windows
export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0C0E12",
          color: "#E8E9E3",
          fontSize: 92,
          fontWeight: 800,
          letterSpacing: -6,
        }}
      >
        <span>CR</span>
        <span style={{ width: 110, height: 8, borderRadius: 8, background: "#2233FF", marginTop: 4 }} />
      </div>
    ),
    size
  );
}
