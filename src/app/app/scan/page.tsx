"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

export default function ScanPage() {
  const { locale } = useI18n();
  const { profile: myProfile } = useAuth();
  const [scannedProfile, setScannedProfile] = useState<Profile | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  const isAuthorized = myProfile?.role === "judge" || myProfile?.role === "admin";

  const startScanning = async () => {
    try {
      setError("");
      setScannedProfile(null);
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

  // BarcodeDetector API polling
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
        // BarcodeDetector not supported, fallback message
      }

      if (active) setTimeout(detect, 500);
    };

    detect();
    return () => { active = false; };
  }, [scanning]);

  const lookupAthlete = async (token: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("qr_token", token)
      .single();

    if (data) {
      setScannedProfile(data);
    } else {
      // Try by id
      const { data: byId } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", token)
        .single();
      if (byId) {
        setScannedProfile(byId);
      } else {
        setError(t("선수를 찾을 수 없습니다", "Athlete not found"));
      }
    }
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
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">{t("QR 스캔", "QR Scan")}</h1>

      {/* Scanner */}
      {!scannedProfile && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          {scanning ? (
            <div className="relative">
              <video ref={videoRef} className="w-full aspect-square object-cover" playsInline muted />
              <canvas ref={canvasRef} className="hidden" />
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
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Scanned Result */}
      {scannedProfile && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="bg-blue-600 px-5 py-4 text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                {scannedProfile.full_name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold">{scannedProfile.full_name}</h2>
                {scannedProfile.full_name_en && (
                  <p className="text-blue-100 text-sm">{scannedProfile.full_name_en}</p>
                )}
                <p className="text-blue-200 text-xs mt-0.5">
                  {scannedProfile.nationality} · {scannedProfile.team || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-3">
            <div className="flex gap-2 text-sm">
              <span className="text-gray-400 w-16 shrink-0">{t("역할", "Role")}</span>
              <span className="font-medium text-gray-900">{scannedProfile.role}</span>
            </div>
            {scannedProfile.category && (
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400 w-16 shrink-0">{t("종별", "Event")}</span>
                <span className="font-medium text-gray-900">{scannedProfile.category}</span>
              </div>
            )}
            <div className="flex gap-2 text-sm">
              <span className="text-gray-400 w-16 shrink-0">{t("등록", "Status")}</span>
              <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs font-medium rounded-md">
                {t("확인됨", "Verified")}
              </span>
            </div>
          </div>

          <div className="px-5 pb-5">
            <button
              onClick={() => { setScannedProfile(null); setError(""); }}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              {t("다시 스캔", "Scan Again")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
