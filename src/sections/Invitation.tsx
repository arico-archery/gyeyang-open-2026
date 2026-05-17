"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";

export default function Invitation() {
  const { t } = useI18n();

  return (
    <section className="invitation-section">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-10">
          {t("invitation.title")}
        </h2>
        <div className="space-y-5 text-gray-600 leading-relaxed">
          <p className="font-semibold">{t("invitation.greeting")}</p>
          <p>{t("invitation.body1")}</p>
          <p>{t("invitation.body2")}</p>
          <p>{t("invitation.body3")}</p>
          <p>{t("invitation.body4")}</p>
          <p>{t("invitation.body5")}</p>
          <p>{t("invitation.body6")}</p>
        </div>
        <div className="mt-10 text-right">
          <p className="font-semibold text-gray-800">{t("invitation.organizer")}</p>
          <p className="mt-1 text-gray-700">{t("invitation.chairperson")}</p>
          <Image
            src="/images/signature.png"
            alt="Signature"
            width={150}
            height={60}
            className="ml-auto mt-2"
          />
        </div>
        <div className="flex justify-center mt-12">
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
