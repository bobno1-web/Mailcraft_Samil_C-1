// data/templates.ts
// ─────────────────────────────────────────────────────────────────────────────
// 메일크래프트의 "핵심 조합 로직"이 있는 파일입니다. (v2: 자료 요청 전용)
//
// 절대 원칙:
//  1) 외부 API/AI 를 쓰지 않습니다. 아래 틀을 "결정론적으로" 이어 붙일 뿐입니다.
//     (같은 입력 → 항상 같은 결과. 무작위/네트워크 없음)
//  2) 없는 사실을 지어내지 않습니다. 본문의 '내용'은 작성자가 넣은 구조화 입력에서만 옵니다.
//
// 구성:
//  - 톤(격식/친근) × 변형(요점 A / 정중 B / 간결 C) = 초안 3종.
//  - 한국어 조사(을/를·은/는·(으)로)는 받침 기준 순수 함수 josa() 로 처리합니다.
//  - 인사/완충/맺음/서술어는 TONE_VOICES 블록 상수로 분리했습니다(팀이 다듬는 기준 v1).
//
// 세 묶음(RECIPIENT_TEMPLATES / TONE_VOICES / PHRASE_BLOCKS)은 Record<...Key, ...> 라
// key 를 빠뜨리면 tsc 가, options 와 어긋나면 check:content 가 잡아 줍니다(3곳 동기화).
// ─────────────────────────────────────────────────────────────────────────────

import type {
  RecipientKey,
  ToneKey,
  PhraseKey,
  ReplyMethodKey,
  VariantKey,
  RecipientVoice,
  ToneVoice,
  PhraseBlock,
  RequestFields,
  ComposeInput,
  Draft,
} from "../lib/types";

/**
 * 받는 사람별 호칭. v1 에서는 모두 "○○님" placeholder 입니다.
 * (팀이 exec 를 "○○ 전무님" 등으로 수신자별로 다듬을 수 있게 분리해 둠)
 */
export const RECIPIENT_TEMPLATES: Record<RecipientKey, RecipientVoice> = {
  exec: { salutationName: "○○님" },
  client: { salutationName: "○○님" },
  partner: { salutationName: "○○님" },
  internal: { salutationName: "○○님" },
};

/**
 * 톤별 어투 블록. (key 는 ToneKey 전부가 있어야 함)
 * 작성 화면에서 고르는 톤은 formal/friendly 2개이고, concise 는 모범 메일 표시용으로만 남아 있어
 * 완전성을 위해 값만 둡니다(작성 흐름에서는 호출되지 않음).
 */
export const TONE_VOICES: Record<ToneKey, ToneVoice> = {
  formal: {
    greetingFull: "안녕하십니까, {name}. ○○회계법인 ○○○입니다.",
    greetingMin: "{name}, 안녕하십니까.",
    ask: "부탁드립니다",
    askPolite: "부탁드리고자 연락드립니다",
    bufferPolite: "다름이 아니라,",
    formatLead: "형식은",
    closingPoint: "확인 부탁드립니다. 감사합니다.",
    closingPolite:
      "바쁘신 중 번거롭게 해드려 죄송합니다. 확인 부탁드리며, 문의사항 있으시면 회신 주시기 바랍니다. 감사합니다.",
    closingBrief: "감사합니다.",
  },
  friendly: {
    greetingFull: "안녕하세요, {name}! ○○회계법인 ○○○입니다.",
    greetingMin: "{name}, 안녕하세요!",
    ask: "부탁드려요",
    askPolite: "부탁드리고자 연락드려요",
    bufferPolite: "다름이 아니라,",
    formatLead: "형식은",
    closingPoint: "확인 부탁드려요. 감사합니다!",
    closingPolite:
      "바쁘신 중에 번거롭게 해드려 죄송해요. 확인 부탁드리고, 궁금한 점 있으면 편하게 회신 주세요. 감사합니다!",
    closingBrief: "감사합니다!",
  },
  // concise: 모범 메일(data/models.ts) 표시용으로만 존재. 작성 흐름에서는 쓰이지 않음.
  concise: {
    greetingFull: "안녕하세요, {name}. ○○회계법인 ○○○입니다.",
    greetingMin: "{name}, 안녕하세요.",
    ask: "부탁드립니다",
    askPolite: "부탁드리고자 연락드립니다",
    bufferPolite: "다름이 아니라,",
    formatLead: "형식은",
    closingPoint: "회신 부탁드립니다. 감사합니다.",
    closingPolite: "확인 부탁드리며 회신 주시기 바랍니다. 감사합니다.",
    closingBrief: "감사합니다.",
  },
};

/** 회신 방법 라벨(문장에 그대로 들어감). (key 는 ReplyMethodKey 전부) */
export const REPLY_METHOD_LABELS: Record<ReplyMethodKey, string> = {
  reply: "회신",
  share: "공유",
  submit: "제출",
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

/** 포함 문구의 '고정 삽입 순서'(선언 순서). 새 문구를 추가하면 자동 포함됩니다. */
const PHRASE_ORDER = Object.keys(PHRASE_BLOCKS) as PhraseKey[];

// ── 한국어 조사 처리(받침 기준) ───────────────────────────────────────────────

type JosaKind = "을/를" | "은/는" | "으로/로";

/** 마지막 글자의 받침 정보. 한글 음절이 아니면 null(영문/숫자/기호). */
function lastSyllable(
  word: string,
): { hasFinal: boolean; isRieul: boolean } | null {
  const s = word.trim();
  if (!s) return null;
  const code = s.charCodeAt(s.length - 1);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const final = (code - 0xac00) % 28; // 0 = 받침 없음
    return { hasFinal: final !== 0, isRieul: final === 8 };
  }
  return null;
}

