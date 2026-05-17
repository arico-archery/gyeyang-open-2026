"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";

const BASE = "https://www.ianseo.net/TourData/2026/28161";

/* -- PDF viewer types -- */
interface Section { labelKey: string; url: string; }
interface Category { id: string; labelKey: string; sections: Section[]; }

const CATEGORIES: Category[] = [
  {
    id: "men", labelKey: "scoreboard.recurveMen",
    sections: [
      { labelKey: "scoreboard.indQual", url: `${BASE}/IQRM.pdf` },
      { labelKey: "scoreboard.indBrackets", url: `${BASE}/IBRM.pdf` },
      { labelKey: "scoreboard.indRankings", url: `${BASE}/IFRM.pdf` },
      { labelKey: "scoreboard.teamQual", url: `${BASE}/TQRM.pdf` },
      { labelKey: "scoreboard.teamBrackets", url: `${BASE}/TBRM.pdf` },
      { labelKey: "scoreboard.teamRankings", url: `${BASE}/TFRM.pdf` },
    ],
  },
  {
    id: "women", labelKey: "scoreboard.recurveWomen",
    sections: [
      { labelKey: "scoreboard.indQual", url: `${BASE}/IQRW.pdf` },
      { labelKey: "scoreboard.indBrackets", url: `${BASE}/IBRW.pdf` },
      { labelKey: "scoreboard.indRankings", url: `${BASE}/IFRW.pdf` },
      { labelKey: "scoreboard.teamQual", url: `${BASE}/TQRW.pdf` },
      { labelKey: "scoreboard.teamBrackets", url: `${BASE}/TBRW.pdf` },
      { labelKey: "scoreboard.teamRankings", url: `${BASE}/TFRW.pdf` },
    ],
  },
  {
    id: "foreignMen", labelKey: "scoreboard.foreignMen",
    sections: [
      { labelKey: "scoreboard.indQual", url: `${BASE}/IQFRM.pdf` },
      { labelKey: "scoreboard.indBrackets", url: `${BASE}/IBFRM.pdf` },
      { labelKey: "scoreboard.indRankings", url: `${BASE}/IFFRM.pdf` },
    ],
  },
  {
    id: "foreignWomen", labelKey: "scoreboard.foreignWomen",
    sections: [
      { labelKey: "scoreboard.indQual", url: `${BASE}/IQFRW.pdf` },
      { labelKey: "scoreboard.indBrackets", url: `${BASE}/IBFRW.pdf` },
      { labelKey: "scoreboard.indRankings", url: `${BASE}/IFFRW.pdf` },
    ],
  },
  {
    id: "participants", labelKey: "scoreboard.participants",
    sections: [
      { labelKey: "scoreboard.byTarget", url: `${BASE}/ENS.pdf` },
      { labelKey: "scoreboard.byCountry", url: `${BASE}/ENC.pdf` },
      { labelKey: "scoreboard.byName", url: `${BASE}/ENA.pdf` },
      { labelKey: "scoreboard.byEvent", url: `${BASE}/ENE.pdf` },
    ],
  },
  {
    id: "statistics", labelKey: "scoreboard.statistics",
    sections: [
      { labelKey: "scoreboard.resultBook", url: `${BASE}/BOOK.pdf` },
      { labelKey: "scoreboard.medalList", url: `${BASE}/MEDLST.pdf` },
      { labelKey: "scoreboard.medalStandings", url: `${BASE}/MEDSTD.pdf` },
      { labelKey: "scoreboard.byCountry", url: `${BASE}/STC.pdf` },
      { labelKey: "scoreboard.byEvent", url: `${BASE}/STE.pdf` },
    ],
  },
];

/* -- Result summary types -- */
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
interface ResultsData {
  timestamp: string;
  finalRanking: {
    men: Athlete[];
    women: Athlete[];
    teamMen: TeamResult[];
    teamWomen: TeamResult[];
  };
  qualification: {
    men: Athlete[];
    women: Athlete[];
    foreignMen: Athlete[];
    foreignWomen: Athlete[];
  };
}

/* -- Medal badge -- */
function Medal({ pos }: { pos: string }) {
  if (pos === "1") return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-white text-xs font-bold shadow-sm">1</span>;
  if (pos === "2") return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 text-white text-xs font-bold shadow-sm">2</span>;
  if (pos === "3") return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold shadow-sm">3</span>;
  return <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-400">{pos}</span>;
}

/* -- Country short name -- */
function shortCountry(c: string) {
  if (!c) return "";
  const dash = c.indexOf(" - ");
  return dash > 0 ? c.substring(dash + 3) : c;
}

