"use client";

import { useCallback } from "react";
import { useI18n } from "./context";

/**
 * Inline translation helper for app pages.
 *
 * Usage:
 *   const t = useInlineT();
 *   t("닫기", "Close", "关闭")
 *
 * The `zh` argument is optional — if omitted (or empty), the Chinese
 * locale falls back to the English string so existing 2-arg call sites
 * keep working until they're individually upgraded.
 *
 * This replaces the per-file inline:
 *   const t = (ko: string, en: string) => locale === "ko" ? ko : en;
 */
export function useInlineT() {
  const { locale } = useI18n();
  return useCallback(
    (ko: string, en: string, zh?: string): string => {
      if (locale === "ko") return ko;
      if (locale === "zh") return zh && zh.length > 0 ? zh : en;
      return en;
    },
    [locale]
  );
}
