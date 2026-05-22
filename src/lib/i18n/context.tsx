"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { en } from "./translations/en";
import { ko } from "./translations/ko";
import { zh } from "./translations/zh";

export type Locale = "en" | "ko" | "zh";
type Translations = typeof en;

const dictionaries: Record<Locale, Translations> = { en, ko, zh };

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

function isValidLocale(v: unknown): v is Locale {
  return v === "ko" || v === "en" || v === "zh";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, _setLocale] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("locale");
      if (isValidLocale(saved)) return saved;
    }
    return "ko";
  });

  const setLocale = useCallback((l: Locale) => {
    _setLocale(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", l);
    }
  }, []);

  // Lookup with English fallback: zh.ts only defines the strings actually
  // translated. Anything missing falls back to English (never a raw key).
  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".");
      const fromDict = (dict: Translations): string | undefined => {
        let value: unknown = dict;
        for (const k of keys) {
          if (value && typeof value === "object") {
            value = (value as Record<string, unknown>)[k];
          } else {
            return undefined;
          }
        }
        return typeof value === "string" ? value : undefined;
      };
      return fromDict(dictionaries[locale]) ?? fromDict(en) ?? key;
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
