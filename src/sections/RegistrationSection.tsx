"use client";

import { useI18n } from "@/lib/i18n/context";

export default function RegistrationSection() {
  const { t } = useI18n();
  return (
    <section id="registration" className="py-16 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="section-tag mb-8">
          <span className="tag-num">02</span>
          <span>{t("registration.title")}</span>
        </div>

        {/* Important Dates */}
        <div className="info-card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t("registration.importantDates")}</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {t("registration.regOpens")}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {t("registration.finalDeadline")}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {t("registration.invoicePayment")}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {t("registration.refundDeadline")}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {t("registration.visaDeadline")}
            </li>
          </ul>
        </div>

        {/* Athlete Registration */}
        <div className="info-card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t("registration.athleteReg")}</h3>
          <p className="text-gray-600 mb-4">
            {t("registration.athleteDesc1")}
          </p>
          <p className="text-gray-600 mb-4">
            {t("registration.athleteDesc2")}
          </p>
          <p className="text-gray-600 mb-4 text-sm">
            {t("registration.athleteNote1")}
          </p>
          <p className="text-gray-600 mb-4">
            {t("registration.athleteDesc3")}
          </p>
          <p className="text-gray-600 mb-6 text-sm">
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
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {t("registration.officialReg")}
          </h3>
          <p className="text-gray-600 mb-4">
            {t("registration.officialDesc")}
          </p>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">{t("registration.onsiteReg")}</h4>
          <p className="text-gray-600 mb-6">
            {t("registration.onsiteDesc")}
          </p>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLScPPmdgPoG0of0x3DT1cbZsnzhMXL-ENhnoNUzx-04aaW6fMQ/viewform" target="_blank" rel="noopener noreferrer" className="btn-download">
            {t("registration.preregForm")}
          </a>
        </div>

        {/* Entry Fee */}
        <div className="info-card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t("registration.entryFee")}</h3>
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
                <td className="font-semibold">{t("registration.individualFee")}</td>
              </tr>
              <tr>
                <td>{t("registration.officialCoach")}</td>
                <td className="font-semibold">{t("registration.officialFee")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Terms */}
        <div className="info-card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t("registration.paymentTerms")}</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {t("registration.paymentTerm1")}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {t("registration.paymentTerm2")}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {t("registration.paymentTerm3")}
            </li>
          </ul>
          <p className="text-gray-600 mt-4 text-sm">
            {t("registration.paymentNote")}
          </p>
        </div>

        {/* Bank Info */}
        <div className="info-card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t("registration.bankInfo")}</h3>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-semibold">{t("registration.accountName")}</span> {t("registration.accountNameVal")}</p>
            <p><span className="font-semibold">{t("registration.clubAddress")}</span> {t("registration.clubAddressVal")}</p>
            <p><span className="font-semibold">{t("registration.phoneNumber")}</span> {t("registration.phoneNumberVal")}</p>
            <p><span className="font-semibold">{t("registration.cityCountry")}</span> {t("registration.cityCountryVal")}</p>
            <hr className="my-3 border-gray-200" />
            <p><span className="font-semibold">{t("registration.bankName")}</span> {t("registration.bankNameVal")}</p>
            <p><span className="font-semibold">{t("registration.accountNumber")}</span> {t("registration.accountNumberVal")}</p>
            <p><span className="font-semibold">{t("registration.swiftCode")}</span> {t("registration.swiftCodeVal")}</p>
            <p><span className="font-semibold">{t("registration.bankAddress")}</span> {t("registration.bankAddressVal")}</p>
            <p><span className="font-semibold">{t("registration.bankPhone")}</span> {t("registration.bankPhoneVal")}</p>
            <p><span className="font-semibold">{t("registration.city")}</span> {t("registration.cityVal")}</p>
          </div>
          <p className="text-gray-600 mt-4 text-sm font-medium">
            {t("registration.bankNote")}
          </p>
        </div>
      </div>
    </section>
  );
}
