"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

function getScheduleData(t: (key: string) => string) {
  return [
    { date: "day1", dateLabel: t("schedule.day1Date"), dayNum: t("schedule.dayNum1"), title: t("schedule.day1Title"), events: [
      { time: "13:00", desc: t("schedule.day1E1") },
      { time: "13:30 – 13:50", desc: t("schedule.day1E2") },
      { time: "13:50 – 14:40", desc: t("schedule.day1E3") },
      { time: "14:40 – 15:40", desc: t("schedule.day1E4") },
      { time: "16:30 – 17:20", desc: t("schedule.day1E5") },
    ]},
    { date: "day2", dateLabel: t("schedule.day2Date"), dayNum: t("schedule.dayNum2"), title: t("schedule.day2Title"), events: [
      { time: "9:00", desc: t("schedule.day2E1") },
      { time: "09:00 – 09:20", desc: t("schedule.day2E2") },
      { time: "09:30 – 11:30", desc: t("schedule.day2E3") },
      { time: "11:30 – 14:00", desc: t("schedule.day2E4") },
      { time: "14:00 – 14:20", desc: t("schedule.day2E5") },
      { time: "14:30 – 16:30", desc: t("schedule.day2E6") },
    ]},
    { date: "day3", dateLabel: t("schedule.day3Date"), dayNum: t("schedule.dayNum3"), title: t("schedule.day3Title"), events: [
      { time: "09:00 – 09:20", desc: t("schedule.day3E1") },
      { time: "09:30 – 09:45", desc: t("schedule.day3E2") },
      { time: "09:45 – 10:25", desc: t("schedule.day3E3") },
      { time: "10:25 – 11:05", desc: t("schedule.day3E4") },
      { time: "11:05 – 11:40", desc: t("schedule.day3E5") },
      { time: "12:00 – 14:00", desc: t("schedule.day3E6") },
      { time: "14:00 – 14:20", desc: t("schedule.day3E7") },
      { time: "14:30 – 14:45", desc: t("schedule.day3E8") },
      { time: "14:45 – 15:25", desc: t("schedule.day3E9") },
      { time: "15:25 – 16:05", desc: t("schedule.day3E10") },
      { time: "16:05 – 16:40", desc: t("schedule.day3E11") },
    ]},
    { date: "day4", dateLabel: t("schedule.day4Date"), dayNum: t("schedule.dayNum4"), title: t("schedule.day4Title"), events: [
      { time: "08:30 – 08:50", desc: t("schedule.day4E1") },
      { time: "", desc: t("schedule.day4E2") },
      { time: "09:00 – 09:15", desc: t("schedule.day4E3") },
      { time: "09:15 – 09:45", desc: t("schedule.day4E4") },
      { time: "09:45 – 10:15", desc: t("schedule.day4E5") },
      { time: "12:00 – 13:00", desc: t("schedule.day4E6") },
      { time: "13:00", desc: t("schedule.day4E7") },
      { time: "", desc: t("schedule.day4E8") },
      { time: "13:06 – 13:29", desc: t("schedule.day4E9") },
      { time: "13:29 – 13:52", desc: t("schedule.day4E10") },
      { time: "13:52 – 14:15", desc: t("schedule.day4E11") },
      { time: "14:15 – 14:38", desc: t("schedule.day4E12") },
    ]},
    { date: "day5", dateLabel: t("schedule.day5Date"), dayNum: t("schedule.dayNum5"), title: t("schedule.day5Title"), events: [
      { time: "08:30 – 08:50", desc: t("schedule.day5E1") },
      { time: "", desc: t("schedule.day5E2") },
      { time: "09:00 – 09:30", desc: t("schedule.day5E3") },
      { time: "09:30 – 10:00", desc: t("schedule.day5E4") },
      { time: "10:00 – 10:30", desc: t("schedule.day5E5") },
      { time: "10:30 – 11:00", desc: t("schedule.day5E6") },
      { time: "11:00 – 11:30", desc: t("schedule.day5E7") },
      { time: "11:30 – 12:00", desc: t("schedule.day5E8") },
      { time: "12:00 – 12:30", desc: t("schedule.day5E9") },
      { time: "12:30 – 13:00", desc: t("schedule.day5E10") },
      { time: "", desc: t("schedule.day5E11") },
      { time: "13:30 – 14:00", desc: t("schedule.day5E12") },
      { time: "14:00 – 14:30", desc: t("schedule.day5E13") },
      { time: "14:30 – 15:00", desc: t("schedule.day5E14") },
      { time: "15:00 – 15:30", desc: t("schedule.day5E15") },
      { time: "15:30 – 16:00", desc: t("schedule.day5E16") },
      { time: "16:00 – 16:30", desc: t("schedule.day5E17") },
      { time: "17:00 – 17:30", desc: t("schedule.day5E18") },
    ]},
    { date: "day6", dateLabel: t("schedule.day6Date"), dayNum: t("schedule.dayNum6"), title: t("schedule.day6Title"), events: [
      { time: "08:30 – 08:50", desc: t("schedule.day6E1") },
      { time: "09:00 – 09:15", desc: t("schedule.day6E2") },
      { time: "09:15 – 09:45", desc: t("schedule.day6E3") },
      { time: "09:45 – 10:15", desc: t("schedule.day6E4") },
      { time: "10:15 – 10:45", desc: t("schedule.day6E5") },
      { time: "10:45 – 11:15", desc: t("schedule.day6E6") },
      { time: "11:15 – 11:45", desc: t("schedule.day6E7") },
      { time: "11:45 – 12:15", desc: t("schedule.day6E8") },
      { time: "13:00 – 13:30", desc: t("schedule.day6E9") },
      { time: "14:00 – 15:00", desc: t("schedule.day6E10") },
      { time: "15:00 – 16:30", desc: t("schedule.day6E11") },
    ]},
  ];
}

