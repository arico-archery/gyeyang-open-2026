"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useInlineT } from "@/lib/i18n/inline";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import type { RegistrationStatus } from "@/lib/supabase/types";

interface RegistrationWithProfile {
  id: string;
  athlete_id: string;
  event_type: string;
  category: string;
  team_name: string | null;
  status: RegistrationStatus;
  registration_number: string | null;
  created_at: string;
  profiles: { full_name: string; full_name_en: string | null; nationality: string } | null;
}

type FilterStatus = "all" | "submitted" | "reviewing" | "approved" | "rejected";

export default function AdminRegistrationsPage() {
  const { locale } = useI18n();
  const { profile } = useAuth();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<RegistrationWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const t = useInlineT();

  useEffect(() => {
    if (profile && profile.role !== "admin") router.push("/app");
  }, [profile, router]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    const { data } = await supabase
      .from("registrations")
      .select("*, profiles(full_name, full_name_en, nationality)")
      .order("created_at", { ascending: false });
    if (data) setRegistrations(data as RegistrationWithProfile[]);
    setLoading(false);
  }

  async function updateStatus(id: string, status: RegistrationStatus) {
    await supabase.from("registrations").update({ status }).eq("id", id);
    setRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  }

  const filtered = filter === "all" ? registrations : registrations.filter((r) => r.status === filter);

  const statusColors: Record<RegistrationStatus, string> = {
    submitted: "bg-yellow-100 text-yellow-800",
    reviewing: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    confirmed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<RegistrationStatus, string> = {
    submitted: t("제출됨", "Submitted"),
    reviewing: t("검토중", "Reviewing"),
    approved: t("승인", "Approved"),
    confirmed: t("확정", "Confirmed"),
    rejected: t("거절", "Rejected"),
  };

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
        <h1 className="text-xl font-bold text-gray-900">{t("참가신청 관리", "Registration Management")}</h1>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {(["all", "submitted", "reviewing", "approved", "rejected"] as FilterStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {s === "all" ? t("전체", "All") : statusLabels[s as RegistrationStatus]}
            {s === "all" ? ` (${registrations.length})` : ` (${registrations.filter((r) => r.status === s).length})`}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-400">{t("해당 신청이 없습니다", "No registrations found")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {r.profiles?.full_name || t("이름 없음", "No name")}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {r.profiles?.nationality} · {r.category} · {r.event_type}
                  </p>
                  {r.team_name && <p className="text-xs text-gray-400 mt-0.5">{r.team_name}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(r.created_at).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US")}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status]}`}>
                  {statusLabels[r.status]}
                </span>
              </div>

              {/* Action buttons */}
              {(r.status === "submitted" || r.status === "reviewing") && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => updateStatus(r.id, "approved")}
                    className="flex-1 py-2 bg-green-600 text-white text-xs font-medium rounded-lg"
                  >
                    {t("승인", "Approve")}
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "rejected")}
                    className="flex-1 py-2 bg-red-500 text-white text-xs font-medium rounded-lg"
                  >
                    {t("거절", "Reject")}
                  </button>
                  {r.status === "submitted" && (
                    <button
                      onClick={() => updateStatus(r.id, "reviewing")}
                      className="flex-1 py-2 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg"
                    >
                      {t("검토중", "Review")}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
