// lib/options.ts
// ─────────────────────────────────────────────────────────────────────────────
// 화면(드롭다운/버튼)에 보여줄 '선택지 목록'입니다.
// 여기 key 들은 lib/types.ts 의 key 타입과, data/templates.ts 의 Record key 와
// "셋 다" 똑같이 맞아야 합니다. (하나만 고치면 버그 → 가드가 잡아 줍니다)
//
// 라벨/설명은 사실을 지어내지 말고 팀이 쓰는 표현으로 바꾸면 됩니다.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Option,
  RecipientKey,
  ToneKey,
  PhraseKey,
  ReplyMethodKey,
} from "./types";

/** 받는 사람 유형 선택지. (수신자별 호칭·맺음말이 다르게 적용됩니다) */
export const RECIPIENT_OPTIONS: ReadonlyArray<Option<RecipientKey>> = [
  {
    key: "exec",
    label: "임원/상사",
    description: "사내 상급자·결재자 (가장 격식)",
  },
  { key: "client", label: "고객사", description: "사외 고객·거래처" },
  { key: "partner", label: "협력사", description: "외부 파트너·협력 업체" },
  { key: "internal", label: "사내", description: "같은 회사/팀 동료" },
];

/**
 * 말투(톤) 선택지(전체). 모범 메일 표시용 라벨 매핑 + 형식 가드에 쓰입니다.
 * concise(간결)는 기존 모범 메일이 쓰고 있어 라벨용으로 남겨 둡니다.
 * (작성 화면에서 고르는 톤은 아래 COMPOSE_TONE_OPTIONS 2개입니다)
 */
export const TONE_OPTIONS: ReadonlyArray<Option<ToneKey>> = [
  { key: "formal", label: "격식", description: "정중하고 공식적인 말투" },
  { key: "friendly", label: "친근", description: "부드럽고 가까운 말투" },
  {
    key: "concise",
    label: "간결",
    description: "군더더기 없이 짧게(모범 메일 표시용)",
  },
];

/**
 * 작성 화면에서 고를 수 있는 톤(격식/친근 2개).
 * v2에서 '간결'은 톤이 아니라 변형(요점/정중/간결)으로 옮겨졌습니다.
 */
export const COMPOSE_TONE_OPTIONS: ReadonlyArray<Option<ToneKey>> =
  TONE_OPTIONS.filter((o) => o.key === "formal" || o.key === "friendly");

/** 회신 방법 선택지(기본 reply=회신). 문장의 "{회신방법} 부탁드립니다"에 들어갑니다. */
export const REPLY_METHOD_OPTIONS: ReadonlyArray<Option<ReplyMethodKey>> = [
  { key: "reply", label: "회신", description: "메일로 답신" },
  { key: "share", label: "공유", description: "자료를 공유" },
  { key: "submit", label: "제출", description: "정식으로 제출" },
];

/** 포함 문구(블록) 선택지. (복수 선택 가능, 본문엔 아래 순서대로 고정 삽입) */
export const PHRASE_OPTIONS: ReadonlyArray<Option<PhraseKey>> = [
  { key: "holiday", label: "명절 인사", description: "명절 안부 한마디" },
  { key: "health", label: "건강/안부", description: "건강을 비는 안부" },
  { key: "thanks", label: "감사 인사", description: "마무리 감사 표현" },
];
