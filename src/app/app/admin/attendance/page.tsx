"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useInlineT } from "@/lib/i18n/inline";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import { isSuperAdmin } from "@/lib/super-admin";

interface AthleteAttendance {
  id: string;
  full_name: string;
  full_name_en: string | null;
  nationality: string;
  team: string | null;
  category: string | null;
  checkedIn: boolean;
  checkedInAt: string | null;
}

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  recurve_men: { ko: "남자 리커브", en: "RM" },
  recurve_women: { ko: "여자 리커브", en: "RW" },
  compound_men: { ko: "남자 컴파운드", en: "CM" },
  compound_women: { ko: "여자 컴파운드", en: "CW" },
};

export default function AttendancePage() {
  const { locale } = useI18n();
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [athletes, setAthletes] = useState<AthleteAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "present" | "absent">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const t = useInlineT();

  const isAdmin = profile?.role === "admin" || isSuperAdmin(user?.email);

  useEffect(() => {
    if (!isAdmin || authLoading) return;
    fetchAttendance();
  }, [isAdmin, authLoading, selectedDate]);

  const fetchAttendance = async () => {
    setLoading(true);

    // Get all athletes
    const { data: allAthletes } = await supabase
      .from("profiles")
      .select("id, full_name, full_name_en, nationality, team, category")
      .eq("role", "athlete")
      .order("full_name");

    if (!allAthletes) {
      setLoading(false);
      return;
    }

    // Get attendance for selected date
    const { data: attendanceData } = await supabase
      .from("attendance")
      .select("athlete_id, checked_in_at")
      .eq("check_date", selectedDate);

    const attendanceMap = new Map<string, string>();
    if (attendanceData) {
      for (const a of attendanceData) {
        attendanceMap.set(a.athlete_id, a.checked_in_at);
      }
    }

    const merged: AthleteAttendance[] = allAthletes.map((ath) => ({
      id: ath.id,
      full_name: ath.full_name || "",
      full_name_en: ath.full_name_en,
      nationality: ath.nationality || "",
      team: ath.team,
      category: ath.category,
      checkedIn: attendanceMap.has(ath.id),
      checkedInAt: attendanceMap.get(ath.id) || null,
    }));

    setAthletes(merged);
    setLoading(false);
  };

  const handleToggleAttendance = async (athleteId: string, currentlyCheckedIn: boolean) => {
    if (!user) return;

    if (currentlyCheckedIn) {
      // Remove attendance
      await supabase
        .from("attendance")
        .delete()
        .eq("athlete_id", athleteId)
        .eq("check_date", selectedDate);
    } else {
      // Add attendance
      await supabase.from("attendance").upsert({
        athlete_id: athleteId,
        check_date: selectedDate,
        checked_by: user.id,
      }, { onConflict: "athlete_id,check_date" });
    }

    // Update local state
    setAthletes((prev) =>
      prev.map((a) =>
        a.id === athleteId
          ? {
              ...a,
              checkedIn: !currentlyCheckedIn,
              checkedInAt: !currentlyCheckedIn ? new Date().toISOString() : null,
            }
          : a
      )
    );
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    router.push("/app");
    return null;
  }

  // Filtering
  const filtered = athletes.filter((a) => {
    if (filterCategory !== "all" && a.category !== filterCategory) return false;
    if (filterStatus === "present" && !a.checkedIn) return false;
    if (filterStatus === "absent" && a.checkedIn) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = a.full_name.toLowerCase().includes(q);
      const nameEnMatch = a.full_name_en?.toLowerCase().includes(q);
      const teamMatch = a.team?.toLowerCase().includes(q);
      if (!nameMatch && !nameEnMatch && !teamMatch) return false;
    }
    return true;
  });

  const presentCount = athletes.filter((a) => a.checkedIn).length;
  const absentCount = athletes.length - presentCount;

  const formatTime = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleTimeString(locale === "ko" ? "ko-KR" : "en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t("출석 관리", "Attendance")}</h1>
      </div>

      {/* Date Picker */}
      <div className="mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <button
          onClick={() => setFilterStatus("all")}
          className={"rounded-xl p-3 text-center border transition-colors " + (filterStatus === "all" ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100")}
        >
          <p className="text-xl font-bold text-blue-700">{athletes.length}</p>
          <p className="text-[10px] text-blue-600">{t("전체", "Total")}</p>
        </button>
        <button
          onClick={() => setFilterStatus("present")}
          className={"rounded-xl p-3 text-center border transition-colors " + (filterStatus === "present" ? "bg-green-50 border-green-200" : "bg-white border-gray-100")}
        >
          <p className="text-xl font-bold text-green-700">{presentCount}</p>
          <p className="text-[10px] text-green-600">{t("출석", "Present")}</p>
        </button>
        <button
          onClick={() => setFilterStatus("absent")}
          className={"rounded-xl p-3 text-center border transition-colors " + (filterStatus === "absent" ? "bg-red-50 border-red-200" : "bg-white border-gray-100")}
        >
          <p className="text-xl font-bold text-red-600">{absentCount}</p>
          <p className="text-[10px] text-red-500">{t("미출석", "Absent")}</p>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("이름/소속 검색", "Search name/team")}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{t("전체 종목", "All Events")}</option>
          <option value="recurve_men">{t("남자 리커브", "Recurve M")}</option>
          <option value="recurve_women">{t("여자 리커브", "Recurve W")}</option>
          <option value="compound_men">{t("남자 컴파운드", "Compound M")}</option>
          <option value="compound_women">{t("여자 컴파운드", "Compound W")}</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-2 px-1">
        {t(`${filtered.length}명 표시 중`, `Showing ${filtered.length} athletes`)}
      </p>

      {/* Athlete List */}
      <div className="space-y-2">
        {filtered.map((ath) => (
          <div
            key={ath.id}
            className={"flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors " +
              (ath.checkedIn ? "bg-green-50 border-green-100" : "bg-white border-gray-100")}
          >
            {/* Toggle button */}
            <button
              onClick={() => handleToggleAttendance(ath.id, ath.checkedIn)}
              className={"w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors " +
                (ath.checkedIn
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200")}
            >
              {ath.checkedIn ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                </svg>
              )}
            </button>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900 truncate">{ath.full_name}</p>
                {ath.category && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded font-medium shrink-0">
                    {CATEGORY_LABELS[ath.category]?.[locale === "ko" ? "ko" : "en"] || ath.category}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 truncate">
                {ath.nationality} {ath.team ? " · " + ath.team : ""}
              </p>
            </div>

            {/* Time */}
            {ath.checkedIn && ath.checkedInAt && (
              <span className="text-xs text-green-600 font-medium shrink-0">
                {formatTime(ath.checkedInAt)}
              </span>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">{t("해당하는 선수가 없습니다", "No athletes found")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
