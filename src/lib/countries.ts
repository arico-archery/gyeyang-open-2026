export interface Country {
  code: string;
  flag: string;
  ko: string;
  en: string;
}

export const COUNTRIES: Country[] = [
  // East Asia
  { code: "KOR", flag: "\u{1F1F0}\u{1F1F7}", ko: "대한민국", en: "Korea" },
  { code: "JPN", flag: "\u{1F1EF}\u{1F1F5}", ko: "일본", en: "Japan" },
  { code: "CHN", flag: "\u{1F1E8}\u{1F1F3}", ko: "중국", en: "China" },
  { code: "TPE", flag: "\u{1F1F9}\u{1F1FC}", ko: "대만", en: "Chinese Taipei" },
  { code: "MGL", flag: "\u{1F1F2}\u{1F1F3}", ko: "몽골", en: "Mongolia" },
  { code: "HKG", flag: "\u{1F1ED}\u{1F1F0}", ko: "홍콩", en: "Hong Kong" },
  // Southeast Asia
  { code: "INA", flag: "\u{1F1EE}\u{1F1E9}", ko: "인도네시아", en: "Indonesia" },
  { code: "MAS", flag: "\u{1F1F2}\u{1F1FE}", ko: "말레이시아", en: "Malaysia" },
  { code: "THA", flag: "\u{1F1F9}\u{1F1ED}", ko: "태국", en: "Thailand" },
  { code: "VIE", flag: "\u{1F1FB}\u{1F1F3}", ko: "베트남", en: "Vietnam" },
  { code: "PHI", flag: "\u{1F1F5}\u{1F1ED}", ko: "필리핀", en: "Philippines" },
  { code: "SIN", flag: "\u{1F1F8}\u{1F1EC}", ko: "싱가포르", en: "Singapore" },
  { code: "MYA", flag: "\u{1F1F2}\u{1F1F2}", ko: "미얀마", en: "Myanmar" },
  { code: "CAM", flag: "\u{1F1F0}\u{1F1ED}", ko: "캄보디아", en: "Cambodia" },
  // South Asia
  { code: "IND", flag: "\u{1F1EE}\u{1F1F3}", ko: "인도", en: "India" },
  { code: "SRI", flag: "\u{1F1F1}\u{1F1F0}", ko: "스리랑카", en: "Sri Lanka" },
  { code: "BAN", flag: "\u{1F1E7}\u{1F1E9}", ko: "방글라데시", en: "Bangladesh" },
  { code: "NEP", flag: "\u{1F1F3}\u{1F1F5}", ko: "네팔", en: "Nepal" },
  // Central Asia / West Asia
  { code: "KAZ", flag: "\u{1F1F0}\u{1F1FF}", ko: "카자흐스탄", en: "Kazakhstan" },
  { code: "UZB", flag: "\u{1F1FA}\u{1F1FF}", ko: "우즈베키스탄", en: "Uzbekistan" },
  { code: "IRI", flag: "\u{1F1EE}\u{1F1F7}", ko: "이란", en: "Iran" },
  { code: "TUR", flag: "\u{1F1F9}\u{1F1F7}", ko: "튀르키예", en: "Turkey" },
  { code: "ISR", flag: "\u{1F1EE}\u{1F1F1}", ko: "이스라엘", en: "Israel" },
  // Americas
  { code: "USA", flag: "\u{1F1FA}\u{1F1F8}", ko: "미국", en: "United States" },
  { code: "CAN", flag: "\u{1F1E8}\u{1F1E6}", ko: "캐나다", en: "Canada" },
  { code: "MEX", flag: "\u{1F1F2}\u{1F1FD}", ko: "멕시코", en: "Mexico" },
  { code: "BRA", flag: "\u{1F1E7}\u{1F1F7}", ko: "브라질", en: "Brazil" },
  { code: "COL", flag: "\u{1F1E8}\u{1F1F4}", ko: "콜롬비아", en: "Colombia" },
  { code: "ARG", flag: "\u{1F1E6}\u{1F1F7}", ko: "아르헨티나", en: "Argentina" },
  { code: "CHI", flag: "\u{1F1E8}\u{1F1F1}", ko: "칠레", en: "Chile" },
  { code: "GUA", flag: "\u{1F1EC}\u{1F1F9}", ko: "과테말라", en: "Guatemala" },
  // Europe
  { code: "GBR", flag: "\u{1F1EC}\u{1F1E7}", ko: "영국", en: "United Kingdom" },
  { code: "FRA", flag: "\u{1F1EB}\u{1F1F7}", ko: "프랑스", en: "France" },
  { code: "GER", flag: "\u{1F1E9}\u{1F1EA}", ko: "독일", en: "Germany" },
  { code: "ITA", flag: "\u{1F1EE}\u{1F1F9}", ko: "이탈리아", en: "Italy" },
  { code: "ESP", flag: "\u{1F1EA}\u{1F1F8}", ko: "스페인", en: "Spain" },
  { code: "NED", flag: "\u{1F1F3}\u{1F1F1}", ko: "네덜란드", en: "Netherlands" },
  { code: "BEL", flag: "\u{1F1E7}\u{1F1EA}", ko: "벨기에", en: "Belgium" },
  { code: "SUI", flag: "\u{1F1E8}\u{1F1ED}", ko: "스위스", en: "Switzerland" },
  { code: "SWE", flag: "\u{1F1F8}\u{1F1EA}", ko: "스웨덴", en: "Sweden" },
  { code: "DEN", flag: "\u{1F1E9}\u{1F1F0}", ko: "덴마크", en: "Denmark" },
  { code: "NOR", flag: "\u{1F1F3}\u{1F1F4}", ko: "노르웨이", en: "Norway" },
  { code: "FIN", flag: "\u{1F1EB}\u{1F1EE}", ko: "핀란드", en: "Finland" },
  { code: "POL", flag: "\u{1F1F5}\u{1F1F1}", ko: "폴란드", en: "Poland" },
  { code: "UKR", flag: "\u{1F1FA}\u{1F1E6}", ko: "우크라이나", en: "Ukraine" },
  { code: "CZE", flag: "\u{1F1E8}\u{1F1FF}", ko: "체코", en: "Czech Republic" },
  { code: "ROU", flag: "\u{1F1F7}\u{1F1F4}", ko: "루마니아", en: "Romania" },
  { code: "GRE", flag: "\u{1F1EC}\u{1F1F7}", ko: "그리스", en: "Greece" },
  { code: "POR", flag: "\u{1F1F5}\u{1F1F9}", ko: "포르투갈", en: "Portugal" },
  { code: "RUS", flag: "\u{1F1F7}\u{1F1FA}", ko: "러시아", en: "Russia" },
  // Oceania
  { code: "AUS", flag: "\u{1F1E6}\u{1F1FA}", ko: "호주", en: "Australia" },
  { code: "NZL", flag: "\u{1F1F3}\u{1F1FF}", ko: "뉴질랜드", en: "New Zealand" },
  // Africa
  { code: "RSA", flag: "\u{1F1FF}\u{1F1E6}", ko: "남아프리카공화국", en: "South Africa" },
  { code: "EGY", flag: "\u{1F1EA}\u{1F1EC}", ko: "이집트", en: "Egypt" },
  { code: "NGR", flag: "\u{1F1F3}\u{1F1EC}", ko: "나이지리아", en: "Nigeria" },
  { code: "KEN", flag: "\u{1F1F0}\u{1F1EA}", ko: "케냐", en: "Kenya" },
];
