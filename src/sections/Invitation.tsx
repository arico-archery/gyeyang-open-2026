"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";

export default function Invitation() {
  const { t } = useI18n();

  return (
    <section className="invitation-section">
      <div className="max-w-3xl mx-auto px-4 py-20 lg:py-24">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-12 tracking-tight">
          {t("invitation.title")}
        </h2>
        <div className="space-y-6">
          <p className="text-lg font-semibold text-slate-900">{t("invitation.greeting")}</p>
          <p className="body-text-lg">{t("invitation.body1")}</p>
          <p className="body-text-lg">{t("invitation.body2")}</p>
          <p className="body-text-lg">{t("invitation.body3")}</p>
          <p className="body-text-lg">{t("invitation.body4")}</p>
          <p className="body-text-lg">{t("invitation.body5")}</p>
          <p className="body-text-lg">{t("invitation.body6")}</p>
        </div>
        <div className="mt-12 text-right">
          <p className="text-base font-semibold text-slate-900">{t("invitation.organizer")}</p>
          <p className="mt-1 text-xl font-bold text-slate-800">{t("invitation.chairperson")}</p>
          <Image
            src="/images/signature.png"
            alt="Signature"
            width={150}
            height={60}
            className="ml-auto mt-2"
          />
        </div>
        <div className="flex justify-center mt-12">
          {/* TODO: replace with 2026 invitation PDF re-uploaded under /public/downloads/ */}
          <a
            href="https://www.gyeyangopen.kr/downloads//2025%20GYEYANG%20OPEN_Invitation%20Package%20(EN).pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-download btn-download-dark"
          >
            {t("invitation.download")}
          </a>
        </div>
      </div>
    </section>
  );
}