export default function SchedulePage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const SCHEDULE_DATA = getScheduleData(t);
  const [selectedDay, setSelectedDay] = useState(0);

  const tl = (ko: string, en: string) => (locale === "ko" ? ko : en);

  const isSubtitle = (event: { time: string; desc: string }) =>
    event.time === "" &&
    (event.desc.includes("KBS") ||
      event.desc === t("schedule.day4E2") ||
      event.desc === t("schedule.day5E2") ||
      event.desc === t("schedule.day4E8") ||
      event.desc === t("schedule.day5E11"));

  const isBreak = (desc: string) =>
    desc === t("schedule.day2E4") || desc === t("schedule.day3E6") ||
    desc === t("schedule.day4E6");

  const isHighlight = (desc: string) =>
    desc === t("schedule.day5E16") || desc === t("schedule.day5E17") ||
    desc === t("schedule.day5E18") || desc === t("schedule.day6E9") ||
    desc === t("schedule.day1E5");

  const currentDay = SCHEDULE_DATA[selectedDay];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{tl("대회 일정", "Schedule")}</h1>
      </div>

      {/* Day selector - scrollable chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1 scrollbar-hide">
        {SCHEDULE_DATA.map((day, i) => (
          <button
            key={day.date}
            onClick={() => setSelectedDay(i)}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              selectedDay === i
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {day.dayNum}
          </button>
        ))}
      </div>

      {/* Day header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl px-4 py-3 mb-4 border border-amber-100">
        <p className="text-base font-bold text-gray-900">{currentDay.dateLabel}</p>
        <p className="text-xs text-gray-600 mt-0.5">{currentDay.title}</p>
      </div>

      {/* Schedule PDF link */}
      <a
        href="https://www.ianseo.net/TourData/2026/28161/SCHEDULE.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors"
      >
        <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-sm font-medium text-gray-700">{tl("상세 일정표 다운로드 (PDF)", "Download Detailed Schedule (PDF)")}</span>
      </a>

      {/* Events list */}
      <div className="space-y-2">
        {currentDay.events.map((event, j) => {
          if (isSubtitle(event)) {
            return (
              <div key={j} className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg px-4 py-2.5">
                <p className="text-sm font-semibold text-blue-800">{event.desc}</p>
              </div>
            );
          }

          return (
            <div
              key={j}
              className={`flex gap-3 px-4 py-3 rounded-xl ${
                isBreak(event.desc) ? "bg-gray-50" :
                isHighlight(event.desc) ? "bg-amber-50 border border-amber-200" :
                "bg-white border border-gray-100"
              }`}
            >
              <span className="text-xs font-medium text-gray-400 w-24 shrink-0 pt-0.5">
                {event.time}
              </span>
              <span className={`text-sm flex-1 ${
                isHighlight(event.desc) ? "font-bold text-amber-800" :
                isBreak(event.desc) ? "text-gray-400 italic" :
                "text-gray-700"
              }`}>
                {event.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
