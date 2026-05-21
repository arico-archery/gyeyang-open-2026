"use client";

import RegistrationSection from "@/sections/RegistrationSection";
import PageHeader from "@/components/PageHeader";
import SeasonEndedBanner from "@/components/SeasonEndedBanner";
import { useI18n } from "@/lib/i18n/context";

export default function RegistrationPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader
        kicker={t("nav.groupParticipate")}
        title={t("pageHeader.registrationTitle")}
        subtitle={t("pageHeader.registrationSubtitle")}
      />
      <SeasonEndedBanner />
      <RegistrationSection hideHeader />
    </>
  );
}
