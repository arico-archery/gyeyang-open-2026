"use client";

import { useI18n } from "@/lib/i18n/context";

const WOMEN_RECORDS = [
  { event: "Individual Single (144)", olympic: "Cho Youn-jeong (KOR) Aug '92 Spain 1375", world: "Park Sung-hyun (KOR) Jul '07 Germany 1385", asian: "Yoon Ok-hee (KOR) Nov '10 Guangzhou 1371", asianChamp: "Park Sung-hyun (KOR) Nov '05 New Delhi 1388", worldRecord: "Park Sung-hyun (KOR) Oct '04 National Games 1405", koreaRecord: "Yoo Soo-jung (KOR) Jun '19 Hyundai Dept. 1407" },
  { event: "70M (36)", olympic: "Cho Youn-jeong (KOR) Aug '92 Spain 338", world: "Park Sung-hyun (KOR) Jul '03 USA 346", asian: "Jung Da-so-mi (KOR) Sep '14 Incheon 342", asianChamp: "Park Sung-hyun (KOR) Nov '05 New Delhi 341", worldRecord: "Park Sung-hyun (KOR) Oct '04 National Games 351", koreaRecord: "Park Sung-hyun (KOR) Oct '04 351" },
  { event: "60M (36)", olympic: "Cho Youn-jeong (KOR) Aug '92 Spain 345", world: "Choi Nam-ok (KOR) Sep '01 China 350", asian: "Yoon Ok-hee (KOR) Nov '10 Guangzhou 345", asianChamp: "Yoon Mi-jin (KOR) Nov '05 New Delhi 349", worldRecord: "Shin Jeong-hwa (KOR) Sep '24 355", koreaRecord: "Shin Jeong-hwa (KOR) Sep '24 355" },
  { event: "50M (36)", olympic: "Cho Youn-jeong (KOR) Aug '92 Spain 338", world: "Park Sung-hyun (KOR) Jul '07 Germany 345", asian: "Park Hwa-yun (KOR) Oct '02 Busan 338", asianChamp: "Park Sung-hyun (KOR) Nov '05 New Delhi 345", worldRecord: "Kim Kyung-eun (KOR) Jul '15 351", koreaRecord: "Kim Kyung-eun (KOR) Jul '15 351" },
  { event: "30M (36)", olympic: "Kim Soo-nyeong (KOR) Aug '92 Spain 357", world: "Park Sung-hyun (KOR) Jul '07 Germany 359", asian: "Park Sung-hyun (KOR) Oct '02 Busan 357", asianChamp: "Park Sung-hyun (KOR) Nov '05 New Delhi 357", worldRecord: "Han Hee-ji (KOR) Sep '15 360/22", koreaRecord: "Han Hee-ji (KOR) Sep '15 360/22" },
  { event: "Team Single (432)", olympic: "Cho Youn-jeong et al. (KOR) Aug '92 Spain 4094", world: "Park Sung-hyun et al. (KOR) Jul '07 Germany 4092", asian: "Yoon Ok-hee et al. (KOR) Nov '10 Guangzhou 4087", asianChamp: "Park Sung-hyun et al. (KOR) Nov '05 New Delhi 4129", worldRecord: "Park Sung-hyun et al. (KOR) Nov '05 4129", koreaRecord: "Ki Bo-bae et al. (KOR) Jul '17 4154" },
  { event: "Individual Matchplay (12)", olympic: "Park Sung-hyun (KOR) Aug '08 China 115", world: "Cho Youn-jeong (KOR) Sep '93 Turkey 115", asian: "Yoon Mi-jin (KOR) Oct '02 Busan 114", asianChamp: "Yoon Ok-hee (KOR) Nov '05 New Delhi 116", worldRecord: "Yoon Ok-hee (KOR) May '08 119", koreaRecord: "Yoon Ok-hee (KOR) May '08 119" },
  { event: "Individual Q.R. (72)", olympic: "Lim Si-hyun (KOR) Jul '24 Paris 694", world: "Kang Chae-young (KOR) Oct '17 Mexico 684", asian: "Kang Chae-young (KOR) Sep '18 Jakarta 681", asianChamp: "Ryu Soo-jung (KOR) Nov '21 Dhaka 687", worldRecord: "Lim Si-hyun (KOR) Jul '24 Paris 694", koreaRecord: "Lim Si-hyun (KOR) Jul '24 694" },
  { event: "Team Q.R. 70M (216)", olympic: "Lim Si-hyun et al. (KOR) Jul '24 Paris 2046", world: "Kang Chae-young et al. (KOR) Oct '17 Mexico 2038", asian: "Jang Hye-jin et al. (KOR) Sep '18 Jakarta 2038", asianChamp: "Ryu Soo-jung et al. (KOR) Nov '21 Dhaka 2045", worldRecord: "Jang Hye-jin et al. (KOR) May '18 2053", koreaRecord: "Jang Hye-jin et al. (KOR) May '18 2053" },
  { event: "Team Matchplay (24)", olympic: "Park Sung-hyun et al. (KOR) Aug '08 China 231", world: "Park Sung-hyun et al. (KOR) Jul '07 Germany 226", asian: "Yoon Ok-hee et al. (KOR) Nov '10 Guangzhou 227", asianChamp: "Dola Banerjee et al. (IND) Sep '07 Xi'an 223", worldRecord: "Park Sung-hyun et al. (KOR) Aug '08 231", koreaRecord: "Kwon Sol-yi et al. (KOR) Sep '10 233" },
];

