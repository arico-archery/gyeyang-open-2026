"use client";

import { useI18n } from "@/lib/i18n/context";

export default function RegistrationSection() {
  const { t } = useI18n();
  return (
    <section id="registration" className="py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="section-tag mb-9">
          <span className="tag-num">02</span>
          <span>{t("registration.title")}</span>
        </div>

        {/* Important Dates */}
        <div className="info-card">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">{t("registration.importantDates")}</h3>
          <ul className="clean-list">
            <li>{t("registration.regOpens")}</li>
            <li>{t("registration.finalDeadline")}</li>
            <li>{t("registration.invoicePayment")}</li>
            <li>{t("registration.refundDeadline")}</li>
            <li>{t("registration.visaDeadline")}</li>
          </ul>
        </div>

        {/* Athlete Registration */}
        <div className="info-card">
          <h3 className="text-2xl font-bold text-slate-900 mb-5 tracking-tight">{t("registration.athleteReg")}</h3>
          <p className="body-text mb-4">
            {t("registration.athleteDesc1")}
          </p>
          <p className="body-text mb-4">
            {t("registration.athleteDesc2")}
          </p>
          <div className="callout callout-info">
            {t("registration.athleteNote1")}
          </div>
          <p className="body-text mb-4">
            {t("registration.athleteDesc3")}
          </p>
          <p className="text-[14px] text-slate-500 mb-7 leading-relaxed">
            {t("registration.athleteContact")}
          </p>
          <a
            href="https://extranet.worldarchery.sport/wareos/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-download"
          >
            {t("registration.goWareos")}
          </a>
        </div>

        {/* Official/Coach Registration */}
        <div className="info-card">
          <h3 className="text-2xl font-bold text-slate-900 mb-5 tracking-tight">
            {t("registration.officialReg")}
          </h3>
          <p className="body-text mb-5">
            {t("registration.officialDesc")}
          </p>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">{t("registration.onsiteReg")}</h4>
          <p className="body-text mb-7">
            {t("registration.onsiteDesc")}
          </p>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLScPPmdgPoG0of0x3DT1cbZsnzhMXL-ENhnoNUzx-04aaW6fMQ/viewform" target="_blank" rel="noopener noreferrer" className="btn-download">
            {t("registration.preregForm")}
          </a>
        </div>

        {/* Entry Fee */}
        <div className="info-card">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">{t("registration.entryFee")}</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("registration.category")}</th>
                <th>{t("registration.feeUsd")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t("registration.individualAthlete")}</td>
                <td className="font-semibold text-slate-900">{t("registration.individualFee")}</td>
              </tr>
              <tr>
                <td>{t("registration.officialCoach")}</td>
                <td className="font-semibold text-slate-900">{t("registration.officialFee")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Terms */}
        <div className="info-card">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">{t("registration.paymentTerms")}</h3>
          <ul className="clean-list">
            <li>{t("registration.paymentTerm1")}</li>
            <li>{t("registration.paymentTerm2")}</li>
            <li>{t("registration.paymentTerm3")}</li>
          </ul>
          <div className="callout callout-warning mt-5">
            {t("registration.paymentNote")}
          </div>
        </div>

        {/* Bank Info */}
        <div className="info-card">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">{t("registration.bankInfo")}</h3>
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
            <div className="sm:col-span-2">
              <dt className="section-label mb-1">{t("registration.accountName")}</dt>
              <dd className="text-[15px] font-semibold text-slate-900">{t("registration.accountNameVal")}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="section-label mb-1">{t("registration.clubAddress")}</dt>
              <dd className="text-[15px] text-slate-700">{t("registration.clubAddressVal")}</dd>
            </div>
            <div>
              <dt className="section-label mb-1">{t("registration.phoneNumber")}</dt>
              <dd className="value-mono text-[15px]">{t("registration.phoneNumberVal")}</dd>
            </div>
            <div>
              <dt className="section-label mb-1">{t("registration.cityCountry")}</dt>
              <dd className="text-[15px] text-slate-700">{t("registration.cityCountryVal")}</dd>
            </div>
          </dl>
          <hr className="my-7 border-slate-200" />
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <dt className="section-label mb-1">{t("registration.bankName")}</dt>
              <dd className="text-[15px] font-semibold text-slate-900">{t("registration.bankNameVal")}</dd>
            </div>
            <div>
              <dt className="section-label mb-1">{t("registration.accountNumber")}</dt>
              <dd className="value-mono text-[15px]">{t("registration.accountNumberVal")}</dd>
            </div>
            <div>
              <dt className="section-label mb-1">{t("registration.swiftCode")}</dt>
              <dd className="value-mono text-[15px]">{t("registration.swiftCodeVal")}</dd>
            </div>
            <div>
              <dt className="section-label mb-1">{t("registration.bankPhone")}</dt>
              <dd className="value-mono text-[15px]">{t("registration.bankPhoneVal")}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="section-label mb-1">{t("registration.bankAddress")}</dt>
              <dd className="text-[15px] text-slate-700">{t("registration.bankAddressVal")}</dd>
            </div>
            <div>
              <dt className="section-label mb-1">{t("registration.city")}</dt>
              <dd className="text-[15px] text-slate-700">{t("registration.cityVal")}</dd>
            </div>
          </dl>
          <div className="callout callout-warning mt-6">
            {t("registration.bankNote")}
          </div>
        </div>
      </div>
    </section>
  );
}
