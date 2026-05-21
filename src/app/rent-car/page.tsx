"use client";

import RentCarSection from "@/sections/RentCarSection";
import PageHeader from "@/components/PageHeader";
import SeasonEndedBanner from "@/components/SeasonEndedBanner";
import { useI18n } from "@/lib/i18n/context";

export default function RentCarPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader
        kicker={t("nav.groupParticipate")}
        title={t("pageHeader.rentcarTitle")}
        subtitle={t("pageHeader.rentcarSubtitle")}
      />
      <SeasonEndedBanner />
      <RentCarSection hideHeader />
    </>
  );
}
