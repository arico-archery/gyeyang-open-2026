"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import Image from "next/image";

function getScheduleData(t: (key: string) => string) {
  return [
    {
      date: t("schedule.day1Date"),
      title: t("schedule.day1Title"),
      events: [
        { time: "13:00", desc: t("schedule.day1E1") },
        { time: "13:30 \u2013 13:50", desc: t("schedule.day1E2") },
        { time: "13:50 \u2013 14:40", desc: t("schedule.day1E3") },
        { time: "14:40 \u2013 15:40", desc: t("schedule.day1E4") },
        { time: "16:30 \u2013 17:20", desc: t("schedule.day1E5") },
      ],
    },
    {
      date: t("schedule.day2Date"),
      title: t("schedule.day2Title"),
      events: [
        { time: "9:00", desc: t("schedule.day2E1") },
        { time: "09:00 \u2013 09:20", desc: t("schedule.day2E2") },
        { time: "09:30 \u2013 11:30", desc: t("schedule.day2E3") },
        { time: "11:30 \u2013 14:00", desc: t("schedule.day2E4") },
        { time: "14:00 \u2013 14:20", desc: t("schedule.day2E5") },
        { time: "14:30 \u2013 16:30", desc: t("schedule.day2E6") },
      ],
    },
    {
      date: t("schedule.day3Date"),
      title: t("schedule.day3Title"),
      events: [
        { time: "09:00 \u2013 09:20", desc: t("schedule.day3E1") },
        { time: "09:30 \u2013 09:45", desc: t("schedule.day3E2") },
        { time: "09:45 \u2013 10:25", desc: t("schedule.day3E3") },
        { time: "10:25 \u2013 11:05", desc: t("schedule.day3E4") },
        { time: "11:05 \u2013 11:40", desc: t("schedule.day3E5") },
        { time: "12:00 \u2013 14:00", desc: t("schedule.day3E6") },
        { time: "14:00 \u2013 14:20", desc: t("schedule.day3E7") },
        { time: "14:30 \u2013 14:45", desc: t("schedule.day3E8") },
        { time: "14:45 \u2013 15:25", desc: t("schedule.day3E9") },
        { time: "15:25 \u2013 16:05", desc: t("schedule.day3E10") },
        { time: "16:05 \u2013 16:40", desc: t("schedule.day3E11") },
      ],
    },
    {
      date: t("schedule.day4Date"),
      title: t("schedule.day4Title"),
      events: [
        { time: "08:30 \u2013 08:50", desc: t("schedule.day4E1") },
        { time: "", desc: t("schedule.day4E2") },
        { time: "09:00 \u2013 09:15", desc: t("schedule.day4E3") },
        { time: "09:15 \u2013 09:45", desc: t("schedule.day4E4") },
        { time: "09:45 \u2013 10:15", desc: t("schedule.day4E5") },
        { time: "12:00 \u2013 13:00", desc: t("schedule.day4E6") },
        { time: "13:00", desc: t("schedule.day4E7") },
        { time: "", desc: t("schedule.day4E8") },
        { time: "13:06 \u2013 13:29", desc: t("schedule.day4E9") },
        { time: "13:29 \u2013 13:52", desc: t("schedule.day4E10") },
        { time: "13:52 \u2013 14:15", desc: t("schedule.day4E11") },
        { time: "14:15 \u2013 14:38", desc: t("schedule.day4E12") },
      ],
    },
    {
      date: t("schedule.day5Date"),
      title: t("schedule.day5Title"),
      events: [
        { time: "08:30 \u2013 08:50", desc: t("schedule.day5E1") },
        { time: "", desc: t("schedule.day5E2") },
        { time: "09:00 \u2013 09:30", desc: t("schedule.day5E3") },
        { time: "09:30 \u2013 10:00", desc: t("schedule.day5E4") },
        { time: "10:00 \u2013 10:30", desc: t("schedule.day5E5") },
        { time: "10:30 \u2013 11:00", desc: t("schedule.day5E6") },
        { time: "11:00 \u2013 11:30", desc: t("schedule.day5E7") },
        { time: "11:30 \u2013 12:00", desc: t("schedule.day5E8") },
        { time: "12:00 \u2013 12:30", desc: t("schedule.day5E9") },
        { time: "12:30 \u2013 13:00", desc: t("schedule.day5E10") },
        { time: "", desc: t("schedule.day5E11") },
        { time: "13:30 \u2013 14:00", desc: t("schedule.day5E12") },
        { time: "14:00 \u2013 14:30", desc: t("schedule.day5E13") },
        { time: "14:30 \u2013 15:00", desc: t("schedule.day5E14") },
        { time: "15:00 \u2013 15:30", desc: t("schedule.day5E15") },
        { time: "15:30 \u2013 16:00", desc: t("schedule.day5E16") },
        { time: "16:00 \u2013 16:30", desc: t("schedule.day5E17") },
        { time: "17:00 \u2013 17:30", desc: t("schedule.day5E18") },
      ],
    },
    {
      date: t("schedule.day6Date"),
      title: t("schedule.day6Title"),
      events: [
        { time: "08:30 \u2013 08:50", desc: t("schedule.day6E1") },
        { time: "09:00 \u2013 09:15", desc: t("schedule.day6E2") },
        { time: "09:15 \u2013 09:45", desc: t("schedule.day6E3") },
        { time: "09:45 \u2013 10:15", desc: t("schedule.day6E4") },
        { time: "10:15 \u2013 10:45", desc: t("schedule.day6E5") },
        { time: "10:45 \u2013 11:15", desc: t("schedule.day6E6") },
        { time: "11:15 \u2013 11:45", desc: t("schedule.day6E7") },
        { time: "11:45 \u2013 12:15", desc: t("schedule.day6E8") },
        { time: "13:00 \u2013 13:30", desc: t("schedule.day6E9") },
        { time: "14:00 \u2013 15:00", desc: t("schedule.day6E10") },
        { time: "15:00 \u2013 16:30", desc: t("schedule.day6E11") },
      ],
    },
  ];
}

