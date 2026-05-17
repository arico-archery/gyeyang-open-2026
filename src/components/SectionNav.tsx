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
    <nav className="section-nav sticky top-16 z-40 bg-white border-b border-gray-200">
      <div className="grid grid-cols-6">
        {SECTIONS.map(({ id, key }, index) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`flex flex-col items-center py-4 transition-colors border-b-[3px] ${
              active === id
                ? "text-blue-600 border-blue-600 bg-blue-50"
                : "text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className={`text-xs font-medium mb-0.5 ${active === id ? "text-blue-600" : "text-gray-300"}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-sm font-medium">{t(key)}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}