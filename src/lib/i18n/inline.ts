"use client";

import { useCallback } from "react";
import { useI18n } from "./context";

/**
 * Inline translation helper for app pages.
 *
 * Usage:
 *   const t = useInlineT();
 *   t("닫기", "Close", "关闭", "閉じる")
 *
 * Both `zh` and `ja` arguments are optional — if omitted (or empty), the
 * Chinese / Japanese locales fall back to the English string. This lets
 * us add languages incrementally without touching every call site.
 *
 * This replaces the per-file inline:
 *   const t = (ko: string, en: string) => locale === "ko" ? ko : en;
 */
export function useInlineT() {
  const { locale } = useI18n();
  return useCallback(
    (ko: string, en: string, zh?: string, ja?: string): string => {
      if (locale === "ko") return ko;
      if (locale === "zh") return zh && zh.length > 0 ? zh : en;
      if (locale === "ja") return ja && ja.length > 0 ? ja : en;
      return en;
    },
    [locale]
  );
}
