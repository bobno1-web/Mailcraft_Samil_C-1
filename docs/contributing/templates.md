# 수신자 / 톤 / 포함문구 추가하기

이 세 가지는 **세 파일을 함께** 고쳐야 합니다.
한 곳만 고치면 어긋나서 버그가 나고, **형식 가드가 커밋을 막습니다.**

> 건드리는 파일: `lib/types.ts` → `lib/options.ts` → `data/templates.ts` (이 순서 추천)
>
> **현재 등록된 값 (v2: 자료 요청 전용)**
>
> - 수신자(4): `exec`(임원/상사) · `client`(고객사) · `partner`(협력사) · `internal`(사내)
> - 톤: `TONE_OPTIONS`(3) = `formal`·`friendly`·`concise`. 단 **작성 화면은 `COMPOSE_TONE_OPTIONS`(격식·친근 2개)만** 노출하고, `concise`(간결)는 모범 메일 표시용으로만 남아 있습니다. ‘간결’은 톤이 아니라 **변형(요점 A / 정중 B / 간결 C)** 으로 이동했습니다.
> - 포함문구(3): `holiday`(명절) · `health`(건강/안부) · `thanks`(감사) — **본문엔 이 선언 순서대로** 삽입됩니다.
> - 회신 방법(3): `reply`(회신·기본) · `share`(공유) · `submit`(제출) — `REPLY_METHOD_OPTIONS`/`REPLY_METHOD_LABELS`.
>
> 본문 조립은 `generateDrafts()` 가 **선택한 톤 × 변형 3종**으로 만들고, 한국어 조사(을/를·은/는·(으)로)는 순수 함수 `josa()` 가 받침 기준으로 처리합니다.

> ⚠️ **편집 중 가드가 한 번 막을 수 있습니다(정상).**
> `data/`·`lib/` 파일을 저장할 때마다 content-guard 훅이 `check:content` 를 돌립니다.
> 세 파일을 하나씩 고치는 동안 잠깐 key 가 어긋나 **중간에 가드가 멈출 수 있는데**,
> 세 파일을 모두 맞추면 통과합니다. (한 번에 다 고친 뒤 검증하면 깔끔합니다.)

---

## 예시: 새 수신자 유형 "팀 전체(team)" 추가

> 아래는 **5번째** 수신자를 추가하는 예시입니다(현재 4종).

### ① `lib/types.ts` — key 를 '기준'에 먼저 추가

```ts
// 변경 전 (현재)
export type RecipientKey = "client" | "internal" | "partner" | "exec";

// 변경 후 ("team" 추가)
export type RecipientKey = "client" | "internal" | "partner" | "exec" | "team";
```

### ② `lib/options.ts` — 화면 선택지에 추가

```ts
export const RECIPIENT_OPTIONS: ReadonlyArray<Option<RecipientKey>> = [
  // ... 기존 4종(exec·client·partner·internal) ...
  { key: "team", label: "팀 전체", description: "사내 팀 전원 공지" }, // ← 추가
];
```

### ③ `data/templates.ts` — 실제 글귀 추가

`RECIPIENT_TEMPLATES` 는 `Record<RecipientKey, RecipientVoice>` 라서, `team` 을 안 넣으면
타입체크에서 **"team 속성이 없다"** 고 바로 에러가 납니다. v2에서는 인사의 **호칭 자리
(`salutationName`)** 만 씁니다(현재 전부 `"○○님"`; 팀이 수신자별로 다듬을 수 있게 분리).

```ts
export const RECIPIENT_TEMPLATES: Record<RecipientKey, RecipientVoice> = {
  // ... 기존 4종(모두 salutationName: "○○님") ...
  team: {
    // ← 추가. 예: 팀 공지는 호칭을 다르게
    salutationName: "팀원 여러분",
  },
};
```

### ④ 확인