const MEN_RECORDS = [
  { event: "Individual Single (144)", olympic: "Jung Jae-hun (KOR) Aug '92 Spain 1329", world: "Oh Jin-hyuk (KOR) Sep '09 Ulsan 1386", asian: "Kim Woo-jin (KOR) Nov '10 Guangzhou 1387", asianChamp: "Hwang Jin-woo (KOR) Sep '99 China 1356", worldRecord: "Kim Woo-jin (KOR) Oct '14 National Games 1391", koreaRecord: "Kim Woo-jin (KOR) Oct '14 1391" },
  { event: "90M (36)", olympic: "Jung Jae-hun (KOR) Aug '92 Spain 311", world: "Oh Jin-hyuk (KOR) Sep '09 Ulsan 342", asian: "Kim Woo-jin (KOR) Nov '10 Guangzhou 333", asianChamp: "Kim Won-sub (KOR) Dec '01 Hong Kong 331", worldRecord: "Kim Woo-jin (KOR) Sep '17 343", koreaRecord: "Kim Woo-jin (KOR) Sep '17 343" },
  { event: "70M (36)", olympic: "Jung Jae-hun (KOR) Aug '92 Spain 338", world: "Lee Chang-hwan (KOR) Jul '07 Germany 346", asian: "Kim Woo-jin (KOR) Nov '10 Guangzhou 349", asianChamp: "Hwang Jin-woo (KOR) Sep '99 China 343", worldRecord: "Oh Jin-hyuk (KOR) Aug '15 353", koreaRecord: "Oh Jin-hyuk (KOR) Aug '15 353" },
  { event: "50M (36)", olympic: "Echeev (URS) Oct '88 Korea 338", world: "Jang Yong-ho (KOR) Jul '03 USA 347", asian: "Oh Jin-hyuk (KOR) Nov '10 Guangzhou 345", asianChamp: "Oh Gyo-mun (KOR) Nov '97 Malaysia 343", worldRecord: "Kim Woo-jin (KOR) Oct '19 352", koreaRecord: "Kim Woo-jin (KOR) Oct '19 352" },
  { event: "30M (36)", olympic: "Shikarev V. (CIS) Aug '92 Spain 356", world: "Im Dong-hyun (KOR) Jul '03 USA 359", asian: "Kim Woo-jin (KOR) Nov '10 Guangzhou 360/23", asianChamp: "Han Seung-hoon et al. (KAZ) Sep '99 China 358", worldRecord: "Kim Hyun-jong (KOR) Jun '18 360/27", koreaRecord: "Kim Hyun-jong (KOR) Jun '18 360/27" },
  { event: "Team Single (432)", olympic: "Han Seung-hoon et al. (KOR) Aug '92 Spain 3938", world: "Oh Jin-hyuk et al. (KOR) Sep '09 4122", asian: "Kim Woo-jin et al. (KOR) Nov '10 Guangzhou 4114", asianChamp: "Im Dong-hyun et al. (KOR) Nov '05 New Delhi 4041", worldRecord: "Oh Jin-hyuk et al. (KOR) Sep '09 4122", koreaRecord: "Choi Gun-tae et al. (KOR) Oct '16 4114" },
  { event: "Individual Matchplay (12)", olympic: "Lee Chang-hwan (KOR) Aug '08 China 117", world: "Park Kyung-mo (KOR) Sep '93 Turkey 119", asian: "Park Kyung-mo (KOR) Oct '94 Japan 116", asianChamp: "Im Dong-hyun (KOR) Nov '05 New Delhi 118", worldRecord: "Kim Woo-jin (KOR) Oct '09 120/4", koreaRecord: "Kim Woo-jin (KOR) Oct '09 120/4" },
  { event: "Individual Q.R. (72)", olympic: "Kim Woo-jin (KOR) Aug '16 Brazil 700", world: "Van den Berg (FRA) Oct '17 Mexico 676", asian: "Koo Bon-chan (KOR) Nov '13 Chinese Taipei 687", asianChamp: "Brady Ellison (USA) Aug '19 Lima 702", worldRecord: "Kim Woo-jin (KOR) Aug '16 700", koreaRecord: "Kim Woo-jin (KOR) Aug '16 700" },
  { event: "Team Q.R. 70M (216)", olympic: "Im Dong-hyun et al. (KOR) Jul '12 London 2087", world: "Im Dong-hyun et al. (KOR) Oct '17 Mexico 2016", asian: "Kim Woo-jin et al. (KOR) Sep '18 Jakarta 2037", asianChamp: "Koo Bon-chan et al. (KOR) Nov '13 Chinese Taipei 2040", worldRecord: "Im Dong-hyun et al. (KOR) Jul '12 2087", koreaRecord: "Im Dong-hyun et al. (KOR) Jul '12 2087" },
  { event: "Team Matchplay (24)", olympic: "Park Kyung-mo et al. (KOR) Aug '08 China 227", world: "Im Dong-hyun et al. (KOR) Jul '07 Germany 231", asian: "Kim Woo-jin et al. (KOR) Nov '10 Guangzhou 229", asianChamp: "Rahul Banerjee et al. (IND) Sep '07 Xi'an 227", worldRecord: "Im Dong-hyun et al. (KOR) Oct '11 233", koreaRecord: "Jang Yong-ho et al. (KOR) Jun '13 232" },
];

function RecordTable({ records }: { records: typeof WOMEN_RECORDS }) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table text-xs">
        <thead>
          <tr>
            <th>Event</th>
            <th>Olympic Games</th>
            <th>World Championships</th>
            <th>Asian Games</th>
            <th>Asian Championships</th>
            <th>World Record</th>
            <th>Korea Record</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, i) => (
            <tr key={i}>
              <td className="font-semibold whitespace-nowrap">{record.event}</td>
              <td>{record.olympic}</td>
              <td>{record.world}</td>
              <td>{record.asian}</td>
              <td>{record.asianChamp}</td>
              <td>{record.worldRecord}</td>
              <td>{record.koreaRecord}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RecordTablePage() {
  const { t } = useI18n();
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
          Archery World Records
        </h1>

        {/* Women's Records */}
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-primary pl-4">
          Recurve Women (Mar 25, 2025)
        </h2>
        <RecordTable records={WOMEN_RECORDS} />

        {/* Men's Records */}
        <h2 className="text-xl font-bold text-gray-900 mt-16 mb-4 border-l-4 border-primary pl-4">
          Recurve Men (Mar 25, 2025)
        </h2>
        <RecordTable records={MEN_RECORDS} />
      </div>
    </div>
  );
}
