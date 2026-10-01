// data/templates.ts
// ─────────────────────────────────────────────────────────────────────────────
// 메일크래프트의 "핵심 조합 로직"이 있는 파일입니다.
//
// 절대 원칙:
//  1) 외부 API/AI 를 쓰지 않습니다. 아래 틀을 "결정론적으로" 이어 붙일 뿐입니다.
//     (같은 입력 → 항상 같은 결과. 무작위/네트워크 없음)
//  2) 없는 사실을 지어내지 않습니다. 본문의 '내용'은 작성자가 넣은 content 에서만 옵니다.
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

/**
 * 받는 사람별 호칭(salutation)/맺음말(signoff) 틀.
 * (key 는 RecipientKey 전부가 있어야 함)
 * 수신자마다 호칭·맺음말이 '다르게' 적용됩니다(예: exec=가장 격식).
 */
export const RECIPIENT_TEMPLATES: Record<RecipientKey, RecipientTemplate> = {
  exec: {
    // 가장 격식: "안녕하십니까" + "올림"
    salutation: "{name}님, 안녕하십니까.",
    signoff: "감사합니다.\n올림",
  },
  client: {
    // 사외 고객: 정중
    salutation: "{name}님, 안녕하세요.",
    signoff: "감사합니다.\n드림",
  },
  partner: {
    // 협력사: 지속 관계 강조
    salutation: "{name}님, 안녕하세요.",
    signoff: "앞으로도 잘 부탁드립니다.\n드림",
  },
  internal: {
    // 사내 동료: 표준
    salutation: "{name}님, 안녕하세요.",
    signoff: "감사합니다.",
  },
};

/** 톤별 여는 문장(도입부)/닫는 문장 틀. (key 는 ToneKey 전부가 있어야 함) */
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
  holiday: {
    key: "holiday",
    label: "명절 인사",
    text: "뜻깊은 명절 보내시길 바랍니다.",
  },
  health: {
    key: "health",
    label: "건강/안부",
    text: "환절기 건강에 유의하시길 바랍니다.",
  },
  thanks: {
    key: "thanks",
    label: "감사 인사",
    text: "늘 협조해 주셔서 감사합니다.",
  },
};

/**
 * 포함 문구의 '고정 삽입 순서'.
 * 사용자가 어떤 순서로 선택하든, 본문에는 항상 이 순서대로 들어갑니다.
 *
 * 순서 = PHRASE_BLOCKS 의 선언 순서입니다(JS 객체 key 순서는 선언 순서로 보장).
 * → 새 문구를 PHRASE_BLOCKS 에 추가하면 자동으로 이 순서에 포함됩니다.
 *   (별도 목록을 따로 관리하지 않으므로 "블록엔 있는데 순서엔 빠진" 누락 구멍이 없습니다)
 */
const PHRASE_ORDER = Object.keys(PHRASE_BLOCKS) as PhraseKey[];

/** 핵심 내용(content)을 본론 문자열로 바꿉니다. 비면 자리만 남깁니다(날조 금지). */
function renderContent(content: string): string {
  const clean = content.trim();
  return clean.length > 0 ? clean : "[전하실 내용을 입력해 주세요]";
}

/** 선택된 포함 문구를 '고정 순서'(PHRASE_ORDER)로 묶습니다(선택 순서 무시). */
function renderPhrases(phrases: PhraseKey[]): string {
  const selected = new Set(phrases);
  return PHRASE_ORDER.filter((k) => selected.has(k))
    .map((k) => PHRASE_BLOCKS[k].text)
    .join("\n");
}

/** 본문 배치 종류. */
type Layout = "points-first" | "context-first" | "brief";

/** 본문을 '정해진 순서'로 조립합니다. layout 에 따라 배치만 달라집니다. */
function assembleBody(input: ComposeInput, layout: Layout): string {
  const recipient = RECIPIENT_TEMPLATES[input.recipient];
  const tone = TONE_TEMPLATES[input.tone];
  const name = input.recipientName?.trim() || "담당자";
  const salutation = recipient.salutation.replace("{name}", name);
  const phrases = renderPhrases(input.phrases);
  const content = renderContent(input.content);

  // 섹션을 순서대로 모은 뒤, 비어 있는 섹션(예: 포함문구 미선택)은 걸러냅니다.
  // 각 섹션 사이는 빈 줄 하나로 구분합니다.
  let sections: string[];
  if (layout === "points-first") {
    sections = [
      salutation,
      tone.opening,
      content,
      phrases,
      tone.closing,
      recipient.signoff,
    ];
  } else if (layout === "context-first") {
    sections = [
      salutation,
      tone.opening,
      phrases,
      content,
      tone.closing,
      recipient.signoff,
    ];
  } else {
    // brief: 군더더기(도입/맺음 문장) 없이 핵심만
    sections = [salutation, content, phrases, recipient.signoff];
  }

  return sections
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .join("\n\n")
    .trim();
}

/**
 * 핵심 함수: 입력(ComposeInput) → 초안 3건(Draft[]).
 * 외부 호출/무작위 없이, 세 가지 배치(layout)로 결정론적 초안 3건을 만듭니다.
 * 같은 입력이면 언제나 같은 초안이 나옵니다.
 */
export function generateDrafts(input: ComposeInput): Draft[] {
  const subject = input.subject?.trim() || undefined;
  const layouts: Array<{ id: string; title: string; layout: Layout }> = [
    { id: "points-first", title: "요점 먼저", layout: "points-first" },
    { id: "context-first", title: "맥락 먼저", layout: "context-first" },
    { id: "brief", title: "짧게 핵심만", layout: "brief" },
  ];

  return layouts.map((l) => ({
    id: l.id,
    title: l.title,
    subject,
    body: assembleBody(input, l.layout),
  }));
}
