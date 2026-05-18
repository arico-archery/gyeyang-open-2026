"use client";

import HotelSection from "@/sections/HotelSection";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/i18n/context";

export default function HotelPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader
        kicker={t("nav.groupParticipate")}
        title={t("pageHeader.hotelTitle")}
        subtitle={t("pageHeader.hotelSubtitle")}
      />
      <HotelSection hideHeader />
    </>
  );
}
