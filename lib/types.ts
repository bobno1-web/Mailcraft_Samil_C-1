// lib/types.ts
// ─────────────────────────────────────────────────────────────────────────────
// 메일크래프트의 "틀"(규격)을 한곳에 모은 파일입니다.
// 여기 있는 key 타입(RecipientKey / ToneKey / PhraseKey)이 전체의 '기준'입니다.
// 이 key 들을 바꾸면 options.ts, templates.ts 도 반드시 함께 바꿔야 합니다.
// (왜인지와 방법은 docs/contributing/templates.md 참고)
//
// v2(자료 요청): '메모 한 칸' 대신 구조화 필드(RequestFields)로 입력받고,
//                톤(격식/친근) × 변형(요점/정중/간결) 3종 초안을 조립합니다.
// ─────────────────────────────────────────────────────────────────────────────

/** 받는 사람 유형 key. 새 유형을 추가하려면 여기에 먼저 한 줄 추가합니다. */
export type RecipientKey = "client" | "internal" | "partner" | "exec";

/**
 * 말투(톤) key.
 * - 작성 화면에서 고를 수 있는 톤은 formal(격식)·friendly(친근) 2개입니다.
 * - concise(간결)는 기존 모범 메일(data/models.ts)이 쓰고 있어 '표시용'으로 남겨 둡니다.
 *   (v2에서 '간결'은 톤이 아니라 변형(Variant)으로 옮겨졌습니다)
 */
export type ToneKey = "formal" | "friendly" | "concise";

/** 끼워 넣는 포함 문구(블록) key. (선택 순서와 무관하게 '고정 순서'로 삽입됨) */
export type PhraseKey = "holiday" | "health" | "thanks";

/** 회신 방법 key. (기본값 reply=회신) */
export type ReplyMethodKey = "reply" | "share" | "submit";

/** 초안 변형(한 톤 안에서 3가지 배치). */
export type VariantKey = "point" | "polite" | "brief";

/** 화면에 보여줄 선택지 하나. (드롭다운/버튼/칩에 그대로 쓰입니다) */
export interface Option<K extends string> {
  /** 코드에서 쓰는 고정 값. 위 key 타입 중 하나여야 합니다. */
  key: K;
  /** 사람이 읽는 이름(한글). */
  label: string;
  /** 보조 설명(선택). */
  description?: string;
}

/**
 * 받는 사람별 호칭 틀.
 * v1(자료 요청)에서는 호칭 자리(salutationName)만 씁니다.
 * 지금은 모두 "○○님" placeholder 이지만, 팀이 수신자별로 다르게 다듬을 수 있도록 분리해 둡니다.
 */
export interface RecipientVoice {
  /** 인사말의 호칭 자리. 예: "○○님" (팀이 exec 는 "○○ 전무님" 등으로 조정 가능) */
  salutationName: string;
}

/**
 * 톤별 어투 블록. 인사/완충/맺음/서술어를 한곳에 모아 둡니다.
 * (팀이 나중에 다듬는 "좋은 메일 기준"의 자료요청 v1 문구)
 * {name} 자리에는 RecipientVoice.salutationName 이 들어갑니다.
 */
export interface ToneVoice {
  /** A·B 변형의 인사(보내는 사람 소개 포함). 예: "안녕하십니까, {name}. ○○회계법인 ○○○입니다." */
  greetingFull: string;
  /** C(간결) 변형의 짧은 인사. 예: "{name}, 안녕하십니까." */
  greetingMin: string;
  /** 요청 서술어. 예: "부탁드립니다" / "부탁드려요" */
  ask: string;
  /** 정중형(B) 요청 서술어. 예: "부탁드리고자 연락드립니다" */
  askPolite: string;
  /** 정중형(B) 완충 머리말. 예: "다름이 아니라," */
  bufferPolite: string;
  /** 형식 문장 머리말. 예: "형식은" */
  formatLead: string;
  /** 요점형(A) 맺음. 예: "확인 부탁드립니다. 감사합니다." */
  closingPoint: string;
  /** 정중형(B) 맺음(양해+감사). */
  closingPolite: string;
  /** 간결형(C) 맺음. 예: "감사합니다." / "감사합니다!" */
  closingBrief: string;
}

/** 포함 문구 블록 하나의 실제 내용. */
export interface PhraseBlock {
  /** 자기 자신의 key (Record 의 key 와 같아야 함 — 가드가 검사합니다). */
  key: PhraseKey;
  label: string;
  /** 본문에 삽입될 실제 문장. */
  text: string;
}

/** 1단계(입력)의 '자료 요청' 구조화 필드. */
export interface RequestFields {
  /** 대상(무엇을) — 필수. 예: "재고자산 조회서" */
  target: string;
  /** 기한(언제까지) — 필수. 예: "6월 30일" */
  due: string;
  /** 형식(선택). 예: "PDF" */
  format?: string;
  /** 회신 방법(기본 reply=회신). */
  replyMethod: ReplyMethodKey;
  /** 비고(선택) — 한 줄로 덧붙습니다. */
  note?: string;
}

/** 1단계(입력): 작성자가 고르고 적는 값. */
export interface ComposeInput {
  recipient: RecipientKey;
  /** 작성 화면에서는 formal/friendly 만 선택됩니다. */
  tone: ToneKey;
  /** 포함할 문구 블록들(복수 선택). 본문엔 고정 순서로 들어갑니다. */
  phrases: PhraseKey[];
  /** 자료 요청 구조화 입력. */
  request: RequestFields;
}

/** 2단계(초안): generateDrafts() 가 만들어 내는 결과 하나. */
export interface Draft {
  id: string;
  /** 어떤 버전인지(예: "버전 A"). */
  title: string;
  /** 변형 성격 배지(예: "요점형"). 화면 pill 에 표시. */
  badge?: string;
  body: string;
  /** 제목(자료 요청에서 자동 구성). 없으면 화면에서 제목 줄을 숨깁니다. */
  subject?: string;
}

/** 모범 메일 1건. reasons 는 '왜 모범인가'로 반드시 채워야 합니다(날조 금지의 연장). */
export interface ModelMail {
  id: string;
  title: string;
  recipient: RecipientKey;
  tone: ToneKey;
  subject: string;
  body: string;
  /** 왜 이 메일이 모범인지(최소 2개). 2개 미만이면 가드가 커밋을 막습니다. */
  reasons: string[];
}

/**
 * 체크리스트 항목의 종류.
 * - "assist": 앱이 자동으로 도와줄 수 있는 확인(예: 빈 제목 감지).
 * - "self":   사람이 눈으로 직접 봐야 하는 자가확인(예: 첨부 누락).
 */
export type ChecklistKind = "assist" | "self";

/** 3단계(점검): 체크리스트 항목 하나. */
export interface ChecklistItem {
  id: string;
  label: string;
  kind: ChecklistKind;
  /** 보조 설명/예시(선택). */
  hint?: string;
}