```bash
npm run check:content   # "recipient" 키가 셋 다 맞는지 검사
npm run typecheck       # Record 에 key 빠지면 여기서 잡힘
npm test                # generateDrafts 계약(호칭 매핑 등) 회귀 확인
```

---

## 예시: 새 톤(tone) 추가

같은 3단계입니다. 파일만 다릅니다. 톤은 인사·완충·맺음·서술어 **블록(ToneVoice)** 으로
들어가고, A/B/C 변형이 이 블록들을 조합합니다.

1. `lib/types.ts` 의 `ToneKey` 에 key 추가 (예: `| "warm"`)
2. `lib/options.ts` 의 `TONE_OPTIONS` 에 선택지 추가
   - **작성 화면에도 보이게 하려면** `COMPOSE_TONE_OPTIONS` 필터에도 포함되게 합니다.
3. `data/templates.ts` 의 `TONE_VOICES` 에 블록 추가 (`{name}` 은 호칭으로 치환됨)

```ts
// data/templates.ts
export const TONE_VOICES: Record<ToneKey, ToneVoice> = {
  // ... 기존 ...
  warm: {
    greetingFull: "안녕하세요, {name}. ○○회계법인 ○○○입니다.",
    greetingMin: "{name}, 안녕하세요.",
    ask: "부탁드려요",
    askPolite: "부탁드리고자 연락드려요",
    bufferPolite: "다름이 아니라,",
    formatLead: "형식은",
    closingPoint: "확인 부탁드려요. 감사합니다.",
    closingPolite: "번거롭게 해드려 죄송해요. 확인 부탁드려요. 감사합니다.",
    closingBrief: "감사합니다.",
  },
};
```

---

## 예시: 새 포함문구(phrase) 추가

1. `lib/types.ts` 의 `PhraseKey` 에 key 추가 (예: `| "followup"`)
2. `lib/options.ts` 의 `PHRASE_OPTIONS` 에 선택지 추가
3. `data/templates.ts` 의 `PHRASE_BLOCKS` 에 블록 추가

```ts
// data/templates.ts
export const PHRASE_BLOCKS: Record<PhraseKey, PhraseBlock> = {
  // ... 기존 ...
  followup: {
    key: "followup", // ← key 와 바깥 이름이 같아야 함(가드가 검사)
    label: "후속 안내",
    text: "진행 상황은 추후 다시 공유드리겠습니다.",
  },
};
```

> **삽입 순서 주의:** 포함문구는 사용자가 고른 순서가 아니라 **`PHRASE_BLOCKS` 의 선언 순서**로
> 본문에 들어갑니다. 원하는 위치에 블록을 선언하세요. (별도 순서 목록은 없으므로 "블록엔
> 있는데 순서에서 빠지는" 실수가 생기지 않습니다.)

---

## 자주 겪는 오류

| 증상                                                       | 원인                     | 해결                     |
| ---------------------------------------------------------- | ------------------------ | ------------------------ |
| `Property 'team' is missing ...`                           | templates 에 key 누락    | ③단계처럼 Record 에 추가 |
| 가드: `options 에는 "X" 가 있는데 templates 에는 없습니다` | 2곳만 고침               | 빠진 파일에 추가         |
| 가드: `PHRASE_BLOCKS["x"] 의 key 가 어긋납니다`            | 블록 안 `key` 오타       | 바깥 이름과 같게 수정    |
| 편집 도중 가드가 한 번 멈춤                                | 세 파일 동기화 '진행 중' | 세 파일 다 고치면 통과   |

---

## 글귀를 쓸 때 주의

- **사실을 지어내지 마세요.** 글귀는 '틀'이고, 실제 내용(수치·일정)은 작성자가 입력합니다.
- 금지 표현/존댓법 수준: <!-- [확인 필요: 금지표현 목록·높임 수준] --> `[확인 필요]`
- 다 되면 **PR 로 올리고 리뷰 승인 후 머지**하세요. ([deploy.md](../deploy.md))
