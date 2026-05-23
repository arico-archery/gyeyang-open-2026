"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useInlineT } from "@/lib/i18n/inline";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import type { Schedule, TargetAssignment, ScheduleType } from "@/lib/supabase/types";

const TYPE_LABELS: Record<ScheduleType, { ko: string; en: string; zh: string; ja: string; color: string }> = {
  practice: { ko: "공식 연습", en: "Practice", zh: "官方练习", ja: "公式練習", color: "bg-green-100 text-green-700" },
  qualification: { ko: "예선", en: "Qualification", zh: "预赛", ja: "予選", color: "bg-blue-100 text-blue-700" },
  elimination: { ko: "본선", en: "Elimination", zh: "淘汰赛", ja: "本戦", color: "bg-purple-100 text-purple-700" },
  ceremony: { ko: "시상식", en: "Ceremony", zh: "颁奖典礼", ja: "表彰式", color: "bg-amber-100 text-amber-700" },
  other: { ko: "기타", en: "Other", zh: "其他", ja: "その他", color: "bg-gray-100 text-gray-700" },
};

function formatTime(t: string | null): string {
  if (!t) return "";
  // Postgres time format is HH:MM:SS — trim seconds
  return t.length >= 5 ? t.slice(0, 5) : t;
}

export default function ScheduleDetailPage() {
  const { locale } = useI18n();
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [target, setTarget] = useState<TargetAssignment | null>(null);
  const [loading, setLoading] = useState(true);

  const t = useInlineT();

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const fetchData = async () => {
    // Fetch schedule detail
    const { data: scheduleData } = await supabase
      .from("schedules")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (scheduleData) setSchedule(scheduleData as Schedule);

    // Fetch my target assignment for this schedule
    if (user) {
      const { data: targetData } = await supabase
        .from("target_assignments")
        .select("target_number, target_position, session")
        .eq("athlete_id", user.id)
        .eq("schedule_id", id)
        .maybeSingle();

      if (targetData) setTarget(targetData as TargetAssignment);
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
        <p className="text-center text-gray-500">{t("일정을 찾을 수 없습니다", "Schedule not found", "找不到此赛程", "スケジュールが見つかりません")}</p>
      </div>
    );
  }

  const title = locale === "ko" ? schedule.title : schedule.title_en || schedule.title;
  const description = schedule.description;
  const typeMeta = TYPE_LABELS[schedule.schedule_type] || TYPE_LABELS.other;

  const dateLabel = new Date(schedule.event_date + "T00:00:00").toLocaleDateString(
    locale === "ko" ? "ko-KR" : "en-US",
    { year: "numeric", month: "long", day: "numeric", weekday: "short" }
  );

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t("일정 상세", "Schedule Detail", "赛程详情", "スケジュール詳細")}</h1>
      </div>

      {/* Main Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
        <div className="flex items-start justify-between mb-3 gap-2">
          <h2 className="text-lg font-bold text-gray-900 flex-1">{title}</h2>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0 ${typeMeta.color}`}>
            {locale === "ko" ? typeMeta.ko : locale === "zh" ? typeMeta.zh : locale === "ja" ? typeMeta.ja : typeMeta.en}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-700">{dateLabel}</span>
          </div>
          {(schedule.start_time || schedule.end_time) && (
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">
                {formatTime(schedule.start_time)}
                {schedule.end_time ? ` - ${formatTime(schedule.end_time)}` : ""}
              </span>
            </div>
          )}
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
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{description}</p>
          </div>
        )}
      </div>

      {/* Target Assignment */}
      {target && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-700 mb-4">{t("내 타겟 배정", "My Target Assignment", "我的靶位分配", "私の的位置")}</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-500 mb-1">{t("사대", "Target", "靶位", "的")}</p>
              <p className="text-2xl font-bold text-blue-700">{target.target_number}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">{t("위치", "Position", "位置", "ポジション")}</p>
              <p className="text-2xl font-bold text-gray-700">{target.target_position || "-"}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">{t("세션", "Session", "时段", "セッション")}</p>
              <p className="text-2xl font-bold text-gray-700">{target.session ?? "-"}</p>
            </div>
          </div>
        </div>
      )}

      {!target && user && (
        <div className="bg-gray-50 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-400">{t("아직 타겟이 배정되지 않았습니다", "Target not assigned yet", "尚未分配靶位", "まだ的位置が割り当てられていません")}</p>
        </div>
      )}
    </div>
  );
}
