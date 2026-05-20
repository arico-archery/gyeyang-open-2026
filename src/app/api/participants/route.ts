import { NextResponse } from "next/server";

// Source: ianseo participant list (ordered by target) for 2026 Gyeyang Open
const SOURCE = "https://www.ianseo.net/TourData/2026/28161/ENS.php";

export interface Participant {
  target: string;        // e.g. "1A", "12C"
  name: string;          // e.g. "SONG Injun"
  affiliation: string;   // club or country line, e.g. "KAFAC - KOREA ARMED FORCES…"
  event: string;         // e.g. "Recurve Men"
}

function cleanText(s: string): string {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Returns all participants parsed from the ianseo ENS.php table. */
function parseParticipants(html: string): Participant[] {
  const out: Participant[] = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch: RegExpExecArray | null;
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const row = rowMatch[1];
    const cells: string[] = [];
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let cellMatch: RegExpExecArray | null;
    while ((cellMatch = cellRegex.exec(row)) !== null) {
      cells.push(cleanText(cellMatch[1]));
    }
    // Expected: [target, name, affiliation, event] — drop header/empty rows.
    if (cells.length < 4) continue;
    const [target, name, affiliation, event] = cells;
    if (!target || !name) continue;
    // Target format like "1A", "12C" — skip rows that obviously aren't athletes.
    if (!/^\d+[A-D]?$/i.test(target)) continue;
    out.push({ target, name, affiliation, event });
  }
  return out;
}

export async function GET() {
  try {
    const res = await fetch(SOURCE, { next: { revalidate: 3600 } }); // cache 1h
    const html = await res.text();
    const participants = parseParticipants(html);

    // Summary metadata
    const byCountry = new Map<string, number>();
    const byEvent = new Map<string, number>();
    for (const p of participants) {
      // affiliation usually starts with code: "KAFAC - KOREA…" → "KAFAC"
      const code = p.affiliation.split(" - ")[0] || "—";
      byCountry.set(code, (byCountry.get(code) ?? 0) + 1);
      byEvent.set(p.event, (byEvent.get(p.event) ?? 0) + 1);
    }

    return NextResponse.json(
      {
        source: SOURCE,
        fetchedAt: new Date().toISOString(),
        total: participants.length,
        countByEvent: Object.fromEntries(byEvent),
        countByCountry: Object.fromEntries(byCountry),
        participants,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch participants", detail: String(err) },
      { status: 500 }
    );
  }
}
