"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";

export default function Invitation() {
  const { t } = useI18n();

  return (
    <section id="invitation" className="bg-slate-50 py-20 lg:py-28 scroll-mt-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Simple section label */}
        <p className="text-center section-label mb-4">Invitation</p>
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-14 tracking-tight">
          {t("invitation.title")}
        </h2>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 lg:p-14">
          <div className="space-y-6">
            <p className="text-lg font-semibold text-slate-900">{t("invitation.greeting")}</p>
            <p className="body-text-lg">{t("invitation.body1")}</p>
            <p className="body-text-lg">{t("invitation.body2")}</p>
            <p className="body-text-lg">{t("invitation.body3")}</p>
            <p className="body-text-lg">{t("invitation.body4")}</p>
            <p className="body-text-lg">{t("invitation.body5")}</p>
            <p className="body-text-lg">{t("invitation.body6")}</p>
          </div>

          {/* Signature — separated by divider */}
          <div className="mt-10 pt-8 border-t border-slate-100 text-right">
            <p className="text-sm text-slate-500 mb-2">{t("invitation.organizer")}</p>
            <p className="text-2xl font-bold text-slate-900">{t("invitation.chairperson")}</p>
            <Image
              src="/images/signature.png"
              alt="Signature"
              width={150}
              height={60}
              className="ml-auto mt-3"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
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
