"use client";

import VisaSection from "@/sections/VisaSection";
import PageHeader from "@/components/PageHeader";
import SeasonEndedBanner from "@/components/SeasonEndedBanner";
import { useI18n } from "@/lib/i18n/context";

export default function VisaPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader
        kicker={t("nav.groupParticipate")}
        title={t("pageHeader.visaTitle")}
        subtitle={t("pageHeader.visaSubtitle")}
      />
      <SeasonEndedBanner />
      <VisaSection hideHeader />
    </>
  );
}
