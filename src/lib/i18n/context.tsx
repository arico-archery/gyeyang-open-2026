"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { en } from "./translations/en";
import { ko } from "./translations/ko";

export type Locale = "en" | "ko";
type Translations = typeof en;

const dictionaries: Record<Locale, Translations> = { en, ko };

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "ko",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ko");

  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".");
      let value: unknown = dictionaries[locale];
      for (const k of keys) {
        if (value && typeof value === "object") {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }
      return typeof value === "string" ? value : key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
