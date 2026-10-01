// data/send.test.ts
// ─────────────────────────────────────────────────────────────────────────────
// data/send.ts 의 순수 도우미들의 '계약'(contract)을 고정하는 단위 테스트입니다.
//   실행: npm test   (= node --import tsx --test "data/**/*.test.ts")
//
// 검증하는 계약:
//   - buildMailtoUrl: to 만 / cc+subject+body / 빈 값 생략 / 인코딩·순서(?,&)
//   - splitAddresses / invalidAddresses: 쉼표·세미콜론 분리, '@' 없는 토큰 탐지
//   - assembleFinalText: 제목·마감 유무에 따른 형식(복사=mailto 본문 동일성의 근거)
// ─────────────────────────────────────────────────────────────────────────────

import test from "node:test";
import assert from "node:assert/strict";
import {
  splitAddresses,
  invalidAddresses,
  buildMailtoUrl,
  assembleFinalText,
} from "./send";

test("buildMailtoUrl: to 만 있으면 mailto:<to> 뿐이다(파라미터 없음)", () => {
  assert.equal(buildMailtoUrl({ to: "a@x.com" }), "mailto:a@x.com");
});

test("buildMailtoUrl: to 는 그대로 두고 @/쉼표를 인코딩하지 않는다", () => {
  assert.equal(
    buildMailtoUrl({ to: "a@x.com, b@y.com" }),
    "mailto:a@x.com, b@y.com",
  );
});

test("buildMailtoUrl: cc+subject+body 를 순서(?cc&subject&body)대로 잇고 값은 인코딩한다", () => {
  const url = buildMailtoUrl({
    to: "a@x.com",
    cc: "c@z.com",
    subject: "회의 안내",
    body: "본문 줄1\n줄2",
  });
  // 전체 형태 고정(순서 cc→subject→body, 값은 encodeURIComponent)
  assert.equal(
    url,
    "mailto:a@x.com?cc=" +
      encodeURIComponent("c@z.com") +
      "&subject=" +
      encodeURIComponent("회의 안내") +
      "&body=" +
      encodeURIComponent("본문 줄1\n줄2"),
  );
  // 세부: '?' 는 한 번, 파라미터 순서, 공백/줄바꿈 인코딩 확인
  assert.ok(url.startsWith("mailto:a@x.com?"));
  assert.equal(url.split("?").length, 2);
  const query = url.split("?")[1];
  assert.ok(query.startsWith("cc="));
  assert.ok(query.includes("&subject="));
  assert.ok(query.includes("&body="));
  assert.ok(url.includes("%20"), "공백은 %20 으로 인코딩돼야 함");
  assert.ok(url.includes("%0A"), "줄바꿈은 %0A 로 인코딩돼야 함");
});

test("buildMailtoUrl: 빈 값(cc/subject/body)은 파라미터에서 생략된다", () => {
  assert.equal(
    buildMailtoUrl({ to: "a@x.com", cc: "", subject: "  ", body: "" }),
    "mailto:a@x.com",
  );
});

test("splitAddresses: 쉼표/세미콜론으로 나누고 공백 정리·빈 칸 제거", () => {
  assert.deepEqual(splitAddresses("a@x.com, b@y.com; c@z.com"), [
    "a@x.com",
    "b@y.com",
    "c@z.com",
  ]);
  assert.deepEqual(splitAddresses("  ,; "), []);
});

test("invalidAddresses: '@' 없는 토큰만 골라낸다(정상 주소는 통과)", () => {
  assert.deepEqual(invalidAddresses("a@x.com, 오타주소, b@y.com; 또오타"), [
    "오타주소",
    "또오타",
  ]);
  assert.deepEqual(invalidAddresses("a@x.com; b@y.com"), []);
});

test("assembleFinalText: 제목 없고 마감 없으면 본문 그대로", () => {
  assert.equal(assembleFinalText({ body: "본문입니다." }), "본문입니다.");
});

test("assembleFinalText: 제목이 있으면 '제목: ...' + 빈 줄 + 본문", () => {
  assert.equal(
    assembleFinalText({ subject: "안내", body: "본문" }),
    "제목: 안내\n\n본문",
  );
});

test("assembleFinalText: 마감이 있으면 끝에 빈 줄 + '회신 기한: ...'", () => {
  assert.equal(
    assembleFinalText({ body: "본문", deadline: "10/15(수) 18시" }),
    "본문\n\n회신 기한: 10/15(수) 18시",
  );
});

test("assembleFinalText: 제목+본문+마감 모두 있으면 셋을 빈 줄로 잇는다", () => {
  assert.equal(
    assembleFinalText({ subject: "안내", body: "본문", deadline: "내일" }),
    "제목: 안내\n\n본문\n\n회신 기한: 내일",
  );
});
