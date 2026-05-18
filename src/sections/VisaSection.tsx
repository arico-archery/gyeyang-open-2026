"use client";

import { useI18n } from "@/lib/i18n/context";

export default function VisaSection() {
  const { t } = useI18n();
  return (
    <section id="visa" className="py-20 lg:py-28 bg-white scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="section-tag mb-9">
          <span className="tag-num">03</span>
          <span>{t("visa.sectionTag")}</span>
        </div>

        <div className="bg-pink-50 rounded-2xl p-10 lg:p-14">
          <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-7 tracking-tight">{t("visa.heading")}</h3>

          <div className="space-y-5">
            <p className="body-text-lg text-slate-700">{t("visa.desc1")}</p>
            <p className="body-text-lg text-slate-700">{t("visa.desc2")}</p>
            <p className="body-text-lg text-slate-700">{t("visa.desc3")}</p>
            <ol className="list-decimal list-outside space-y-3 pl-6 text-[16px] text-slate-700 leading-relaxed">
              <li>{t("visa.step1")}</li>
              <li>
                {t("visa.step2Pre")}
                <a
                  href="mailto:gyeyangopen@gmail.com"
                  className="link"
                >
                  gyeyangopen@gmail.com
                </a>
                {t("visa.step2Post")}
              </li>
            </ol>
            <p className="body-text-lg text-slate-700">{t("visa.desc4")}</p>
            <p className="body-text-lg text-slate-700">{t("visa.desc5")}</p>
          </div>

          <div className="mt-10 pt-10 border-t border-pink-200">
            <h4 className="text-xl lg:text-2xl font-bold text-slate-900 mb-5 tracking-tight">
              {t("visa.ketaTitle")}
            </h4>
            <div className="space-y-5">
              <p className="body-text-lg text-slate-700">{t("visa.ketaDesc1")}</p>
              <p className="body-text-lg text-slate-700">{t("visa.ketaDesc2")}</p>
              <div className="callout callout-warning">
                <strong>⚠ </strong>{t("visa.ketaWarning")}
              </div>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="https://www.k-eta.go.kr/portal/apply/index.do"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-download"
              >
                {t("visa.applyKeta")}
              </a>
              <a
                href="https://www.k-eta.go.kr/portal/guide/viewetaalification.do"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-download"
              >
                {t("visa.checkEligibility")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
