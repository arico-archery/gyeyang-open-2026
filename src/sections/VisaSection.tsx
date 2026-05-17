"use client";

import { useI18n } from "@/lib/i18n/context";

export default function VisaSection() {
  const { t } = useI18n();
  return (
    <section id="visa" className="py-16 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="section-tag mb-8">
          <span className="tag-num">03</span>
          <span>{t("visa.sectionTag")}</span>
        </div>

        <div className="bg-pink-50 rounded-2xl p-8 lg:p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{t("visa.heading")}</h3>

          <div className="space-y-4 text-gray-700">
            <p>{t("visa.desc1")}</p>
            <p>{t("visa.desc2")}</p>
            <p>{t("visa.desc3")}</p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>{t("visa.step1")}</li>
              <li>
                {t("visa.step2Pre")}
                <a
                  href="mailto:gyeyangopen@gmail.com"
                  className="text-primary underline font-medium"
                >
                  gyeyangopen@gmail.com
                </a>
                {t("visa.step2Post")}
              </li>
            </ol>
            <p>{t("visa.desc4")}</p>
            <p>{t("visa.desc5")}</p>
          </div>

          <div className="mt-8 pt-8 border-t border-pink-200">
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              {t("visa.ketaTitle")}
            </h4>
            <div className="space-y-4 text-gray-700">
              <p>{t("visa.ketaDesc1")}</p>
              <p>{t("visa.ketaDesc2")}</p>
              <p className="text-amber-700 font-medium">
                ⚠ {t("visa.ketaWarning")}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
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
