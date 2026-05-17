import { NextResponse } from "next/server";

const BASE = "https://www.ianseo.net/TourData/2025/22813";

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
  const res = await fetch(url, { next: { revalidate: 86400 } }); // cache 24h (archived)
  return res.text();
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
      cells.push(cellMatch[1].replace(/<[^>]*>/g, "").trim());
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
      cells.push(cellMatch[1].replace(/<[^>]*>/g, "").trim());
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
      cells.push(cellMatch[1].replace(/<[^>]*>/g, "").trim());
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
    };

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch results", detail: String(error) },
      { status: 500 }
    );
  }
}
