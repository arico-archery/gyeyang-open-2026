"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import type { Registration, RegistrationStatus } from "@/lib/supabase/types";

const STATUS_CONFIG: Record<RegistrationStatus, { ko: string; en: string; color: string }> = {
  submitted: { ko: "접수됨", en: "Submitted", color: "bg-yellow-100 text-yellow-700" },
  reviewing: { ko: "검토중", en: "Reviewing", color: "bg-blue-100 text-blue-700" },
  approved: { ko: "승인됨", en: "Approved", color: "bg-green-100 text-green-700" },
  confirmed: { ko: "확정", en: "Confirmed", color: "bg-emerald-100 text-emerald-700" },
  rejected: { ko: "반려됨", en: "Rejected", color: "bg-red-100 text-red-700" },
};

const EVENT_TYPES = [
  { value: "individual", ko: "개인전", en: "Individual" },
  { value: "team", ko: "단체전", en: "Team" },
];

const CATEGORIES = [
  { value: "recurve_men", ko: "남자 리커브", en: "Recurve Men" },
  { value: "recurve_women", ko: "여자 리커브", en: "Recurve Women" },
  { value: "compound_men", ko: "남자 컴파운드", en: "Compound Men" },
  { value: "compound_women", ko: "여자 컴파운드", en: "Compound Women" },
];

export default function RegistrationPage() {
  const { locale } = useI18n();
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [registration, setRegistration] = useState<Registration | null>(null);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [eventType, setEventType] = useState("individual");
  const [category, setCategory] = useState("recurve_men");
  const [teamName, setTeamName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  // Prefill category from profile if available
  useEffect(() => {
    if (profile?.category) {
      const known = CATEGORIES.find((c) => c.value === profile.category);
      if (known) setCategory(known.value);
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchRegistration();
    } else if (!loading) {
      setFetching(false);
    }
  }, [user, loading]);

  const fetchRegistration = async () => {
    const { data } = await supabase
      .from("registrations")
      .select("*")
      .eq("athlete_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) setRegistration(data as Registration);
    setFetching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload: Record<string, unknown> = {
      athlete_id: user!.id,
      event_type: eventType,
      category,
    };
    if (eventType === "team" && teamName.trim()) {
      payload.team_name = teamName.trim();
    }

    const { error: insertError } = await supabase.from("registrations").insert(payload);

    if (insertError) {
      setError(insertError.message);
    } else {
      setShowForm(false);
      await fetchRegistration();
    }
    setSubmitting(false);
  };

  const statusLabel = (s: string) => {
    const m = STATUS_CONFIG[s as RegistrationStatus];
    return m ? (locale === "ko" ? m.ko : m.en) : s;
  };
  const statusColor = (s: string) =>
    STATUS_CONFIG[s as RegistrationStatus]?.color || "bg-gray-100 text-gray-600";
  const categoryLabel = (c: string) => {
    const m = CATEGORIES.find((x) => x.value === c);
    return m ? (locale === "ko" ? m.ko : m.en) : c;
  };
  const eventTypeLabel = (e: string) => {
    const m = EVENT_TYPES.find((x) => x.value === e);
    return m ? (locale === "ko" ? m.ko : m.en) : e;
  };

  if (loading || fetching) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("/app/login");
    return null;
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t("참가 신청", "Registration")}</h1>
      </div>

      {/* Existing registration */}
      {registration && !showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">{t("신청 현황", "Status")}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(registration.status)}`}>
              {statusLabel(registration.status)}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{t("경기 종류", "Event Type")}</span>
              <span className="text-gray-900 font-medium">{eventTypeLabel(registration.event_type)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t("종목", "Category")}</span>
              <span className="text-gray-900 font-medium">{categoryLabel(registration.category)}</span>
            </div>
            {registration.team_name && (
              <div className="flex justify-between">
                <span className="text-gray-500">{t("팀명", "Team")}</span>
                <span className="text-gray-900">{registration.team_name}</span>
              </div>
            )}
            {registration.registration_number && (
              <div className="flex justify-between">
                <span className="text-gray-500">{t("등록번호", "Reg No.")}</span>
                <span className="text-gray-900 font-mono">{registration.registration_number}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">{t("신청일", "Applied")}</span>
              <span className="text-gray-900">{new Date(registration.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {registration.status === "rejected" && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full mt-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              {t("다시 신청하기", "Reapply")}
            </button>
          )}

          {(registration.status === "approved" || registration.status === "confirmed") && (
            <div className="mt-4 p-3 bg-green-50 rounded-xl">
              <p className="text-sm text-green-700 text-center font-medium">
                {t("참가가 승인되었습니다! 대회에서 만나요.", "Your registration is approved! See you at the event.")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* No registration yet */}
      {!registration && !showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-gray-900 mb-2">
            {t("아직 참가 신청을 하지 않았습니다", "No registration yet")}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {t("계양오픈에 참가하려면 아래 버튼을 눌러 신청하세요.", "Apply below to participate in the Gyeyang Open.")}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            {t("참가 신청하기", "Apply Now")}
          </button>
        </div>
      )}

      {/* Registration Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">{t("참가 신청서", "Registration Form")}</h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("경기 종류", "Event Type")}</label>
              <div className="grid grid-cols-2 gap-2">
                {EVENT_TYPES.map((e) => (
                  <button
                    key={e.value} type="button"
                    onClick={() => setEventType(e.value)}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                      eventType === e.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {locale === "ko" ? e.ko : e.en}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("종목", "Category")}</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value} type="button"
                    onClick={() => setCategory(c.value)}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                      category === c.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {locale === "ko" ? c.ko : c.en}
                  </button>
                ))}
              </div>
            </div>

            {eventType === "team" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("팀명", "Team Name")}</label>
                <input
                  type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("팀 이름 입력", "Enter team name")}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {t("팀 구성원은 관리자 측에서 별도 등록합니다.", "Team members are added separately by an admin.")}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button" onClick={() => setShowForm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                {t("취소", "Cancel")}
              </button>
              <button
                type="submit" disabled={submitting}
                className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? t("제출 중...", "Submitting...") : t("신청하기", "Submit")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
