"use client";

import Invitation from "@/sections/Invitation";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/i18n/context";

export default function InvitationPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader
        kicker={t("nav.groupAbout")}
        title={t("pageHeader.invitationTitle")}
        subtitle={t("pageHeader.invitationSubtitle")}
      />
      <Invitation hideHeader />
    </>
  );
}
