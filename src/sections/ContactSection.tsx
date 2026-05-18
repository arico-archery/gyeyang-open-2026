"use client";

import { useI18n } from "@/lib/i18n/context";

import Image from "next/image";

export default function ContactSection() {
  const { t } = useI18n();
  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="section-tag mb-9">
          <span className="tag-num">06</span>
          <span>{t("contact.sectionTag")}</span>
        </div>

        <div className="bg-blue-600 rounded-3xl p-10 lg:p-14 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-4 right-4 opacity-20">
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 border-2 border-white rounded-lg"
                />
              ))}
            </div>
          </div>

          <h3 className="text-3xl font-bold mb-8 tracking-tight">{t("contact.heading")}</h3>

          <dl className="space-y-5 text-[17px] leading-relaxed relative">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <dt className="font-bold w-32 shrink-0 text-blue-100">{t("contact.name")}</dt>
              <dd>Vivian</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <dt className="font-bold w-32 shrink-0 text-blue-100">{t("contact.whatsapp")}</dt>
              <dd>+82-10-2124-0016 <span className="text-blue-200 text-[14px]">{t("contact.whatsappNote")}</span></dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <dt className="font-bold w-32 shrink-0 text-blue-100">{t("contact.email")}</dt>
              <dd>
                <a
                  href="mailto:gyeyangopen@gmail.com"
                  className="underline underline-offset-4 hover:text-blue-200"
                >
                  gyeyangopen@gmail.com
                </a>
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <dt className="font-bold w-32 shrink-0 text-blue-100">{t("contact.website")}</dt>
              <dd>
                <a
                  href="https://www.gyeyangopen.com"
                  className="underline underline-offset-4 hover:text-blue-200"
                >
                  www.gyeyangopen.com
                </a>
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <dt className="font-bold w-32 shrink-0 text-blue-100">{t("contact.language")}</dt>
              <dd>{t("contact.languageVal")}</dd>
            </div>
          </dl>

          {/* QR Code */}
          <div className="mt-8 bg-white rounded-xl p-6 text-center max-w-xs">
            <p className="text-sm text-gray-500 font-medium">{t("contact.qrTitle")}</p>
            <p className="text-xs text-gray-400 mb-3">{t("contact.qrSubtitle")}</p>
            <Image src="/images/qrcode.jpeg" alt="LOC QR Code" width={128} height={128} className="mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
