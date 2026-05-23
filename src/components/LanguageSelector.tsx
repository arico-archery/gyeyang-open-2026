"use client";

import Image from "next/image";
import { useState } from "react";
import { useI18n, type Locale } from "@/lib/i18n/context";

/** Inline 30:20 PRC flag — kept as SVG so we don't ship another PNG. */
function CnFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#DE2910" />
      <g fill="#FFDE00">
        <polygon points="5,3 5.95,5.85 8.95,5.85 6.5,7.65 7.45,10.5 5,8.7 2.55,10.5 3.5,7.65 1.05,5.85 4.05,5.85" />
        <polygon points="10,1.5 10.32,2.46 11.32,2.46 10.5,3.05 10.82,4 10,3.4 9.18,4 9.5,3.05 8.68,2.46 9.68,2.46" />
        <polygon points="12,4 12.32,4.96 13.32,4.96 12.5,5.55 12.82,6.5 12,5.9 11.18,6.5 11.5,5.55 10.68,4.96 11.68,4.96" />
        <polygon points="12,7 12.32,7.96 13.32,7.96 12.5,8.55 12.82,9.5 12,8.9 11.18,9.5 11.5,8.55 10.68,7.96 11.68,7.96" />
        <polygon points="10,9.5 10.32,10.46 11.32,10.46 10.5,11.05 10.82,12 10,11.4 9.18,12 9.5,11.05 8.68,10.46 9.68,10.46" />
      </g>
    </svg>
  );
}

/** Inline 30:20 Japanese flag — Hinomaru. */
function JpFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#FFFFFF" />
      <circle cx="15" cy="10" r="6" fill="#BC002D" />
    </svg>
  );
}

/** Render the flag for the given locale at a given size class. */
function Flag({ locale, className }: { locale: Locale; className: string }) {
  if (locale === "zh") return <CnFlag className={className} />;
  if (locale === "ja") return <JpFlag className={className} />;
  return (
    <Image
      src={locale === "en" ? "/images/flag_us.png" : "/images/flag_kr.png"}
      alt={locale === "en" ? "English" : "한국어"}
      width={28}
      height={20}
      className={className}
    />
  );
}

const OPTIONS: { code: Locale; label: string }[] = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
  { code: "zh", label: "简体中文" },
  { code: "ja", label: "日本語" },
];

interface Props {
  /** Visual size — "md" = 32px (homepage header), "sm" = 28px (compact app header). */
  size?: "sm" | "md";
  /** Override the dropdown horizontal alignment relative to the button. */
  align?: "left" | "right";
}

/**
 * Shared language selector — flag button that opens a dark dropdown listing
 * all supported languages. Used in both the marketing site Header and the
 * participant app home so the language picker behaves identically across
 * the two surfaces.
 */
export default function LanguageSelector({ size = "md", align = "right" }: Props) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);

  const buttonSize = size === "sm" ? "w-8 h-8" : "w-8 h-8";
  const flagSize = size === "sm" ? "w-6 h-4" : "w-7 h-5";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${buttonSize} rounded-full overflow-hidden border-2 border-slate-200 hover:border-slate-400 transition-colors flex items-center justify-center bg-slate-50`}
        aria-label="Select language"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Flag locale={locale} className={`${flagSize} object-cover rounded-sm`} />
      </button>

      {open && (
        <>
          {/* Click-outside backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            role="menu"
            className={`absolute ${align === "right" ? "right-0" : "left-0"} top-10 z-50 bg-[#1a1a1a] rounded-lg shadow-xl py-2 min-w-[160px]`}
          >
            {OPTIONS.map((o) => (
              <button
                key={o.code}
                role="menuitemradio"
                aria-checked={locale === o.code}
                onClick={() => {
                  setLocale(o.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#2a2a2a] transition-colors ${
                  locale === o.code ? "bg-[#2a2a2a]" : ""
                }`}
              >
                <Flag locale={o.code} className="w-7 h-5 shrink-0 rounded-sm" />
                <span className="text-white text-sm font-medium">{o.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