/* -- Result Summary Component -- */
function ResultsSummary({ data, t }: { data: ResultsData; t: (k: string) => string }) {
  const [tab, setTab] = useState<"final" | "qual">("final");

  return (
    <div className="mb-8">
      {/* Tab switch */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("final")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === "final" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {t("scoreboard.finalResults")}
        </button>
        <button
          onClick={() => setTab("qual")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === "qual" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {t("scoreboard.qualResults")}
        </button>
      </div>

      {tab === "final" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Individual Men */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-blue-600 px-4 py-2.5 text-white font-semibold text-sm">{t("scoreboard.recurveMen")}</div>
            <div className="divide-y divide-gray-100">
              {data.finalRanking.men.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <Medal pos={a.pos} />
                  <span className="font-medium text-sm text-gray-900 flex-1">{a.name}</span>
                  <span className="text-xs text-gray-500 truncate max-w-[140px]">{shortCountry(a.country)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Women */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-pink-600 px-4 py-2.5 text-white font-semibold text-sm">{t("scoreboard.recurveWomen")}</div>
            <div className="divide-y divide-gray-100">
              {data.finalRanking.women.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <Medal pos={a.pos} />
                  <span className="font-medium text-sm text-gray-900 flex-1">{a.name}</span>
                  <span className="text-xs text-gray-500 truncate max-w-[140px]">{shortCountry(a.country)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Men */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-blue-800 px-4 py-2.5 text-white font-semibold text-sm">{t("scoreboard.teamMen")}</div>
            <div className="divide-y divide-gray-100">
              {data.finalRanking.teamMen.map((tm, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <Medal pos={tm.pos} />
                  <span className="font-medium text-sm text-gray-900 flex-1">{shortCountry(tm.team)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Women */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-pink-800 px-4 py-2.5 text-white font-semibold text-sm">{t("scoreboard.teamWomen")}</div>
            <div className="divide-y divide-gray-100">
              {data.finalRanking.teamWomen.map((tm, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <Medal pos={tm.pos} />
                  <span className="font-medium text-sm text-gray-900 flex-1">{shortCountry(tm.team)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Qual Men */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-blue-600 px-4 py-2.5 text-white font-semibold text-sm">{t("scoreboard.recurveMen")} - 72 Arrows</div>
            <div className="divide-y divide-gray-100">
              {data.qualification.men.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="w-6 text-center text-xs font-medium text-gray-400">{a.pos}</span>
                  <span className="font-medium text-sm text-gray-900 flex-1">{a.name}</span>
                  <span className="text-xs text-gray-500 truncate max-w-[120px]">{shortCountry(a.country)}</span>
                  <span className="font-mono font-bold text-sm text-blue-600 w-10 text-right">{a.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Qual Women */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-pink-600 px-4 py-2.5 text-white font-semibold text-sm">{t("scoreboard.recurveWomen")} - 72 Arrows</div>
            <div className="divide-y divide-gray-100">
              {data.qualification.women.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="w-6 text-center text-xs font-medium text-gray-400">{a.pos}</span>
                  <span className="font-medium text-sm text-gray-900 flex-1">{a.name}</span>
                  <span className="text-xs text-gray-500 truncate max-w-[120px]">{shortCountry(a.country)}</span>
                  <span className="font-mono font-bold text-sm text-pink-600 w-10 text-right">{a.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Foreign Men */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-green-600 px-4 py-2.5 text-white font-semibold text-sm">{t("scoreboard.foreignMen")} - 72 Arrows</div>
            <div className="divide-y divide-gray-100">
              {data.qualification.foreignMen.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="w-6 text-center text-xs font-medium text-gray-400">{a.pos}</span>
                  <span className="font-medium text-sm text-gray-900 flex-1">{a.name}</span>
                  <span className="text-xs text-gray-500 truncate max-w-[120px]">{shortCountry(a.country)}</span>
                  <span className="font-mono font-bold text-sm text-green-600 w-10 text-right">{a.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Foreign Women */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-purple-600 px-4 py-2.5 text-white font-semibold text-sm">{t("scoreboard.foreignWomen")} - 72 Arrows</div>
            <div className="divide-y divide-gray-100">
              {data.qualification.foreignWomen.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="w-6 text-center text-xs font-medium text-gray-400">{a.pos}</span>
                  <span className="font-medium text-sm text-gray-900 flex-1">{a.name}</span>
                  <span className="text-xs text-gray-500 truncate max-w-[120px]">{shortCountry(a.country)}</span>
                  <span className="font-mono font-bold text-sm text-purple-600 w-10 text-right">{a.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Updated timestamp */}
      <p className="text-xs text-gray-400 mt-3 text-right">
        {t("scoreboard.dataUpdated")}: {new Date(data.timestamp).toLocaleString()}
      </p>
    </div>
  );
}

/* -- Main Scoreboard Page -- */
export default function ScoreboardPage() {
  const { t } = useI18n();
  const [catIdx, setCatIdx] = useState(0);
  const [secIdx, setSecIdx] = useState(0);
  const [results, setResults] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/results")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setResults(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeCat = CATEGORIES[catIdx];
  const activeSec = activeCat.sections[secIdx] || activeCat.sections[0];

  const handleCatChange = (i: number) => {
    setCatIdx(i);
    setSecIdx(0);
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t("scoreboard.title")}</h1>

        {/* -- Results Summary -- */}
        {loading ? (
          <div className="mb-8 flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
          </div>
        ) : results ? (
          <ResultsSummary data={results} t={t} />
        ) : null}

        {/* -- Live Results Link -- */}
        <div className="mb-6 text-center">
          <a
            href="https://www.ianseo.net/Details.php?toId=28161"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {t("scoreboard.allScore")}
          </a>
        </div>

        {/* -- PDF Viewer Section -- */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t("scoreboard.detailedResults")}</h2>

        <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-4">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => handleCatChange(i)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                catIdx === i
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 mb-6">
          {activeCat.sections.map((sec, i) => (
            <button
              key={sec.labelKey + sec.url}
              onClick={() => setSecIdx(i)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                secIdx === i
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t(sec.labelKey)}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden" style={{ minHeight: "min(700px, 70vh)" }}>
          <object
            data={activeSec.url}
            type="application/pdf"
            className="w-full"
            style={{ height: "min(700px, 70vh)" }}
          >
            <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm mb-4">{t("scoreboard.pdfFallback")}</p>
              <a
                href={activeSec.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {t("scoreboard.downloadPdf")}
              </a>
            </div>
          </object>
        </div>
      </div>
    </div>
  );
}
