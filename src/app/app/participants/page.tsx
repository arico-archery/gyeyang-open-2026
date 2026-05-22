"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useInlineT } from "@/lib/i18n/inline";

interface Participant {
  target: string;
  bib: string;
  name: string;
  affiliation: string;
  event: string;
}

interface ApiResponse {
  total: number;
  countByEvent: Record<string, number>;
  countByCountry: Record<string, number>;
  participants: Participant[];
  fetchedAt?: string;
  error?: string;
}

function shortAffiliation(s: string) {
  // "KAFAC - KOREA ARMED FORCES ATHLETIC CO" → "KAFAC"
  const dash = s.indexOf(" - ");
  return dash > 0 ? s.slice(0, dash) : s;
}

function fullAffiliation(s: string) {
  const dash = s.indexOf(" - ");
  return dash > 0 ? s.slice(dash + 3) : "";
}

export default function ParticipantsPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");

  const t = useInlineT();

  useEffect(() => {
    fetch("/api/participants")
      .then((r) => r.json())
      .then((d: ApiResponse) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const events = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.countByEvent).sort((a, b) => b[1] - a[1]);
  }, [data]);

  const countries = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.countByCountry).sort((a, b) => b[1] - a[1]);
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.participants.filter((p) => {
      if (eventFilter !== "all" && p.event !== eventFilter) return false;
      if (countryFilter !== "all" && shortAffiliation(p.affiliation) !== countryFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.affiliation.toLowerCase().includes(q) ||
        p.target.toLowerCase().includes(q) ||
        (p.bib || "").toLowerCase().includes(q)
      );
    });
  }, [data, query, eventFilter, countryFilter]);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link href="/app" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg" aria-label="Back">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t("참가자 명단", "Participants", "参赛选手名单")}</h1>
          <p className="text-xs text-gray-500">{t("2026 GYEYANG OPEN · ianseo 기준", "2026 GYEYANG OPEN · from ianseo", "2026 GYEYANG OPEN · 来源 ianseo")}</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-gray-400">{t("명단을 불러오는 중...", "Loading participants...", "正在加载名单...")}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {t("명단을 불러올 수 없습니다", "Could not load participants", "无法加载名单")}: {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-blue-700">{data.total}</p>
              <p className="text-[10px] text-blue-600 font-medium uppercase tracking-wider mt-0.5">{t("선수", "Athletes", "选手")}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-purple-700">{countries.length}</p>
              <p className="text-[10px] text-purple-600 font-medium uppercase tracking-wider mt-0.5">{t("소속", "Clubs", "所属")}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-emerald-700">{events.length}</p>
              <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider mt-0.5">{t("종목", "Events", "项目")}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("이름·소속·BIB·타겟으로 검색", "Search by name, club, BIB, or target", "按姓名 · 所属 · BIB · 靶位搜索")}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Event filter chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-1 scrollbar-hide">
            <button
              onClick={() => setEventFilter("all")}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors ${
                eventFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("전체", "All", "全部")} · {data.total}
            </button>
            {events.map(([ev, count]) => (
              <button
                key={ev}
                onClick={() => setEventFilter(ev === eventFilter ? "all" : ev)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors ${
                  eventFilter === ev
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {ev} · {count}
              </button>
            ))}
          </div>

          {/* Country filter (top 12) */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            <button
              onClick={() => setCountryFilter("all")}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors ${
                countryFilter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("전체 소속", "All clubs", "全部所属")}
            </button>
            {countries.slice(0, 30).map(([code, count]) => (
              <button
                key={code}
                onClick={() => setCountryFilter(code === countryFilter ? "all" : code)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors ${
                  countryFilter === code
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {code} · {count}
              </button>
            ))}
          </div>

          {/* Result count */}
          <p className="text-[12px] text-gray-500 mb-2">
            {filtered.length === data.total
              ? t(`전체 ${data.total}명`, `${data.total} total`, `共 ${data.total} 名`)
              : t(`${filtered.length}명 표시 (전체 ${data.total}명 중)`, `Showing ${filtered.length} of ${data.total}`, `显示 ${filtered.length} / 共 ${data.total} 名`)}
          </p>

          {/* List */}
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
            {filtered.map((p, i) => (
              <div key={`${p.target}-${p.name}-${i}`} className="flex items-start gap-3 px-4 py-3">
                <div className="w-12 shrink-0 text-center">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-700 font-bold text-sm">
                    {p.target}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                    {p.bib && (
                      <span className="shrink-0 px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded font-mono tracking-tight">
                        #{p.bib}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-500 truncate" title={fullAffiliation(p.affiliation)}>
                    <span className="font-semibold text-purple-600 mr-1">{shortAffiliation(p.affiliation)}</span>
                    <span className="text-gray-400">·</span>{" "}
                    {p.event}
                  </p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-10">
                {t("검색 결과가 없습니다", "No matching participants", "未找到匹配的参赛者")}
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-[11px] text-gray-400">
            {t("출처: ianseo", "Source: ianseo", "来源: ianseo")} ·{" "}
            <a
              href="https://www.ianseo.net/Details.php?toId=28161"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-600"
            >
              {t("원본 보기", "View original", "查看原始数据")}
            </a>
          </p>
        </>
      )}
    </div>
  );
}
