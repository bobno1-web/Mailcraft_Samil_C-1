// data/send.ts
// ─────────────────────────────────────────────────────────────────────────────
// 발송 준비 단계에서 쓰는 '순수 도우미'들입니다. (compose 3단계: 점검 → 발송)
//
// 절대 원칙(이 파일도 동일):
//  1) 외부 API/AI/네트워크/무작위 없음. 입력만으로 결과가 정해집니다(결정론적).
//     → 같은 입력이면 buildMailtoUrl/assembleFinalText 결과도 항상 같습니다.
//  2) 없는 사실을 지어내지 않습니다. 제목·본문·주소·마감은 모두 '작성자가 입력한 값'뿐입니다.
//     (마감 회신 기한도 작성자가 직접 적은 것이므로 날조가 아닙니다)
//
// 화면(React) 없이도 단위 테스트할 수 있도록 분리했습니다(data/send.test.ts).
// ─────────────────────────────────────────────────────────────────────────────

/** 주소 문자열을 쉼표(,)/세미콜론(;) 기준으로 나눠 공백을 다듬고 빈 칸은 버립니다. */
export function splitAddresses(raw: string): string[] {
  return raw
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * '@' 가 없는(= 형식이 의심되는) 주소 토큰만 골라 돌려줍니다.
 * - 앱 보조(assist) 경고용입니다. 발송을 '막지는' 않습니다(안내만).
 */
export function invalidAddresses(raw: string): string[] {
  return splitAddresses(raw).filter((addr) => !addr.includes("@"));
}

/**
 * mailto: URL 을 조립합니다.
 * - to 는 mailto: 바로 뒤에 '그대로'(trim 만) 둡니다. (@/쉼표를 인코딩하지 않음)
 * - cc/subject/body 는 값마다 encodeURIComponent 로 인코딩해 ?a&b&c 로 잇습니다.
 * - 비어 있는 항목은 아예 넣지 않습니다(빈 파라미터 생략).
 * - 순서는 cc → subject → body 로 고정합니다(결정론적).
 */
export function buildMailtoUrl(fields: {
  to?: string;
  cc?: string;
  subject?: string;
  body?: string;
}): string {
  const to = (fields.to ?? "").trim();
  const base = `mailto:${to}`;

  const params: string[] = [];
  // cc/subject: 앞뒤 공백은 의미가 없어 다듬고, 빈 값이면 생략합니다.
  const cc = (fields.cc ?? "").trim();
  if (cc.length > 0) params.push(`cc=${encodeURIComponent(cc)}`);
  const subject = (fields.subject ?? "").trim();
  if (subject.length > 0) params.push(`subject=${encodeURIComponent(subject)}`);
  // body: 줄바꿈/공백이 의미가 있으므로 trim 하지 않고, 빈 문자열일 때만 생략합니다.
  const body = fields.body ?? "";
  if (body.length > 0) params.push(`body=${encodeURIComponent(body)}`);

  return params.length > 0 ? `${base}?${params.join("&")}` : base;
}

/**
 * 복사·mailto 양쪽에서 '똑같이' 쓰는 최종 텍스트를 만듭니다(두 경로가 어긋나지 않게).
 * 형식:
 *   (제목이 있으면) "제목: {subject}" + 빈 줄
 *   본문
 *   (마감이 있으면) 빈 줄 + "회신 기한: {deadline}"
 * 모든 조각은 작성자가 입력한 값에서만 나옵니다(날조 금지).
 */
export function assembleFinalText(parts: {
  subject?: string;
  body: string;
  deadline?: string;
}): string {
  const segments: string[] = [];
  const subject = (parts.subject ?? "").trim();
  if (subject.length > 0) segments.push(`제목: ${subject}`);
  segments.push(parts.body);
  const deadline = (parts.deadline ?? "").trim();
  if (deadline.length > 0) segments.push(`회신 기한: ${deadline}`);
  return segments.join("\n\n");
}
