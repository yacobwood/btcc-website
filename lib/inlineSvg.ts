import { readFile } from "fs/promises";
import path from "path";

// Server-only (Node `fs`) - only ever called from a Server Component.
// Every other page renders these circuit maps via CircuitMap.tsx's plain
// <img src>, which is the right choice there (no optimization benefit,
// simplest option). The one exception is the homepage's stroke-dashoffset
// "draw the circuit" animation, which needs the raw <path> in the DOM -
// CSS can't reach inside an external <img>'s document to animate it.
export async function readInlineCircuitSvg(slug: string): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), "public", "circuits", `${slug}.svg`);
    const raw = await readFile(filePath, "utf-8");
    // Strip the XML declaration/DOCTYPE - invalid/unnecessary once inlined
    // directly into an HTML document.
    return raw.replace(/^<\?xml[^>]*\?>\s*/, "").replace(/<!DOCTYPE[^>]*>\s*/, "");
  } catch {
    return null;
  }
}
