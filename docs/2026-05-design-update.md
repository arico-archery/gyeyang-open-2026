# 2026-05-19 디자인 업데이트 설명서

> 머지 커밋: `50384f7` · 배포: `dpl_5ew4QyE577E6HxD3j4GsrmR7Z9QG`
> 적용 사이트: https://www.gyeyangopen.com

이번 업데이트의 핵심은 **"원페이지 → 메뉴별 페이지"** 전환과 **가독성·일관성 강화**입니다.

---

## 1. 한 줄 요약

> 메인 페이지에 모든 정보가 anchor로 모여 있던 구조를 **메뉴 항목마다 별도 페이지**로 분리하고, 모든 페이지에 일관된 헤더와 가독성 시스템을 적용했다.

---

## 2. 주요 변경 사항 (Before → After)

### 2-1. 사이트 구조

**Before** — 원페이지(One Page)
```
/  (메인)
 ├ Hero
 ├ Invitation
 ├ SectionNav (01–06 중간 메뉴)
 ├ ScheduleSection      ← 메인 페이지 내 #schedule
 ├ RegistrationSection  ← #registration
 ├ VisaSection          ← #visa
 ├ HotelSection         ← #hotel
 ├ RentCarSection       ← #rent-car
 └ ContactSection       ← #contact
```

**After** — 메뉴별 페이지
```
/  (메인 = 허브)
 ├ Hero (포스터·D-Day·CTA·SNS)
 └ Quick Links (9개 카드로 각 페이지 진입)

/invitation       — 초대장 (신규)
/schedule         — 일정
/registration     — 참가 신청
/visa             — 비자 (신규)
/hotel            — 숙소 (신규)
/rent-car         — 교통 (신규)
/gallery          — 갤러리 (홍보영상·포스터)
/contact          — 문의
/scoreboard       — 점수 & 타겟
/guide_map        — 경기장 안내도
/practice_schedule — 연습 일정
/record_table     — 양궁 세계 기록
/archive/2025     — 2025 결과
/archive/2026     — 2026 결과
```

---

### 2-2. 메인 페이지 (`/`)

| 항목 | Before | After |
|---|---|---|
| 페이지 길이 | 매우 김 (모든 섹션 포함) | 짧음 (Hero + Quick Links만) |
| 좌측 블루 배경 박스 | 있음 (큰 시각 무게) | **제거** |
| 포스터 크기 | w-470px | w-320px (적절한 여백 확보) |
| YouTube 영상 | Hero 내부 자동 임베드 | **갤러리로 이동** + 썸네일 lazy |
| SNS 아이콘 | 40px 큰 원형 | 36px 작게, "SNS" 라벨 추가 |
| Quick Links | 없음 | **9개 카드 신규 추가** (각 페이지 진입) |

---

### 2-3. 상단 메뉴 (Header)

**Before** — 평면 9개 메뉴
```
일정  참가 신청  문의  양궁 기록  연습 일정  안내도  점수 & 타겟  2025 아카이브  참가자 앱
```

**After** — 콘텐츠 그룹 3개 + 문의 + 참가자 앱
```
대회 안내 ▾   참가 안내 ▾   결과 & 미디어 ▾   문의   [참가자 앱]
```

| 그룹 | 항목 |
|---|---|
| **대회 안내** | 초대장 · 일정 · 경기장 안내도 · 연습 일정 |
| **참가 안내** | 참가 신청 · 비자 · 숙소 · 렌터카 |
| **결과 & 미디어** | 점수 & 타겟 · 양궁 기록 · 갤러리 · 2026 아카이브 · 2025 아카이브 |

- **데스크탑**: hover하면 그룹 메뉴 펼침
- **모바일**: 햄버거 메뉴 안에 그룹별 헤딩 + 들여쓰기 항목

---

### 2-4. 중간 메뉴 (SectionNav)

**Before** — 01–06 6칸 균등 그리드 (Hero·Invitation 다음에 등장)

**After** — **제거**. 각 콘텐츠가 별도 페이지로 분리되었기 때문에 더 이상 필요 없음.

---

### 2-5. 각 페이지 공통 헤더 (PageHeader)

모든 콘텐츠 페이지가 동일한 헤더 구조로 시작:

```
[slate-50 배경]
  ← Home  ·  카테고리 라벨 (예: 참가 안내)
  큰 H1 페이지 제목 (예: 비자 지원)
  부제 (예: K-ETA 및 입국 정보)
[흰 본문 시작]
```

| 페이지 | 카테고리 라벨 | 제목 | 부제 |
|---|---|---|---|
| /invitation | 대회 안내 | 초대장 | 조직위원장의 환영 메시지 |
| /schedule | 대회 안내 | 대회 일정 | 6일간의 경기 |
| /registration | 참가 안내 | 참가 신청 | 선수·코치·임원 등록 안내 |
| /visa | 참가 안내 | 비자 지원 | K-ETA 및 입국 정보 |
| /hotel | 참가 안내 | 제휴 호텔 | 선수 할인 숙소 |
| /rent-car | 참가 안내 | 교통 | 렌터카·TABA·국제택시 |
| /contact | LOC | 문의 | 대회 운영본부 연락처 |

---

### 2-6. 갤러리 페이지 (`/gallery`, 신규)

