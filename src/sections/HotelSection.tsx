"use client";

import { useI18n } from "@/lib/i18n/context";

import Image from "next/image";

function getHotels(t: (key: string) => string) {
  return [
    {
      name: "THE CHARIS HOTEL",
      image: "/images/hotels/hotel_charis.jpeg",
      website: "http://www.hotelcharis.com",
      address: "28, Gyeyang-daero, Gyeyang-gu, Incheon",
      phone: ["+82-32-556-0880", "+82-10-3899-3240"],
      checkIn: "15:00",
      checkOut: "12:00",
      breakfast: t("hotel.breakfast15k"),
      amenities: t("hotel.coinLaundry"),
      rooms: [
        { type: t("hotel.stdDouble"), count: 22, beds: t("hotel.bed1"), rate: "KRW 180,000", discount: "KRW 70,000" },
        { type: t("hotel.stdTwin"), count: 48, beds: t("hotel.bed2"), rate: "KRW 180,000", discount: "KRW 70,000" },
        { type: t("hotel.deluxeDouble"), count: 42, beds: t("hotel.bed1"), rate: "KRW 260,000", discount: "KRW 80,000" },
      ],
    },
    {
      name: "THE SOULHADA HOTEL",
      image: "/images/hotels/hotel_topstay.jpeg",
      website: "http://topstay01.cafe24.com",
      address: "58, Gyeyangmunhwa-ro, Gyeyang-gu, Incheon",
      phone: ["+82-32-272-1700", "+82-10-4286-7895"],
      checkIn: "15:00",
      checkOut: "12:00",
      breakfast: t("hotel.breakfast15kDisc"),
      amenities: t("hotel.freeWasher"),
      rooms: [
        { type: t("hotel.deluxeCityView"), count: 36, beds: t("hotel.bed1"), rate: "KRW 100,000", discount: "KRW 70,000" },
        { type: t("hotel.deluxeBalcony"), count: 10, beds: t("hotel.bed1"), rate: "KRW 100,000", discount: "KRW 70,000" },
        { type: t("hotel.premiumRoom"), count: 15, beds: t("hotel.bed1"), rate: "KRW 120,000", discount: "KRW 90,000" },
      ],
    },
    {
      name: "HOTEL VOW",
      image: "/images/hotels/hotel_vow.jpeg",
      website: "http://www.hotelvow.com",
      address: "9, Gyeyangmunhwa-ro 59beon-gil, Gyeyang-gu, Incheon",
      phone: ["+82-32-545-1111", "+82-10-9140-8782"],
      checkIn: "14:00",
      checkOut: "13:00",
      breakfast: t("hotel.noBreakfast"),
      amenities: t("hotel.paidLaundry"),
      rooms: [
        { type: t("hotel.deluxeRoom"), count: 24, beds: t("hotel.bed12"), rate: "KRW 90,000", discount: "KRW 80,000" },
        { type: t("hotel.premiumRoom"), count: 40, beds: t("hotel.bed12"), rate: "KRW 100,000", discount: "KRW 90,000" },
        { type: t("hotel.suiteRoom"), count: 8, beds: t("hotel.bed2"), rate: "KRW 130,000", discount: "KRW 130,000" },
      ],
    },
    {
      name: "HOTEL AMARE",
      image: "/images/hotels/hotel_amare.jpeg",
      website: "http://www.hotel-amare.com",
      address: "14, Jangje-ro 730beon-gil, Gyeyang-gu, Incheon",
      phone: ["+82-32-541-2222", "+82-10-9140-8782"],
      checkIn: "15:00",
      checkOut: "13:00",
      breakfast: t("hotel.noBreakfast"),
      amenities: t("hotel.paidLaundry"),
      rooms: [
        { type: t("hotel.deluxeRoom"), count: 34, beds: t("hotel.bed12"), rate: "KRW 80,000", discount: "KRW 70,000" },
        { type: t("hotel.premiumRoom"), count: 30, beds: t("hotel.bed12"), rate: "KRW 90,000", discount: "KRW 70,000" },
        { type: t("hotel.penthouseRoom"), count: 3, beds: t("hotel.bed2"), rate: "KRW 150,000", discount: "KRW 150,000" },
      ],
    },
    {
      name: "RIVER HOTEL",
      image: "/images/hotels/hotel_river.jpeg",
      website: "http://www.riverhotel.co.kr",
      address: "6, Gyeyangmunhwa-ro 53beon-gil, Gyeyang-gu, Incheon",
      phone: ["CP +82-10-8405-6808"],
      checkIn: "15:00",
      checkOut: "12:00",
      breakfast: t("hotel.noBreakfast"),
      amenities: t("hotel.paidLaundry"),
      rooms: [
        { type: t("hotel.stdRoom"), count: 40, beds: t("hotel.bed1"), rate: "KRW 90,000", discount: "KRW 70,000" },
        { type: t("hotel.deluxeDoubleTwin"), count: 6, beds: t("hotel.bed2"), rate: "KRW 100,000", discount: "KRW 80,000" },
        { type: t("hotel.deluxeRoom"), count: 14, beds: t("hotel.bed1"), rate: "KRW 100,000", discount: "KRW 80,000" },
        { type: t("hotel.suiteRoom"), count: 1, beds: t("hotel.bed2"), rate: "KRW 250,000", discount: "KRW 200,000" },
        { type: t("hotel.premSuiteA"), count: 1, beds: t("hotel.bed1"), rate: "KRW 350,000", discount: "KRW 300,000" },
        { type: t("hotel.premSuiteB"), count: 1, beds: t("hotel.bed2"), rate: "KRW 350,000", discount: "KRW 300,000" },
      ],
    },
    {
      name: "HOTEL BANDO",
      image: "/images/hotels/hotel_bando.jpeg",
      website: "",
      address: "8, Gyeyangmoonhwa-ro 17beon-gil, Gyeyang-gu, Incheon",
      phone: ["+82-32-551-5959/5960", "+82-10-9171-5930"],
      checkIn: "14:00",
      checkOut: "14:00",
      breakfast: t("hotel.noBreakfast"),
      amenities: t("hotel.paidLaundry"),
      rooms: [
        { type: t("hotel.stdRoom"), count: 37, beds: t("hotel.bed1"), rate: "KRW 60,000", discount: "KRW 60,000" },
        { type: t("hotel.superiorRoom"), count: 9, beds: t("hotel.bed1"), rate: "KRW 85,000", discount: "KRW 80,000" },
        { type: t("hotel.deluxeRoom"), count: 4, beds: t("hotel.bed2"), rate: "KRW 100,000", discount: "KRW 90,000" },
      ],
    },
  ];
}

