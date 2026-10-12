import OpengraphImage from "./opengraph-image";

// edge runtime: the Node build of next/og cannot resolve its font path on Windows
export const runtime = "edge";

export const alt = "CodeRAG Vector: code review, by the rulebook";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OpengraphImage;
