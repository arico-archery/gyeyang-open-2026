"use client";

import ContactSection from "@/sections/ContactSection";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/i18n/context";

export default function ContactPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader
        kicker="LOC"
        title={t("pageHeader.contactTitle")}
        subtitle={t("pageHeader.contactSubtitle")}
      />
      <ContactSection hideHeader />
    </>
  );
}
