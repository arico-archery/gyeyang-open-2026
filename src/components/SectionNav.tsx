"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

const SECTIONS = [
  { id: "schedule", key: "sectionNav.schedule" },
  { id: "registration", key: "sectionNav.registration" },
  { id: "visa", key: "sectionNav.visa" },
  { id: "hotel", key: "sectionNav.hotel" },
  { id: "rent-car", key: "sectionNav.rentcar" },
  { id: "contact", key: "sectionNav.contact" },
];

export default function SectionNav() {
  const [active, setActive] = useState("");
  const { t } = useI18n();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="section-nav sticky top-[72px] z-40 bg-white/95 border-b border-slate-200 backdrop-blur-sm">
      {/* Desktop: centered single row, no numbers — clean */}
      <div className="hidden md:flex justify-center max-w-7xl mx-auto">
        {SECTIONS.map(({ id, key }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`px-7 py-3.5 text-[14px] font-semibold transition-colors border-b-2 ${
              active === id
                ? "text-blue-600 border-blue-600"
                : "text-slate-500 border-transparent hover:text-slate-900"
            }`}
          >
            {t(key)}
          </button>
        ))}
      </div>
      {/* Mobile: horizontal scroll */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max">
          {SECTIONS.map(({ id, key }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`px-5 py-3 text-[13px] font-semibold whitespace-nowrap transition-colors border-b-2 ${
                active === id
                  ? "text-blue-600 border-blue-600"
                  : "text-slate-500 border-transparent hover:text-slate-900"
              }`}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
