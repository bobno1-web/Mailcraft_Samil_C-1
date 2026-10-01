# 아키텍처 (구조 설명)

메일크래프트가 어떻게 생겼고, 왜 이렇게 나눴는지 설명합니다.
개발을 몰라도 "어디를 고치면 뭐가 바뀌는지" 알 수 있도록 적었습니다.

---

## 1. 폴더 지도

```
mailcraft/
├─ app/                 # 화면(페이지). Next.js App Router
│  ├─ layout.tsx        #   공통 틀(폰트/본문 래퍼/꼬리말) — 전역 헤더 없음
│  ├─ page.tsx          #   랜딩(브랜드바 + 히어로 + 두 갈래 카드)
│  ├─ compose/page.tsx  #   메인: 입력→초안→점검·발송 3단계 흐름
│  ├─ models/page.tsx   #   모범 메일 모음
│  └─ globals.css       #   디자인 토큰(틸) + 공통 CSS 클래스(+반응형)
├─ components/          # 화면 부품(재사용 조각)
│  ├─ PageHeader.tsx    #   흐름 페이지 상단 바(← 뒤로 · 제목 · 진행상태)
│  ├─ Icons.tsx         #   인라인 SVG 아이콘(봉투·책·연필·자물쇠)
│  ├─ ComposeForm.tsx   #   1단계 입력 폼(자료 요청 구조화 필드)
│  ├─ DraftList.tsx     #   2단계 초안(버전 A/B/C) 선택
│  ├─ ChecklistView.tsx #   3단계 점검 + 발송(2단: 최종 메일 / 보내기 전 확인)
│  └─ ModelMailList.tsx #   모범 메일 카드 그리드
├─ data/                # ★ 내용(알맹이) ★
│  ├─ templates.ts      #   핵심 조합 generateDrafts() + josa() + 톤/변형 블록
│  ├─ models.ts         #   모범 메일 모음(불변)
│  ├─ checklist.ts      #   점검 항목 + 게이트 isChecklistComplete()
│  └─ send.ts           #   발송 순수 도우미(buildMailtoUrl 등)
├─ lib/                 # ★ 규격(틀의 정의) ★
│  ├─ types.ts          #   타입(=규격). 모든 key 의 '기준'
│  └─ options.ts        #   선택지 목록(+ COMPOSE_TONE_OPTIONS·REPLY_METHOD_OPTIONS)
├─ design/mockup.pdf    # 디자인 기준(5쪽: 랜딩/모범/작성/초안/발송)
└─ scripts/check-content/  # 내용 형식 가드(검사기)
```

---

## 2. 데이터 주도(Data-driven) 설계

이 앱의 핵심 생각은 **"화면은 틀, 내용은 데이터"** 입니다.

- **화면(app/·components/)** 은 "어떻게 보여줄까"만 압니다.
  어떤 수신자 유형이 있는지, 톤이 몇 개인지 **직접 알지 못합니다.**
- **내용(data/·lib/)** 이 "무엇을 보여줄까"를 가집니다.

> 👉 그래서 **새 수신자/톤/문구를 추가할 때 화면 코드를 건드릴 필요가 거의 없습니다.**
> `lib/` 와 `data/` 만 고치면 화면에 자동으로 반영됩니다.

### 왜 이렇게 하나요?

- 비개발자도 **글귀·선택지**만 고치면 되도록 하기 위해서입니다.
- 외부 AI 없이, **정해진 글귀를 규칙대로 조립**하기 때문에 결과가 예측 가능합니다.

---

## 3. "틀"의 세 묶음은 항상 함께 움직입니다

수신자/톤/포함문구는 **세 파일에 나뉘어** 있고, 세 곳의 key 가 **똑같아야** 합니다.

| 파일                | 역할                  | 예 (recipient)                        |
| ------------------- | --------------------- | ------------------------------------- |
| `lib/types.ts`      | key 의 **기준**(타입) | `type RecipientKey = "client" \| ...` |
| `lib/options.ts`    | 화면 **선택지**       | `{ key: "client", label: "고객사" }`  |
| `data/templates.ts` | 실제 **글귀**(Record) | `RECIPIENT_TEMPLATES.client = {...}`  |

하나만 고치면 어긋나서 버그가 납니다. 그래서:

- `data/templates.ts` 는 `Record<RecipientKey, ...>` 로 되어 있어 **key 를 빠뜨리면 타입체크(tsc)가 즉시** 잡습니다.
- 추가로 **형식 가드**(`npm run check:content`)가 options↔templates 불일치, reasons 누락 등을 사람 말로 알려 줍니다.

자세한 추가 방법: [contributing/templates.md](contributing/templates.md)

---

## 4. compose 3단계 상태 흐름 (입력 → 초안 → 점검·발송)

메인 화면(`app/compose/page.tsx`)은 작은 상태 기계처럼 움직입니다.
(`app/page.tsx` 는 이 흐름으로 보내 주는 랜딩입니다.)

```
[1. 입력]  ComposeForm 에서 자료 요청 구조화 필드(대상·기한·형식·회신방법·비고)
   │        + 수신자 + 톤(격식/친근) + 포함문구를 고르고 적음 (대상·기한 필수)
   │   "메일 만들기 →" 클릭
   ▼
[2. 초안]  generateDrafts(input) 가 선택 톤 안에서 변형 3종(요점 A·정중 B·간결 C)을
   │        결정론적으로 만들어 DraftList 로 보여 줌 (선택한 조건 뱃지로 되짚음)
   │   "이 버전 선택 →" 클릭  (→ checked 초기화)
   ▼
[3. 점검·발송]  ChecklistView(2단): 왼쪽 최종 메일(수신인/참조/마감 + 본문 편집),
               오른쪽 보내기 전 확인(data/checklist.ts 항목)
               · 모든 항목 체크 → '복사 · 메일 열기' 활성 (게이트: isChecklistComplete)
               · 클릭 시 본문을 클립보드 복사 + mailto 로 메일 프로그램 열기
```

- 상태는 `compose/page.tsx` 안의 `stage`(1·2·3), `input`, `drafts`, `selected`, `checked` 가 전부입니다.
  (발송 폼의 본문/수신인/참조/마감은 `ChecklistView` 로컬 상태이고, 초안을 다시 고르면 `key` 로 초기화됩니다.)
- **초안 생성은 순수 함수 `generateDrafts()`** 하나에 모여 있습니다(톤 × 변형).
  한국어 조사(을/를·은/는·(으)로)는 받침 기준 순수 함수 `josa()` 가 처리합니다.
  입력이 같으면 결과가 항상 같습니다(무작위·네트워크 없음 = 절대 원칙 1).
- **발송 게이트도 순수 함수**(`data/checklist.ts` 의 `isChecklistComplete`,
  `data/send.ts` 의 `buildMailtoUrl`)로 빼서 단위 테스트합니다.
  복사 본문과 mailto 본문은 같은 편집 본문을 써서 서로 어긋나지 않습니다.
- 본문의 '내용'은 작성자가 입력한 구조화 필드(와 발송 단계에서 직접 다듬은 본문)에서만
  나옵니다(= 절대 원칙 2, 날조 금지). {받는사람}은 `○○님`, 보내는 사람은 `○○회계법인 ○○○` placeholder 입니다.

---

## 5. 더 읽기

- 내용 기여 전체 안내: [contributing-content.md](contributing-content.md)
- 색/스타일: [design-system.md](design-system.md)
- 배포: [deploy.md](deploy.md)
