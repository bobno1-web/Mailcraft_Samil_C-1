# 수신자 / 톤 / 포함문구 추가하기

이 세 가지는 **세 파일을 함께** 고쳐야 합니다.
한 곳만 고치면 어긋나서 버그가 나고, **형식 가드가 커밋을 막습니다.**

> 건드리는 파일: `lib/types.ts` → `lib/options.ts` → `data/templates.ts` (이 순서 추천)

---

## 예시: 새 수신자 유형 "임원(exec)" 추가

### ① `lib/types.ts` — key 를 '기준'에 먼저 추가

```ts
// 변경 전
export type RecipientKey = "client" | "internal" | "partner";

// 변경 후 ("exec" 추가)
export type RecipientKey = "client" | "internal" | "partner" | "exec";
```

### ② `lib/options.ts` — 화면 선택지에 추가

```ts
export const RECIPIENT_OPTIONS: ReadonlyArray<Option<RecipientKey>> = [
  { key: "client", label: "고객사", description: "사외 고객(회사 밖)" },
  { key: "internal", label: "사내", description: "같은 회사/팀" },
  { key: "partner", label: "협력사", description: "외부 파트너·협력 업체" },
  { key: "exec", label: "임원", description: "회사 임원" }, // ← 추가
];
```

### ③ `data/templates.ts` — 실제 글귀 추가

`RECIPIENT_TEMPLATES` 는 `Record<RecipientKey, ...>` 라서, `exec` 를 안 넣으면
타입체크에서 **"exec 속성이 없다"** 고 바로 에러가 납니다.

```ts
export const RECIPIENT_TEMPLATES: Record<RecipientKey, RecipientTemplate> = {
  client: {
    /* ... 기존 ... */ salutation: "{name}님, 안녕하세요.",
    signoff: "감사합니다.\n드림",
  },
  internal: {
    /* ... */ salutation: "{name}님, 안녕하세요.",
    signoff: "감사합니다.",
  },
  partner: {
    /* ... */ salutation: "{name}님, 안녕하세요.",
    signoff: "앞으로도 잘 부탁드립니다.\n드림",
  },
  exec: {
    // ← 추가
    salutation: "{name}님, 안녕하십니까.",
    signoff: "감사합니다.\n드림",
  },
};
```

### ④ 확인

```bash
npm run check:content   # "recipient" 키가 셋 다 맞는지 검사
npm run typecheck
```

---

## 예시: 새 톤(tone) 추가

같은 3단계입니다. 파일만 다릅니다.

1. `lib/types.ts` 의 `ToneKey` 에 key 추가 (예: `| "warm"`)
2. `lib/options.ts` 의 `TONE_OPTIONS` 에 선택지 추가
3. `data/templates.ts` 의 `TONE_TEMPLATES` 에 `opening`/`closing` 추가

```ts
// data/templates.ts
export const TONE_TEMPLATES: Record<ToneKey, ToneTemplate> = {
  // ... 기존 ...
  warm: {
    opening: "먼저 따뜻한 인사 전합니다.",
    closing: "좋은 하루 보내세요. 감사합니다.",
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

---

## 자주 겪는 오류

| 증상                                                       | 원인                  | 해결                     |
| ---------------------------------------------------------- | --------------------- | ------------------------ |
| `Property 'exec' is missing ...`                           | templates 에 key 누락 | ③단계처럼 Record 에 추가 |
| 가드: `options 에는 "X" 가 있는데 templates 에는 없습니다` | 2곳만 고침            | 빠진 파일에 추가         |
| 가드: `PHRASE_BLOCKS["x"] 의 key 가 어긋납니다`            | 블록 안 `key` 오타    | 바깥 이름과 같게 수정    |

---

## 글귀를 쓸 때 주의

- **사실을 지어내지 마세요.** 글귀는 '틀'이고, 실제 내용(수치·일정)은 작성자가 입력합니다.
- 금지 표현/존댓법 수준: <!-- [확인 필요: 금지표현 목록·높임 수준] --> `[확인 필요]`
- 다 되면 **PR 로 올리고 리뷰 승인 후 머지**하세요. ([deploy.md](../deploy.md))