세 섹션 구조:
1. **홍보영상** — YouTube 영상 (썸네일 lazy)
2. **공식 포스터** — 2026 / 2025 두 포스터 그리드
3. **대회 사진** — placeholder (사진 업로드 시 채움)

---

### 2-7. 가독성 강화 (디자인 시스템)

| 영역 | 변경 |
|---|---|
| **본문 폰트** | 14px → 16px (한국어 가독성 ↑) |
| **줄간격** | 1.625 → 1.75 (좀 더 여유) |
| **본문 색** | gray-500/600 → slate-700 (WCAG AA+) |
| **헤딩** | text-xl→text-2xl, tracking-tight 추가 |
| **표(table)** | 셀 패딩 14→18px, 시간 컬럼 tabular-nums |
| **리스트** | 작은 dot → 6px 파란 원 + 22px 들여쓰기 |
| **알림** | `※` 흐린 캡션 → **색 막대 callout 박스** (Info/Warning) |
| **링크** | 색 변경만 → underline + offset 명시 |
| **버튼** | 12×24px → 14×32px, hover 시 약간 떠오름 |

---

### 2-8. 푸터

| 항목 | Before | After |
|---|---|---|
| 후원사 위 라벨 | 없음 | **"주최 · 후원 · HOSTS & SPONSORS"** 추가 |
| 아카이브 링크 | "2025 아카이브"만 | **"2026 아카이브 · 2025 아카이브"** 둘 다 |
| 도메인 표기 | gyeyangopen.kr | **gyeyangopen.com** 통일 |

---

## 3. 운영자/콘텐츠 담당자 참고

### 3-1. 콘텐츠 수정 시 어느 파일을 보면 되는지

| 페이지 | 콘텐츠 위치 |
|---|---|
| 초대장 본문 | `src/lib/i18n/translations/ko.ts` 의 `invitation.*` |
| 대회 일정 표 | `src/sections/ScheduleSection.tsx` (또는 `/app/schedule/page.tsx`) + `schedule.*` i18n |
| 참가 신청 안내 | `src/sections/RegistrationSection.tsx` + `registration.*` i18n |
| 비자 안내 | `src/sections/VisaSection.tsx` + `visa.*` i18n |
| 호텔 정보 | `src/sections/HotelSection.tsx` 내 HOTELS 배열 |
| 렌터카 정보 | `src/sections/RentCarSection.tsx` 내 RENTAL_COMPANIES 배열 |
| LOC 연락처 | `src/sections/ContactSection.tsx` + `contact.*` i18n |
| 페이지 헤더 텍스트 | `pageHeader.*` i18n (en.ts / ko.ts) |

### 3-2. 페이지 헤더 톤 일괄 변경
페이지 헤더 디자인을 한꺼번에 바꾸려면 `src/components/PageHeader.tsx` 하나만 수정.

### 3-3. 메인 페이지 Quick Links 카드 변경
`src/sections/QuickLinks.tsx`의 `LINKS` 배열 + `home.*` i18n 키.

### 3-4. 메뉴 그룹 변경
`src/components/Header.tsx`의 `GROUPS` 배열. 항목 추가/제거/이동 한 곳에서.

---

## 4. 차기(2027) 대회 갱신 시 손볼 곳

- **일정 데이터**: `src/lib/event.ts`의 `EVENT_YEAR`, `EVENT_START_ISO`, `EVENT_END_ISO`, `EVENT_IANSEO_ID`
- **포스터**: `public/images/poster_2027.jpg` 업로드 + `Hero.tsx` 참조
- **i18n 본문**: ko.ts / en.ts의 `invitation.*`, `schedule.*` 등 본문 텍스트
- **2027 아카이브** (대회 종료 후): `/archive/2027` 라우트 + `/api/results-2027` API 새로 추가 (2026/2025 패턴 그대로)

---

## 5. 롤백 방법 (필요 시)

이전 디자인으로 돌리고 싶다면:

### 방법 A — Vercel Instant Rollback (1분, 가장 빠름)
1. https://vercel.com/arico/gyeyang-open-2026/deployments
2. 5/19 이전 deployment(`dpl_DxjnnTZqDo...` 등) `⋯` 메뉴
3. **"Promote to Production"** 클릭

### 방법 B — Git revert (코드 기록 보존)
```bash
git revert -m 1 50384f7
git push origin main
```

---

## 6. 미반영 / 후속 작업 (다음 라운드 후보)

- 한국 전통 모티프 시안(B)·믹스 시안(C) 등 다른 디자인 방향
- `/scoreboard`, `/guide_map`, `/record_table`, `/practice_schedule`, `/archive/*`에도 PageHeader 일괄 적용
- 갤러리 페이지에 실제 대회 사진 업로드
- arico-staff-app과 디자인 토큰 동기화

---

## 7. 미리보기 시안 파일 (참고용)

브라우저에서 직접 열어볼 수 있는 4종 시안 HTML이 `public/preview/`에 있습니다:

| 파일 | 톤 |
|---|---|
| `/preview/sport-modern.html` | 양궁 스포츠 모던 (네이비 + 골드) |
| `/preview/traditional.html` | 한국 전통 (단청 팔레트) |
| `/preview/mixed.html` | A+B 믹스 |
| `/preview/readability.html` | 가독성 개선만 (이번에 채택된 방향) |

차기 디자인 결정 시 참고용으로 보관.

---

*문서 작성: 2026-05-19 · 작성자: ARICO Archery*
