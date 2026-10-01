---
name: add-mail-template
description: 메일크래프트에 새 수신자(recipient)·톤(tone)·포함문구(phrase)를 추가하거나 수정할 때 사용. types.ts·options.ts·templates.ts 세 곳의 key 를 반드시 동기화한다. "수신자 추가", "톤 추가", "포함 문구 추가", "선택지 추가" 같은 요청에 적용.
---

# add-mail-template — 수신자/톤/포함문구 추가·수정

새 **수신자 / 톤 / 포함문구** 블록을 추가하거나 고칠 때 쓰는 절차입니다.
**핵심: 세 파일의 key 를 항상 함께 맞춰야 합니다. 하나만 고치면 버그입니다.**

참고 문서: `docs/contributing/templates.md`

## 절대 원칙 (어기지 말 것)

- 외부 API/AI 를 호출하지 않는다. 템플릿을 결정론적으로 조합할 뿐이다.
- 사실을 지어내지 않는다. 글귀는 '틀'이며 실제 내용은 작성자 입력에서 온다.
- 회사/팀 고유 판단(금지표현·높임 수준 등)이 필요하면 지어내지 말고
  `[확인 필요: 설명]` 로 남기고 사용자에게 물어본다.

## 어떤 종류인지 먼저 확인

- 수신자 → `RecipientKey` / `RECIPIENT_OPTIONS` / `RECIPIENT_TEMPLATES`
- 톤 → `ToneKey` / `TONE_OPTIONS` / `TONE_TEMPLATES`
- 포함문구 → `PhraseKey` / `PHRASE_OPTIONS` / `PHRASE_BLOCKS`

## 절차 (세 곳 동기화 — 반드시 이 순서)

1. **`lib/types.ts`**: 해당 `...Key` 유니온에 새 key 를 추가한다. (기준이 되는 곳)
2. **`lib/options.ts`**: 대응하는 `..._OPTIONS` 배열에 `{ key, label, description? }` 를 추가한다.
   - `key` 는 1에서 추가한 값과 **정확히 동일**해야 한다.
3. **`data/templates.ts`**: 대응하는 `Record` 에 실제 글귀를 추가한다.
   - 수신자: `salutation`(‘{name}’ 치환됨)·`signoff`
   - 톤: `opening`·`closing`
   - 포함문구: `{ key, label, text }` — 이때 안쪽 `key` 도 바깥 이름과 같게.
4. 글귀는 사실을 지어내지 않고 중립적인 '틀'로 작성한다. 금지표현/높임 수준이
   불확실하면 `[확인 필요]` 로 표시하고 사용자 확인을 요청한다.

## 검증 (반드시 실행)

```bash
npm run check:content   # options↔templates key 일치, phrase key 일치 등
npm run typecheck       # Record 에 key 빠지면 여기서 잡힘
```

- 하나라도 실패하면 **멈추고** 어떤 규칙이 깨졌는지 사용자에게 보고한다.
- 통과하면 변경한 세 파일을 요약해 보고한다.

## 마무리

- 내용/톤 변경은 **PR 로 올리고 리뷰어 승인 후 머지**해야 함을 안내한다. (`docs/deploy.md`)
- 자동 검사는 형식만 본다. "적절한 표현인가"는 사람 리뷰가 최종 관문이다.
