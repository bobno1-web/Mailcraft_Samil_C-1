// lib/types.ts
// ─────────────────────────────────────────────────────────────────────────────
// 메일크래프트의 "틀"(규격)을 한곳에 모은 파일입니다.
// 여기 있는 key 타입(RecipientKey / ToneKey / PhraseKey)이 전체의 '기준'입니다.
// 이 key 들을 바꾸면 options.ts, templates.ts 도 반드시 함께 바꿔야 합니다.
// (왜인지와 방법은 docs/contributing/templates.md 참고)
// ─────────────────────────────────────────────────────────────────────────────

/** 받는 사람 유형 key. 새 유형을 추가하려면 여기에 먼저 한 줄 추가합니다. */
export type RecipientKey = "client" | "internal" | "partner";

/** 말투(톤) key. */
export type ToneKey = "formal" | "friendly" | "concise";

/** 끼워 넣는 포함 문구(블록) key. */
export type PhraseKey = "greeting" | "apology" | "deadline" | "thanks";

/** 화면에 보여줄 선택지 하나. (드롭다운/버튼에 그대로 쓰입니다) */
export interface Option<K extends string> {
  /** 코드에서 쓰는 고정 값. 위 key 타입 중 하나여야 합니다. */
  key: K;
  /** 사람이 읽는 이름(한글). */
  label: string;
  /** 보조 설명(선택). */
  description?: string;
}

/** 받는 사람별 머리말/맺음말 틀. */
export interface RecipientTemplate {
  /** 첫 인사. {name} 자리에 받는 분 이름이 들어갑니다. */
  salutation: string;
  /** 서명/맺음. */
  signoff: string;
}

/** 톤별 여는 문장/닫는 문장 틀. */
export interface ToneTemplate {
  opening: string;
  closing: string;
}

/** 포함 문구 블록 하나의 실제 내용. */
export interface PhraseBlock {
  /** 자기 자신의 key (Record 의 key 와 같아야 함 — 가드가 검사합니다). */
  key: PhraseKey;
  label: string;
  /** 본문에 삽입될 실제 문장. */
  text: string;
}

/** 1단계(입력): 작성자가 고르고 적는 값. */
export interface ComposeInput {
  recipient: RecipientKey;
  tone: ToneKey;
  /** 포함할 문구 블록들. */
  phrases: PhraseKey[];
  /** 제목. */
  subject: string;
  /** 작성자가 직접 적는 '사실' 항목들(불릿). 지어내지 않습니다. */
  points: string[];
  /** 받는 분 이름(선택). salutation 의 {name} 에 들어감. */
  recipientName?: string;
}

/** 2단계(초안): generateDrafts() 가 만들어 내는 결과 하나. */
export interface Draft {
  id: string;
  /** 어떤 조합/배치인지 설명하는 제목. */
  title: string;
  subject: string;
  body: string;
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
