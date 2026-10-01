---
name: add-checklist-item
description: 메일크래프트의 발송 전 점검 항목(data/checklist.ts)을 추가할 때 사용. kind 를 assist(앱 보조)와 self(자가확인)로 정확히 구분한다. "체크리스트 추가", "점검 항목 추가", "발송 전 확인 항목" 같은 요청에 적용.
---

# add-checklist-item — 체크리스트 항목 추가

`data/checklist.ts` 의 `CHECKLIST` 배열에 점검 항목을 추가하는 절차입니다.

참고 문서: `docs/contributing/checklist.md`

## 가장 중요한 결정: kind

- `"assist"` = 앱이 **자동으로 거들 수 있는** 확인 (예: 빈 제목 감지, 글자 수)
- `"self"` = 사람이 **눈으로 직접** 봐야 하는 자가확인 (예: 첨부 누락, 수신자 주소, 사실 여부)

판단 기준: "코드가 기계적으로 검사할 수 있나?" → 예면 `assist`, 아니면 `self`.
애매하면 지어내지 말고 사용자에게 어느 쪽인지 확인한다.

> 주의: 추가한 항목은 **발송 게이트**에 바로 반영됩니다. 3단계에서 `CHECKLIST` 의
> **모든 항목**을 체크해야 '복사·메일 열기'가 활성화됩니다(`isChecklistComplete`).
> 즉 항목을 늘리면 사용자가 더 많이 체크해야 발송할 수 있으니, 꼭 필요한 항목만 넣는다.

## 절차

1. `data/checklist.ts` 를 연다.
2. `CHECKLIST` 배열에 객체 추가:
   - `id`: 기존과 겹치지 않는 고유 id
   - `label`: 물음형 권장("~했는가?")
   - `kind`: `"assist"` 또는 `"self"` (둘 중 하나만 허용)
   - `hint`: 선택(헷갈리는 항목에만)

## 검증 (반드시 실행)

```bash
npm run check:content   # id 중복·잘못된 kind·빈 label 검사
npm run typecheck
```

- 실패하면 멈추고 깨진 규칙을 사용자에게 보고한다.

## 마무리

- **PR 로 올리고 리뷰어 승인 후 머지**하도록 안내한다. (`docs/deploy.md`)
