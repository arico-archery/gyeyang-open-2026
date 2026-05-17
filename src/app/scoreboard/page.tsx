"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/context";

const BASE = "https://www.ianseo.net/TourData/2026/28161";

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

export default function ScoreboardPage() {
  const { t } = useI18n();
  const [catIdx, setCatIdx] = useState(0);
  const [secIdx, setSecIdx] = useState(0);

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

        <div className="mt-6 text-center">
          <a
            href="https://info.ianseo.net/26IGYO/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {t("scoreboard.allScore")}
          </a>
        </div>
      </div>
    </div>
  );
}
