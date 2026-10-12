/**
 * Fetches a Google Font as TTF for next/og (Satori cannot read woff2).
 * Returns null on any failure so image routes still render with the default face.
 */
export async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!src) return null;
    const res = await fetch(src[1]);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}
