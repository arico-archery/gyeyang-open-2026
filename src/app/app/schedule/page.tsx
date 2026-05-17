"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { supabase } from "@/lib/supabase/client";
import type { Schedule } from "@/lib/supabase/types";

const STATIC_SCHEDULE = [
  { date: "2026-07-10", title_ko: "공식 연습", title_en: "Official Practice", time: "09:00 ~ 17:00", type: "practice" },
  { date: "2026-07-11", title_ko: "예선 라운드 (70m)", title_en: "Qualification Round (70m)", time: "09:00 ~ 16:00", type: "qualification" },
  { date: "2026-07-11", title_ko: "개회식", title_en: "Opening Ceremony", time: "17:00", type: "ceremony" },
  { date: "2026-07-12", title_ko: "본선 (개인전/단체전)", title_en: "Finals (Individual & Team)", time: "09:00 ~ 16:00", type: "elimination" },
  { date: "2026-07-12", title_ko: "시상식 및 폐회식", title_en: "Award & Closing Ceremony", time: "16:30", type: "ceremony" },
];

const TYPE_COLORS: Record<string, string> = {
  practice: "bg-green-100 text-green-700",
  qualification: "bg-blue-100 text-blue-700",
  elimination: "bg-purple-100 text-purple-700",
  ceremony: "bg-amber-100 text-amber-700",
  other: "bg-gray-100 text-gray-700",
};

const TYPE_LABELS: Record<string, Record<string, string>> = {
  practice: { ko: "연습", en: "Practice" },
  qualification: { ko: "예선", en: "Qualification" },
  elimination: { ko: "본선", en: "Finals" },
  ceremony: { ko: "행사", en: "Ceremony" },
  other: { ko: "기타", en: "Other" },
};

const DATES = ["2026-07-10", "2026-07-11", "2026-07-12"];
const DATE_LABELS: Record<string, Record<string, string>> = {
  "2026-07-10": { ko: "7/10 (금)", en: "Jul 10 (Fri)" },
  "2026-07-11": { ko: "7/11 (토)", en: "Jul 11 (Sat)" },
  "2026-07-12": { ko: "7/12 (일)", en: "Jul 12 (Sun)" },
};

export default function SchedulePage() {
  const { locale } = useI18n();
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [dbSchedules, setDbSchedules] = useState<Schedule[]>([]);

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  useEffect(() => {
    supabase
      .from("schedules")
      .select("*")
      .order("event_date")
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) setDbSchedules(data);
      });
  }, []);

  const schedules = dbSchedules.length > 0
    ? dbSchedules.filter((s) => s.event_date === selectedDate)
    : STATIC_SCHEDULE.filter((s) => s.date === selectedDate);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">{t("대회 일정", "Schedule")}</h1>

      {/* Date Tabs */}
      <div className="flex gap-2 mb-6">
        {DATES.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDate(d)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              selectedDate === d
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
            }`}
          >
            {DATE_LABELS[d][locale] || DATE_LABELS[d]["en"]}
          </button>
        ))}
      </div>

      {/* Schedule List */}
      <div className="space-y-3">
        {schedules.map((s, i) => {
          const isDb = "id" in s;
          const title = isDb
            ? (locale === "ko" ? (s as Schedule).title : ((s as Schedule).title_en || (s as Schedule).title))
            : (locale === "ko" ? (s as typeof STATIC_SCHEDULE[0]).title_ko : (s as typeof STATIC_SCHEDULE[0]).title_en);
          const type = isDb ? (s as Schedule).schedule_type : (s as typeof STATIC_SCHEDULE[0]).type;
          const time = isDb
            ? ((s as Schedule).start_time ? `${(s as Schedule).start_time}${(s as Schedule).end_time ? ` ~ ${(s as Schedule).end_time}` : ""}` : "")
            : (s as typeof STATIC_SCHEDULE[0]).time;

          return (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4">
              <div className="w-16 shrink-0 text-center">
                <p className="text-sm font-bold text-blue-600">{time.split("~")[0]?.trim().split(" ")[0]}</p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${TYPE_COLORS[type] || TYPE_COLORS.other}`}>
                    {TYPE_LABELS[type]?.[locale] || TYPE_LABELS[type]?.["en"] || type}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
