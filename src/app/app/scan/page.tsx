"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

interface ScannedData {
  profile: Profile;
  registration: { status: string; category: string } | null;
  targetAssignment: { target_number: string; session_time: string; distance: string } | null;
}

const ROLE_LABELS: Record<string, Record<string, string>> = {
  athlete: { ko: "선수", en: "Athlete" },
  coach: { ko: "코치", en: "Coach" },
  judge: { ko: "심판", en: "Judge" },
  admin: { ko: "관리자", en: "Admin" },
};

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  recurve_men: { ko: "남자 리커브", en: "Recurve Men" },
  recurve_women: { ko: "여자 리커브", en: "Recurve Women" },
};

export default function ScanPage() {
  const { locale } = useI18n();
  const { user, profile: myProfile } = useAuth();
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  const isAuthorized = myProfile?.role === "judge" || myProfile?.role === "admin";

  const startScanning = async () => {
    try {
      setError("");
      setScannedData(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setScanning(true);
    } catch {
      setError(t("카메라 접근 권한이 필요합니다", "Camera permission required"));
    }
  };

  const stopScanning = () => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

  useEffect(() => {
    if (!scanning) return;
    let active = true;

    const detect = async () => {
      if (!active || !videoRef.current || !("BarcodeDetector" in window)) return;

      try {
        // @ts-expect-error BarcodeDetector is not yet in TS types
        const detector = new BarcodeDetector({ formats: ["qr_code"] });
        const barcodes = await detector.detect(videoRef.current);

        if (barcodes.length > 0) {
          const url = barcodes[0].rawValue as string;
          const tokenMatch = url.match(/\/athlete\/([a-f0-9-]+)/);
          if (tokenMatch) {
            stopScanning();
            await lookupAthlete(tokenMatch[1]);
            return;
          }
        }
      } catch {
        // BarcodeDetector not supported
      }

      if (active) setTimeout(detect, 500);
    };

    detect();
    return () => { active = false; };
  }, [scanning]);

  const lookupAthlete = async (token: string) => {
    let profileData: Profile | null = null;
    const { data } = await supabase.from("profiles").select("*").eq("qr_token", token).single();
    if (data) {
      profileData = data;
    } else {
      const { data: byId } = await supabase.from("profiles").select("*").eq("id", token).single();
      if (byId) profileData = byId;
    }

    if (!profileData) {
      setError(t("선수를 찾을 수 없습니다", "Athlete not found"));
      return;
    }

    const { data: regData } = await supabase
      .from("registrations")
      .select("status, category")
      .eq("user_id", profileData.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const { data: targetData } = await supabase
      .from("target_assignments")
      .select("target_number, session_time, distance")
      .eq("user_id", profileData.id)
      .limit(1)
      .single();

    if (user) {
      await supabase.from("qr_scan_logs").insert({
        scanned_by: user.id,
        scanned_user_id: profileData.id,
        scan_type: "checkin",
      });
    }

    setScannedData({
      profile: profileData,
      registration: regData || null,
      targetAssignment: targetData || null,
    });
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">{t("QR 스캔", "QR Scan")}</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-500">
            {t("심판 또는 관리자만 사용할 수 있습니다", "Only judges and admins can use this feature")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <h1 className="text-xl font-bold text-gray-900 mb-4">{t("QR 스캔", "QR Scan")}</h1>

      {!scannedData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          {scanning ? (
            <div className="relative">
              <video ref={videoRef} className="w-full aspect-square object-cover" playsInline muted />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white rounded-xl opacity-50" />
              </div>
              <button
                onClick={stopScanning}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-red-500 text-white text-sm font-medium rounded-full"
              >
                {t("중지", "Stop")}
              </button>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {t("선수의 QR 코드를 스캔하세요", "Scan an athlete's QR code")}
              </p>
              <button
                onClick={startScanning}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                {t("스캔 시작", "Start Scanning")}
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
      )}

      {scannedData && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-blue-600 px-5 py-4 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                  {scannedData.profile.full_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{scannedData.profile.full_name}</h2>
                  {scannedData.profile.full_name_en && (
                    <p className="text-blue-100 text-sm">{scannedData.profile.full_name_en}</p>
                  )}
                  <p className="text-blue-200 text-xs mt-0.5">
                    {scannedData.profile.nationality} \u00b7 {scannedData.profile.team || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400 w-16 shrink-0">{t("역할", "Role")}</span>
                <span className="font-medium text-gray-900">
                  {ROLE_LABELS[scannedData.profile.role]?.[locale] || scannedData.profile.role}
                </span>
              </div>
              {scannedData.profile.category && (
                <div className="flex gap-2 text-sm">
                  <span className="text-gray-400 w-16 shrink-0">{t("종별", "Event")}</span>
                  <span className="font-medium text-gray-900">
                    {CATEGORY_LABELS[scannedData.profile.category]?.[locale] || scannedData.profile.category}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-3">{t("참가 등록", "Registration")}</h3>
            {scannedData.registration ? (
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  scannedData.registration.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : scannedData.registration.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {scannedData.registration.status === "approved"
                    ? t("승인됨", "Approved")
                    : scannedData.registration.status === "pending"
                    ? t("심사중", "Pending")
                    : t("반려됨", "Rejected")}
                </span>
                <span className="text-sm text-gray-500">
                  {CATEGORY_LABELS[scannedData.registration.category]?.[locale] || scannedData.registration.category}
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-400">{t("미등록", "Not registered")}</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-3">{t("타겟 배정", "Target Assignment")}</h3>
            {scannedData.targetAssignment ? (
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-500 mb-1">{t("타겟", "Target")}</p>
                  <p className="text-lg font-bold text-blue-700">{scannedData.targetAssignment.target_number}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">{t("시간", "Time")}</p>
                  <p className="text-sm font-bold text-gray-700">{scannedData.targetAssignment.session_time}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">{t("거리", "Distance")}</p>
                  <p className="text-sm font-bold text-gray-700">{scannedData.targetAssignment.distance}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">{t("배정되지 않음", "Not assigned yet")}</p>
            )}
          </div>

          <button
            onClick={() => { setScannedData(null); setError(""); }}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            {t("다시 스캔", "Scan Again")}
          </button>
        </div>
      )}
    </div>
  );
}
