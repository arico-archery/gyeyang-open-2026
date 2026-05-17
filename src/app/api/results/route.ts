import { NextResponse } from "next/server";

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
  const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
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
  // Match table rows: <tr>...<td>pos</td><td>name</td><td>country</td><td>70m-1</td><td>70m-2</td><td>total</td>...
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
      // Final ranking: [pos, name, code, "CODE - Full Name", ""]
      // or [pos, name, "CODE - Full Name"] depending on structure
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
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch results", detail: String(error) },
      { status: 500 }
    );
  }
}
