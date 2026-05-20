# SmugMug ⇄ 홈페이지·앱 운영 매뉴얼

작성일: 2026-05-20
대상: 계양오픈 조직위 운영진

---

## 한 줄 요약

**SmugMug 갤러리에 사진을 업로드하면 1시간 안에 자동으로 홈페이지(`/gallery`)와 앱(`/app/photos`)에 표시됩니다.**

즉시 반영이 필요하면 [관리자 페이지](https://www.gyeyangopen.com/app/admin)의 **"SmugMug 사진 캐시 새로고침"** 버튼을 누르면 됩니다.

---

## 1. 사진 업로드 방법

### 옵션 A: 외부 사진작가용 게스트 업로드 (인증 불필요)

링크: **https://arico.smugmug.com/upload/hqJS8f/guest**

- 사진작가에게 이 링크 하나만 공유
- 브라우저에서 드래그앤드롭으로 업로드
- SmugMug 계정 없이도 게스트로 업로드 가능
- 업로드된 파일은 자동으로 "Upload Gallay (Guest)" 앨범에 들어감

### 옵션 B: SmugMug 로그인 후 직접 업로드 (조직위)

1. https://media.arico.group 로그인
2. `Gyeyang Open Competition` → `2026-GyeyangOpen` 폴더로 이동
3. 원하는 앨범 클릭 (또는 새 앨범 생성)
4. 우측 상단 "Upload" 클릭 → 파일 선택

---

## 2. 폴더 구조 권장

현재 구조:
```
Gyeyang Open Competition
└─ 2026-GyeyangOpen
   ├─ Upload Gallay (Guest)    ← 게스트 업로드용 (공개)
   ├─ Upload Gallary (admin)   ← 내부용 (비밀번호 보호) — 사이트 노출 X
   └─ 1 Day                    ← 일자별 분류 (비어있음)
```

**일자별로 정리하고 싶다면:**

새 앨범을 만들어서 이름을 다음과 같이 지정:
- `1 Day` (5/13 수요일)
- `2 Day` (5/14 목요일)
- `3 Day` (5/15 금요일)
- `4 Day` (5/16 토요일)
- `5 Day` (5/17 일요일)
- `6 Day` (5/18 월요일)

→ 사이트에서 자동으로 일자별 탭이 생성됩니다 (숫자 prefix 자동 인식)

**탭 표시 규칙**
- 사진이 1장 이상 있는 공개 앨범만 사이트에 노출
- 비어있는 앨범, 비밀번호 걸린 앨범은 자동 제외
- "1 Day" 같은 숫자 prefix는 그대로 탭 이름으로 표시되며 숫자 순으로 정렬

---

## 3. 캡션·태그 입력 (권장)

각 사진의 캡션(Caption)을 SmugMug에서 입력하면 사이트 라이트박스에 표시됩니다.

**캡션 입력 방법**
1. SmugMug에서 사진 클릭
2. 우측 "i" 아이콘 → "Edit details"
3. Caption 필드에 한·영 병기 추천: `리커브 남자 결승 / Recurve Men Finals`

**좋은 캡션 예시**
- `개막식 — 선수단 입장 / Opening Ceremony — Athlete Procession`
- `Day 3 시상식 — 컴파운드 여자 / Day 3 Medal Ceremony — Compound Women`

---

## 4. 사이트에서 사진이 안 보일 때 점검 순서

### 4-1. 1시간 기다려보기
사이트는 1시간 단위로 캐시를 갱신합니다. 업로드 직후라면 조금 기다리거나 4-2로.

### 4-2. 관리자 페이지에서 즉시 새로고침
1. https://www.gyeyangopen.com/app/admin 접속 (관리자 로그인 필요)
2. "빠른 작업" 카드의 **"SmugMug 사진 캐시 새로고침"** 버튼 클릭
3. "✓ 사진 캐시 갱신 완료" 메시지 뜨면 성공
4. `/gallery` 새로고침해서 확인

### 4-3. SmugMug 쪽 점검
- 앨범의 **Security 설정이 "Public"인지** 확인 (Password 보호된 앨범은 사이트 노출 X)
- 앨범에 사진이 **1장 이상** 있는지 확인 (빈 앨범은 자동 제외)
- 사진이 비디오(.mp4 등)가 아닌 이미지(.jpg/.png)인지 확인

### 4-4. 그래도 안 보이면
운영자에게 다음 정보와 함께 문의:
- 어느 앨범에 업로드했는지 (URL)
- 사진을 업로드한 시각
- 브라우저 콘솔 에러 (F12 → Console)

---

## 5. 보안·접근 권한

| 항목 | 설정값 | 효과 |
|---|---|---|
| API 액세스 레벨 | Read-Only | 사이트는 읽기만 가능, 사진 수정·삭제 불가 |
| 사이트 노출 앨범 | SecurityType = "None" (공개) | 비밀번호 앨범은 자동 제외 |
| 다운로드 | Album 설정에 따름 | SmugMug 측 `AllowDownloads` 설정 따름 |
| 우클릭 보호 | Protected = true | UI 상 다운로드 메뉴 차단 (URL 직접 접근은 가능) |

---

## 6. 비용

| 항목 | 비용 |
|---|---|
| SmugMug Power 플랜 | $69/년 (이미 가입됨) |
| SmugMug API 호출 | 무료 (요청 제한 사실상 없음) |
| 사이트 측 캐시 | 무료 (Vercel 기본 포함) |

→ **추가 비용 0원**으로 운영 가능.

---

## 7. 운영 흐름 (요약)

```
1. 사진작가 또는 운영진이 SmugMug에 업로드
        ↓
2. (자동) 1시간 안에 사이트 캐시 갱신
        ↓
3. 사용자가 /gallery (홈페이지) 또는 /app/photos (앱)에서 시청
        ↓
4. 사용자가 "SmugMug에서 보기" 누르면 원본 페이지로 이동, 다운로드 가능
```

---

## 8. 자주 묻는 질문

**Q. 잘못 올린 사진은 어떻게 지우나요?**
A. SmugMug에서 사진 삭제 → 최대 1시간 후 사이트에서도 자동으로 사라집니다. 즉시 반영하려면 관리자 페이지에서 "새로고침" 버튼.

**Q. 비공개로 두고 싶은 사진은요?**
A. "Upload Gallary (admin)" 앨범처럼 비밀번호를 걸어두면 사이트에는 노출되지 않습니다.

**Q. 한·영 캡션이 같이 안 나옵니다.**
A. SmugMug 캡션 필드에 한·영 병기로 입력하면 그대로 표시됩니다. 별도 영어 필드는 없습니다.

**Q. 사진 순서를 바꾸고 싶어요.**
A. SmugMug 앨범 설정의 "Sort Method"를 변경 (현재: Date Uploaded, Descending). 사이트는 SmugMug 정렬을 그대로 따릅니다.

**Q. 2027 대회 때는요?**
A. 새 폴더 `2027-GyeyangOpen`을 만들고 사이트 환경변수 `SMUGMUG_ROOT_FOLDER`를 `Gyeyang-Open-Competition/2027-GyeyangOpen`으로 변경하면 끝.

---

## 9. 핵심 링크

- **공개 갤러리**: https://media.arico.group/Gyeyang-Open-Competition/2026-GyeyangOpen
- **게스트 업로드**: https://arico.smugmug.com/upload/hqJS8f/guest
- **관리자 페이지**: https://www.gyeyangopen.com/app/admin
- **사이트 갤러리**: https://www.gyeyangopen.com/gallery
- **앱 사진**: https://www.gyeyangopen.com/app/photos
- **SmugMug API 키 관리**: https://api.smugmug.com/api/developer (회전·재발급 시)
