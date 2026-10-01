// data/templates.test.ts
// ─────────────────────────────────────────────────────────────────────────────
// generateDrafts()/josa() 의 '계약'(contract)을 고정하는 단위 테스트입니다.
//   실행: npm test   (= node --import tsx --test "data/**/*.test.ts")
//
// 검증하는 계약(v2 자료 요청):
//   - 한국어 조사(을/를·은/는·(으)로) 받침 기준 처리
//   - 예시 입력 → 기대 문장(격식 A/B/C) 정확 일치
//   - 톤(격식/친근) × 변형(요점/정중/간결) 6종이 서로 다름
//   - 결정론성, 항상 3개, 빈 필수값 자리표시(날조 금지), 포함 문구 삽입, 제목 자동 구성
// ─────────────────────────────────────────────────────────────────────────────

import test from "node:test";
import assert from "node:assert/strict";
import {
  generateDrafts,
  josa,
  PHRASE_BLOCKS,
  REPLY_METHOD_LABELS,
} from "./templates";
import type { ComposeInput } from "../lib/types";

const base: ComposeInput = {
  recipient: "client",
  tone: "formal",
  phrases: [],
  request: {
    target: "재고자산 조회서",
    due: "6월 30일",
    format: "PDF",
    replyMethod: "reply",
  },
};

// ── 조사 처리 ──
test("josa: 을/를 (받침 기준)", () => {
  assert.equal(josa("재고자산 조회서", "을/를"), "를"); // 서: 받침 없음
  assert.equal(josa("계약", "을/를"), "을"); // 약: ㄱ받침
  assert.equal(josa("자료", "을/를"), "를");
});

test("josa: 은/는 (받침 기준)", () => {
  assert.equal(josa("보고서", "은/는"), "는");
  assert.equal(josa("형식", "은/는"), "은"); // 식: ㄱ받침
});

test("josa: 으로/로 (받침 없음·ㄹ받침 → 로)", () => {
  assert.equal(josa("PDF", "으로/로"), "로"); // 영문 → 받침 없음 처리
  assert.equal(josa("한글", "으로/로"), "로"); // ㄹ받침
  assert.equal(josa("메일", "으로/로"), "로"); // ㄹ받침
  assert.equal(josa("원본", "으로/로"), "으로"); // 본: ㄴ받침
});

// ── 예시 입력 → 기대 문장(격식) ──
test("격식 A(요점형): 예시 입력 → 기대 문장", () => {
  const a = generateDrafts(base).find((d) => d.id === "point")!;
  assert.equal(
    a.body,
    [
      "안녕하십니까, ○○님. ○○회계법인 ○○○입니다.",
      "",
      "재고자산 조회서를 6월 30일까지 회신 부탁드립니다. 형식은 PDF로 부탁드립니다.",
      "",
      "확인 부탁드립니다. 감사합니다.",
    ].join("\n"),
  );
});

test("격식 B(정중형): 완충 + 양해·감사 맺음", () => {
  const b = generateDrafts(base).find((d) => d.id === "polite")!;
  assert.equal(
    b.body,
    [
      "안녕하십니까, ○○님. ○○회계법인 ○○○입니다.",
      "",
      "다름이 아니라, 재고자산 조회서를 6월 30일까지 회신 부탁드리고자 연락드립니다. 형식은 PDF로 부탁드립니다.",
      "",
      "바쁘신 중 번거롭게 해드려 죄송합니다. 확인 부탁드리며, 문의사항 있으시면 회신 주시기 바랍니다. 감사합니다.",
    ].join("\n"),
  );
});

test("격식 C(간결형): 최소 인사 + 형식 인라인 + 짧은 맺음", () => {
  const c = generateDrafts(base).find((d) => d.id === "brief")!;
  assert.equal(
    c.body,
    [
      "○○님, 안녕하십니까.",
      "",
      "재고자산 조회서를 6월 30일까지 회신(형식 PDF) 부탁드립니다. 감사합니다.",
    ].join("\n"),
  );
});

// ── 톤 × 변형이 실제로 다름 ──
test("격식·친근 × A·B·C = 6종이 서로 다르다", () => {
  const bodies = [
    ...generateDrafts({ ...base, tone: "formal" }),
    ...generateDrafts({ ...base, tone: "friendly" }),
  ].map((d) => d.body);
  assert.equal(new Set(bodies).size, 6, "6종 본문이 모두 달라야 함");
});

test("친근 톤은 어투가 격식과 다르다(부탁드려요/감사합니다!)", () => {
  const f = generateDrafts({ ...base, tone: "friendly" }).find(
    (d) => d.id === "point",
  )!;
  assert.ok(f.body.includes("부탁드려요"));
  assert.ok(f.body.includes("감사합니다!"));
});

// ── 공통 계약 ──
test("항상 정확히 3개(요점/정중/간결)", () => {
  const drafts = generateDrafts(base);
  assert.equal(drafts.length, 3);
  assert.deepEqual(
    drafts.map((d) => d.badge),
    ["요점형", "정중형", "간결형"],
  );
});

test("결정론적: 같은 입력 → 같은 출력", () => {
  assert.deepEqual(generateDrafts(base), generateDrafts(base));
});

test("빈 필수값은 자리표시로 대체된다(날조 금지)", () => {
  const drafts = generateDrafts({
    ...base,
    request: { target: "", due: "", replyMethod: "reply" },
  });
  for (const d of drafts) {
    assert.ok(d.body.includes("[대상]"), `${d.id}: [대상] 자리표시 누락`);
    assert.ok(d.body.includes("[기한]"), `${d.id}: [기한] 자리표시 누락`);
  }
});

test("회신 방법 라벨이 문장에 반영된다(공유/제출)", () => {
  const share = generateDrafts({
    ...base,
    request: { ...base.request, replyMethod: "share" },
  }).find((d) => d.id === "point")!;
  assert.ok(share.body.includes(`${REPLY_METHOD_LABELS.share} 부탁드립니다`));
});

test("형식이 없으면 형식 문장이 들어가지 않는다", () => {
  const noFmt = generateDrafts({
    ...base,
    request: { target: "자료", due: "내일", replyMethod: "reply" },
  }).find((d) => d.id === "point")!;
  assert.ok(!noFmt.body.includes("형식은"));
  assert.ok(!noFmt.body.includes("(형식"));
});

test("포함 문구는 인사 바로 뒤에 삽입된다", () => {
  const d = generateDrafts({ ...base, phrases: ["holiday"] }).find(
    (d) => d.id === "point",
  )!;
  const iGreet = d.body.indexOf("○○회계법인");
  const iPhrase = d.body.indexOf(PHRASE_BLOCKS.holiday.text);
  assert.ok(iPhrase > iGreet, "안부(포함 문구)가 인사 뒤에 와야 함");
  assert.ok(
    iPhrase < d.body.indexOf("재고자산"),
    "안부가 본론(요청)보다 앞에 와야 함",
  );
});

test("비고는 한 줄로 덧붙는다", () => {
  const note = "회신 시 담당자 성함 기재 부탁드립니다.";
  const d = generateDrafts({
    ...base,
    request: { ...base.request, note },
  }).find((d) => d.id === "point")!;
  assert.ok(d.body.includes(note));
});

test("제목은 '[자료 요청] {대상}' 으로 구성된다", () => {
  assert.equal(generateDrafts(base)[0].subject, "[자료 요청] 재고자산 조회서");
});
