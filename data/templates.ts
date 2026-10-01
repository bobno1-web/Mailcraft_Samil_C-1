// data/templates.ts
// ─────────────────────────────────────────────────────────────────────────────
// 메일크래프트의 "핵심 조합 로직"이 있는 파일입니다.
//
// 절대 원칙:
//  1) 외부 API/AI 를 쓰지 않습니다. 아래 틀을 "결정론적으로" 이어 붙일 뿐입니다.
//     (같은 입력 → 항상 같은 결과. 무작위/네트워크 없음)
//  2) 없는 사실을 지어내지 않습니다. 본문의 '내용'은 작성자가 넣은 points 에서만 옵니다.
//
// 아래 세 묶음은 Record<...Key, ...> 로 선언되어 있어서,
// key 를 빠뜨리거나 오타를 내면 TypeScript(tsc) 가 바로 잡아 줍니다.
// → "틀을 깨는 변경"은 막고, "규격을 지킨 추가"는 통과하는 구조.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  RecipientKey,
  ToneKey,
  PhraseKey,
  RecipientTemplate,
  ToneTemplate,
  PhraseBlock,
  ComposeInput,
  Draft,
} from "../lib/types";

/** 받는 사람별 인사/맺음 틀. (key 는 RecipientKey 전부가 있어야 함) */
export const RECIPIENT_TEMPLATES: Record<RecipientKey, RecipientTemplate> = {
  client: {
    salutation: "{name}님, 안녕하세요.",
    signoff: "감사합니다.\n드림",
  },
  internal: {
    salutation: "{name}님, 안녕하세요.",
    signoff: "감사합니다.",
  },
  partner: {
    salutation: "{name}님, 안녕하세요.",
    signoff: "앞으로도 잘 부탁드립니다.\n드림",
  },
};

/** 톤별 여는 문장/닫는 문장 틀. (key 는 ToneKey 전부가 있어야 함) */
export const TONE_TEMPLATES: Record<ToneKey, ToneTemplate> = {
  formal: {
    opening: "아래와 같이 안내드립니다.",
    closing: "확인 부탁드리며, 문의 사항이 있으시면 회신 주시기 바랍니다.",
  },
  friendly: {
    opening: "아래 내용 공유드려요.",
    closing: "편하게 회신 주세요. 감사합니다!",
  },
  concise: {
    opening: "요점만 전달드립니다.",
    closing: "회신 부탁드립니다.",
  },
};

/** 포함 문구 블록 실제 내용. (key 는 PhraseKey 전부가 있어야 함) */
export const PHRASE_BLOCKS: Record<PhraseKey, PhraseBlock> = {
  greeting: {
    key: "greeting",
    label: "인사말",
    text: "요즘 업무로 바쁘실 텐데 시간 내 주셔서 감사합니다.",
  },
  apology: {
    key: "apology",
    label: "양해 요청",
    text: "회신이 늦어진 점 양해 부탁드립니다.",
  },
  deadline: {
    key: "deadline",
    label: "기한 안내",
    text: "가능하시면 회신 기한을 함께 알려 주시면 감사하겠습니다.",
  },
  thanks: {
    key: "thanks",
    label: "감사 인사",
    text: "늘 협조해 주셔서 감사합니다.",
  },
};

/** points(불릿)를 본문 리스트로 바꿉니다. 내용은 그대로, 지어내지 않습니다. */
function renderPoints(points: string[]): string {
  const clean = points.map((p) => p.trim()).filter((p) => p.length > 0);
  if (clean.length === 0) {
    // 지어내지 않음: 내용이 없으면 작성자가 채우도록 자리만 남깁니다.
    return "- (여기에 전달할 내용을 적어 주세요)";
  }
  return clean.map((p) => `- ${p}`).join("\n");
}

/** 선택된 포함 문구 블록들을 한 덩어리로 묶습니다(선택 순서 유지). */
function renderPhrases(phrases: PhraseKey[]): string {
  return phrases
    .map((k) => PHRASE_BLOCKS[k]?.text)
    .filter((t): t is string => Boolean(t))
    .join("\n");
}

/** 본문을 '정해진 순서'로 조립합니다. layout 에 따라 배치만 달라집니다. */
function assembleBody(
  input: ComposeInput,
  layout: "points-first" | "context-first",
): string {
  const recipient = RECIPIENT_TEMPLATES[input.recipient];
  const tone = TONE_TEMPLATES[input.tone];
  const name = input.recipientName?.trim() || "담당자";
  const salutation = recipient.salutation.replace("{name}", name);
  const phrases = renderPhrases(input.phrases);
  const points = renderPoints(input.points);

  // 섹션을 순서대로 모은 뒤, 비어 있는 섹션(예: 포함문구 미선택)은 걸러냅니다.
  // 각 섹션 사이는 빈 줄 하나로 구분합니다.
  const sections: string[] =
    layout === "points-first"
      ? [
          salutation,
          tone.opening,
          points,
          phrases,
          tone.closing,
          recipient.signoff,
        ]
      : [
          salutation,
          tone.opening,
          phrases,
          points,
          tone.closing,
          recipient.signoff,
        ];

  return sections
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .join("\n\n")
    .trim();
}

/**
 * 핵심 함수: 입력(ComposeInput) → 초안 여러 개(Draft[]).
 * 외부 호출/무작위 없이, 두 가지 배치(layout)로 결정론적 초안 2건을 만듭니다.
 * 같은 입력이면 언제나 같은 초안이 나옵니다.
 */
export function generateDrafts(input: ComposeInput): Draft[] {
  const subject = input.subject.trim() || "(제목 없음)";
  const layouts: Array<{
    id: string;
    title: string;
    layout: "points-first" | "context-first";
  }> = [
    { id: "points-first", title: "요점 먼저", layout: "points-first" },
    { id: "context-first", title: "맥락 먼저", layout: "context-first" },
  ];

  return layouts.map((l) => ({
    id: l.id,
    title: l.title,
    subject,
    body: assembleBody(input, l.layout),
  }));
}
