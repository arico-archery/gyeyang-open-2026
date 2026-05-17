"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";

interface ScheduleDetail {
  id: string;
  title_ko: string;
  title_en: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  description_ko: string | null;
  description_en: string | null;
  schedule_type: string;
}

interface TargetAssignment {
  target_number: string;
  session_time: string;
  distance: string;
}

const TYPE_COLORS: Record<string, string> = {
  practice: "bg-green-100 text-green-700",
  qualification: "bg-blue-100 text-blue-700",
  elimination: "bg-purple-100 text-purple-700",
  ceremony: "bg-amber-100 text-amber-700",
  meeting: "bg-gray-100 text-gray-700",
};

export default function ScheduleDetailPage() {
  const { locale } = useI18n();
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [schedule, setSchedule] = useState<ScheduleDetail | null>(null);
  const [target, setTarget] = useState<TargetAssignment | null>(null);
  const [loading, setLoading] = useState(true);

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const fetchData = async () => {
    // Fetch schedule detail
    const { data: scheduleData } = await supabase
      .from("schedules")
      .select("*")
      .eq("id", id)
      .single();

    if (scheduleData) setSchedule(scheduleData);

    // Fetch my target assignment for this schedule
    if (user) {
      const { data: targetData } = await supabase
        .from("target_assignments")
        .select("target_number, session_time, distance")
        .eq("user_id", user.id)
        .eq("schedule_id", id)
        .single();

      if (targetData) setTarget(targetData);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <p className="text-center text-gray-500">{t("일정을 찾을 수 없습니다", "Schedule not found")}</p>
      </div>
    );
  }

  const title = locale === "ko" ? schedule.title_ko : schedule.title_en;
  const description = locale === "ko" ? schedule.description_ko : schedule.description_en;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t("일정 상세", "Schedule Detail")}</h1>
      </div>

      {/* Main Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900 flex-1">{title}</h2>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0 ml-2 ${TYPE_COLORS[schedule.schedule_type] || "bg-gray-100 text-gray-700"}`}>
            {schedule.schedule_type}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-700">{schedule.date}</span>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-700">{schedule.start_time} - {schedule.end_time}</span>
          </div>
          {schedule.location && (
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-700">{schedule.location}</span>
            </div>
          )}
        </div>

        {description && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          </div>
        )}
      </div>

      {/* Target Assignment */}
      {target && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-700 mb-4">{t("내 타겟 배정", "My Target Assignment")}</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-500 mb-1">{t("타겟", "Target")}</p>
              <p className="text-2xl font-bold text-blue-700">{target.target_number}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">{t("시간", "Time")}</p>
              <p className="text-base font-bold text-gray-700">{target.session_time}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">{t("거리", "Distance")}</p>
              <p className="text-base font-bold text-gray-700">{target.distance}</p>
            </div>
          </div>
        </div>
      )}

      {!target && user && (
        <div className="bg-gray-50 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-400">{t("아직 타겟이 배정되지 않았습니다", "Target not assigned yet")}</p>
        </div>
      )}
    </div>
  );
}
