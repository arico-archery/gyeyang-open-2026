"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import type { Schedule } from "@/lib/supabase/types";

interface TargetWithProfile {
  id: string;
  schedule_id: string;
  athlete_id: string;
  target_number: number;
  target_position: string | null;
  session: number;
  profiles: { full_name: string; nationality: string } | null;
}

export default function AdminTargetsPage() {
  const { locale } = useI18n();
  const { profile } = useAuth();
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [targets, setTargets] = useState<TargetWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New assignment form
  const [showForm, setShowForm] = useState(false);
  const [athleteSearch, setAthleteSearch] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string; full_name: string; nationality: string }[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<{ id: string; full_name: string } | null>(null);
  const [targetNumber, setTargetNumber] = useState("");
  const [targetPosition, setTargetPosition] = useState("");
  const [sessionNum, setSessionNum] = useState("1");

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  useEffect(() => {
    if (profile && profile.role !== "admin") router.push("/app");
  }, [profile, router]);

  useEffect(() => {
    async function fetchSchedules() {
      const { data } = await supabase
        .from("schedules")
        .select("*")
        .order("event_date", { ascending: true })
        .order("sort_order", { ascending: true });
      if (data) setSchedules(data);
      setLoading(false);
    }
    fetchSchedules();
  }, []);

  useEffect(() => {
    if (selectedSchedule) fetchTargets();
  }, [selectedSchedule]);

  async function fetchTargets() {
    const { data } = await supabase
      .from("target_assignments")
      .select("*, profiles(full_name, nationality)")
      .eq("schedule_id", selectedSchedule)
      .order("target_number", { ascending: true });
    if (data) setTargets(data as TargetWithProfile[]);
  }

  async function searchAthletes(query: string) {
    setAthleteSearch(query);
    if (query.length < 2) { setSearchResults([]); return; }
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, nationality")
      .or(`full_name.ilike.%${query}%,full_name_en.ilike.%${query}%`)
      .limit(10);
    if (data) setSearchResults(data);
  }

  async function handleAssign() {
    if (!selectedAthlete || !targetNumber || !selectedSchedule) return;
    setSaving(true);
    await supabase.from("target_assignments").insert({
      schedule_id: selectedSchedule,
      athlete_id: selectedAthlete.id,
      target_number: parseInt(targetNumber),
      target_position: targetPosition || null,
      session: parseInt(sessionNum),
    });
    setSaving(false);
    setShowForm(false);
    setSelectedAthlete(null);
    setTargetNumber("");
    setTargetPosition("");
    fetchTargets();
  }

  async function handleRemove(id: string) {
    if (!confirm(t("배정을 삭제하시겠습니까?", "Remove this assignment?"))) return;
    await supabase.from("target_assignments").delete().eq("id", id);
    fetchTargets();
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/app/admin")} className="p-2 -ml-2 text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t("타겟 배정", "Target Assignment")}</h1>
      </div>

      {/* Schedule selector */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block">{t("일정 선택", "Select Schedule")}</label>
        <select
          value={selectedSchedule}
          onChange={(e) => setSelectedSchedule(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
        >
          <option value="">{t("일정을 선택하세요", "Select a schedule")}</option>
          {schedules.map((s) => (
            <option key={s.id} value={s.id}>
              {s.event_date} - {locale === "ko" ? s.title : (s.title_en || s.title)}
            </option>
          ))}
        </select>
      </div>

      {selectedSchedule && (
        <>
          {/* Add button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full mb-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl"
          >
            + {t("새 배정 추가", "Add Assignment")}
          </button>

          {/* Assignment form */}
          {showForm && (
            <div className="bg-blue-50 rounded-xl p-4 mb-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">{t("선수 검색", "Search Athlete")}</label>
                <input
                  value={athleteSearch}
                  onChange={(e) => searchAthletes(e.target.value)}
                  placeholder={t("이름으로 검색...", "Search by name...")}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                {searchResults.length > 0 && !selectedAthlete && (
                  <div className="mt-1 bg-white border border-gray-200 rounded-lg max-h-32 overflow-y-auto">
                    {searchResults.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedAthlete({ id: p.id, full_name: p.full_name }); setSearchResults([]); }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 border-b border-gray-50"
                      >
                        {p.full_name} ({p.nationality})
                      </button>
                    ))}
                  </div>
                )}
                {selectedAthlete && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm text-blue-700 font-medium">{selectedAthlete.full_name}</span>
                    <button onClick={() => setSelectedAthlete(null)} className="text-xs text-red-500">✕</button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600">{t("타겟 번호", "Target #")}</label>
                  <input value={targetNumber} onChange={(e) => setTargetNumber(e.target.value)} type="number" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">{t("위치", "Position")}</label>
                  <input value={targetPosition} onChange={(e) => setTargetPosition(e.target.value)} placeholder="A/B/C/D" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">{t("세션", "Session")}</label>
                  <input value={sessionNum} onChange={(e) => setSessionNum(e.target.value)} type="number" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <button
                onClick={handleAssign}
                disabled={saving || !selectedAthlete || !targetNumber}
                className="w-full py-2 bg-green-600 text-white text-sm font-medium rounded-lg disabled:opacity-50"
              >
                {saving ? t("저장 중...", "Saving...") : t("배정하기", "Assign")}
              </button>
            </div>
          )}

          {/* Current assignments */}
          {targets.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <p className="text-sm text-gray-400">{t("배정된 선수가 없습니다", "No assignments yet")}</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-700">{t("배정 목록", "Assignments")}</h2>
                <span className="text-xs text-gray-400">{targets.length}{t("명", " athletes")}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {targets.map((ta) => (
                  <div key={ta.id} className="px-4 py-3 flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                      {ta.target_number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{ta.profiles?.full_name}</p>
                      <p className="text-xs text-gray-400">
                        {ta.target_position && `${ta.target_position} · `}{t("세션", "Session")} {ta.session}
                      </p>
                    </div>
                    <button onClick={() => handleRemove(ta.id)} className="text-xs text-red-500 font-medium">
                      {t("삭제", "Remove")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
