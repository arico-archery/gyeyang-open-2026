"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import jsQR from "jsqr";

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
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  const isAuthorized = myProfile?.role === "judge" || myProfile?.role === "admin";

  const stopScanning = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    setScanning(false);
  }, []);

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

  const startScanning = async () => {
    try {
      setError("");
      setCameraError("");
      setScannedData(null);

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setScanning(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("NotAllowedError") || message.includes("Permission")) {
        setCameraError(t(
          "카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.",
          "Camera permission denied. Please allow camera access in browser settings."
        ));
      } else if (message.includes("NotFoundError") || message.includes("DevicesNotFound")) {
        setCameraError(t(
          "카메라를 찾을 수 없습니다.",
          "No camera found on this device."
        ));
      } else {
        setCameraError(t(
          "카메라를 시작할 수 없습니다: " + message,
          "Cannot start camera: " + message
        ));
      }
    }
  };

  // Attach stream to video element after it renders in DOM
  useEffect(() => {
    if (!scanning || !streamRef.current) return;

    const attachStream = async () => {
      await new Promise((r) => setTimeout(r, 50));
      if (videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        try {
          await videoRef.current.play();
        } catch (e) {
          console.error("Video play failed:", e);
        }
      }
    };

    attachStream();
  }, [scanning]);

  // QR detection loop using jsQR
  useEffect(() => {
    if (!scanning) return;

    const scanFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        animFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        animFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code && code.data) {
        const tokenMatch = code.data.match(/\/athlete\/([a-f0-9-]+)/);
        if (tokenMatch) {
          stopScanning();
          lookupAthlete(tokenMatch[1]);
          return;
        }
      }

      animFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animFrameRef.current = requestAnimationFrame(scanFrame);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [scanning, stopScanning]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

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

  const statusBadge = (status: string) => {
    if (status === "approved") return { cls: "bg-green-100 text-green-700", label: t("승인됨", "Approved") };
    if (status === "pending") return { cls: "bg-yellow-100 text-yellow-700", label: t("심사중", "Pending") };
    return { cls: "bg-red-100 text-red-700", label: t("반려됨", "Rejected") };
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <h1 className="text-xl font-bold text-gray-900 mb-4">{t("QR 스캔", "QR Scan")}</h1>

      {cameraError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 mb-4">
          <p className="font-medium mb-1">{t("카메라 오류", "Camera Error")}</p>
          <p>{cameraError}</p>
        </div>
      )}

      {!scannedData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          {scanning ? (
            <div className="relative">
              <video ref={videoRef} className="w-full aspect-square object-cover" playsInline muted autoPlay />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-lg" />
                </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button onClick={stopScanning} className="px-6 py-2.5 bg-red-500 text-white text-sm font-medium rounded-full shadow-lg">
                  {t("중지", "Stop")}
                </button>
              </div>
              <p className="absolute top-4 left-0 right-0 text-center text-white text-xs font-medium drop-shadow-lg">
                {t("QR 코드를 사각형 안에 맞춰주세요", "Align QR code within the frame")}
              </p>
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
              <button onClick={startScanning} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
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
                    {scannedData.profile.nationality} {"·"} {scannedData.profile.team || "-"}
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
                <span className={"px-3 py-1 rounded-full text-xs font-semibold " + statusBadge(scannedData.registration.status).cls}>
                  {statusBadge(scannedData.registration.status).label}
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
