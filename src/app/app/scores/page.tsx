"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useInlineT } from "@/lib/i18n/inline";

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

type Tab = "qualification" | "finals" | "foreign";
type Gender = "men" | "women";

function Medal({ pos }: { pos: string }) {
  if (pos === "1") return <span className="text-lg">🥇</span>;
  if (pos === "2") return <span className="text-lg">🥈</span>;
  if (pos === "3") return <span className="text-lg">🥉</span>;
  return <span className="w-6 text-center text-sm font-medium text-gray-400">{pos}</span>;
}

export default function ScoresPage() {
  const { locale } = useI18n();
  const router = useRouter();
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("qualification");
  const [gender, setGender] = useState<Gender>("men");

  const t = useInlineT();

  useEffect(() => {
    fetch("/api/results")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t("실시간 점수", "Live Scores", "实时成绩")}</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const qualAthletes = data
    ? gender === "men" ? data.qualification.men : data.qualification.women
    : [];
  const finalAthletes = data
    ? gender === "men" ? data.finalRanking.men : data.finalRanking.women
    : [];
  const teams = data
    ? gender === "men" ? data.finalRanking.teamMen : data.finalRanking.teamWomen
    : [];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t("실시간 점수", "Live Scores", "实时成绩")}</h1>
      </div>

      {/* ianseo live link */}
      <a
        href="https://www.ianseo.net/TourData/2026/28161/index.php"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors"
      >
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-gray-700">{t("ianseo 라이브 결과 보기", "View Live Results on ianseo", "在 ianseo 查看实时成绩")}</span>
      </a>

      {/* Tab: Qualification / Finals / Foreign */}
      <div className="flex gap-2 mb-4">
        {(["qualification", "finals", "foreign"] as Tab[]).map((v) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              tab === v ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {v === "qualification" ? t("예선", "Qual.", "预赛") : v === "finals" ? t("본선", "Finals", "决赛") : t("외국인부", "Foreign", "外国组")}
          </button>
        ))}
      </div>

      {/* Gender Toggle */}
      <div className="flex gap-2 mb-6">
        {(["men", "women"] as Gender[]).map((g) => (
          <button
            key={g}
            onClick={() => setGender(g)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              gender === g ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {g === "men" ? t("남자부", "Men", "男子组") : t("여자부", "Women", "女子组")}
          </button>
        ))}
      </div>

      {/* Results Table */}
      {tab === "qualification" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-700">{t("예선 순위", "Qualification Ranking", "预赛排名")}</h2>
          </div>
          {qualAthletes.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {qualAthletes.map((a, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <Medal pos={a.pos} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.country}</p>
                  </div>
                  {a.score && (
                    <span className="text-sm font-bold text-blue-600">{a.score}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-gray-400">
              {t("데이터가 없습니다", "No data available", "暂无数据")}
            </div>
          )}
        </div>
      )}

      {tab === "finals" && (
        <div className="space-y-4">
          {/* Individual */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-700">{t("개인전", "Individual", "个人赛")}</h2>
            </div>
            {finalAthletes.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {finalAthletes.map((a, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-3">
                    <Medal pos={a.pos} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{a.name}</p>
                      <p className="text-xs text-gray-400">{a.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-gray-400">
                {t("데이터가 없습니다", "No data available", "暂无数据")}
              </div>
            )}
          </div>

          {/* Team */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-700">{t("단체전", "Team", "团体赛")}</h2>
            </div>
            {teams.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {teams.map((te, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-3">
                    <Medal pos={te.pos} />
                    <p className="text-sm font-medium text-gray-900">{te.team}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-gray-400">
                {t("데이터가 없습니다", "No data available", "暂无数据")}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "foreign" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-700">{t("외국인부 순위", "Foreign Division Ranking", "外国组排名")}</h2>
          </div>
          {(gender === "men" ? data?.qualification.foreignMen : data?.qualification.foreignWomen)?.length ? (
            <div className="divide-y divide-gray-50">
              {(gender === "men" ? data?.qualification.foreignMen : data?.qualification.foreignWomen)?.map((a, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <Medal pos={a.pos} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.country}</p>
                  </div>
                  {a.score && (
                    <span className="text-sm font-bold text-blue-600">{a.score}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-gray-400">
              {t("데이터가 없습니다", "No data available", "暂无数据")}
            </div>
          )}
        </div>
      )}

      {data?.timestamp && (
        <p className="text-center text-xs text-gray-400 mt-4">
          {t("마지막 업데이트", "Last updated", "最后更新")}: {new Date(data.timestamp).toLocaleString(locale === "ko" ? "ko-KR" : locale === "zh" ? "zh-CN" : "en-US")}
        </p>
      )}
    </div>
  );
}
