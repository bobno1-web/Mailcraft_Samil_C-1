// data/checklist.test.ts
// ─────────────────────────────────────────────────────────────────────────────
// 발송 게이트(isChecklistComplete)의 '계약'(contract)을 고정하는 단위 테스트입니다.
//   실행: npm test
//
// 검증하는 계약:
//   - 아무것도 체크 안 하면 false (점검할 항목이 있으므로)
//   - 모든 항목 체크 → true
//   - 하나라도 빠지면(또는 꺼지면) false
//   - 검사할 항목이 빈 배열이면 true (막을 항목이 없음 — vacuous)
// ─────────────────────────────────────────────────────────────────────────────

import test from "node:test";
import assert from "node:assert/strict";
import { CHECKLIST, isChecklistComplete } from "./checklist";

/** CHECKLIST 의 모든 id 를 true 로 채운 맵을 만든다. */
function allChecked(): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (const item of CHECKLIST) map[item.id] = true;
  return map;
}

test("아무것도 체크하지 않으면 false (점검할 항목이 있으므로)", () => {
  assert.ok(CHECKLIST.length > 0, "전제: 체크리스트에 항목이 있어야 함");
  assert.equal(isChecklistComplete({}), false);
});

test("모든 항목을 체크하면 true", () => {
  assert.equal(isChecklistComplete(allChecked()), true);
});

test("하나라도 빠지면 false", () => {
  const map = allChecked();
  delete map[CHECKLIST[0].id];
  assert.equal(isChecklistComplete(map), false);
});

test("false 로 꺼진 항목이 있으면 false", () => {
  const map = allChecked();
  map[CHECKLIST[0].id] = false;
  assert.equal(isChecklistComplete(map), false);
});

test("검사할 항목이 빈 배열이면 true (막을 항목이 없음 — vacuous)", () => {
  assert.equal(isChecklistComplete({}, []), true);
});
