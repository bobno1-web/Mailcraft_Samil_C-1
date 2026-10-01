// lib/options.ts
// ─────────────────────────────────────────────────────────────────────────────
// 화면(드롭다운/버튼)에 보여줄 '선택지 목록'입니다.
// 여기 key 들은 lib/types.ts 의 key 타입과, data/templates.ts 의 Record key 와
// "셋 다" 똑같이 맞아야 합니다. (하나만 고치면 버그 → 가드가 잡아 줍니다)
//
// [예시] placeholder 내용입니다. 실제 팀 기준으로 교체하세요.
// 라벨/설명은 사실을 지어내지 말고 팀이 쓰는 표현으로 바꾸면 됩니다.
// ─────────────────────────────────────────────────────────────────────────────

import type { Option, RecipientKey, ToneKey, PhraseKey } from "./types";

/** 받는 사람 유형 선택지. */
export const RECIPIENT_OPTIONS: ReadonlyArray<Option<RecipientKey>> = [
  { key: "client", label: "고객사", description: "사외 고객(회사 밖)" },
  { key: "internal", label: "사내", description: "같은 회사/팀" },
  { key: "partner", label: "협력사", description: "외부 파트너·협력 업체" },
];

/** 말투(톤) 선택지. */
export const TONE_OPTIONS: ReadonlyArray<Option<ToneKey>> = [
  { key: "formal", label: "격식", description: "정중하고 공식적인 말투" },
  { key: "friendly", label: "친근", description: "부드럽고 가까운 말투" },
  { key: "concise", label: "간결", description: "군더더기 없이 짧게" },
];

/** 포함 문구(블록) 선택지. */
export const PHRASE_OPTIONS: ReadonlyArray<Option<PhraseKey>> = [
  { key: "greeting", label: "인사말", description: "안부/도입 인사" },
  { key: "apology", label: "양해 요청", description: "불편/지연에 대한 양해" },
  { key: "deadline", label: "기한 안내", description: "회신·처리 기한 안내" },
  { key: "thanks", label: "감사 인사", description: "마무리 감사 표현" },
];
