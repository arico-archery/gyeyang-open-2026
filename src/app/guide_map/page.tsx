"use client";

import Image from "next/image";
export default function GuideMapPage() {
  return (
    <div className="bg-blue-600 min-h-screen py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* Section 1: Asiad Archery Field */}
        <section>
          <Image
            src="/images/asiad1.jpg"
            alt="Gyeyang Asiad Archery Field Guide Map"
            width={1200}
            height={1692}
            className="w-full h-auto"
          />
        </section>

        {/* Section 2: Araon Suhyangwon */}
        <section>
          <Image
            src="/images/araon_guide_map.jpg"
            alt="Gyeyang Araon Suhyangwon Guide Map"
            width={1692}
            height={1200}
            className="w-full h-auto"
          />
        </section>

      </div>
    </div>
  );
}