interface ScheduleSectionProps {
  hideHeader?: boolean;
}

export default function ScheduleSection({ hideHeader }: ScheduleSectionProps = {}) {
  const { t } = useI18n();
  const SCHEDULE_DATA = getScheduleData(t);

  useEffect(() => {
    const elements = document.querySelectorAll(".schedule-poster-img");
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const isSubtitle = (event: { time: string; desc: string }) =>
    event.time === "" &&
    (event.desc.includes("KBS") ||
      event.desc === t("schedule.day4E2") ||
      event.desc === t("schedule.day5E2") ||
      event.desc === t("schedule.day4E8") ||
      event.desc === t("schedule.day5E11"));

  return (
    <section id="schedule" className="py-20 lg:py-28 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Download button */}
        <div className="text-center mb-12">
          <a href="https://www.ianseo.net/TourData/2026/28161/SCHEDULE.pdf" target="_blank" rel="noopener noreferrer" className="btn-download">
            {t("schedule.download")}
          </a>
        </div>

        {/* 2-column layout: left title + right schedule */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
          {/* Left column - Section info */}
          <div className="lg:w-2/5 shrink-0">
            {!hideHeader && (
              <>
                <div className="section-tag mb-7">
                  <span className="tag-num">01</span>
                  <span>{t("sectionNav.schedule")}</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-light text-slate-900 mb-4 tracking-tight leading-tight">{t("schedule.title")}</h2>
                <p className="text-lg text-slate-600 font-medium">
                  {t("schedule.period")}
                </p>
              </>
            )}
            {hideHeader && (
              <p className="text-lg text-slate-600 font-medium">
                {t("schedule.period")}
              </p>
            )}

            {/* Decorative poster images with scroll fade-in */}
            <div className="hidden lg:flex flex-col gap-12 mt-10">
              {["/images/bg0.jpg", "/images/bg1.jpg", "/images/bg2.jpg"].map((src, idx) => (
                <div
                  key={idx}
                  className="schedule-poster-img"
                  style={{ transitionDelay: `${idx * 0.15}s` }}
                >
                  <Image
                    src={src}
                    alt={`Gyeyang Open Poster ${idx + 1}`}
                    width={656}
                    height={681}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Schedule tables */}
          <div className="lg:w-3/5 space-y-14">
            {SCHEDULE_DATA.map((day, i) => (
              <div key={i}>
                <h3 className="text-xl lg:text-2xl font-bold text-slate-900 text-center mb-2 tracking-tight">{day.date}</h3>
                <p className="text-base font-semibold text-slate-700 text-center mb-7">{day.title}</p>

                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th className="w-36">{t("schedule.time")}</th>
                      <th>{t("schedule.event")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.events.map((event, j) =>
                      isSubtitle(event) ? (
                        <tr key={j}>
                          <td colSpan={2} className="!p-0">
                            <div className="schedule-subtitle">{event.desc}</div>
                          </td>
                        </tr>
                      ) : (
                        <tr key={j}>
                          <td>{event.time}</td>
                          <td>{event.desc}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