/**
 * 받침에 맞는 조사를 돌려줍니다(순수 함수).
 * - 한글이 아니면(영문/숫자) 받침 없는 형태로 처리합니다(관용: "PDF로", "CSV로").
 * - "으로/로": 받침 없거나 ㄹ받침이면 "로", 그 외 "으로".
 */
export function josa(word: string, kind: JosaKind): string {
  const info = lastSyllable(word);
  const hasFinal = info ? info.hasFinal : false;
  const isRieul = info ? info.isRieul : false;
  switch (kind) {
    case "을/를":
      return hasFinal ? "을" : "를";
    case "은/는":
      return hasFinal ? "은" : "는";
    case "으로/로":
      return !hasFinal || isRieul ? "로" : "으로";
  }
}

// ── 문장 조립 ────────────────────────────────────────────────────────────────

/** 값이 비면 자리표시자로(날조 금지). */
function orPlaceholder(value: string | undefined, placeholder: string): string {
  const s = (value ?? "").trim();
  return s.length > 0 ? s : placeholder;
}

/** "{대상}을/를 {기한}까지 {회신방법}" 공통 조각. */
function objectPhrase(req: RequestFields): string {
  const target = orPlaceholder(req.target, "[대상]");
  const due = orPlaceholder(req.due, "[기한]");
  const reply = REPLY_METHOD_LABELS[req.replyMethod];
  return `${target}${josa(target, "을/를")} ${due}까지 ${reply}`;
}

/** "형식은 {형식}(으)로 부탁드립니다." (형식 없으면 빈 문자열). 앞에 공백 하나 포함. */
function formatSentence(req: RequestFields, voice: ToneVoice): string {
  const fmt = (req.format ?? "").trim();
  if (!fmt) return "";
  return ` ${voice.formatLead} ${fmt}${josa(fmt, "으로/로")} ${voice.ask}.`;
}

/** 선택된 포함 문구를 '고정 순서'로 묶습니다(안부 블록, 인사 뒤에 삽입). */
function renderPhrases(phrases: PhraseKey[]): string {
  const selected = new Set(phrases);
  return PHRASE_ORDER.filter((k) => selected.has(k))
    .map((k) => PHRASE_BLOCKS[k].text)
    .join("\n");
}

/** 인사말({name} 치환). */
function greeting(
  voice: ToneVoice,
  salutationName: string,
  full: boolean,
): string {
  const g = full ? voice.greetingFull : voice.greetingMin;
  return g.replace("{name}", salutationName);
}

/** 한 변형(A/B/C)의 본문을 조립합니다. 섹션을 \n\n 으로 잇고 빈 섹션은 걸러냅니다. */
function assembleBody(
  variant: VariantKey,
  voice: ToneVoice,
  salutationName: string,
  req: RequestFields,
  phrasesText: string,
): string {
  const obj = objectPhrase(req);
  const fmt = formatSentence(req, voice);
  const note = (req.note ?? "").trim();

  let sections: string[];
  if (variant === "point") {
    // A 요점형: 인사 + 요청문장 + 간단 맺음
    sections = [
      greeting(voice, salutationName, true),
      phrasesText,
      `${obj} ${voice.ask}.${fmt}`,
      note,
      voice.closingPoint,
    ];
  } else if (variant === "polite") {
    // B 정중형: 인사 + 완충 + 요청문장 + 양해·감사 맺음
    sections = [
      greeting(voice, salutationName, true),
      phrasesText,
      `${voice.bufferPolite} ${obj} ${voice.askPolite}.${fmt}`,
      note,
      voice.closingPolite,
    ];
  } else {
    // C 간결형: 최소 인사 + 요청문장(형식 인라인) + 짧은 맺음
    const fmtInline = (req.format ?? "").trim()
      ? `(형식 ${req.format!.trim()})`
      : "";
    sections = [
      greeting(voice, salutationName, false),
      phrasesText,
      `${obj}${fmtInline} ${voice.ask}. ${voice.closingBrief}`,
      note,
    ];
  }

  return sections
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .join("\n\n")
    .trim();
}

/** 제목 자동 구성: "[자료 요청] {대상}". 대상이 비면 제목을 숨깁니다. */
function buildSubject(req: RequestFields): string | undefined {
  const t = (req.target ?? "").trim();
  return t ? `[자료 요청] ${t}` : undefined;
}

/**
 * 핵심 함수: 입력(ComposeInput) → 초안 3건(Draft[]).
 * 선택한 톤 안에서 요점(A)·정중(B)·간결(C) 3가지 변형을 결정론적으로 만듭니다.
 * 같은 입력이면 언제나 같은 초안이 나옵니다.
 */
export function generateDrafts(input: ComposeInput): Draft[] {
  const voice = TONE_VOICES[input.tone];
  const salutationName = RECIPIENT_TEMPLATES[input.recipient].salutationName;
  const phrasesText = renderPhrases(input.phrases);
  const subject = buildSubject(input.request);

  const variants: Array<{
    id: string;
    title: string;
    badge: string;
    variant: VariantKey;
  }> = [
    { id: "point", title: "버전 A", badge: "요점형", variant: "point" },
    { id: "polite", title: "버전 B", badge: "정중형", variant: "polite" },
    { id: "brief", title: "버전 C", badge: "간결형", variant: "brief" },
  ];

  return variants.map((v) => ({
    id: v.id,
    title: v.title,
    badge: v.badge,
    subject,
    body: assembleBody(
      v.variant,
      voice,
      salutationName,
      input.request,
      phrasesText,
    ),
  }));
}