export default function HotelSection() {
  const { t } = useI18n();
  const HOTELS = getHotels(t);
  return (
    <section id="hotel" className="py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="section-tag mb-9">
          <span className="tag-num">04</span>
          <span>{t("hotel.sectionTag")}</span>
        </div>

        <h3 className="text-2xl lg:text-3xl font-bold text-center text-slate-900 mb-12 tracking-tight">
          {t("hotel.heading")}
        </h3>

        <div className="space-y-8">
          {HOTELS.map((hotel, i) => (
            <div key={i} className="info-card">
              <div className="lg:flex gap-8">
                {/* Hotel Info */}
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
                    {i + 1}. {hotel.name}
                  </h4>
                  {hotel.website && (
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link text-[14px] mb-3 inline-block"
                    >
                      {hotel.website}
                    </a>
                  )}
                  <div className="space-y-1.5 text-[15px] text-slate-700 leading-relaxed">
                    <p>{hotel.address}</p>
                    {hotel.phone.map((p, j) => (
                      <p key={j} className="value-mono text-[14px]">{p}</p>
                    ))}
                    <p>- {t("hotel.checkIn")} {hotel.checkIn} / {t("hotel.checkOut")} {hotel.checkOut}</p>
                    <p>- {t("hotel.breakfast")} {hotel.breakfast}</p>
                    <p>- {hotel.amenities}</p>
                  </div>
                </div>

                {/* Hotel Image */}
                <Image src={hotel.image} alt={hotel.name} width={300} height={200} className="rounded-lg object-cover w-full lg:w-48 h-36" />
              </div>

              {/* Room Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t("hotel.roomType")}</th>
                      <th>{t("hotel.numRooms")}</th>
                      <th>{t("hotel.numBeds")}</th>
                      <th>{t("hotel.standardRate")}</th>
                      <th>{t("hotel.discountRate")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotel.rooms.map((room, j) => (
                      <tr key={j}>
                        <td>{room.type}</td>
                        <td>{room.count}</td>
                        <td>{room.beds}</td>
                        <td>{room.rate}</td>
                        <td className="font-semibold text-primary">{room.discount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="callout callout-warning mt-12">
          <ul className="space-y-2.5">
            <li>{t("hotel.note1")}</li>
            <li>{t("hotel.note2")}</li>
          </ul>
        </div>

        {/* Download Buttons */}
        {/* TODO: replace .kr-hosted ZIP/XLSX with assets re-uploaded to .com (or to /public/downloads/) */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a
            href="https://www.gyeyangopen.kr/additional_information.zip"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {t("hotel.download1")}
          </a>
          <a
            href="https://www.gyeyangopen.kr/List%20of%20Excellent%20Restaurants%20(As%20of%20April%2011,%202025).xlsx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {t("hotel.download2")}
          </a>
        </div>
      </div>
    </section>
  );
}
