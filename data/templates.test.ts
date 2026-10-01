// data/templates.test.ts
// ─────────────────────────────────────────────────────────────────────────────
// generateDrafts() 의 '계약'(contract)을 고정하는 단위 테스트입니다.
// 러너는 의존성 최소 원칙에 따라 Node 내장 test 러너를 씁니다.
//   실행: npm test   (= node --import tsx --test data/templates.test.ts)
//
// 검증하는 계약:
//   - 항상 정확히 3개의 초안
//   - 결정론성(같은 입력 → 같은 출력)
//   - 빈 content 플레이스홀더(날조 금지)
//   - 각 RecipientKey → 호칭/맺음말 매핑
//   - 각 ToneKey → 도입부 매핑
//   - 포함 문구의 '고정 순서' 삽입
// ─────────────────────────────────────────────────────────────────────────────

import test from "node:test";
import assert from "node:assert/strict";
import {
  generateDrafts,
  RECIPIENT_TEMPLATES,
  TONE_TEMPLATES,
  PHRASE_BLOCKS,
} from "./templates";
import type { ComposeInput, RecipientKey, ToneKey } from "../lib/types";

const base: ComposeInput = {
  recipient: "client",
  tone: "formal",
  phrases: [],
  content: "요청하신 자료 초안 첨부",
  recipientName: "홍길동",
  subject: "테스트 제목",
};

test("정확히 3개의 초안을 반환한다", () => {
  assert.equal(generateDrafts(base).length, 3);
});

test("결정론적: 같은 입력 → 같은 출력", () => {
  assert.deepEqual(generateDrafts(base), generateDrafts(base));
});

test("빈 content 는 플레이스홀더로 대체된다(날조 금지)", () => {
  const drafts = generateDrafts({ ...base, content: "   " });
  for (const d of drafts) {
    assert.ok(
      d.body.includes("[전하실 내용을 입력해 주세요]"),
      `${d.id}: 빈 content 플레이스홀더가 없음`,
    );
  }
});

test("content 가 있으면 플레이스홀더 없이 그 내용이 들어간다", () => {
  for (const d of generateDrafts(base)) {
    assert.ok(!d.body.includes("[전하실 내용을 입력해 주세요]"));
    assert.ok(d.body.includes("요청하신 자료 초안 첨부"));
  }
});

test("각 RecipientKey → 호칭/맺음말이 본문에 적용된다", () => {
  const recipients = Object.keys(RECIPIENT_TEMPLATES) as RecipientKey[];
  for (const r of recipients) {
    const body = generateDrafts({ ...base, recipient: r })[0].body;
    const salutation = RECIPIENT_TEMPLATES[r].salutation.replace(
      "{name}",
      "홍길동",
    );
    assert.ok(body.startsWith(salutation), `${r}: 호칭 '${salutation}' 누락`);
    assert.ok(
      body.includes(RECIPIENT_TEMPLATES[r].signoff),
      `${r}: 맺음말 누락`,
    );
  }
});

test("각 ToneKey → 도입부(opening)가 본문에 반영된다", () => {
  const tones = Object.keys(TONE_TEMPLATES) as ToneKey[];
  for (const t of tones) {
    const body = generateDrafts({ ...base, tone: t })[0].body;
    assert.ok(body.includes(TONE_TEMPLATES[t].opening), `${t}: 도입부 누락`);
  }
});

test("포함 문구는 선택 순서와 무관하게 고정 순서(명절→건강→감사)로 삽입된다", () => {
  // 일부러 역순으로 선택
  const body = generateDrafts({
    ...base,
    phrases: ["thanks", "health", "holiday"],
  })[0].body;
  const iHoliday = body.indexOf(PHRASE_BLOCKS.holiday.text);
  const iHealth = body.indexOf(PHRASE_BLOCKS.health.text);
  const iThanks = body.indexOf(PHRASE_BLOCKS.thanks.text);
  assert.ok(
    iHoliday >= 0 && iHealth >= 0 && iThanks >= 0,
    "선택한 문구가 모두 삽입되지 않음",
  );
  assert.ok(iHoliday < iHealth, "명절이 건강보다 앞에 와야 함");
  assert.ok(iHealth < iThanks, "건강이 감사보다 앞에 와야 함");
});

test("선택하지 않은 문구는 본문에 들어가지 않는다", () => {
  const body = generateDrafts({ ...base, phrases: ["holiday"] })[0].body;
  assert.ok(body.includes(PHRASE_BLOCKS.holiday.text));
  assert.ok(!body.includes(PHRASE_BLOCKS.health.text));
  assert.ok(!body.includes(PHRASE_BLOCKS.thanks.text));
});

test("세 초안의 배치(layout)는 서로 다른 본문을 만든다", () => {
  const bodies = new Set(
    generateDrafts({ ...base, phrases: ["holiday"] }).map((d) => d.body),
  );
  assert.equal(bodies.size, 3, "세 초안이 서로 달라야 함");
});

test("모든 PhraseKey 는 고정 순서에 포함된다(순서 목록 누락 구멍 방지)", () => {
  // PHRASE_BLOCKS 의 모든 문구를 선택하면, 본문에 전부(= 빠짐없이) 삽입돼야 한다.
  const allKeys = Object.keys(PHRASE_BLOCKS) as (keyof typeof PHRASE_BLOCKS)[];
  const body = generateDrafts({ ...base, phrases: allKeys })[0].body;
  for (const k of allKeys) {
    assert.ok(
      body.includes(PHRASE_BLOCKS[k].text),
      `문구 '${k}' 가 본문에 삽입되지 않음`,
    );
  }
});
