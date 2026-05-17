"use client";

import { useI18n } from "@/lib/i18n/context";

import Image from "next/image";

export default function ContactSection() {
  const { t } = useI18n();
  return (
    <section id="contact" className="py-16 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="section-tag mb-8">
          <span className="tag-num">06</span>
          <span>{t("contact.sectionTag")}</span>
        </div>

        <div className="bg-blue-600 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
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

          <h3 className="text-2xl font-bold mb-6">{t("contact.heading")}</h3>

          <ul className="space-y-3 text-lg">
            <li>
              <span className="font-bold">{t("contact.name")}</span> Vivian
            </li>
            <li>
              <span className="font-bold">{t("contact.whatsapp")}</span> +82-10-2124-0016 {t("contact.whatsappNote")}
            </li>
            <li>
              <span className="font-bold">{t("contact.email")}</span>{" "}
              <a
                href="mailto:gyeyangopen@gmail.com"
                className="underline hover:text-blue-200"
              >
                gyeyangopen@gmail.com
              </a>
            </li>
            <li>
              <span className="font-bold">{t("contact.website")}</span>{" "}
              <a
                href="https://www.gyeyangopen.kr"
                className="underline hover:text-blue-200"
              >
                www.gyeyangopen.kr
              </a>
            </li>
            <li>
              <span className="font-bold">{t("contact.language")}</span> {t("contact.languageVal")}
            </li>
          </ul>

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
