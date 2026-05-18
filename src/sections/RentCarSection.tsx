"use client";

import { useI18n } from "@/lib/i18n/context";

import Image from "next/image";

function getRentalCompanies(t: (key: string) => string) {
  return [
    { name: t("rentcar.woori"), address: t("rentcar.wooriAddr"), contact: "+82-32-426-9500" },
    { name: t("rentcar.geumgang"), address: t("rentcar.geumgangAddr"), contact: "+82-32-547-8777" },
    { name: t("rentcar.amazon"), address: t("rentcar.amazonAddr"), contact: "+82-32-554-8820" },
    { name: t("rentcar.lotte"), address: t("rentcar.lotteAddr"), contact: "+82-32-679-8000" },
    { name: t("rentcar.redcap"), address: t("rentcar.redcapAddr"), contact: "+82-32-523-3771" },
  ];
}

interface RentCarSectionProps {
  hideHeader?: boolean;
}

export default function RentCarSection({ hideHeader }: RentCarSectionProps = {}) {
  const { t } = useI18n();
  const RENTAL_COMPANIES = getRentalCompanies(t);
  return (
    <section id="rent-car" className="py-16 lg:py-20 bg-white scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4">
        {!hideHeader && (
          <>
            <div className="section-tag mb-9">
              <span className="tag-num">05</span>
              <span>{t("rentcar.sectionTag")}</span>
            </div>

            <h3 className="text-2xl lg:text-3xl font-bold text-center text-slate-900 mb-12 tracking-tight">
              {t("rentcar.heading")}
            </h3>
          </>
        )}

        {/* Rental Car Table */}
        <div className="info-card">
          <h4 className="text-xl font-bold text-slate-900 mb-5 tracking-tight">
            {t("rentcar.rentalInfo")}
          </h4>
          <p className="body-text mb-6">
            {t("rentcar.rentalDesc")}
          </p>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("rentcar.companyName")}</th>
                  <th>{t("rentcar.address")}</th>
                  <th>{t("rentcar.contactCol")}</th>
                </tr>
              </thead>
              <tbody>
                {RENTAL_COMPANIES.map((company, i) => (
                  <tr key={i}>
                    <td className="font-medium">{company.name}</td>
                    <td className="text-gray-600">{company.address}</td>
                    <td className="whitespace-nowrap">{company.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-2 text-[15px] text-slate-700 leading-relaxed">
            <p>{t("rentcar.inquiry")} <a href="mailto:gyeyangopen@gmail.com" className="link">gyeyangopen@gmail.com</a></p>
            <p>{t("rentcar.referWebsite")} <a href="https://www.gyeyangopen.com" target="_blank" rel="noopener noreferrer" className="link">www.gyeyangopen.com</a></p>
            <p>{t("rentcar.privateVehicle")}</p>
          </div>
        </div>

        {/* TABA App */}
        <div className="info-card">
          <h4 className="text-xl font-bold text-slate-900 mb-5 tracking-tight">
            {t("rentcar.tabaTitle")}
          </h4>
          <p className="body-text mb-5">
            {t("rentcar.tabaDesc")}
          </p>
          <div className="grid grid-cols-2 gap-4 my-6">
            <Image src="/images/taba1.png" alt="TABA App Screenshot 1" width={511} height={256} className="rounded-lg w-full h-auto" />
            <Image src="/images/taba2.png" alt="TABA App Screenshot 2" width={511} height={256} className="rounded-lg w-full h-auto" />
          </div>
          <a
            href="https://taba.taxi"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-download"
          >
            {t("rentcar.downloadTaba")}
          </a>
        </div>

        {/* International Taxi */}
        <div className="info-card">
          <h4 className="text-xl font-bold text-slate-900 mb-5 tracking-tight">
            {t("rentcar.intlTaxiTitle")}
          </h4>
          <p className="body-text mb-5">
            {t("rentcar.intlTaxiDesc")}
          </p>
          <div className="space-y-2 text-[15px] text-slate-700 mb-6 leading-relaxed">
            <p>{t("rentcar.intlTaxiNote1")}</p>
            <p>{t("rentcar.intlTaxiNote2")}</p>
            <p>
              {t("rentcar.bookingSite")}{" "}
              <a
                href="https://ktaxi.net"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                https://ktaxi.net
              </a>
            </p>
          </div>
          <Image src="/images/taxi.png" alt="International Taxi Photo" width={1039} height={256} className="rounded-lg w-full h-auto" />
        </div>
      </div>
    </section>
  );
}
