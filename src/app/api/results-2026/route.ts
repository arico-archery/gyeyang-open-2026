import { NextResponse } from "next/server";
import staticResults from "@/lib/data/results-2026.json";

// 2026 GYEYANG OPEN — IANSEO tournament data
// Tournament has ended; cache aggressively (24h + 1 week SWR).
// If ianseo is unreachable or returns empty rows, fall back to the static
// snapshot in src/lib/data/results-2026.json (medalists only; richer fields
// like qualification top-8 will be empty in fallback mode).
const BASE = "https://www.ianseo.net/TourData/2026/28161";

interface Athlete {
  pos: string;
  name: string;
  country: string;
  score?: string;
}

interface TeamResult {
  pos: string;
  team: string;
}

async function fetchHTML(url: string): Promise<string> {
  const res = await fetch(url, { next: { revalidate: 86400 } });
  return res.text();
}

function cleanText(s: string): string {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

function parseQualification(html: string): Athlete[] {
  const results: Athlete[] = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const row = match[1];
    const cells: string[] = [];
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(row)) !== null) {
      cells.push(cleanText(cellMatch[1]));
    }
    if (cells.length >= 6 && /^\d+$/.test(cells[0])) {
      results.push({
        pos: cells[0],
        name: cells[1],
        country: cells[2],
        score: cells[5],
      });
      if (results.length >= 8) break;
    }
  }
  return results;
}

function parseFinalRanking(html: string): Athlete[] {
  const results: Athlete[] = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const row = match[1];
    const cells: string[] = [];
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(row)) !== null) {
      cells.push(cleanText(cellMatch[1]));
    }
    if (cells.length >= 3 && /^\d+$/.test(cells[0])) {
      const country = cells[3] || cells[2];
      results.push({
        pos: cells[0],
        name: cells[1],
        country: country,
      });
      if (results.length >= 8) break;
    }
  }
  return results;
}

function parseTeamRanking(html: string): TeamResult[] {
  const results: TeamResult[] = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const row = match[1];
    const cells: string[] = [];
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(row)) !== null) {
      cells.push(cleanText(cellMatch[1]));
    }
    if (cells.length >= 2 && /^\d+$/.test(cells[0])) {
      results.push({
        pos: cells[0],
        team: cells[1],
      });
      if (results.length >= 4) break;
    }
  }
  return results;
}

/** Convert static snapshot medalists into the same shape ianseo parsing yields. */
function buildFallback() {
  const events = (staticResults as { events: Array<{ code: string; isTeam: boolean; medalists: Array<{ position: number; name: string; clubCode?: string; clubFull?: string; country?: string }> }> }).events;
  const findEvent = (code: string) => events.find((e) => e.code === code);
  const toAthletes = (code: string): Athlete[] => {
    const ev = findEvent(code);
    if (!ev) return [];
    return ev.medalists.map((m) => ({
      pos: String(m.position),
      name: m.name,
      country: m.clubCode
        ? `${m.clubCode} - ${m.clubFull ?? ""}`.trim()
        : m.country ?? "",
    }));
  };
  const toTeams = (code: string): TeamResult[] => {
    const ev = findEvent(code);
    if (!ev) return [];
    return ev.medalists.map((m) => ({
      pos: String(m.position),
      team: m.country ?? m.name,
    }));
  };
  return {
    timestamp: (staticResults as { fetchedAt: string }).fetchedAt,
    finalRanking: {
      men: toAthletes("IFRM"),
      women: toAthletes("IFRW"),
      teamMen: toTeams("TFRM"),
      teamWomen: toTeams("TFRW"),
    },
    qualification: {
      // Snapshot only contains medalists; qualification rankings stay empty.
      // /archive/2026 still renders the medalists section from the static
      // import directly, so this is acceptable.
      men: [],
      women: [],
      foreignMen: toAthletes("IFFRM"),
      foreignWomen: toAthletes("IFFRW"),
    },
    source: "static-fallback",
  };
}

export async function GET() {
  try {
    const [
      qualMenHtml, qualWomenHtml, qualForeignMenHtml, qualForeignWomenHtml,
      finalMenHtml, finalWomenHtml, finalTeamMenHtml, finalTeamWomenHtml,
    ] = await Promise.all([
      fetchHTML(`${BASE}/IQRM.php`),
      fetchHTML(`${BASE}/IQRW.php`),
      fetchHTML(`${BASE}/IQFRM.php`),
      fetchHTML(`${BASE}/IQFRW.php`),
      fetchHTML(`${BASE}/IFRM.php`),
      fetchHTML(`${BASE}/IFRW.php`),
      fetchHTML(`${BASE}/TFRM.php`),
      fetchHTML(`${BASE}/TFRW.php`),
    ]);

    const data = {
      timestamp: new Date().toISOString(),
      finalRanking: {
        men: parseFinalRanking(finalMenHtml),
        women: parseFinalRanking(finalWomenHtml),
        teamMen: parseTeamRanking(finalTeamMenHtml),
        teamWomen: parseTeamRanking(finalTeamWomenHtml),
      },
      qualification: {
        men: parseQualification(qualMenHtml),
        women: parseQualification(qualWomenHtml),
        foreignMen: parseQualification(qualForeignMenHtml),
        foreignWomen: parseQualification(qualForeignWomenHtml),
      },
      source: "ianseo" as const,
    };

    // If every section came back empty, fall back to static snapshot.
    const totalRows =
      data.finalRanking.men.length +
      data.finalRanking.women.length +
      data.qualification.men.length +
      data.qualification.women.length;
    if (totalRows === 0) {
      return NextResponse.json(buildFallback(), {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch (error) {
    // ianseo is down or threw — serve the static medalists snapshot.
    console.error("[api/results-2026] ianseo error, using fallback:", error);
    return NextResponse.json(buildFallback(), {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }
}
