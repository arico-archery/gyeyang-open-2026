"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";

/* ── Result types ── */
interface Athlete { pos: string; name: string; country: string; score?: string; }
interface TeamResult { pos: string; team: string; }
interface ResultsData {
  timestamp: string;
  finalRanking: { men: Athlete[]; women: Athlete[]; teamMen: TeamResult[]; teamWomen: TeamResult[]; };
  qualification: { men: Athlete[]; women: Athlete[]; foreignMen: Athlete[]; foreignWomen: Athlete[]; };
}

function Medal({ pos }: { pos: string }) {
  if (pos === "1") return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-white text-xs font-bold shadow-sm">1</span>;
  if (pos === "2") return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 text-white text-xs font-bold shadow-sm">2</span>;
  if (pos === "3") return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold shadow-sm">3</span>;
  return <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-400">{pos}</span>;
}

function shortCountry(c: string) {
  if (!c) return "";
  const dash = c.indexOf(" - ");
  return dash > 0 ? c.substring(dash + 3) : c;
}

function ResultsSummary2026({ data, t }: { data: ResultsData; t: (k: string) => string }) {
  const [tab, setTab] = useState<"final" | "qual">("final");

  return (
    <div className="mb-8">
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
              {data.finalRanking.men.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-gray-400">No data</div>
              )}
            </div>
          </div>
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
              {data.finalRanking.women.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-gray-400">No data</div>
              )}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-blue-800 px-4 py-2.5 text-white font-semibold text-sm">{t("scoreboard.teamMen")}</div>
            <div className="divide-y divide-gray-100">
              {data.finalRanking.teamMen.map((tm, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <Medal pos={tm.pos} />
                  <span className="font-medium text-sm text-gray-900 flex-1">{shortCountry(tm.team)}</span>
                </div>
              ))}
              {data.finalRanking.teamMen.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-gray-400">No data</div>
              )}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-pink-800 px-4 py-2.5 text-white font-semibold text-sm">{t("scoreboard.teamWomen")}</div>
            <div className="divide-y divide-gray-100">
              {data.finalRanking.teamWomen.map((tm, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <Medal pos={tm.pos} />
                  <span className="font-medium text-sm text-gray-900 flex-1">{shortCountry(tm.team)}</span>
                </div>
              ))}
              {data.finalRanking.teamWomen.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-gray-400">No data</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
}

export default function Archive2026Page() {
  const { t } = useI18n();
  const [results, setResults] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/results-2026")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setResults(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Page Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            2026
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {t("archive2026.pageTitle")}
          </h1>
          <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            {t("archive2026.pageSubtitle")}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 font-medium px-4 py-2 rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("archive2026.backToMain")}
          </Link>
        </header>

        {/* Poster */}
        <section className="mb-16">
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6 inline-block">
              <Image
                src="/images/poster_2026.jpg"
                alt="2026 GYEYANG OPEN Poster"
                width={400}
                height={566}
                className="rounded-xl w-64 sm:w-80 md:w-[400px] h-auto"
              />
            </div>
          </div>
        </section>

        {/* Schedule Summary */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t("archive2026.scheduleTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((day) => (
              <div
                key={day}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                    D{day}
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {t(`archive2026.day${day}Date`)}
                  </span>
                </div>
                <div className="text-gray-800 font-medium leading-snug">
                  {t(`archive2026.day${day}Title`)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Venues */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t("archive2026.venuesTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-100 px-4 py-3.5 text-gray-700 font-medium text-sm">
              {t("archive2026.venueQual")}
            </div>
            <div className="bg-white rounded-xl border border-gray-100 px-4 py-3.5 text-gray-700 font-medium text-sm">
              {t("archive2026.venueFinal")}
            </div>
          </div>
        </section>

        {/* Scoreboard / Results */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t("archive2026.scoreboardTitle")}
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
            </div>
          ) : results ? (
            <ResultsSummary2026 data={results} t={t} />
          ) : (
            <p className="text-center text-sm text-gray-400 py-8">
              {t("archive2026.scoreboardDesc")}
            </p>
          )}

          <div className="text-center">
            <a
              href={t("archive2026.ianseoUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {t("archive2026.scoreboardLink")}
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm pt-10 border-t border-gray-200">
          <p>{t("archive2026.footer")}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1 mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("archive2026.backToMain")}
          </Link>
        </footer>
      </div>
    </div>
  );
}
