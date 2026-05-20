"use client";

import { useI18n } from "@/lib/i18n/context";

export default function ThankYou() {
  const { t } = useI18n();
  return (
    <section className="bg-blue-600 text-white py-16 lg:py-20 relative overflow-hidden">
      {/* Decorative concentric rings (target motif) */}
      <div className="absolute -right-32 -top-32 w-[520px] h-[520px] rounded-full border-[2px] border-white/10 pointer-events-none" />
      <div className="absolute -right-16 -top-16 w-[360px] h-[360px] rounded-full border-[2px] border-white/10 pointer-events-none" />
      <div className="absolute right-12 top-12 w-[180px] h-[180px] rounded-full border-[2px] border-white/15 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-blue-200 mb-4">
          {t("thanks.kicker")}
        </p>
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight mb-10">
          {t("thanks.title")}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 border border-white/15">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-blue-200 mb-3">
              {t("thanks.athletesLabel")}
            </p>
            <p className="text-[15px] leading-[1.85]">{t("thanks.athletesBody")}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 border border-white/15">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-blue-200 mb-3">
              {t("thanks.staffLabel")}
            </p>
            <p className="text-[15px] leading-[1.85]">{t("thanks.staffBody")}</p>
          </div>
        </div>

        <p className="mt-10 text-right text-[15px] font-semibold text-blue-100">
          — {t("thanks.signature")}
        </p>
      </div>
    </section>
  );
}
