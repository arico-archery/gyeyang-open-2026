"use client";

import { useI18n } from "@/lib/i18n/context";

function getSchedulePageData(t: (key: string) => string) {
  return [
    { date: t("schedule.day1Date"), dayNum: t("schedule.dayNum1"), title: t("schedule.day1Title"), events: [
      { time: "13:00", desc: t("schedule.day1E1") },
      { time: "13:30 – 13:50", desc: t("schedule.day1E2") },
      { time: "13:50 – 14:40", desc: t("schedule.day1E3") },
      { time: "14:40 – 15:40", desc: t("schedule.day1E4") },
      { time: "16:30 – 17:20", desc: t("schedule.day1E5") },
    ]},
    { date: t("schedule.day2Date"), dayNum: t("schedule.dayNum2"), title: t("schedule.day2Title"), events: [
      { time: "9:00", desc: t("schedule.day2E1") },
      { time: "09:00 – 09:20", desc: t("schedule.day2E2") },
      { time: "09:30 – 11:30", desc: t("schedule.day2E3") },
      { time: "11:30 – 14:00", desc: t("schedule.day2E4") },
      { time: "14:00 – 14:20", desc: t("schedule.day2E5") },
      { time: "14:30 – 16:30", desc: t("schedule.day2E6") },
    ]},
    { date: t("schedule.day3Date"), dayNum: t("schedule.dayNum3"), title: t("schedule.day3Title"), events: [
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
    { date: t("schedule.day4Date"), dayNum: t("schedule.dayNum4"), title: t("schedule.day4Title"), events: [
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
    { date: t("schedule.day5Date"), dayNum: t("schedule.dayNum5"), title: t("schedule.day5Title"), events: [
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
    { date: t("schedule.day6Date"), dayNum: t("schedule.dayNum6"), title: t("schedule.day6Title"), events: [
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
  const { t } = useI18n();
  const SCHEDULE_DATA = getSchedulePageData(t);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-10 lg:py-14">
          <div className="section-tag mb-5">
            <span className="tag-num">01</span>
            <span>{t("sectionNav.schedule")}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {t("schedule.title")}
          </h1>
          <p className="text-lg text-gray-500">{t("schedule.period")}</p>
          <div className="mt-6">
            <a
              href="https://www.ianseo.net/TourData/2026/28161/SCHEDULE.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-download btn-download-sm"
            >
              {t("schedule.downloadDetailed")}
            </a>
          </div>
        </div>
      </div>

      {/* Schedule Content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="space-y-8">
          {SCHEDULE_DATA.map((day, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 border-b border-amber-100">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    {day.dayNum}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">{day.date}</h2>
                </div>
                <p className="text-sm font-medium text-gray-600 mt-2">{day.title}</p>
              </div>

              {/* Schedule Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-40">
                        {t("schedule.time")}
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {t("schedule.event")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.events.map((event, j) =>
                      isSubtitle(event) ? (
                        <tr key={j}>
                          <td colSpan={2} className="px-0 py-0">
                            <div className="bg-blue-50 border-l-4 border-blue-500 px-6 py-3 font-semibold text-blue-800 text-sm">
                              {event.desc}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr
                          key={j}
                          className={`border-b border-gray-50 transition-colors hover:bg-gray-50 ${
                            isBreak(event.desc) ? "bg-gray-50/50" : ""
                          } ${isHighlight(event.desc) ? "bg-amber-50/40" : ""}`}
                        >
                          <td className="px-6 py-3.5 text-sm font-medium text-gray-500 whitespace-nowrap align-top">
                            {event.time}
                          </td>
                          <td
                            className={`px-6 py-3.5 text-sm align-top ${
                              isHighlight(event.desc)
                                ? "font-bold text-amber-800"
                                : isBreak(event.desc)
                                ? "text-gray-400 italic"
                                : "text-gray-700"
                            }`}
                          >
                            {event.desc}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
