---
name: add-model-mail
description: 메일크래프트의 모범 메일(data/models.ts)을 1건 추가할 때 사용. 본문과 reasons('왜 모범인가')를 반드시 함께 채운다. "모범 메일 추가", "모범 사례 등록", "예시 메일 추가" 같은 요청에 적용.
---

# add-model-mail — 모범 메일 1건 추가

`data/models.ts` 의 `MODEL_MAILS` 배열에 모범 메일을 한 건 추가하는 절차입니다.

참고 문서: `docs/contributing/models.md`

## 절대 원칙

- `reasons`('왜 모범인가')는 **반드시 2개 이상** 채운다. 2개 미만이면 형식 가드가 커밋을 막는다.
- `reasons` 는 지어낸 칭찬이 아니라 **실제 근거**를 적는다(날조 금지).
- 본문도 사실을 지어내지 않는다. 확인 안 된 수치·일정은 넣지 않는다.

## 절차

1. `data/models.ts` 를 연다.
2. `MODEL_MAILS` 배열에 객체를 하나 추가한다. 필드:
   - `id`: 기존과 **겹치지 않는** 고유 영문 id
   - `title`: 목록에 보일 제목
   - `recipient` / `tone`: **이미 등록된 key** 만 사용(없으면 먼저 `add-mail-template`)
   - `subject`: 제목
   - `body`: 본문(여러 줄은 `["줄1","줄2"].join("\n")` 권장)
   - `reasons`: **왜 모범인지 2개 이상**, 각 항목은 비어 있으면 안 됨
3. 금지표현·높임 수준 기준이 불확실하면 `[확인 필요]` 로 남기고 사용자에게 확인.

> 추가한 메일은 **`/models` 화면에 자동으로** 카드로 보입니다.
> (받는 사람·톤은 태그, `subject` 는 제목 줄, `reasons` 는 "왜 모범인가" 목록으로 표시)
> 화면 코드는 건드릴 필요가 없습니다 — `data/models.ts` 만 고치면 됩니다.

## 검증 (반드시 실행)

```bash
npm run check:content   # reasons 누락·id 중복·잘못된 recipient/tone 검사
npm run typecheck
```

- 실패하면 멈추고 깨진 규칙을 사용자에게 보고한다.

## 마무리

- **PR 로 올리고 리뷰어 승인 후 머지**하도록 안내한다. (`docs/deploy.md`)
