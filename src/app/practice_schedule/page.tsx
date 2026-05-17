"use client";

import { useI18n } from "@/lib/i18n/context";

function getPracticeData(t: (key: string) => string) {
  return [
    { date: t("practiceSchedule.p1Date"), venue: t("practiceSchedule.p1Venue"), time: "13:50-14:40", activity: t("practiceSchedule.p1Act1") },
    { date: "", venue: "", time: "14:40-15:40", activity: t("practiceSchedule.p1Act2") },
    { date: t("practiceSchedule.p2Date"), venue: t("practiceSchedule.p2Venue"), time: "09:00-11:30", activity: t("practiceSchedule.p2Act1") },
    { date: "", venue: "", time: "14:00-16:30", activity: t("practiceSchedule.p2Act2") },
    { date: t("practiceSchedule.p3Date"), venue: t("practiceSchedule.p3Venue"), time: "09:00-11:30", activity: t("practiceSchedule.p3Act1") },
    { date: "", venue: "", time: "14:00-16:30", activity: t("practiceSchedule.p3Act2") },
    { date: t("practiceSchedule.p4Date"), venue: t("practiceSchedule.p4Venue1"), time: "09:00-11:00", activity: t("practiceSchedule.p4Act1") },
    { date: t("practiceSchedule.p4Date"), venue: t("practiceSchedule.p4Venue2"), time: "12:30-15:30", activity: t("practiceSchedule.p4Act1") },
    { date: t("practiceSchedule.p5Date"), venue: t("practiceSchedule.p5Venue1"), time: "09:00-11:00", activity: t("practiceSchedule.p5Act1") },
    { date: t("practiceSchedule.p5Date"), venue: t("practiceSchedule.p5Venue2"), time: "13:00-15:30", activity: t("practiceSchedule.p5Act1") },
  ];
}

export default function PracticeSchedulePage() {
  const { t } = useI18n();
  const PRACTICE_DATA = getPracticeData(t);

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {t("practiceSchedule.title")}
        </h1>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("practiceSchedule.date")}</th>
                <th>{t("practiceSchedule.venue")}</th>
                <th>{t("practiceSchedule.time")}</th>
                <th>{t("practiceSchedule.activity")}</th>
              </tr>
            </thead>
            <tbody>
              {PRACTICE_DATA.map((row, i) => (
                <tr key={i}>
                  <td className="font-medium whitespace-nowrap">{row.date}</td>
                  <td className="text-gray-600">{row.venue}</td>
                  <td className="whitespace-nowrap">{row.time}</td>
                  <td>{row.activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm text-gray-400 text-center">
          {t("practiceSchedule.note")}
        </p>
      </div>
    </div>
  );
}
